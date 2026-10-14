import * as React from 'react';
import {
  animate,
  motion,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useTransform,
  type MotionValue,
} from 'framer-motion';

/* ── Halo Reel ───────────────────────────────────────────────────
 * Cards ride an ellipse. Card i sits at θ = i·step + rotation on an
 * ellipse of radii (rx, ry):
 *
 *   x = rx·cos θ      y = ry·sin θ      scale = min + (1−min)·(cos θ + 1)/2
 *
 * cos θ places the card, sizes it and, through the scale, stacks it, so a
 * card that looks nearer is nearer. One `rotation` motion value drives the
 * whole ring through `useTransform`: a spin never re-renders React.
 *
 * Adapted for lightor.app (LT-330) from the 21st.dev component: no shadcn
 * (`cn`, `@/` and the card/ring tokens are replaced), cards take a class so
 * they can be phones, and `onActiveChange` reports the card at the front.
 * ─────────────────────────────────────────────────────────────── */

export type HaloReelItem = {
  src: string;
  alt?: string;
};

export interface HaloReelProps
  extends Omit<React.ComponentPropsWithoutRef<'div'>, 'children'> {
  items: HaloReelItem[];
  /** Card width in px at the front of the ring. @default 130 */
  cardWidth?: number;
  /** Card height in px at the front of the ring. @default 180 */
  cardHeight?: number;
  /** Scale of the card at the far side of the ring. @default 0.4 */
  minScale?: number;
  /** Horizontal radius as a fraction of the stage width. @default 0.45 */
  radiusXRatio?: number;
  /** Where the ellipse is centred across the stage; `0` pins it to the left edge. @default 0 */
  centerXRatio?: number;
  /** Vertical radius as a fraction of the stage height. @default 0.36 */
  radiusYRatio?: number;
  /** @default true */
  autoPlay?: boolean;
  /** Time (ms) a card is held at the front before the next step. @default 1000 */
  holdDuration?: number;
  /** Duration (ms) of one step. @default 700 */
  stepDuration?: number;
  /** @default true */
  pauseOnHover?: boolean;
  /** @default true */
  draggable?: boolean;
  /** Gap between neighbouring cards at the widest point, in card widths. @default 1.2 */
  spread?: number;
  /** Ceiling on the number of cards drawn around the ring. @default 64 */
  maxCards?: number;
  /** @default 1 */
  dragSensitivity?: number;
  /** Node parked beside the ring, in the space it leaves. */
  centerLabel?: React.ReactNode;
  /** Classes for every card's frame (the image sits inside it). */
  cardClassName?: string;
  /** Classes for every card's image. */
  imageClassName?: string;
  /** Called with the index into `items` of the card at the front. */
  onActiveChange?: (index: number) => void;
  /** Mirror the ring for right-to-left pages: `centerXRatio` counts from the
   *  right edge and the front card faces left. @default false */
  mirror?: boolean;
}

const TAU = Math.PI * 2;

const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));

const cx = (...c: (string | false | undefined)[]) => c.filter(Boolean).join(' ');

