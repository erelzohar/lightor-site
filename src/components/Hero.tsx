import { lazy, Suspense, useEffect, useState, type ComponentProps, type ComponentType } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, CheckCircle2, Sparkles } from 'lucide-react';

const REGISTER_URL = 'https://register.lightor.app';
const SITES_URL = 'https://lightor.app/sites';

// three.js and the model load in their own chunk, after the page is up.
// A chunk that fails to load — a tab opened before a deploy asks for a hash
// the server no longer has, or a flaky phone connection — draws nothing, and
// the still Lighty stays: there is no error boundary on this page, so a
// rejected import used to blank all of it (LT-315).
type Lighty3DProps = ComponentProps<typeof import('./Lighty3D').default>;
const NoLighty3D = () => null;
const Lighty3D = lazy<ComponentType<Lighty3DProps>>(() =>
  import('./Lighty3D').catch(() => ({ default: NoLighty3D }))
);

/**
 * LT-260: the still waves until the live Lighty is ready — or for good with
 * reduced motion or a data-saving connection (the model is 1.8 MB).
 */
const useLiveLighty = (): boolean => {
  const [mount, setMount] = useState(false);
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if ((navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData) return;
    const idle = window.requestIdleCallback ?? ((cb: () => void) => window.setTimeout(cb, 400));
    const id = idle(() => setMount(true));
    return () => (window.cancelIdleCallback ?? window.clearTimeout)(id);
  }, []);
  return mount;
};

const Hero = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'he';
  const Arrow = isRTL ? ArrowLeft : ArrowRight;
  const mount3d = useLiveLighty();
  const [live, setLive] = useState(false);

  return (
    <section id="home" className="relative overflow-hidden pt-28 pb-16 sm:pt-32 lg:pt-36 lg:pb-24" aria-labelledby="hero-title">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute -top-48 start-1/3 h-[34rem] w-[34rem] rounded-full bg-violet-400/25 blur-3xl dark:bg-violet-700/25" />
        <div className="absolute top-24 -end-40 h-[30rem] w-[30rem] rounded-full bg-pink-300/25 blur-3xl dark:bg-pink-700/20" />
      </div>

      <div className="relative mx-auto grid max-w-7xl items-center gap-6 px-4 sm:px-6 lg:grid-cols-[1.15fr_0.85fr] lg:gap-10 lg:px-8">
        <div className="order-2 text-center lg:order-1 lg:text-start">
          <motion.a
            href="#lighty"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-2 rounded-full border border-violet-200 bg-white/70 px-4 py-1.5 text-sm font-semibold text-violet-700 backdrop-blur hover:bg-white dark:border-violet-800 dark:bg-white/5 dark:text-violet-300"
          >
            <Sparkles className="h-4 w-4" aria-hidden="true" />
            {t('hero.badge')}
          </motion.a>

          <motion.h1
            id="hero-title"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.05 }}
            className="mt-6 text-balance text-4xl font-bold leading-[1.1] tracking-tight text-gray-950 sm:text-5xl lg:text-6xl dark:text-white"
          >
            {t('hero.title')}{' '}
            <span className="inline-block whitespace-nowrap bg-gradient-to-r from-violet-600 to-pink-600 bg-clip-text text-transparent">
              {t('hero.titleHighlight')}
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mx-auto mt-5 max-w-2xl text-lg text-gray-600 sm:text-xl lg:mx-0 dark:text-gray-300"
          >
            {t('hero.subtitle')}
          </motion.p>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="mx-auto mt-3 max-w-2xl text-base font-semibold text-gray-800 lg:mx-0 dark:text-gray-200"
          >
            {t('hero.audience')}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center lg:justify-start"
          >
            <a
              href={REGISTER_URL}
              className="group inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-violet-600 to-pink-600 px-8 py-4 text-lg font-semibold text-white shadow-lg shadow-violet-600/25 transition hover:shadow-xl hover:shadow-violet-600/30 sm:w-auto"
            >
              {t('hero.cta')}
              <Arrow className="h-5 w-5 transition-transform group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5" aria-hidden="true" />
            </a>
            <a
              href={SITES_URL}
              className="inline-flex w-full items-center justify-center rounded-full border border-gray-300 bg-white/70 px-7 py-4 text-lg font-semibold text-gray-800 transition hover:border-gray-400 hover:bg-white sm:w-auto dark:border-gray-700 dark:bg-white/5 dark:text-gray-100 dark:hover:bg-white/10"
            >
              {t('hero.secondary')}
            </a>
          </motion.div>

          <ul className="mt-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-sm text-gray-600 lg:justify-start dark:text-gray-400">
            {(['card', 'plus', 'languages'] as const).map((k) => (
              <li key={k} className="inline-flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-violet-600 dark:text-violet-400" aria-hidden="true" />
                {t(`hero.trust.${k}`)}
              </li>
            ))}
          </ul>
        </div>

        <div className="relative order-1 mx-auto h-[230px] w-[230px] sm:h-[320px] sm:w-[320px] lg:order-2 lg:h-[520px] lg:w-[520px]">
          <div aria-hidden="true" className="absolute inset-[12%] rounded-full bg-gradient-to-br from-violet-300/50 to-pink-300/40 blur-2xl dark:from-violet-600/40 dark:to-pink-600/30" />
          <img
            src="/lighty-wave.webp"
            alt={t('hero.lightyAlt')}
            width={900}
            height={900}
            className={`absolute inset-0 h-full w-full object-contain transition-opacity duration-500 ${live ? 'opacity-0' : 'opacity-100'}`}
          />
          {mount3d && (
            <Suspense fallback={null}>
              <Lighty3D
                onReady={() => setLive(true)}
                className={`absolute inset-0 transition-opacity duration-500 ${live ? 'opacity-100' : 'opacity-0'}`}
              />
            </Suspense>
          )}
        </div>
      </div>
    </section>
  );
};

export default Hero;
