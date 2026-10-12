import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight } from 'lucide-react';

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

const Showcase = () => {
  const { t, i18n } = useTranslation();
  const Arrow = i18n.language === 'he' ? ArrowLeft : ArrowRight;

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

        <ul className="mt-12 flex snap-x snap-mandatory gap-6 overflow-x-auto pb-4 md:grid md:grid-cols-3 md:gap-8 md:overflow-visible md:pb-0">
          {SITES.map(({ sub, name, kind }, i) => (
            <motion.li
              key={sub}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="w-[68%] shrink-0 snap-center sm:w-[42%] md:w-auto"
            >
              <a href={`https://${sub}.lightor.app`} className="group block" aria-label={`${name} — ${t('showcase.visit')}`}>
                <div className="mx-auto max-w-[260px] rounded-[2.4rem] bg-gray-900 p-2.5 shadow-2xl shadow-violet-900/20 transition-transform duration-300 group-hover:-translate-y-1 dark:bg-gray-800">
                  <img
                    src={`/showcase/${sub}.webp`}
                    alt={t('showcase.alt', { name })}
                    width={520}
                    height={1125}
                    loading="lazy"
                    className="block w-full rounded-[1.9rem]"
                  />
                </div>
                <p className="mt-5 text-center text-lg font-bold text-gray-950 dark:text-white">{name}</p>
                <p className="text-center text-sm text-gray-600 dark:text-gray-400">
                  {t(`showcase.kind.${kind}`)} · <span dir="ltr">{sub}.lightor.app</span>
                </p>
              </a>
            </motion.li>
          ))}
        </ul>

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
