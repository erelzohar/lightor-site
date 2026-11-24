import type { Lang } from '../i18n/languages';

/** Set by vite.config.ts (`define`); undefined where the code runs without it. */
declare const __LT_BLOG_LANGS__: string[] | undefined;

/**
 * LT-715: the languages whose blog the navbar and the footer link, named by
 * the build (vite.config.ts, `__LT_BLOG_LANGS__`): a language with at least
 * three published posts. Hebrew alone where the build named none (the site's
 * tests load the code without the config).
 */
const BUILT_BLOG_LANGS: readonly string[] = typeof __LT_BLOG_LANGS__ === 'undefined' ? ['he'] : __LT_BLOG_LANGS__;

/** The blog in a language (/blog/, /en/blog/, /ar/blog/), or null when that language has none yet. */
export const blogPath = (lang: Lang, langs: readonly string[] = BUILT_BLOG_LANGS): string | null =>
  !langs.includes(lang) ? null : lang === 'he' ? '/blog/' : `/${lang}/blog/`;

/**
 * The sites built with Lightor (LT-715): English and Arabic have their own
 * page, served by lightor-edge like /sites; the others the Hebrew one.
 */
export const sitesUrl = (lang: Lang): string => `https://lightor.app${lang === 'en' || lang === 'ar' ? `/${lang}` : ''}/sites`;
