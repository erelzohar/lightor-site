import { useTranslation } from 'react-i18next';
import { isRtl } from '../i18n/languages';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight } from 'lucide-react';

const REGISTER_URL = 'https://register.lightor.app';
const DASHBOARD_URL = 'https://dashboard.lightor.app';

/** LT-260: the closing call to action, with Lighty cheering. */
const Contact = () => {
  const { t, i18n } = useTranslation();
  const Arrow = isRtl(i18n.language) ? ArrowLeft : ArrowRight;

  return (
    <section id="start" className="bg-white px-4 py-16 sm:px-6 sm:py-24 lg:px-8 dark:bg-black" aria-labelledby="start-title">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.5 }}
        className="relative mx-auto grid max-w-6xl items-center gap-6 overflow-hidden rounded-[2rem] bg-gradient-to-br from-violet-600 via-purple-600 to-pink-600 px-6 py-12 text-white sm:px-12 md:grid-cols-[1fr_auto]"
      >
        <div className="text-center md:text-start">
          <h2 id="start-title" className="text-balance text-3xl font-bold tracking-tight sm:text-5xl">{t('contact.title')}</h2>
          <p className="mt-4 text-lg text-white/90 sm:text-xl">{t('contact.subtitle')}</p>
          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row md:justify-start">
            <a
              href={REGISTER_URL}
              className="group inline-flex w-full items-center justify-center gap-2 rounded-full bg-white px-8 py-4 text-lg font-bold text-violet-700 shadow-lg transition hover:bg-violet-50 sm:w-auto"
            >
              {t('contact.cta')}
              <Arrow className="h-5 w-5" aria-hidden="true" />
            </a>
            <a
              href={DASHBOARD_URL}
              className="inline-flex w-full items-center justify-center rounded-full border border-white/50 px-7 py-4 text-lg font-semibold text-white transition hover:bg-white/10 sm:w-auto"
            >
              {t('contact.signIn')}
            </a>
          </div>
          <p className="mt-6 text-sm text-white/85">{t('contact.note')}</p>
        </div>
        <img
          src="/lighty-cheer.webp"
          alt={t('contact.imageAlt')}
          width={800}
          height={800}
          loading="lazy"
          className="mx-auto w-48 drop-shadow-[0_18px_30px_rgba(40,0,80,0.35)] sm:w-64 md:w-72"
        />
      </motion.div>
    </section>
  );
};

export default Contact;
