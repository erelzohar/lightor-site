import type { CSSProperties, MouseEventHandler, ReactNode } from 'react';
import { useStill } from '../../hooks/useA11yPrefs';
import './splash-button.css';

/* ── Splash button (LT-605) ──────────────────────────────────────
 * Erel's 21st.dev "3D button", rebuilt for lightor.app: a raised button
 * that presses in. Pointed at, its letters roll up and back in one after
 * another, a light runs round its edge and short lines splash out round
 * it, once. Both rows of letters say the same words (the reference's
 * "Join Today" / "Join Now" would need a second line nobody wrote). Its
 * CSS was missing from the paste (only the keyframes came): what is here
 * is our own, and every move is a transform, an opacity or a dash. The
 * same button is festive's own on the tenant sites (lightor-front
 * components/ui/SplashButton.tsx).
 * ─────────────────────────────────────────────────────────────── */

// Drawn round a 218x94 box at (62, 57) of a 342x208 frame, which is stretched over the button.
const SPLASH: [string, number][] = [
  ['M54.1 99.8C54.1 99.8 40.1 90.8 26.7 97.6C13.3 104.5 1.5 97.6 1.5 97.6', 1],
  ['M285.3 99.8C285.3 99.8 299.3 90.8 312.7 97.6C326.1 104.5 340.1 95.5 340.1 95.5', 1],
  ['M281.1 65C281.1 65 288 49.8 302.9 48.2C317.9 46.7 319.7 36.5 319.7 36.5', 0.35],
  ['M281.1 139C281.1 139 288 154.2 302.9 155.7C317.9 157.3 319.7 167.4 319.7 167.4', 0.35],
  ['M230.6 57.4C230.6 57.4 225.8 41.5 236.1 30.5C246.3 19.5 244.7 13 244.7 13', 1],
  ['M230.6 150.5C230.6 150.5 225.8 166.5 236.1 177.5C246.3 188.5 244.7 195 244.7 195', 1],
  ['M170.4 57C170.4 57 173.9 42.1 169.6 29.5C165.3 16.9 168.8 2.1 168.8 2.1', 0.35],
  ['M170.4 150.9C170.4 150.9 173.9 165.8 169.6 178.4C165.3 191 168.8 205.9 168.8 205.9', 0.35],
  ['M112.6 57.4C112.6 57.4 117.4 41.5 107.1 30.5C96.8 19.5 98.5 13 98.5 13', 1],
  ['M112.6 150.5C112.6 150.5 117.4 166.5 107.1 177.5C96.8 188.5 98.5 195 98.5 195', 1],
  ['M62.3 65C62.3 65 55.5 49.8 40.5 48.2C25.5 46.7 23.7 36.5 23.7 36.5', 0.35],
  ['M62.3 146C62.3 146 55.5 161.2 40.5 162.7C25.5 164.3 23.7 174.4 23.7 174.4', 0.35],
];

type Segmenter = new (l?: string, o?: { granularity: 'grapheme' }) => { segment: (s: string) => Iterable<{ segment: string }> };

/** The words' letters, one by one (an accented letter or an emoji is one). */
const lettersOf = (text: string): string[] => {
  const Seg = (Intl as unknown as { Segmenter?: Segmenter }).Segmenter;
  return Seg ? Array.from(new Seg(undefined, { granularity: 'grapheme' }).segment(text), (s) => s.segment) : Array.from(text);
};

interface SplashButtonProps {
  href: string;
  children: string;
  icon?: ReactNode;
  /** 'brand': the violet-to-pink face; 'light': a white face, for a coloured band. */
  tone?: 'brand' | 'light';
  /** Joined scripts (Arabic) are never cut into letters. */
  joined?: boolean;
  className?: string;
  onClick?: MouseEventHandler<HTMLAnchorElement>;
}

export const SplashButton = ({ href, children, icon, tone = 'brand', joined = false, className = '', onClick }: SplashButtonProps) => {
  const still = useStill();
  const split = !still && !joined;
  const letters = split ? lettersOf(children) : [];
  const row = (cls: string) => (
    <span className={`lt-splash-word ${cls}`}>
      {letters.map((ch, i) => <span key={i} style={{ '--i': i } as CSSProperties}>{ch}</span>)}
    </span>
  );
  return (
    <a href={href} onClick={onClick} aria-label={children} className={`lt-splash lt-splash-${tone} ${className}`} data-still={still || undefined}>
      <span className="lt-splash-glow" aria-hidden="true" />
      <svg className="lt-splash-burst" viewBox="0 0 342 208" preserveAspectRatio="none" fill="none" aria-hidden="true">
        {SPLASH.map(([d, alpha], i) => <path key={i} d={d} pathLength={60} strokeOpacity={alpha} style={{ '--i': i } as CSSProperties} />)}
      </svg>
      <span className="lt-splash-side" aria-hidden="true" />
      <span className="lt-splash-face">
        <span className="lt-splash-trace" aria-hidden="true" />
        {split ? (
          <span className="lt-splash-label" aria-hidden="true">{row('lt-splash-out')}{row('lt-splash-in')}</span>
        ) : (
          <span className="lt-splash-label">{children}</span>
        )}
        {icon && <span className="lt-splash-icon" aria-hidden="true">{icon}</span>}
      </span>
    </a>
  );
};
