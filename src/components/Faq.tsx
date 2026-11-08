import { useTranslation } from 'react-i18next';
import { ChevronDown } from 'lucide-react';

/** LT-618: where an answer can point. Public pages and store listings, nothing secret. */
export const FAQ_LINKS = {
  pricing: '/pricing.html',
  play: 'https://play.google.com/store/apps/details?id=app.lightor.dashboard',
  appStore: 'https://apps.apple.com/app/lightor/id6819305092',
  mail: 'mailto:support@lightor.app',
} as const;

export type FaqLink = keyof typeof FAQ_LINKS;

export interface FaqItem {
  q: string;
  a: string;
  links?: FaqLink[];
}

/**
 * LT-618: the questions people ask about Lightor, each answered in its first
 * sentence, so a reader (or an answer engine) that takes one paragraph gets the
 * whole answer. Every fact is from blog/FACTS.md. The answers are in the page's
 * HTML even while closed (<details>), and scripts/prerender-home.mjs writes the
 * same words as FAQPage data.
 */
const Faq = () => {
  const { t } = useTranslation();
  const items = t('faq.items', { returnObjects: true }) as FaqItem[];

  return (
    <section id="faq" className="bg-gray-50 py-20 sm:py-28 dark:bg-gray-950" aria-labelledby="faq-title">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <p className="text-sm font-bold tracking-wide text-violet-600 dark:text-violet-400">{t('faq.eyebrow')}</p>
          <h2 id="faq-title" className="text-balance mt-3 text-3xl font-bold tracking-tight text-gray-950 sm:text-4xl dark:text-white">
            {t('faq.title')}
          </h2>
          <p className="mt-3 text-lg text-gray-600 dark:text-gray-400">{t('faq.subtitle')}</p>
        </div>

        <div className="mt-12 space-y-3">
          {items.map((item) => (
            <details
              key={item.q}
              className="group rounded-2xl border border-gray-200 bg-white transition-colors open:border-violet-200 dark:border-gray-800 dark:bg-gray-900 dark:open:border-violet-900"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 rounded-2xl px-5 py-4 text-start focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600 [&::-webkit-details-marker]:hidden">
                <h3 className="text-lg font-semibold text-gray-950 dark:text-white">{item.q}</h3>
                <ChevronDown aria-hidden="true" className="h-5 w-5 shrink-0 text-violet-600 transition-transform duration-200 group-open:rotate-180 dark:text-violet-400" />
              </summary>
              <div className="px-5 pb-5 text-gray-700 dark:text-gray-300">
                <p className="leading-relaxed">{item.a}</p>
                {item.links?.length ? (
                  <p className="mt-3 flex flex-wrap gap-x-5 gap-y-2">
                    {item.links.map((key) => (
                      <a
                        key={key}
                        href={FAQ_LINKS[key]}
                        className="font-semibold text-violet-700 underline-offset-4 hover:underline dark:text-violet-300"
                        {...(key === 'play' || key === 'appStore' ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                      >
                        {t(`faq.links.${key}`)}
                      </a>
                    ))}
                  </p>
                ) : null}
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Faq;
