import { useEffect, useId, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Accessibility, Check, Contrast, Link2, Minus, PauseCircle, Plus, RotateCcw, Type, WrapText, X } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useDialogFocus } from '../hooks/useDialogFocus';
import { useA11yPrefs } from '../hooks/useA11yPrefs';
import { getA11yPrefs, isCustomised, resetA11yPrefs, setA11yPrefs, TEXT_SCALE, type A11yPrefs, type TextStep } from '../services/a11yPrefs';

type ToggleKey = Exclude<keyof A11yPrefs, 'text'>;

const TOGGLES: { key: ToggleKey; icon: LucideIcon }[] = [
  { key: 'contrast', icon: Contrast },
  { key: 'links', icon: Link2 },
  { key: 'font', icon: Type },
  { key: 'spacing', icon: WrapText },
  { key: 'still', icon: PauseCircle },
];

/** The statement: a plain page beside the privacy policy and the terms. */
export const STATEMENT_URL = '/accessibility.html';

/**
 * LT-357: lightor.app's accessibility menu, the same one every customer site
 * has (lightor-front, LT-346). Every choice is a class on <html>
 * (services/a11yPrefs) plus, for motion, the hooks the moving parts ask. A
 * preferences panel only: it never claims to make the page compliant and
 * never touches a screen reader.
 *
 * Its button sits in the navbar, not in a corner of the screen as on the
 * customer sites: on a phone the first screen is full, and a corner button
 * covered the main call to action.
 */
const AccessibilityMenu = ({ buttonClass }: { buttonClass: string }) => {
  const { t } = useTranslation();
  const prefs = useA11yPrefs();
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const panelId = useId();
  const titleId = useId();
  useDialogFocus(open, panelRef, () => setOpen(false), { trap: false });

  // A click elsewhere closes it, as any popover.
  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('pointerdown', onDown);
    return () => document.removeEventListener('pointerdown', onDown);
  }, [open]);

  // From the store, not this render: two quick taps are two steps.
  const step = (d: 1 | -1) => setA11yPrefs({ text: Math.min(3, Math.max(0, getA11yPrefs().text + d)) as TextStep });

  const tile = 'flex flex-col items-center justify-center gap-1.5 rounded-xl border-2 px-2 py-3 text-sm font-medium leading-tight';
  const idle = 'border-transparent bg-gray-100 text-gray-900 dark:bg-white/10 dark:text-gray-100';

  return (
    <div ref={wrapRef} className="relative" data-lt-a11y-menu="">
      {open && (
        <div
          ref={panelRef}
          id={panelId}
          role="dialog"
          aria-labelledby={titleId}
          tabIndex={-1}
          className="lt-ui absolute end-0 top-full z-50 mt-3 max-h-[calc(100svh-6rem)] w-[min(20rem,calc(100vw-3.5rem))] overflow-y-auto overflow-x-hidden rounded-2xl border border-gray-200 bg-white p-4 text-start text-gray-950 shadow-2xl dark:border-white/15 dark:bg-gray-900 dark:text-white"
        >
          <div className="mb-3 flex items-center justify-between gap-2">
            <h2 id={titleId} className="min-w-0 break-words font-bold">{t('a11y.menu.title')}</h2>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label={t('a11y.menu.close')}
              className="-m-1 rounded-full p-2 hover:bg-gray-100 dark:hover:bg-white/10"
            >
              <X className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>

          <div className="mb-3 flex items-center justify-between gap-2 rounded-xl bg-gray-100 p-2 dark:bg-white/10" role="group" aria-label={t('a11y.menu.text')}>
            <button
              type="button"
              onClick={() => step(-1)}
              disabled={prefs.text === 0}
              aria-label={t('a11y.menu.textSmaller')}
              className="rounded-lg bg-white p-2 disabled:opacity-40 dark:bg-gray-900"
            >
              <Minus className="h-4 w-4" aria-hidden="true" />
            </button>
            <span className="text-sm font-medium" aria-live="polite">
              {t('a11y.menu.text')} <bdi>{TEXT_SCALE[prefs.text]}%</bdi>
            </span>
            <button
              type="button"
              onClick={() => step(1)}
              disabled={prefs.text === 3}
              aria-label={t('a11y.menu.textLarger')}
              className="rounded-lg bg-white p-2 disabled:opacity-40 dark:bg-gray-900"
            >
              <Plus className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>

          <div className="mb-3 grid grid-cols-2 gap-2">
            {TOGGLES.map(({ key, icon: Icon }) => {
              const on = prefs[key];
              return (
                <button
                  key={key}
                  type="button"
                  aria-pressed={on}
                  onClick={() => setA11yPrefs({ [key]: !on } as Partial<A11yPrefs>)}
                  className={`relative ${tile} ${on
                    ? 'border-violet-700 bg-violet-50 text-gray-950 dark:border-violet-300 dark:bg-violet-500/20 dark:text-white'
                    : idle}`}
                >
                  {on && <Check className="absolute end-1.5 top-1.5 h-4 w-4 text-violet-700 dark:text-violet-300" aria-hidden="true" />}
                  <Icon className="h-5 w-5" aria-hidden="true" />
                  <span>{t(`a11y.menu.${key}`)}</span>
                </button>
              );
            })}
            <button
              type="button"
              onClick={resetA11yPrefs}
              disabled={!isCustomised(prefs)}
              className={`${tile} ${idle} disabled:opacity-40`}
            >
              <RotateCcw className="h-5 w-5" aria-hidden="true" />
              <span>{t('a11y.menu.reset')}</span>
            </button>
          </div>

          <a
            href={STATEMENT_URL}
            className="block py-1 text-center text-sm text-violet-700 underline underline-offset-2 dark:text-violet-300"
          >
            {t('a11y.menu.statement')}
          </a>
        </div>
      )}

      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label={t('a11y.menu.button')}
        aria-expanded={open}
        aria-controls={open ? panelId : undefined}
        className={buttonClass}
      >
        <Accessibility className="h-6 w-6" aria-hidden="true" />
      </button>
    </div>
  );
};

export default AccessibilityMenu;
