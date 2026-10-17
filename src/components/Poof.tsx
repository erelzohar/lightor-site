import { useTranslation } from 'react-i18next';

/**
 * LT-388: the cartoon "poof" when Lighty turns into the guardian and back -
 * a cloud bursting out, a flash, little stars and the word itself. Plain
 * gradients and transforms (no blur filters, LT-328); it plays once and the
 * hero removes it.
 */
const PUFFS = [
  [-1, -0.2, 1], [1, -0.25, 0.9], [-0.55, -0.85, 0.8], [0.6, -0.8, 0.85], [0, -1, 0.7],
  [-0.9, 0.55, 0.85], [0.9, 0.5, 0.8], [-0.3, 0.9, 0.75], [0.35, 0.95, 0.7], [0, 0, 1.25],
];
const STARS = [[-1.25, -0.9], [1.3, -0.7], [-1.35, 0.6], [1.2, 0.85], [0.15, -1.4], [-0.2, 1.3]];

export default function Poof() {
  const { t } = useTranslation();
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center">
      <span className="lt-poof-flash absolute h-[70%] w-[70%] rounded-full" />
      {PUFFS.map(([x, y, s], i) => (
        <span
          key={i}
          className="lt-poof-puff absolute h-[34%] w-[34%] rounded-full"
          style={{ '--dx': `${x * 70}%`, '--dy': `${y * 70}%`, '--s': s, animationDelay: `${(i % 4) * 25}ms` } as React.CSSProperties}
        />
      ))}
      {STARS.map(([x, y], i) => (
        <svg
          key={i}
          viewBox="-10 -10 20 20"
          className="lt-poof-star absolute h-[9%] w-[9%]"
          style={{ '--dx': `${x * 100}%`, '--dy': `${y * 100}%`, animationDelay: `${60 + i * 30}ms` } as React.CSSProperties}
        >
          <path d="M0 -10 C1.4 -2.8 2.8 -1.4 10 0 C2.8 1.4 1.4 2.8 0 10 C-1.4 2.8 -2.8 1.4 -10 0 C-2.8 -1.4 -1.4 -2.8 0 -10Z" fill="#fde68a" />
        </svg>
      ))}
      <span className="lt-poof-word absolute select-none font-black text-white text-5xl sm:text-6xl lg:text-8xl">{t('hero.poof')}</span>
    </div>
  );
}
