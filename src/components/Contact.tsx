import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { ArrowRight, Check } from 'lucide-react';

const REGISTER_URL = 'https://register.lightor.app';
const DASHBOARD_URL = 'https://dashboard.lightor.app';

/**
 * The closing call to action.
 *
 * This replaced the agency site's contact form, which posted straight to the
 * Meta Graph API from the browser using a WhatsApp token read from
 * `import.meta.env`. Anything in a Vite client bundle is public, so that token
 * shipped to every visitor; it is gone along with the reCAPTCHA widget that
 * guarded it. Lightor has nothing to collect here anyway — signing up happens
 * in the register app, so this section only has to point at it.
 */
const Contact = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'he';

  const points = [
    t('services.site.features.aiBuilder'),
    t('services.booking.features.realTimeSlots'),
    t('services.reminders.features.confirmation'),
  ];

  return (
    <section
      id="contact"
      dir={isRTL ? 'rtl' : 'ltr'}
      className="relative py-24 px-4 overflow-hidden bg-white dark:bg-primary"
      aria-labelledby="contact-heading"
    >
      {/* Ambient wash — paint only, never interactive. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-70"
        style={{
          background:
            'radial-gradient(40rem 40rem at 15% 10%, rgba(139,92,246,0.16), transparent 70%),' +
            'radial-gradient(40rem 40rem at 85% 90%, rgba(56,189,248,0.14), transparent 70%)',
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="relative max-w-3xl mx-auto text-center"
      >
        <h2
          id="contact-heading"
          className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 dark:text-white tracking-tight"
        >
          {t('contact.title')}
        </h2>

        <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
          {t('contact.subtitle')}
        </p>

        <ul className="mt-8 flex flex-wrap justify-center gap-x-6 gap-y-3">
          {points.map((point) => (
            <li
              key={point}
              className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300"
            >
              <Check className="w-4 h-4 text-violet-500 shrink-0" aria-hidden="true" />
              {point}
            </li>
          ))}
        </ul>

        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <motion.a
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            href={REGISTER_URL}
            className="group inline-flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-4 rounded-full bg-gradient-to-r from-violet-600 to-purple-600 text-white font-medium shadow-lg shadow-violet-500/20"
          >
            {t('contact.cta')}
            <ArrowRight
              className={`w-5 h-5 transition-transform group-hover:translate-x-1 ${isRTL ? 'rotate-180 group-hover:-translate-x-1' : ''}`}
              aria-hidden="true"
            />
          </motion.a>

          <a
            href={DASHBOARD_URL}
            className="inline-flex items-center justify-center w-full sm:w-auto px-8 py-4 rounded-full border border-gray-300 dark:border-white/20 text-gray-800 dark:text-white font-medium hover:bg-gray-50 dark:hover:bg-white/10 transition-colors"
          >
            {t('contact.signIn')}
          </a>
        </div>

        <p className="mt-6 text-xs text-gray-500 dark:text-gray-400">
          {t('contact.note')}
        </p>
      </motion.div>
    </section>
  );
};

export default Contact;
