import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';

interface Step {
  title: string;
  text: string;
}

/** LT-260: three steps, from describing the business to the first booking or inquiry. */
const HowItWorks = () => {
  const { t } = useTranslation();
  const steps = t('how.steps', { returnObjects: true }) as Step[];

  return (
    <section id="how" className="bg-white py-20 sm:py-28 dark:bg-black" aria-labelledby="how-title">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-3xl text-center"
        >
          <p className="text-sm font-bold tracking-wide text-violet-600 dark:text-violet-400">{t('how.eyebrow')}</p>
          <h2 id="how-title" className="text-balance mt-3 text-3xl font-bold tracking-tight text-gray-950 sm:text-4xl dark:text-white">
            {t('how.title')}
          </h2>
          <p className="mt-3 text-lg text-gray-600 dark:text-gray-400">{t('how.subtitle')}</p>
        </motion.div>

        <ol className="relative mt-14 grid gap-10 md:grid-cols-3 md:gap-8">
          <div aria-hidden="true" className="absolute inset-x-[16%] top-8 hidden h-px bg-gradient-to-r from-violet-200 via-pink-200 to-violet-200 md:block dark:from-violet-900 dark:via-pink-900 dark:to-violet-900" />
          {steps.map((step, i) => (
            <motion.li
              key={step.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.45, delay: i * 0.1 }}
              className="relative text-center"
            >
              <span className="relative mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-violet-600 to-pink-600 text-2xl font-bold text-white shadow-lg shadow-violet-600/25">
                {i + 1}
              </span>
              <h3 className="mt-5 text-xl font-bold text-gray-950 dark:text-white">{step.title}</h3>
              <p className="mx-auto mt-2 max-w-xs text-gray-600 dark:text-gray-400">{step.text}</p>
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  );
};

export default HowItWorks;
