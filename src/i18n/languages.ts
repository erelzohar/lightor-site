/**
 * LT-349: one URL per language: Google's own advice for a multilingual
 * site: a crawler reads the HTML a URL serves, so a page that switches its
 * language in the browser is indexed in one language only. Hebrew is the
 * root; the others live under their own folder, and every version names the
 * rest with hreflang (see `seo.ts` and the build step in vite.config.ts).
 */
export const LANGS = ['he', 'en', 'ar', 'fr', 'es'] as const;
export type Lang = (typeof LANGS)[number];
export const DEFAULT_LANG: Lang = 'he';

const RTL = new Set<Lang>(['he', 'ar']);
export const isRtl = (lang: string): boolean => RTL.has(lang as Lang);

/** Each language's name in its own language, for the switcher. */
export const NATIVE_NAME: Record<Lang, string> = {
  he: 'עברית',
  en: 'English',
  ar: 'العربية',
  fr: 'Français',
  es: 'Español',
};

/** The path a language lives at: "/" for Hebrew, "/en/" and so on. */
export const pathFor = (lang: Lang): string => (lang === DEFAULT_LANG ? '/' : `/${lang}/`);

/** The language a path is in: its first segment when it names one, else Hebrew. */
export const langFromPath = (pathname: string): Lang => {
  const first = pathname.split('/').filter(Boolean)[0];
  return (LANGS as readonly string[]).includes(first ?? '') && first !== DEFAULT_LANG ? (first as Lang) : DEFAULT_LANG;
};
