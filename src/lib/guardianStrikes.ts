/**
 * LT-367: the guardian Lighty on /pay strikes where he is clicked. The
 * strikes are Meshy clips on Lighty's rig (meshy_output/lightor-mascot/
 * guardian); the times below are clip seconds, measured from the sword
 * hand's path (its fastest moment is the hit). The long clips start part-way
 * into their wind-up and are cut after the swing, so a click is answered in
 * about half a second and he is back on guard soon after.
 */

export type Strike = 'slashRight' | 'slashLeft' | 'slashUp' | 'thrust';

export interface StrikeTiming {
  /** Where the clip starts playing (skips the slow wind-up). */
  from: number;
  /** Where it hands back to his guard stance. */
  to: number;
  /** When the blade lands: the slash mark at the click shows then. */
  hits: number[];
}

export const STRIKES: Record<Strike, StrikeTiming> = {
  // A forehand sweep from his sword side across his front.
  slashRight: { from: 0, to: 1.45, hits: [0.65] },
  // Up across, then back down: two cuts.
  slashLeft: { from: 0.3, to: 1.65, hits: [0.95, 1.35] },
  // A rising cut that ends high in the middle.
  slashUp: { from: 0.5, to: 1.7, hits: [1.2] },
  // A jab at the viewer.
  thrust: { from: 0.3, to: 1.15, hits: [0.85] },
};

/** Faster than the clips' own pace: a click wants an answer. */
export const STRIKE_SPEED = 1.25;

/** Seconds from the click to a hit. */
export const hitDelay = (strike: Strike, hit: number): number => (hit - STRIKES[strike].from) / STRIKE_SPEED;

/**
 * The strike for a click at (fx, fy) in his box, 0..1 from its top-left —
 * on screen, whatever the page's direction. His sword is on the left of the
 * screen and his shield on the right.
 */
export function strikeFor(fx: number, fy: number): Strike {
  if (fy < 0.28) return 'slashUp';
  if (fx < 0.38) return 'slashLeft';
  if (fx > 0.62) return 'slashRight';
  return 'thrust';
}

/** How the slash mark at the click is drawn for each strike, in degrees (0 = left to right). */
export const MARK_ANGLE: Record<Strike, number[]> = {
  slashRight: [0],
  slashLeft: [-35, 150],
  slashUp: [-60],
  thrust: [],
};
