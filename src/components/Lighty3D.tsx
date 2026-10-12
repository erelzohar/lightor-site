import { useEffect, useRef } from 'react';
import {
  AnimationMixer,
  Group,
  LoopOnce,
  LoopRepeat,
  NeutralToneMapping,
  PerspectiveCamera,
  PMREMGenerator,
  Scene,
  SRGBColorSpace,
  WebGLRenderer,
} from 'three';
import type { AnimationAction } from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { MeshoptDecoder } from 'three/addons/libs/meshopt_decoder.module.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import lightyUrl from '../assets/lighty.glb?url';

type Clip = 'idle' | 'wave' | 'cheer';

interface Lighty3DProps {
  /** Called once the model has drawn its first frame — the still can go. */
  onReady?: () => void;
  className?: string;
}

// The register's framing (lightor-register components/ui/lighty-3d.tsx), with
// more room: the model is 1 unit tall, feet at y=0, and his arrival wave tips
// him well to the side — 1.75 units keep him whole. The still in
// public/lighty-wave.webp is rendered with the same framing.
const VIEW_H = 1.75;
const FOV = 30;
const LOOK_Y = VIEW_H / 2 - 0.065;

const clamp1 = (v: number) => Math.max(-1, Math.min(1, v));

/**
 * LT-260: the 3D Lighty of the register and the dashboard, on the marketing
 * site — the same model (src/assets/lighty.glb, built in
 * meshy_output/lightor-mascot). He waves when he arrives, then idles, turns a
 * little toward the pointer, and cheers when he is tapped. Drawing stops while
 * he is off screen. Without WebGL, or if the model fails, nothing appears and
 * the still in front of him stays.
 */
export default function Lighty3D({ onReady, className = '' }: Lighty3DProps) {
  const hostRef = useRef<HTMLDivElement>(null);
  const onReadyRef = useRef(onReady);
  onReadyRef.current = onReady;

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    let renderer: WebGLRenderer;
    try {
      renderer = new WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'low-power' });
    } catch {
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

    let disposed = false;
    let raf = 0;
    let running = false;
    let visible = true;
    let mixer: AnimationMixer | null = null;
    const actions: Partial<Record<Clip, AnimationAction>> = {};
    let current: AnimationAction | null = null;
    // Where the pointer is, relative to his chest (null: look at the viewer).
    let pointer: { x: number; y: number } | null = null;

    const draw = () => renderer.render(scene, camera);

    const resize = () => {
      const w = host.clientWidth, h = host.clientHeight;
      if (!w || !h) return;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      if (!running) draw();
    };
    const ro = new ResizeObserver(resize);
    ro.observe(host);
    resize();

    const play = (name: Clip, once = false) => {
      const next = actions[name];
      if (!next || !mixer) return;
      if (next === current && !once) return;
      next.reset();
      next.setLoop(once ? LoopOnce : LoopRepeat, once ? 1 : Infinity);
      next.clampWhenFinished = once;
      if (current && current !== next) next.crossFadeFrom(current, 0.35, false);
      next.play();
      current = next;
    };

    let last = 0;
    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      const dt = last ? Math.min(0.05, (now - last) / 1000) : 0;
      last = now;
      mixer?.update(dt);
      let yaw = 0, pitch = 0;
      if (pointer) {
        const r = host.getBoundingClientRect();
        yaw = clamp1((pointer.x - (r.left + r.width / 2)) / 600) * 0.45;
        pitch = clamp1((pointer.y - (r.top + r.height * 0.45)) / 600) * 0.12;
      }
      const k = 1 - Math.exp(-dt * 5);
      rig.rotation.y += (yaw - rig.rotation.y) * k;
      rig.rotation.x += (pitch - rig.rotation.x) * k;
      draw();
    };
    const start = () => {
      if (running || disposed || !mixer || !visible) return;
      running = true;
      last = 0;
      raf = requestAnimationFrame(frame);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) start(); else stop();
    });
    io.observe(host);

    const onPointer = (e: PointerEvent) => {
      if (e.pointerType === 'mouse') pointer = { x: e.clientX, y: e.clientY };
    };
    const onLeave = () => { pointer = null; };
    const onTap = () => play('cheer', true);
    window.addEventListener('pointermove', onPointer, { passive: true });
    document.documentElement.addEventListener('pointerleave', onLeave);
    host.addEventListener('click', onTap);

    const loader = new GLTFLoader();
    loader.setMeshoptDecoder(MeshoptDecoder);
    loader.load(
      lightyUrl,
      (gltf) => {
        if (disposed) return;
        rig.add(gltf.scene);
        mixer = new AnimationMixer(gltf.scene);
        for (const clip of gltf.animations) {
          if (clip.name === 'idle' || clip.name === 'wave' || clip.name === 'cheer') {
            actions[clip.name] = mixer.clipAction(clip);
          }
        }
        // A one-off ends: back to idling.
        mixer.addEventListener('finished', () => play('idle'));
        play(actions.wave ? 'wave' : 'idle', !!actions.wave);
        mixer.update(0);
        draw();
        onReadyRef.current?.();
        start();
      },
      undefined,
      () => { /* no model: the still stays */ },
    );

    return () => {
      disposed = true;
      stop();
      io.disconnect();
      ro.disconnect();
      window.removeEventListener('pointermove', onPointer);
      document.documentElement.removeEventListener('pointerleave', onLeave);
      host.removeEventListener('click', onTap);
      renderer.dispose();
      canvas.remove();
    };
  }, []);

  return <div ref={hostRef} className={`cursor-pointer ${className}`} aria-hidden="true" />;
}
