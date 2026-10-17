import { useEffect, useRef, useState } from 'react';
import type { MouseEvent as ReactMouseEvent } from 'react';
import {
  AnimationMixer,
  LoopOnce,
  LoopRepeat,
  Mesh,
  NeutralToneMapping,
  PerspectiveCamera,
  PMREMGenerator,
  Scene,
  SRGBColorSpace,
  Texture,
  Vector3,
  WebGLRenderer,
} from 'three';
import type { AnimationAction, Material, Object3D } from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { MeshoptDecoder } from 'three/addons/libs/meshopt_decoder.module.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { useTranslation } from 'react-i18next';
import guardianUrl from '../assets/lighty-guardian.glb?url';
import { reducedMotion } from '../services/a11yPrefs';
import { MARK_ANGLE, STRIKES, STRIKE_SPEED, hitDelay, strikeFor, type Strike } from '../lib/guardianStrikes';

/**
 * LT-388 (lightor.app): the same guardian as register's /pay, the hero's
 * easter egg - tap Lighty five times and he turns into this one with a
 * poof, opens with a jab at you and strikes wherever he is clicked.
 * `onStrike` tells the hero he is still being played with.
 *
 * LT-367: Lighty the guardian — headband, war paint, a sword in his right
 * fist and a shield on his left (Erel's Meshy model "Calendar Guardian") —
 * stands guard over the payment page, and strikes where he is clicked: a
 * click above him is a rising cut, on his sword side a cut up and back down,
 * on his shield side a sweep, on his middle a jab at you; a slash mark shows
 * at the click as the blade lands (lib/guardianStrikes.ts).
 * The model would not auto-rig, so it rides on Lighty's own skeleton:
 * meshy_output/lightor-mascot/scripts/guardian_build.py — the sword rigid in
 * the right hand; the shield, as LT-300's, its own node put at the left
 * hand's position every frame, so it never turns from the viewer.
 * His canvas is larger than his box, so a swing can leave it; the box is the
 * button. Reduced motion: his guard stance, still, and clicks do nothing.
 * Without WebGL, or if the model fails to load, `onReady` never fires and the
 * page keeps its logo.
 */

const FOV = 30;
// His guard stance, shield included, fills the box (measured over the stance
// clip with the shield placed; re-measure if the model changes).
const FRAME = { x0: -0.7, x1: 1.0, y0: -0.08, y1: 0.96 };
const LOOK_X = (FRAME.x0 + FRAME.x1) / 2;
const LOOK_Y = (FRAME.y0 + FRAME.y1) / 2;
const VIEW_W = FRAME.x1 - FRAME.x0 + 0.04;
const VIEW_H = FRAME.y1 - FRAME.y0 + 0.04;
/** The canvas reaches this far past the box on every side (a share of the box). */
const BLEED = 0.3;
const FADE_IN = 0.12;
const FADE_BACK = 0.3;

interface Mark {
  id: number;
  x: number;
  y: number;
  angle: number | null;
  delay: number;
}

