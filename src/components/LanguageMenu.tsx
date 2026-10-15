import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Check, Globe } from 'lucide-react';
import { LANGS, NATIVE_NAME, pathFor, type Lang } from '../i18n/languages';

/**
 * LT-349: the language switcher. Each language is its own address, so the
 * choices are plain links (hreflang, each named in its own language): a
 * crawler follows them to the other versions, and a person lands on a page
 * that is already in their language.
 */
const linkClass = (active: boolean) =>
  `flex items-center justify-between gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
    active
      ? 'bg-violet-50 text-violet-700 dark:bg-violet-500/15 dark:text-violet-300'
      : 'text-gray-800 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-white/10'
  }`;

/** The desktop dropdown. */
export const LanguageMenu = ({ buttonClass }: { buttonClass: string }) => {
  const { t, i18n } = useTranslation();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const current = i18n.language as Lang;

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false);
        buttonRef.current?.focus();
      }
    };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <div ref={rootRef} className="relative">
      <button
        ref={buttonRef}
        onClick={() => setOpen((v) => !v)}
        className={`${buttonClass} flex items-center gap-1.5 px-3 text-sm font-semibold`}
        aria-expanded={open}
        aria-controls="language-menu"
        aria-label={`${t('nav.language')}: ${NATIVE_NAME[current] ?? ''}`}
      >
        <Globe className="h-4 w-4" aria-hidden="true" />
        <span>{NATIVE_NAME[current]}</span>
      </button>
      <ul
        id="language-menu"
        hidden={!open}
        className="absolute end-0 top-full z-50 mt-2 w-44 space-y-0.5 rounded-xl border border-gray-200/80 bg-white p-1.5 shadow-[0_8px_30px_rgba(0,0,0,0.12)] dark:border-gray-800 dark:bg-gray-950"
      >
        {LANGS.map((l) => (
          <li key={l}>
            <a href={pathFor(l)} hrefLang={l} lang={l} aria-current={l === current ? 'true' : undefined} className={linkClass(l === current)}>
              <span>{NATIVE_NAME[l]}</span>
              {l === current && <Check className="h-4 w-4" aria-hidden="true" />}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

/** The phone menu's row: every language at once, no second menu to open. */
export const LanguageLinks = () => {
  const { t, i18n } = useTranslation();
  const current = i18n.language as Lang;
  return (
    <nav aria-label={t('nav.language')} className="mt-3">
      <p className="mb-1.5 flex items-center gap-1.5 px-3 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
        <Globe className="h-3.5 w-3.5" aria-hidden="true" />
        {t('nav.language')}
      </p>
      <ul className="flex flex-wrap gap-1.5 px-1">
        {LANGS.map((l) => (
          <li key={l}>
            <a
              href={pathFor(l)}
              hrefLang={l}
              lang={l}
              aria-current={l === current ? 'true' : undefined}
              className={`block rounded-full border px-3 py-1.5 text-sm font-medium ${
                l === current
                  ? 'border-violet-300 bg-violet-50 text-violet-700 dark:border-violet-500/40 dark:bg-violet-500/15 dark:text-violet-300'
                  : 'border-gray-200 text-gray-800 hover:bg-gray-100 dark:border-gray-800 dark:text-gray-200 dark:hover:bg-white/10'
              }`}
            >
              {NATIVE_NAME[l]}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
};
