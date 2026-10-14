import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { HaloReel } from './ui/halo-reel';

/**
 * LT-260: real sites built with Lightor, as their owners' customers see them
 * on a phone (screenshots in public/showcase, taken 2026-10-12). The terms
 * (section 5) let Lightor show a public site in its marketing; an owner who
 * asks to be left out is removed here by hand — the live list, which follows
 * "hide from search" on its own, is lightor.app/sites.
 */
const SITES = [
  { sub: 'zoharsweets', name: 'Zohar Sweets', kind: 'leads' },
  { sub: 'studio-hair-design', name: 'Studio Hair Design', kind: 'booking' },
  { sub: 'cakes-netanya', name: 'עוגות עד הבית', kind: 'leads' },
] as const;

/** True while the viewport is at least `px` wide; follows resizes. */
const useWide = (px: number): boolean => {
  const query = `(min-width: ${px}px)`;
  const [wide, setWide] = useState(() => window.matchMedia(query).matches);
  useEffect(() => {
    const mq = window.matchMedia(query);
    const on = () => setWide(mq.matches);
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, [query]);
  return wide;
};

const Showcase = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'he';
  const Arrow = isRTL ? ArrowLeft : ArrowRight;
  const [active, setActive] = useState(0);
  const wide = useWide(768);
  const site = SITES[active];

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
        items={SITES.map(({ sub, name }) => ({ src: `/showcase/${sub}.webp`, alt: t('showcase.alt', { name }) }))}
        aria-label={t('showcase.title')}
        onActiveChange={setActive}
        cardWidth={150}
        cardHeight={325}
        mirror={isRTL}
        // Wide: the ring rides one edge and the front site is named in the
        // space beside it. Phone: the front card is centred (centre + rx =
        // half the width) and the site is named under the ring.
        centerXRatio={wide ? 0.02 : 0.5 - 0.62}
        radiusXRatio={wide ? 0.4 : 0.62}
        radiusYRatio={0.27}
        minScale={0.3}
        spread={1.1}
        maxCards={6}
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
