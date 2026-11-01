import { useEffect, useRef } from 'react';
import {
  AnimationMixer,
  Group,
  LoopOnce,
  NeutralToneMapping,
  PerspectiveCamera,
  PMREMGenerator,
  Scene,
  SRGBColorSpace,
  WebGLRenderer,
} from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { MeshoptDecoder } from 'three/addons/libs/meshopt_decoder.module.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import lightyUrl from '../assets/lighty.glb?url';

// public/lighty-cast.webp is `cast` at this moment, seen through this camera
// (measured: 99.8% of the silhouette overlaps). He stops there, so the still
// can take over without a visible change.
const REST_AT = 1;
const VIEW_H = 1.62;
const LOOK_Y = 0.7;
const FOV = 30;

const RUN_S = 1.5;
/** How far along the way he starts to stop and turn to the viewer. */
const STOPPING = 0.72;
/** His body is a flat calendar: three quarters on, since side on he is a plank. */
const RUN_YAW = 0.95;

interface LightyRunInProps {
  /** Which edge of the screen he comes from. */
  from: 'left' | 'right';
  /** The run may start, as soon as the model is ready. */
  go: boolean;
  onStart: () => void;
  /** He stands where the still stands. */
  onDone: () => void;
  /** No WebGL, or no model. */
  onFail: () => void;
  className?: string;
}

/**
 * LT-533: Lighty runs into his place on the home page, once. Runs in the box
 * of the still, moved by a transform, so the canvas stays small. Nothing here
 * outlives the run: when he stops, the still takes over and this unmounts.
 */
export default function LightyRunIn({ from, go, onStart, onDone, onFail, className = '' }: LightyRunInProps) {
  const hostRef = useRef<HTMLDivElement>(null);
  const events = useRef({ onStart, onDone, onFail });
  events.current = { onStart, onDone, onFail };
  const startRef = useRef<() => void>(() => {});
  const goRef = useRef(go);
  goRef.current = go;

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    let renderer: WebGLRenderer;
    try {
      renderer = new WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'low-power' });
    } catch {
      events.current.onFail();
      return;
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setClearColor(0x000000, 0);
    renderer.outputColorSpace = SRGBColorSpace;
    renderer.toneMapping = NeutralToneMapping;
    const canvas = renderer.domElement;
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.display = 'block';
    host.appendChild(canvas);

    const scene = new Scene();
    const pmrem = new PMREMGenerator(renderer);
    scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    pmrem.dispose();

    const camera = new PerspectiveCamera(FOV, 1, 0.1, 20);
    camera.position.set(0, LOOK_Y, VIEW_H / 2 / Math.tan((FOV / 2) * Math.PI / 180));
    camera.lookAt(0, LOOK_Y, 0);

    const rig = new Group();
    scene.add(rig);

    const draw = () => renderer.render(scene, camera);
    const resize = () => {
      const w = host.clientWidth, h = host.clientHeight;
      if (!w || !h) return;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    const ro = new ResizeObserver(resize);
    ro.observe(host);
    resize();

    let disposed = false;
    let raf = 0;

    const loader = new GLTFLoader();
    loader.setMeshoptDecoder(MeshoptDecoder);
    loader.load(
      lightyUrl,
      (gltf) => {
        if (disposed) return;
        const runClip = gltf.animations.find((clip) => clip.name === 'run');
        const castClip = gltf.animations.find((clip) => clip.name === 'cast');
        if (!runClip || !castClip) {
          events.current.onFail();
          return;
        }
        rig.add(gltf.scene);
        const mixer = new AnimationMixer(gltf.scene);
        const run = mixer.clipAction(runClip);
        const cast = mixer.clipAction(castClip);
        cast.setLoop(LoopOnce, 1);
        cast.clampWhenFinished = true;

        const side = from === 'right' ? 1 : -1;
        const yaw = -side * RUN_YAW;
        rig.rotation.y = yaw;
        run.play();
        mixer.update(0);
        // The first draw compiles the shaders: better now, unseen, than on his first step.
        draw();

        let started = false;
        let stopping = false;
        startRef.current = () => {
          if (started || disposed) return;
          started = true;
          const box = host.getBoundingClientRect();
          const distance = side > 0 ? window.innerWidth - box.left : box.right;
          const place = (share: number) => {
            host.style.transform = `translate3d(${side * distance * share}px, 0, 0)`;
          };
          place(1);
          host.style.visibility = 'visible';
          events.current.onStart();

          let last = 0;
          let time = 0;
          const frame = (now: number) => {
            raf = requestAnimationFrame(frame);
            const dt = last ? Math.min(0.05, (now - last) / 1000) : 0;
            last = now;
            time += dt;
            mixer.update(dt);

            const way = Math.min(1, time / RUN_S);
            place((1 - way) ** 1.6);
            const turn = Math.max(0, (way - STOPPING) / (1 - STOPPING));
            rig.rotation.y = yaw * (1 - turn * turn * (3 - 2 * turn));

            if (way >= STOPPING && !stopping) {
              stopping = true;
              cast.reset().play();
              cast.crossFadeFrom(run, 0.25, false);
            }
            if (stopping && way === 1 && cast.time >= REST_AT) {
              cast.time = REST_AT;
              cast.paused = true;
              mixer.update(0);
              draw();
              cancelAnimationFrame(raf);
              events.current.onDone();
              return;
            }
            draw();
          };
          raf = requestAnimationFrame(frame);
        };
        if (goRef.current) startRef.current();
      },
      undefined,
      () => events.current.onFail(),
    );

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      ro.disconnect();
      renderer.dispose();
      // Done for good on this page: the graphics memory goes back at once.
      renderer.forceContextLoss();
      canvas.remove();
    };
  }, [from]);

  useEffect(() => {
    if (go) startRef.current();
  }, [go]);

  return <div ref={hostRef} className={`pointer-events-none invisible ${className}`} aria-hidden="true" />;
}
