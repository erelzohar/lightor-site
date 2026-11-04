import { lazy, Suspense, useEffect, useRef, useState, type ComponentProps, type ComponentType } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { MessagesSquare, MousePointerClick, Wand2 } from 'lucide-react';
import { useStill } from '../hooks/useA11yPrefs';
import { isRtl } from '../i18n/languages';

// As in the Hero (LT-315): a chunk that fails to load leaves the still.
type LightyRunInProps = ComponentProps<typeof import('./LightyRunIn').default>;
const NoRunIn = ({ onFail }: LightyRunInProps) => {
  useEffect(() => onFail(), [onFail]);
  return null;
};
const LightyRunIn = lazy<ComponentType<LightyRunInProps>>(() =>
  import('./LightyRunIn').catch(() => ({ default: NoRunIn }))
);

/** How long he may keep a visitor waiting at his empty place before the still comes in. */
const MODEL_PATIENCE_MS = 1500;
const FADE_MS = 300;

const savesData = () =>
  typeof navigator !== 'undefined' && (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData === true;

/**
 * LT-533: the first time his place scrolls into view, the 3D Lighty runs in
 * from the side of the screen and stops exactly on the still, which then
 * takes over. The still is the page's Lighty: it holds his place from the
 * start, and shows at once if the visitor asked for less motion, saves data,
 * has no WebGL, or the model is late.
 */
const LightyArrival = () => {
  const { t, i18n } = useTranslation();
  const still = useStill();
  const placeRef = useRef<HTMLDivElement>(null);
  const [near, setNear] = useState(false);
  const [go, setGo] = useState(false);
  const [running, setRunning] = useState(false);
  const [arrived, setArrived] = useState(false);
  const [over, setOver] = useState(false);
  const settled = arrived || still;

  // In an effect, not the first render: the page drawn at build time (LT-579)
  // cannot know, and the browser's first render must match it.
  useEffect(() => {
    if (savesData()) setArrived(true);
  }, []);

  useEffect(() => {
    const place = placeRef.current;
    if (!place || settled) return;
    // A viewport and a half early, so the model is ready when he is needed.
    const nearby = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) setNear(true);
    }, { rootMargin: '150% 0px' });
    const inView = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) setGo(true);
    }, { threshold: 0.6 });
    nearby.observe(place);
    inView.observe(place);
    return () => {
      nearby.disconnect();
      inView.disconnect();
    };
  }, [settled]);

  useEffect(() => {
    if (!go || running || settled) return;
    const timer = setTimeout(() => setArrived(true), MODEL_PATIENCE_MS);
    return () => clearTimeout(timer);
  }, [go, running, settled]);

  useEffect(() => {
    if (!settled) return;
    const timer = setTimeout(() => setOver(true), FADE_MS);
    return () => clearTimeout(timer);
  }, [settled]);

  return (
    <div ref={placeRef} className="relative mx-auto mt-6 w-56 sm:w-72 lg:mx-0">
      <img
        src="/lighty-cast.webp"
        alt={t('lighty.imageAlt')}
        width={800}
        height={800}
        loading="lazy"
        style={{ transitionDuration: `${FADE_MS}ms` }}
        className={`w-full drop-shadow-[0_20px_40px_rgba(167,139,250,0.35)] transition-opacity ${settled ? 'opacity-100' : 'opacity-0'}`}
      />
      {near && !over && !still && (
        <Suspense fallback={null}>
          <LightyRunIn
            from={isRtl(i18n.language) ? 'right' : 'left'}
            go={go}
            onStart={() => setRunning(true)}
            onDone={() => setArrived(true)}
            onFail={() => setArrived(true)}
            className="absolute inset-0"
          />
        </Suspense>
      )}
    </div>
  );
};

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
        <div className="absolute -top-40 start-[-14%] h-[32rem] w-[32rem] bg-[radial-gradient(closest-side,rgba(124,58,237,0.38),rgba(124,58,237,0.209)_55%,transparent)]" />
        <div className="absolute bottom-[-10rem] end-[-10%] h-[30rem] w-[30rem] bg-[radial-gradient(closest-side,rgba(219,39,119,0.26),rgba(219,39,119,0.143)_55%,transparent)]" />
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
            <LightyArrival />
          </motion.div>

          <div className="space-y-4">
            {cards.map(({ id, Icon }, i) => (
              <motion.article
                key={id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.45, delay: i * 0.08 }}
                className="rounded-3xl border border-white/10 bg-white/[0.08] p-6 sm:p-7"
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
