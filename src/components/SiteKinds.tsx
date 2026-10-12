import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { CalendarCheck, Check, Inbox } from 'lucide-react';

/** LT-260: a booking site and a leads site (LT-199), side by side. */
const SiteKinds = () => {
  const { t } = useTranslation();
  const points = (kind: 'booking' | 'leads') => t(`kinds.${kind}.points`, { returnObjects: true }) as string[];

  return (
    <section id="kinds" className="bg-white py-20 sm:py-28 dark:bg-black" aria-labelledby="kinds-title">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-3xl text-center"
        >
          <p className="text-sm font-bold tracking-wide text-violet-600 dark:text-violet-400">{t('kinds.eyebrow')}</p>
          <h2 id="kinds-title" className="text-balance mt-3 text-3xl font-bold tracking-tight text-gray-950 sm:text-4xl dark:text-white">
            {t('kinds.title')}
          </h2>
        </motion.div>

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          <motion.article
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.5 }}
            className="rounded-3xl border border-gray-200 bg-gray-50 p-8 sm:p-10 dark:border-gray-800 dark:bg-gray-950"
          >
            <span className="inline-flex rounded-2xl bg-violet-100 p-3 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300" aria-hidden="true">
              <CalendarCheck className="h-7 w-7" />
            </span>
            <h3 className="mt-5 text-2xl font-bold text-gray-950 dark:text-white">{t('kinds.booking.title')}</h3>
            <p className="mt-1 text-gray-600 dark:text-gray-400">{t('kinds.booking.lead')}</p>
            <ul className="mt-6 space-y-3">
              {points('booking').map((p) => (
                <li key={p} className="flex items-start gap-3 text-gray-800 dark:text-gray-200">
                  <Check className="mt-0.5 h-5 w-5 shrink-0 text-violet-600 dark:text-violet-400" aria-hidden="true" />
                  {p}
                </li>
              ))}
            </ul>
          </motion.article>

          <motion.article
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.5, delay: 0.08 }}
            className="rounded-3xl bg-gradient-to-br from-violet-700 to-fuchsia-800 p-8 text-white shadow-xl shadow-violet-900/20 sm:p-10"
          >
            <span className="inline-flex rounded-2xl bg-white/15 p-3" aria-hidden="true">
              <Inbox className="h-7 w-7" />
            </span>
            <h3 className="mt-5 text-2xl font-bold">{t('kinds.leads.title')}</h3>
            <p className="mt-1 text-violet-100">{t('kinds.leads.lead')}</p>
            <ul className="mt-6 space-y-3">
              {points('leads').map((p) => (
                <li key={p} className="flex items-start gap-3">
                  <Check className="mt-0.5 h-5 w-5 shrink-0 text-pink-200" aria-hidden="true" />
                  {p}
                </li>
              ))}
            </ul>
          </motion.article>
        </div>

        <p className="mt-8 text-center text-gray-600 dark:text-gray-400">{t('kinds.both')}</p>
      </div>
    </section>
  );
};

export default SiteKinds;
