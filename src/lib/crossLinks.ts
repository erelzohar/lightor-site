import type { Lang } from '../i18n/languages';

/**
 * LT-710: the language travels with every link that leaves the site
 * (lightor-qa-lt703/language-spec.md, sections 2 and 3). The page's language
 * is its address; the wizard and the dashboard read `?lang=` at boot.
 */
export const registerUrl = (lang: Lang): string => `https://register.lightor.app/?lang=${lang}`;

export const dashboardUrl = (lang: Lang): string => `https://dashboard.lightor.app/?lang=${lang}`;

/**
 * The two-language pages (terms, privacy, refund, support, accessibility,
 * pricing.html): Hebrew as they are, any other language at their English
 * part, the `#english` section each of them has.
 */
export const legalUrl = (href: string, lang: Lang): string => (lang === 'he' ? href : `${href}#english`);

/**
 * The person's own pick, the cookie `lt_lang` shared by lightor.app and its
 * subdomains (the wizard, the dashboard, the edge's root redirect read it).
 * Written only by the language switch; the page works without it.
 */
export const rememberLanguage = (lang: Lang): void => {
  try {
    const host = window.location.hostname;
    const onLightor = host === 'lightor.app' || host.endsWith('.lightor.app');
    const secure = onLightor || window.location.protocol === 'https:';
    document.cookie = [
      `lt_lang=${lang}`,
      ...(onLightor ? ['Domain=.lightor.app'] : []),
      'Path=/',
      'Max-Age=31536000',
      'SameSite=Lax',
      ...(secure ? ['Secure'] : []),
    ].join('; ');
  } catch {
    /* no cookies here */
  }
};
