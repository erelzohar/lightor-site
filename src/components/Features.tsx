import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { BellRing, Clock, Globe, Images, Languages, LayoutDashboard, MessageCircle, Smartphone, Users } from 'lucide-react';

const ITEMS = [
  { id: 'address', Icon: Globe },
  { id: 'reminders', Icon: MessageCircle },
  { id: 'alerts', Icon: BellRing },
  { id: 'dashboard', Icon: LayoutDashboard },
  { id: 'customers', Icon: Users },
  { id: 'hours', Icon: Clock },
  { id: 'content', Icon: Images },
  { id: 'languages', Icon: Languages },
  { id: 'mobile', Icon: Smartphone },
] as const;

/** LT-260: what an account gets, as a grid — the first card is the address, set apart. */
const Features = () => {
  const { t } = useTranslation();

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

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {ITEMS.map(({ id, Icon }, i) => {
            const lead = i === 0;
            return (
              <motion.article
                key={id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.4, delay: (i % 4) * 0.05 }}
                className={
                  lead
                    ? 'rounded-3xl bg-gradient-to-br from-violet-600 to-pink-600 p-7 text-white sm:col-span-2 lg:row-span-2 lg:p-9'
                    : 'rounded-3xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-black'
                }
              >
                <span
                  className={`inline-flex rounded-2xl p-3 ${lead ? 'bg-white/15' : 'bg-violet-50 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300'}`}
                  aria-hidden="true"
                >
                  <Icon className={lead ? 'h-8 w-8' : 'h-6 w-6'} />
                </span>
                <h3 className={`mt-4 font-bold ${lead ? 'text-2xl sm:text-3xl' : 'text-lg text-gray-950 dark:text-white'}`}>
                  {t(`features.items.${id}.title`)}
                </h3>
                <p className={`mt-2 ${lead ? 'text-lg text-white/90' : 'text-gray-600 dark:text-gray-400'}`}>
                  {t(`features.items.${id}.text`)}
                </p>
                {lead && (
                  <p dir="ltr" className="mt-8 inline-block rounded-2xl bg-white/15 px-4 py-2 font-mono text-base sm:text-lg">
                    your-business.lightor.app
                  </p>
                )}
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Features;
