import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { MessagesSquare, MousePointerClick, Wand2 } from 'lucide-react';

/**
 * LT-260: Lighty (LT-237 → LT-259) — he builds the site from a conversation
 * (the register), edits it with a click (the dashboard's site editor) and
 * answers questions about the business from its own data (read-only today:
 * bookings, free time, summaries, customers, inquiries). Nothing here may
 * promise what he cannot do yet — no actions.
 */
const LightySection = () => {
  const { t } = useTranslation();
  const examples = t('lighty.ask.examples', { returnObjects: true }) as string[];
  const cards = [
    { id: 'build', Icon: Wand2 },
    { id: 'edit', Icon: MousePointerClick },
    { id: 'ask', Icon: MessagesSquare },
  ] as const;

  return (
    <section id="lighty" className="relative overflow-hidden bg-[#140b2e] py-20 text-white sm:py-28" aria-labelledby="lighty-title">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute -top-32 start-[-10%] h-[28rem] w-[28rem] rounded-full bg-violet-600/30 blur-3xl" />
        <div className="absolute bottom-[-8rem] end-[-6%] h-[26rem] w-[26rem] rounded-full bg-pink-600/20 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-10 lg:grid-cols-[0.8fr_1.2fr]">
          <motion.div
            initial={{ opacity: 0, scale: 0.94 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6 }}
            className="text-center lg:text-start"
          >
            <p className="text-sm font-bold tracking-wide text-pink-300">{t('lighty.eyebrow')}</p>
            <h2 id="lighty-title" className="text-balance mt-3 text-3xl font-bold tracking-tight sm:text-4xl">{t('lighty.title')}</h2>
            <p className="mt-4 text-lg text-violet-100/90">{t('lighty.subtitle')}</p>
            <img
              src="/lighty-cast.webp"
              alt={t('lighty.imageAlt')}
              width={800}
              height={800}
              loading="lazy"
              className="mx-auto mt-6 w-56 drop-shadow-[0_20px_40px_rgba(167,139,250,0.35)] sm:w-72 lg:mx-0"
            />
          </motion.div>

          <div className="space-y-4">
            {cards.map(({ id, Icon }, i) => (
              <motion.article
                key={id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.45, delay: i * 0.08 }}
                className="rounded-3xl border border-white/10 bg-white/[0.06] p-6 backdrop-blur sm:p-7"
              >
                <div className="flex items-start gap-4">
                  <span className="inline-flex shrink-0 rounded-2xl bg-gradient-to-br from-violet-500 to-pink-500 p-3" aria-hidden="true">
                    <Icon className="h-6 w-6" />
                  </span>
                  <div>
                    <h3 className="text-xl font-bold">{t(`lighty.${id}.title`)}</h3>
                    <p className="mt-1.5 text-violet-100/85">{t(`lighty.${id}.text`)}</p>
                    {id === 'ask' && (
                      <ul className="mt-4 flex flex-wrap gap-2" aria-label={t('lighty.ask.title')}>
                        {examples.map((q) => (
                          <li key={q} className="rounded-2xl rounded-ss-sm bg-white px-3.5 py-1.5 text-sm font-semibold text-violet-900">
                            {q}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default LightySection;
