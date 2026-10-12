import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { CalendarCheck, Check, Inbox, LayoutTemplate } from 'lucide-react';

const CARDS = [
  { id: 'site', Icon: LayoutTemplate },
  { id: 'booking', Icon: CalendarCheck },
  { id: 'leads', Icon: Inbox },
] as const;

/**
 * LT-260, LT-276: a site for anything - a business, a brochure site, a
 * landing page, an event. What every site has comes first; then the two
 * things it can take (LT-199's conversion, 'book' | 'lead', which the
 * register reads from the conversation and Settings can switch).
 */
const SiteKinds = () => {
  const { t } = useTranslation();
  const uses = t('kinds.uses', { returnObjects: true }) as string[];

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
          <ul className="mt-6 flex flex-wrap justify-center gap-2">
            {uses.map((u) => (
              <li
                key={u}
                className="rounded-full border border-violet-200 bg-violet-50 px-4 py-1.5 text-sm font-semibold text-violet-800 dark:border-violet-800/60 dark:bg-violet-900/30 dark:text-violet-200"
              >
                {u}
              </li>
            ))}
          </ul>
        </motion.div>

        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {CARDS.map(({ id, Icon }, i) => {
            const lead = i === 0;
            const points = t(`kinds.${id}.points`, { returnObjects: true }) as string[];
            return (
              <motion.article
                key={id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className={
                  lead
                    ? 'rounded-3xl bg-gradient-to-br from-violet-700 to-fuchsia-800 p-8 text-white shadow-xl shadow-violet-900/20 sm:p-10 md:col-span-2 lg:col-span-1'
                    : 'rounded-3xl border border-gray-200 bg-gray-50 p-8 sm:p-10 dark:border-gray-800 dark:bg-gray-950'
                }
              >
                <span
                  className={`inline-flex rounded-2xl p-3 ${lead ? 'bg-white/15' : 'bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300'}`}
                  aria-hidden="true"
                >
                  <Icon className="h-7 w-7" />
                </span>
                <h3 className={`mt-5 text-2xl font-bold ${lead ? '' : 'text-gray-950 dark:text-white'}`}>{t(`kinds.${id}.title`)}</h3>
                <p className={`mt-1 ${lead ? 'text-violet-100' : 'text-gray-600 dark:text-gray-400'}`}>{t(`kinds.${id}.lead`)}</p>
                <ul className="mt-6 space-y-3">
                  {points.map((p) => (
                    <li key={p} className={`flex items-start gap-3 ${lead ? '' : 'text-gray-800 dark:text-gray-200'}`}>
                      <Check className={`mt-0.5 h-5 w-5 shrink-0 ${lead ? 'text-pink-200' : 'text-violet-600 dark:text-violet-400'}`} aria-hidden="true" />
                      {p}
                    </li>
                  ))}
                </ul>
              </motion.article>
            );
          })}
        </div>

        <p className="mt-8 text-center text-gray-600 dark:text-gray-400">{t('kinds.both')}</p>
      </div>
    </section>
  );
};

export default SiteKinds;