export function HaloReel({
  items,
  cardWidth = 130,
  cardHeight = 180,
  minScale = 0.4,
  radiusXRatio = 0.45,
  centerXRatio = 0,
  radiusYRatio = 0.36,
  autoPlay = true,
  holdDuration = 1000,
  stepDuration = 700,
  pauseOnHover = true,
  draggable = true,
  spread = 1.2,
  maxCards = 64,
  dragSensitivity = 1,
  centerLabel,
  cardClassName,
  imageClassName,
  onActiveChange,
  mirror = false,
  className,
  style,
  ...props
}: HaloReelProps) {
  const stageRef = React.useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();

  const count = items.length;

  const rotation = useMotionValue(0);
  const draggingRef = React.useRef(false);
  const hoverRef = React.useRef(false);
  const [visible, setVisible] = React.useState(false);

  const [size, setSize] = React.useState({ w: 0, h: 0 });
  React.useEffect(() => {
    const node = stageRef.current;
    if (!node) return;
    const measure = () => setSize({ w: node.offsetWidth, h: node.offsetHeight });
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(node);
    // Autoplay only while the ring is on screen.
    const io = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting));
    io.observe(node);
    return () => {
      observer.disconnect();
      io.disconnect();
    };
  }, []);

  const flip = mirror ? -1 : 1;
  // The ring's centre in stage pixels, from the left edge.
  const centerX = mirror ? size.w * (1 - centerXRatio) : size.w * centerXRatio;
  const radiusX = size.w * radiusXRatio;
  const radiusY = size.h * radiusYRatio;

  // The ring is sized by the stage and filled by repeating the items; the
  // tighter axis decides how many slots it needs.
  const slots = clamp(
    Math.ceil(TAU * Math.max(radiusX / (cardWidth * spread), radiusY / (cardHeight * spread))),
    count,
    Math.max(count, maxCards),
  );
  const step = slots ? TAU / slots : 0;

  // Cards shrink continuously to fit the box instead of stepping at a breakpoint.
  const fit = size.w
    ? clamp(Math.min(size.w / (radiusX + cardWidth), size.h / (2 * radiusY + cardHeight)), 0.45, 1)
    : 1;
  const cardW = cardWidth * fit;
  const cardH = cardHeight * fit;

  // The front card is the slot whose angle is a whole turn: i·step + r ≡ 0.
  const activeRef = React.useRef(-1);
  const report = React.useCallback(
    (r: number) => {
      if (!step || !onActiveChange) return;
      const slot = (((Math.round(-r / step) % slots) + slots) % slots);
      const index = slot % count;
      if (index !== activeRef.current) {
        activeRef.current = index;
        onActiveChange(index);
      }
    },
    [count, onActiveChange, slots, step],
  );
  useMotionValueEvent(rotation, 'change', report);
  React.useEffect(() => report(rotation.get()), [report, rotation]);

  // Autoplay. Each step schedules the next, so a paused tick only re-checks.
  React.useEffect(() => {
    if (!autoPlay || reduceMotion || !count || !visible) return;

    let timer = 0;
    let controls: ReturnType<typeof animate> | undefined;

    const tick = () => {
      timer = window.setTimeout(() => {
        if (draggingRef.current || (pauseOnHover && hoverRef.current)) {
          tick();
          return;
        }
        controls = animate(rotation, rotation.get() - step, {
          duration: stepDuration / 1000,
          ease: [0.4, 0, 0.2, 1],
          onComplete: tick,
        });
      }, holdDuration);
    };

    tick();
    return () => {
      window.clearTimeout(timer);
      controls?.stop();
    };
  }, [autoPlay, count, holdDuration, pauseOnHover, reduceMotion, rotation, step, stepDuration, visible]);

  /* ── drag ──────────────────────────────────────────────────── */

  const dragRef = React.useRef({ left: 0, top: 0, angle: 0 });

  const pointerAngle = (e: React.PointerEvent) => {
    const { left, top } = dragRef.current;
    // Normalising by the radii un-squashes the ellipse.
    return Math.atan2(
      (e.clientY - top - size.h / 2) / (radiusY || 1),
      (flip * (e.clientX - left - centerX)) / (radiusX || 1),
    );
  };

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!draggable || (e.pointerType === 'mouse' && e.button !== 0)) return;
    const rect = e.currentTarget.getBoundingClientRect();
    dragRef.current = { left: rect.left, top: rect.top, angle: 0 };
    dragRef.current.angle = pointerAngle(e);
    draggingRef.current = true;
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!draggingRef.current) return;
    const angle = pointerAngle(e);
    // Wrap into (−π, π] so crossing the seam is one small delta.
    const delta = ((angle - dragRef.current.angle + Math.PI * 3) % TAU) - Math.PI;
    dragRef.current.angle = angle;
    rotation.set(rotation.get() + delta * dragSensitivity);
  };

  const endDrag = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!draggingRef.current) return;
    draggingRef.current = false;
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
    // Settle onto the nearest card.
    const snapped = Math.round(rotation.get() / step) * step;
    if (reduceMotion) {
      rotation.set(snapped);
      return;
    }
    animate(rotation, snapped, { duration: 0.5, ease: [0.16, 1, 0.3, 1] });
  };

  const spinBy = (direction: number) => {
    const target = Math.round(rotation.get() / step) * step - direction * step;
    if (reduceMotion) {
      rotation.set(target);
      return;
    }
    animate(rotation, target, { duration: stepDuration / 1000, ease: [0.4, 0, 0.2, 1] });
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const direction = ({ ArrowRight: 1, ArrowLeft: -1 } as Record<string, number>)[e.key];
    if (!direction) return;
    e.preventDefault();
    spinBy(direction * flip);
  };

  if (!count) return null;

  return (
    <div
      ref={stageRef}
      role="region"
      aria-roledescription="carousel"
      tabIndex={0}
      onKeyDown={onKeyDown}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      className={cx(
        'relative w-full touch-pan-y select-none overflow-hidden outline-none',
        draggable && 'cursor-grab active:cursor-grabbing',
        'focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-violet-500',
        className,
      )}
      style={style}
      {...props}
    >
      {centerLabel ? (
        <div
          className="pointer-events-none absolute inset-y-0 z-0 flex items-center justify-center px-4 text-center"
          style={
            mirror
              ? { left: 0, right: size.w - centerX + radiusX + cardW / 2 }
              : { left: centerX + radiusX + cardW / 2, right: 0 }
          }
        >
          {centerLabel}
        </div>
      ) : null}

      {size.w > 0 &&
        Array.from({ length: slots }, (_, i) => (
          <WheelCard
            key={i}
            item={items[i % count]}
            // Only the first lap is real content; the repeats are decoration.
            decorative={i >= count}
            index={i}
            step={step}
            rotation={rotation}
            radiusX={radiusX}
            radiusY={radiusY}
            centerX={centerX}
            flip={flip}
            minScale={minScale}
            width={cardW}
            height={cardH}
            className={cardClassName}
            imageClassName={imageClassName}
            onHoverChange={(hovered) => {
              hoverRef.current = hovered;
            }}
          />
        ))}
    </div>
  );
}

