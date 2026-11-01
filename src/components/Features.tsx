import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Check, Clock, Images, LayoutDashboard, Smartphone, TrendingUp } from 'lucide-react';
import {
  FeatureCard,
  addressScene,
  alertsScene,
  calendarScene,
  customersScene,
  designScene,
  languagesScene,
  remindersScene,
} from './ui/feature';

// Three columns from lg: the two wide cards zigzag. Two columns at md: the
// calendar alone on the first row, then pairs.
const CARDS = [
  { id: 'calendar', scene: calendarScene, wide: true, className: 'md:col-span-2' },
  { id: 'reminders', scene: remindersScene },
  { id: 'alerts', scene: alertsScene },
  { id: 'customers', scene: customersScene },
  { id: 'design', scene: designScene },
  { id: 'languages', scene: languagesScene },
  { id: 'address', scene: addressScene, wide: true, lead: true, className: 'lg:col-span-2' },
] as const;

const EXTRAS = [
  { id: 'dashboard', Icon: LayoutDashboard },
  { id: 'hours', Icon: Clock },
  { id: 'content', Icon: Images },
  { id: 'mobile', Icon: Smartphone },
] as const;

/**
 * LT-260: what an account gets. LT-526: the main features are cards with a
 * small scene from the product (ui/feature.tsx); the rest follow in a row.
 * LT-306: the last row is the organic promotion every site gets (the edge's
 * structured data and sitemaps, IndexNow on every save, a link from /sites).
 */
const Features = () => {
  const { t } = useTranslation();
  const seoPoints = t('features.seo.points', { returnObjects: true }) as string[];

  return (
    <section id="features" className="bg-gray-50 py-20 sm:py-28 dark:bg-gray-950" aria-labelledby="features-title">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-3xl text-center"
        >
          <p className="text-sm font-bold tracking-wide text-violet-600 dark:text-violet-400">{t('features.eyebrow')}</p>
          <h2 id="features-title" className="text-balance mt-3 text-3xl font-bold tracking-tight text-gray-950 sm:text-4xl dark:text-white">
            {t('features.title')}
          </h2>
        </motion.div>

        <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3 lg:gap-5">
          {CARDS.map(({ id, ...card }, i) => (
            <FeatureCard
              key={id}
              {...card}
              title={t(`features.items.${id}.title`)}
              text={t(`features.items.${id}.text`)}
              delay={(i % 3) * 150}
            />
          ))}
        </div>

        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:mt-5 lg:grid-cols-4 lg:gap-5">
          {EXTRAS.map(({ id, Icon }, i) => (
            <motion.article
              key={id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className="flex items-start gap-4 rounded-3xl border border-gray-200 bg-white p-5 sm:block sm:p-6 dark:border-gray-800 dark:bg-black"
            >
              <span className="inline-flex shrink-0 rounded-2xl bg-violet-50 p-3 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300" aria-hidden="true">
                <Icon className="h-6 w-6" />
              </span>
              <div className="min-w-0">
                <h3 className="text-lg font-bold text-gray-950 sm:mt-4 dark:text-white">{t(`features.items.${id}.title`)}</h3>
                <p className="mt-1 text-gray-600 sm:mt-2 dark:text-gray-400">{t(`features.items.${id}.text`)}</p>
              </div>
            </motion.article>
          ))}
        </div>

        <motion.article
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.4 }}
          className="mt-4 rounded-3xl border border-violet-200 bg-gradient-to-br from-violet-50 to-pink-50 p-7 lg:mt-5 lg:p-9 dark:border-violet-900/60 dark:from-violet-950/40 dark:to-pink-950/20"
        >
          {/* LT-354: search and AI answers, with Lighty riding the growth arrow. */}
          <div className="grid items-center gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_14rem] lg:gap-10">
            <div className="min-w-0">
              <p className="inline-flex items-center gap-2 text-sm font-bold tracking-wide text-violet-700 dark:text-violet-300">
                <TrendingUp className="h-4 w-4" aria-hidden="true" />
                {t('features.seo.eyebrow')}
              </p>
              <h3 className="text-balance mt-3 text-2xl font-bold tracking-tight text-gray-950 sm:text-3xl dark:text-white">{t('features.seo.title')}</h3>
              <p className="text-balance mt-3 text-gray-700 dark:text-gray-300">{t('features.seo.text')}</p>
            </div>
            <ul className="grid min-w-0 gap-3">
              {seoPoints.map((p) => (
                <li key={p} className="flex items-start gap-3 rounded-2xl bg-white/80 px-4 py-3 font-medium text-gray-800 dark:bg-black/40 dark:text-gray-200">
                  <Check className="mt-0.5 h-5 w-5 shrink-0 text-violet-600 dark:text-violet-400" aria-hidden="true" />
                  {p}
                </li>
              ))}
            </ul>
            <img
              src="/lighty-growth.webp"
              alt={t('features.seo.imageAlt')}
              width={640}
              height={640}
              loading="lazy"
              className="order-first mx-auto h-44 w-44 object-contain sm:h-52 sm:w-52 lg:order-none lg:h-56 lg:w-56"
            />
          </div>
        </motion.article>
      </div>
    </section>
  );
};

export default Features;
