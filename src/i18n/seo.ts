import { LANGS, DEFAULT_LANG, isRtl, pathFor, type Lang } from './languages';

/**
 * LT-349: what each language's HTML carries before any script runs: the
 * title and description a search engine shows, the share card, and the links
 * between the versions. The title starts "Lightor | <the name as written in
 * that language>" (Erel), so a search for "לייטור" or "لايتور" finds it.
 * Plain hyphens only: no em-dash anywhere users read (LT-350).
 */
export const ORIGIN = 'https://lightor.app';

export interface Seo {
  title: string;
  description: string;
  ogTitle: string;
  ogDescription: string;
  ogLocale: string;
  imageAlt: string;
}

export const SEO: Record<Lang, Seo> = {
  he: {
    title: 'Lightor | לייטור | אתר לכל עסק, אירוע או רעיון - עם AI',
    description:
      'לייטור בונה לך אתר מתוך שיחה עם Lighty, העוזר החכם - לעסק, לאירוע, דף נחיתה או אתר תדמית, בכתובת משלך. האתר יכול גם לקבל תורים או פניות, עם תזכורות, התראות ולוח בקרה. כל אתר בנוי כדי שימצאו אותו בגוגל ובמנועי AI.',
    ogTitle: 'Lightor | לייטור - האתר שלך, תוך 60 שניות',
    ogDescription: 'Lighty בונה לך אתר משלך מתוך שיחה - לעסק, לאירוע, דף נחיתה או כל רעיון. מתחילים בחינם.',
    ogLocale: 'he_IL',
    imageAlt: 'Lighty, הדמות של לייטור, ליד הכותרת: האתר שלך, תוך 60 שניות',
  },
  en: {
    title: 'Lightor | A website for any business, event or idea - with AI',
    description:
      'Lightor builds you a website from a conversation with Lighty, its smart assistant - for a business, an event, a landing page or a brochure site, at your own address. A site can also take bookings or inquiries, with reminders, alerts and a dashboard. Every site is built to be found on Google and in AI search.',
    ogTitle: 'Lightor - Your website, in 60 seconds',
    ogDescription: 'Lighty builds you a site of your own from a conversation - for a business, an event, a landing page or any idea. Start free.',
    ogLocale: 'en_US',
    imageAlt: 'Lighty, the Lightor character, next to the headline: your website, in 60 seconds',
  },
  ar: {
    title: 'Lightor | لايتور | موقع لأي عمل أو حدث أو فكرة - بالذكاء الاصطناعي',
    description:
      'لايتور يبني لك موقعًا من محادثة مع Lighty، المساعد الذكي - لعملك أو لحدث أو صفحة هبوط أو موقع تعريفي، على عنوانك الخاص. ويمكن للموقع أيضًا استقبال الحجوزات أو الاستفسارات، مع تذكيرات وتنبيهات ولوحة تحكم. كل موقع مبني ليظهر في Google ومحركات البحث بالذكاء الاصطناعي.',
    ogTitle: 'Lightor | لايتور - موقعك خلال 60 ثانية',
    ogDescription: 'Lighty يبني لك موقعك الخاص من محادثة - لعملك أو لحدث أو صفحة هبوط أو أي فكرة. ابدأ مجانًا.',
    ogLocale: 'ar_AR',
    imageAlt: 'Lighty، شخصية لايتور، بجانب العنوان: موقعك خلال 60 ثانية',
  },
  fr: {
    title: "Lightor | Un site pour toute entreprise, tout événement ou toute idée - avec l'IA",
    description:
      "Lightor crée votre site à partir d'une conversation avec Lighty, son assistant intelligent - pour une entreprise, un événement, une page d'atterrissage ou un site vitrine, à votre propre adresse. Le site peut aussi prendre des rendez-vous ou recevoir des demandes, avec rappels, alertes et tableau de bord. Chaque site est conçu pour être trouvé sur Google et dans la recherche IA.",
    ogTitle: 'Lightor - Votre site, en 60 secondes',
    ogDescription: "Lighty crée votre propre site à partir d'une conversation - pour une entreprise, un événement, une page d'atterrissage ou toute idée. Commencez gratuitement.",
    ogLocale: 'fr_FR',
    imageAlt: 'Lighty, le personnage de Lightor, à côté du titre : votre site, en 60 secondes',
  },
  es: {
    title: 'Lightor | Un sitio web para cualquier negocio, evento o idea - con IA',
    description:
      'Lightor crea tu sitio web a partir de una conversación con Lighty, su asistente inteligente - para un negocio, un evento, una landing page o un sitio institucional, en tu propia dirección. El sitio también puede recibir reservas o consultas, con recordatorios, alertas y un panel de control. Cada sitio está hecho para aparecer en Google y en la búsqueda con IA.',
    ogTitle: 'Lightor - Tu sitio web, en 60 segundos',
    ogDescription: 'Lighty crea tu propio sitio a partir de una conversación - para un negocio, un evento, una landing page o cualquier idea. Empieza gratis.',
    ogLocale: 'es_ES',
    imageAlt: 'Lighty, el personaje de Lightor, junto al titular: tu sitio web, en 60 segundos',
  },
};

