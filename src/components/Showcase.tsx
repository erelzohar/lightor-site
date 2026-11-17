import { useState, useSyncExternalStore } from 'react';
import { useTranslation } from 'react-i18next';
import { isRtl, LANGS, DEFAULT_LANG, type Lang } from '../i18n/languages';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { HaloReel } from './ui/halo-reel';

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
 */
type ShowcaseSite = { sub: string; name: string; kind: 'booking' | 'leads' };

const SITES: Record<Lang, readonly ShowcaseSite[]> = {
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
const SHOTS = '2026-11-17';

/**
 * True while the viewport is at least `px` wide; follows resizes. The page
 * drawn at build time (LT-579) is the phone's; the browser corrects it.
 */
const useWide = (px: number): boolean => {
  const query = `(min-width: ${px}px)`;
  return useSyncExternalStore(
    (on) => {
      const mq = window.matchMedia(query);
      mq.addEventListener('change', on);
      return () => mq.removeEventListener('change', on);
    },
    () => window.matchMedia(query).matches,
    () => false,
  );
};

const Showcase = () => {
  const { t, i18n } = useTranslation();
  const isRTL = isRtl(i18n.language);
  const Arrow = isRTL ? ArrowLeft : ArrowRight;
  const lang: Lang = (LANGS as readonly string[]).includes(i18n.language) ? (i18n.language as Lang) : DEFAULT_LANG;
  const sites = SITES[lang];
  const [active, setActive] = useState(0);
  const wide = useWide(768);
  const site = sites[active % sites.length];

  const caption = (
    <div className="mx-auto max-w-xs text-center" aria-live="polite">
      <p className="text-2xl font-bold text-gray-950 sm:text-3xl dark:text-white">{site.name}</p>
      <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
        {t(`showcase.kind.${site.kind}`)} · <span dir="ltr">{site.sub}.lightor.app</span>
      </p>
      <a
        href={`https://${site.sub}.lightor.app`}
        onPointerDown={(e) => e.stopPropagation()}
        className="pointer-events-auto mt-4 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-violet-600 to-pink-600 px-5 py-2.5 font-semibold text-white shadow-md shadow-violet-600/20 transition hover:shadow-lg"
      >
        {t('showcase.visit')}
        <Arrow className="h-4 w-4" aria-hidden="true" />
      </a>
    </div>
  );

  return (
    <section id="showcase" className="bg-gray-50 py-20 sm:py-28 dark:bg-gray-950" aria-labelledby="showcase-title">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-3xl text-center"
        >
          <p className="text-sm font-bold tracking-wide text-violet-600 dark:text-violet-400">{t('showcase.eyebrow')}</p>
          <h2 id="showcase-title" className="text-balance mt-3 text-3xl font-bold tracking-tight text-gray-950 sm:text-4xl dark:text-white">
            {t('showcase.title')}
          </h2>
          <p className="mt-3 text-lg text-gray-600 dark:text-gray-400">{t('showcase.subtitle')}</p>
        </motion.div>
      </div>

      {/* LT-330: the phones ride a turning ring (HaloReel); the site at the
          front is named beside it on wide screens and under it on phones. */}
      <HaloReel
        items={sites.map(({ sub, name }) => ({ src: `/showcase/${sub}.webp?v=${SHOTS}`, alt: t('showcase.alt', { name }) }))}
        aria-label={t('showcase.title')}
        onActiveChange={setActive}
        cardWidth={150}
        cardHeight={325}
        mirror={isRTL}
        pauseLabel={t('showcase.pause')}
        playLabel={t('showcase.play')}
        // Wide: the ring rides one edge and the front site is named in the
        // space beside it. Phone: the front card is centred (centre + rx =
        // half the width) and the site is named under the ring.
        centerXRatio={wide ? 0.02 : 0.5 - 0.62}
        radiusXRatio={wide ? 0.4 : 0.62}
        radiusYRatio={0.27}
        minScale={0.3}
        spread={1.1}
        // A short list goes round twice, so the ring is never sparse.
        maxCards={sites.length < 7 ? sites.length * 2 : 7}
        holdDuration={1800}
        stepDuration={750}
        centerLabel={wide ? caption : undefined}
        cardClassName="rounded-[1.6rem] bg-gray-900 p-[5px] shadow-xl shadow-violet-900/25 dark:bg-gray-800"
        imageClassName="rounded-[1.3rem]"
        className="mt-10 h-[480px] md:h-[620px]"
      />
      {!wide && <div className="px-4">{caption}</div>}

      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mt-10 text-center">
          <a
            href="https://lightor.app/sites"
            className="inline-flex items-center gap-2 rounded-full border border-gray-300 bg-white px-6 py-3 font-semibold text-gray-800 transition hover:border-gray-400 dark:border-gray-700 dark:bg-white/5 dark:text-gray-100"
          >
            {t('showcase.all')}
            <Arrow className="h-4 w-4" aria-hidden="true" />
          </a>
        </div>
      </div>
    </section>
  );
};

export default Showcase;