export default function LightyWarrior({ className = '', onReady, onStrike, active = true }: { className?: string; onReady?: () => void; onStrike?: () => void; active?: boolean }) {
  const { t } = useTranslation();
  const hostRef = useRef<HTMLDivElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);
  const [marks, setMarks] = useState<Mark[]>([]);
  const strikeRef = useRef<((strike: Strike) => boolean) | null>(null);
  const onReadyRef = useRef(onReady);
  const markId = useRef(0);
  useEffect(() => { onReadyRef.current = onReady; }, [onReady]);
  // Loaded ahead of time but not yet shown: he does not draw (LT-388).
  const activeRef = useRef(active);
  const wakeRef = useRef<(() => void) | null>(null);
  useEffect(() => {
    activeRef.current = active;
    wakeRef.current?.();
  }, [active]);

  useEffect(() => {
    const host = hostRef.current;
    if (!host || !('WebGLRenderingContext' in window)) return;
    let renderer: WebGLRenderer;
    try {
      renderer = new WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'low-power' });
    } catch {
      return;
    }
    // The device's "reduce motion" or the menu's "stop animations" (LT-357).
    const still = reducedMotion();
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setClearColor(0x000000, 0);
    renderer.outputColorSpace = SRGBColorSpace;
    renderer.toneMapping = NeutralToneMapping;
    const canvas = renderer.domElement;
    Object.assign(canvas.style, { width: '100%', height: '100%', display: 'block' });
    host.appendChild(canvas);

    const scene = new Scene();
    const pmrem = new PMREMGenerator(renderer);
    const envMap = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = envMap;
    pmrem.dispose();

    const camera = new PerspectiveCamera(FOV, 1, 0.1, 20);
    const fit = () => {
      const w = host.clientWidth, h = host.clientHeight;
      if (!w || !h) return;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      // The frame fits the box, which is the canvas less its bleed on each side.
      const grow = 1 + 2 * BLEED;
      const tan = Math.tan((FOV / 2) * Math.PI / 180);
      const d = Math.max((VIEW_H * grow) / (2 * tan), (VIEW_W * grow) / (2 * tan * camera.aspect));
      camera.position.set(LOOK_X, LOOK_Y + 0.06, d);
      camera.lookAt(LOOK_X, LOOK_Y, 0);
      camera.updateProjectionMatrix();
      if (!running) renderer.render(scene, camera);
    };

    let disposed = false;
    let running = false;
    let visible = true;
    let raf = 0;
    let last = 0;
    let mixer: AnimationMixer | null = null;
    let stance: AnimationAction | null = null;
    const actions: Partial<Record<Strike, AnimationAction>> = {};
    let active: { strike: Strike; action: AnimationAction } | null = null;
    // The shield follows the hand's position, never its turn (LT-300).
    let shield: Object3D | null = null;
    let hand: Object3D | null = null;
    let root: Object3D | null = null;
    const grip = new Vector3();
    const at = new Vector3();
    const holdShield = () => {
      if (!shield || !hand || !root) return;
      root.updateMatrixWorld(true);
      hand.getWorldPosition(at);
      shield.position.copy(at).sub(grip);
    };
    const ro = new ResizeObserver(fit);
    ro.observe(host);
    fit();

    const backOnGuard = () => {
      if (!active || !stance) return;
      stance.reset();
      stance.play();
      active.action.crossFadeTo(stance, FADE_BACK, false);
      active = null;
    };
    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      const dt = last ? Math.min(0.05, (now - last) / 1000) : 0;
      last = now;
      mixer?.update(dt);
      if (active && active.action.time >= STRIKES[active.strike].to) backOnGuard();
      holdShield();
      renderer.render(scene, camera);
    };
    const start = () => {
      if (running || still || disposed || !mixer || !visible || !activeRef.current) return;
      running = true;
      last = 0;
      raf = requestAnimationFrame(frame);
    };
    const stop = () => { running = false; cancelAnimationFrame(raf); };
    wakeRef.current = () => (activeRef.current ? start() : stop());
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; if (visible) start(); else stop(); });
    io.observe(host);

    /** A strike, unless one is still on its way to its last hit. */
    strikeRef.current = (strike) => {
      const action = actions[strike];
      if (still || !mixer || !stance || !action) return false;
      if (active) {
        const s = STRIKES[active.strike];
        if (active.action.time < s.hits[s.hits.length - 1]) return false;
      }
      const from = active?.action ?? stance;
      action.reset();
      action.setLoop(LoopOnce, 1);
      action.clampWhenFinished = true;
      action.timeScale = STRIKE_SPEED;
      action.time = STRIKES[strike].from;
      action.play();
      from.crossFadeTo(action, FADE_IN, false);
      active = { strike, action };
      start();
      return true;
    };

    const loader = new GLTFLoader();
    loader.setMeshoptDecoder(MeshoptDecoder);
    loader.load(guardianUrl, (gltf) => {
      if (disposed) return;
      scene.add(gltf.scene);
      root = gltf.scene;
      shield = gltf.scene.getObjectByName('Shield') ?? null;
      hand = gltf.scene.getObjectByName('LeftHand') ?? null;
      const g = (shield?.userData as { grip?: number[] } | undefined)?.grip;
      if (g?.length === 3) grip.set(g[0], g[1], g[2]);
      mixer = new AnimationMixer(gltf.scene);
      for (const clip of gltf.animations) {
        if (clip.name === 'stance') stance = mixer.clipAction(clip);
        else if (clip.name in STRIKES) actions[clip.name as Strike] = mixer.clipAction(clip);
      }
      if (stance) {
        stance.setLoop(LoopRepeat, Infinity);
        stance.play();
      }
      mixer.update(0);
      holdShield();
      renderer.render(scene, camera);
      setReady(true);
      onReadyRef.current?.();
      start();
    }, undefined, () => {
      // No model, no guardian: the logo stays.
    });

    return () => {
      disposed = true;
      strikeRef.current = null;
      stop();
      ro.disconnect();
      io.disconnect();
      mixer?.stopAllAction();
      scene.traverse((obj) => {
        if (!(obj instanceof Mesh)) return;
        obj.geometry.dispose();
        const mats: Material[] = Array.isArray(obj.material) ? obj.material : [obj.material];
        for (const m of mats) {
          for (const value of Object.values(m)) if (value instanceof Texture) value.dispose();
          m.dispose();
        }
      });
      envMap.dispose();
      renderer.dispose();
      renderer.forceContextLoss();
      canvas.remove();
    };
  }, []);

  // He fights back at once: a jab at whoever woke him, as he appears (LT-388).
  const greeted = useRef(false);
  useEffect(() => {
    if (!active || !ready || greeted.current) return;
    greeted.current = true;
    const id = window.setTimeout(() => {
      if (!strikeRef.current?.('thrust')) return;
      const box = boxRef.current?.getBoundingClientRect();
      if (box) setMarks((m) => [...m, { id: ++markId.current, x: box.width / 2, y: box.height * 0.45, angle: null, delay: hitDelay('thrust', STRIKES.thrust.hits[0]) }]);
    }, 250);
    return () => window.clearTimeout(id);
  }, [active, ready]);

  // Marks fade by themselves; the list is trimmed once they are done.
  useEffect(() => {
    if (!marks.length) return;
    const id = window.setTimeout(() => setMarks((m) => m.slice(-6)), 3000);
    return () => window.clearTimeout(id);
  }, [marks]);

  const onClick = (e: ReactMouseEvent<HTMLButtonElement>) => {
    const box = boxRef.current?.getBoundingClientRect();
    if (!box || !box.width) return;
    // A keyboard press has no point: he aims at his own middle.
    const keyboard = e.detail === 0;
    const x = keyboard ? box.width / 2 : e.clientX - box.left;
    const y = keyboard ? box.height / 2 : e.clientY - box.top;
    const strike = keyboard ? 'thrust' : strikeFor(x / box.width, y / box.height);
    if (!strikeRef.current?.(strike)) return;
    onStrike?.();
    const hits = STRIKES[strike].hits;
    const angles = MARK_ANGLE[strike];
    setMarks((m) => [
      ...m,
      ...hits.map((hit, i) => ({ id: ++markId.current, x, y, angle: angles.length ? angles[i % angles.length] : null, delay: hitDelay(strike, hit) })),
    ]);
  };

  return (
    <div ref={boxRef} className={className} style={{ opacity: ready ? 1 : 0, transition: 'opacity 0.5s ease' }}>
      <div
        ref={hostRef}
        aria-hidden="true"
        className="absolute pointer-events-none"
        style={{ left: `-${BLEED * 100}%`, top: `-${BLEED * 100}%`, width: `${100 + 200 * BLEED}%`, height: `${100 + 200 * BLEED}%` }}
      />
      {ready && (
        <button type="button" onClick={onClick} aria-label={t('hero.guard')} className="absolute inset-0 cursor-pointer rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60" />
      )}
      {marks.map((m) => (
        <svg
          key={m.id}
          aria-hidden="true"
          viewBox="-40 -40 80 80"
          className="lt-slash absolute pointer-events-none overflow-visible"
          style={{ left: m.x - 40, top: m.y - 40, width: 80, height: 80, animationDelay: `${m.delay}s` }}
        >
          {m.angle === null ? (
            // The jab: a burst.
            <g>
              <path d="M0 -30 L7 -7 L30 0 L7 7 L0 30 L-7 7 L-30 0 L-7 -7 Z" fill="#fde68a" opacity="0.7" />
              <path d="M0 -22 L4 -4 L22 0 L4 4 L0 22 L-4 4 L-22 0 L-4 -4 Z" fill="white" />
            </g>
          ) : (
            <g transform={`rotate(${m.angle})`}>
              <path d="M-36 10 Q0 -24 36 10" fill="none" stroke="#fde68a" strokeWidth="14" strokeLinecap="round" opacity="0.7" />
              <path d="M-36 10 Q0 -24 36 10" fill="none" stroke="white" strokeWidth="6" strokeLinecap="round" />
            </g>
          )}
        </svg>
      ))}
    </div>
  );
}