/** The brand as written in the scripts we speak, for structured data. */
export const BRAND_ALTERNATE_NAMES = ['לייטור', 'لايتور'];

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/** The hreflang links every version carries: itself, the rest, and x-default (Hebrew, the root). */
export const hreflangLinks = (): string =>
  [
    ...LANGS.map((l) => `<link rel="alternate" hreflang="${l}" href="${ORIGIN}${pathFor(l)}" />`),
    `<link rel="alternate" hreflang="x-default" href="${ORIGIN}${pathFor(DEFAULT_LANG)}" />`,
  ].join('\n    ');

/**
 * The built page in `lang`: the <html> lang/dir, the title, the description,
 * the canonical URL, the share card, and the hreflang links: everything a
 * crawler reads before scripts. `html` is the Hebrew build (index.html).
 */
export const localizeHtml = (html: string, lang: Lang): string => {
  const seo = SEO[lang];
  const url = `${ORIGIN}${pathFor(lang)}`;
  const set = (re: RegExp, value: string) => {
    if (!re.test(html)) throw new Error(`LT-349: ${re} not found in index.html`);
    html = html.replace(re, value);
  };
  set(/<html lang="[^"]*" dir="[^"]*">/, `<html lang="${lang}" dir="${isRtl(lang) ? 'rtl' : 'ltr'}">`);
  set(/<title>[^<]*<\/title>/, `<title>${esc(seo.title)}</title>`);
  set(/<meta name="description" content="[^"]*" \/>/, `<meta name="description" content="${esc(seo.description)}" />`);
  set(/<link rel="canonical" href="[^"]*" \/>/, `<link rel="canonical" href="${url}" />\n    ${hreflangLinks()}`);
  set(/<meta property="og:locale" content="[^"]*" \/>/, [
    `<meta property="og:locale" content="${seo.ogLocale}" />`,
    ...LANGS.filter((l) => l !== lang).map((l) => `<meta property="og:locale:alternate" content="${SEO[l].ogLocale}" />`),
  ].join('\n    '));
  set(/<meta property="og:url" content="[^"]*" \/>/, `<meta property="og:url" content="${url}" />`);
  set(/<meta property="og:title" content="[^"]*" \/>/, `<meta property="og:title" content="${esc(seo.ogTitle)}" />`);
  set(/<meta property="og:description" content="[^"]*" \/>/, `<meta property="og:description" content="${esc(seo.ogDescription)}" />`);
  set(/<meta property="og:image:alt" content="[^"]*" \/>/, `<meta property="og:image:alt" content="${esc(seo.imageAlt)}" />`);
  set(/<meta name="twitter:title" content="[^"]*" \/>/, `<meta name="twitter:title" content="${esc(seo.ogTitle)}" />`);
  set(/<meta name="twitter:description" content="[^"]*" \/>/, `<meta name="twitter:description" content="${esc(seo.ogDescription)}" />`);
  return html;
};