/* ── card ────────────────────────────────────────────────────── */

function WheelCard({
  item,
  index,
  step,
  rotation,
  radiusX,
  radiusY,
  centerX,
  flip,
  minScale,
  width,
  height,
  decorative,
  className,
  imageClassName,
  onHoverChange,
}: {
  item: HaloReelItem;
  index: number;
  step: number;
  rotation: MotionValue<number>;
  radiusX: number;
  radiusY: number;
  centerX: number;
  flip: number;
  minScale: number;
  width: number;
  height: number;
  decorative: boolean;
  className?: string;
  imageClassName?: string;
  onHoverChange: (hovered: boolean) => void;
}) {
  const cos = useTransform(rotation, (r) => Math.cos(index * step + r));
  const sin = useTransform(rotation, (r) => Math.sin(index * step + r));

  const x = useTransform(cos, (c) => flip * c * radiusX);
  const y = useTransform(sin, (s) => s * radiusY);
  const scale = useTransform(cos, (c) => minScale + (1 - minScale) * ((c + 1) / 2));
  const zIndex = useTransform(scale, (s) => Math.round(s * 1000));

  return (
    <motion.div
      role={decorative ? undefined : 'group'}
      aria-roledescription={decorative ? undefined : 'slide'}
      aria-hidden={decorative || undefined}
      onPointerEnter={() => onHoverChange(true)}
      onPointerLeave={() => onHoverChange(false)}
      style={{
        x,
        y,
        scale,
        zIndex,
        width,
        height,
        left: centerX,
        top: '50%',
        marginLeft: -width / 2,
        marginTop: -height / 2,
      }}
      className={cx('absolute overflow-hidden', className)}
    >
      <img
        src={item.src}
        alt={decorative ? '' : (item.alt ?? '')}
        draggable={false}
        decoding="async"
        className={cx('pointer-events-none h-full w-full select-none object-cover object-top', imageClassName)}
      />
    </motion.div>
  );
}

export default HaloReel;
