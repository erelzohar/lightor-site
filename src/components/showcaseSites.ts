import type { Lang } from '../i18n/languages';

/**
 * LT-260: real sites built with Lightor, as their owners' customers see them
 * on a phone (screenshots in public/showcase). The terms (section 5) let
 * Lightor show a public site in its marketing; an owner who asks to be left
 * out is removed here by hand - the live list, which follows "hide from
 * search" on its own, is lightor.app/sites.
 *
 * LT-675: each language shows sites written in it. Besides Zohar Sweets they
 * are demo businesses the real wizard built (LT-331, LT-675), seeded with
 * activity by lightor-back's seedDemoSites; the LT-675 ones each wear one of
 * the ten styles of 2026-11, so a language's ring shows different designs.
 *
 * LT-698: its own module, so the landing pages (src/blog) show the same
 * phones without the home page's ring.
 */
export type ShowcaseSite = { sub: string; name: string; kind: 'booking' | 'leads' };

export const SITES: Record<Lang, readonly ShowcaseSite[]> = {
  he: [
    { sub: 'zoharsweets', name: 'Zohar Sweets', kind: 'leads' },
    { sub: 'or-rach', name: 'אור רך', kind: 'leads' },
    { sub: 'hakise-barbershop', name: 'דקל ברברשופ', kind: 'booking' },
    { sub: 'balonim-vesimcha', name: 'בלונים ושמחה', kind: 'leads' },
    { sub: 'noga-nails', name: 'נוגה ניילס', kind: 'booking' },
    { sub: 'studio-koach', name: 'סטודיו Loose', kind: 'booking' },
    { sub: 'shulchan-aruch', name: 'שולחן ערוך', kind: 'leads' },
    { sub: 'neshima-yoga', name: 'נשימה', kind: 'booking' },
    { sub: 'dyo-tattoo', name: 'דיו', kind: 'booking' },
  ],
  en: [
    { sub: 'harbor-pilates', name: 'Harbor Pilates', kind: 'booking' },
    { sub: 'olive-and-rye', name: 'Olive & Rye', kind: 'leads' },
    { sub: 'mila-fit', name: 'Mila Fit', kind: 'booking' },
    { sub: 'bright-smile-dental', name: 'Bright Smile Dental', kind: 'booking' },
  ],
  ar: [
    { sub: 'layan-beauty-salon', name: 'صالون ليان للتجميل', kind: 'booking' },
    { sub: 'halawiyat-albahr', name: 'حلويات البحر', kind: 'leads' },
    { sub: 'ibtisama-dental', name: 'عيادة ابتسامة', kind: 'booking' },
    { sub: 'adv-rana-khoury', name: 'مكتب المحامية رنا خوري', kind: 'leads' },
  ],
  fr: [
    { sub: 'petite-boulangerie', name: 'La Petite Boulangerie', kind: 'leads' },
    { sub: 'force-club', name: 'Force Club', kind: 'booking' },
    { sub: 'studio-perle', name: 'Studio Perle', kind: 'booking' },
    { sub: 'claire-benhamou-psy', name: 'Claire Benhamou', kind: 'booking' },
  ],
  es: [
    { sub: 'barberia-el-porteno', name: 'Barbería El Porteño', kind: 'booking' },
    { sub: 'lucia-moreno-foto', name: 'Lucía Moreno Fotografía', kind: 'leads' },
    { sub: 'tinta-negra', name: 'Tinta Negra', kind: 'booking' },
    { sub: 'prana-yoga-telaviv', name: 'Prana Yoga', kind: 'booking' },
  ],
};

/** The screenshots' date: a new set gets a new address, past the 4 h cache (LT-372). */
export const SHOTS = '2026-11-17';

/** A site's phone screenshot, at the current set's address. */
export const shotSrc = (sub: string): string => `/showcase/${sub}.webp?v=${SHOTS}`;
