import { StrictMode } from 'react';
import { renderToString } from 'react-dom/server';
import i18n from './i18n';
import { Home } from './App';
import type { Lang } from './i18n/languages';
import type { FaqItem } from './components/Faq';

export { LANGS, DEFAULT_LANG } from './i18n/languages';

/**
 * LT-579: the home page as HTML, once per language. Built by
 * `vite build --ssr` into dist-ssr-home/ and called by
 * scripts/prerender-home.mjs, which writes it inside #root of each
 * language's page, so a reader that runs no script (most AI tools) gets the
 * page's words. main.tsx takes the drawn page over in the browser.
 */
export const render = async (lang: Lang): Promise<string> => {
  await i18n.changeLanguage(lang);
  return renderToString(
    <StrictMode>
      <Home />
    </StrictMode>
  );
};

/** LT-618: the home's questions in a language, as the page shows them, for its FAQPage data. */
export const faqOf = async (lang: Lang): Promise<{ q: string; a: string }[]> => {
  await i18n.changeLanguage(lang);
  return (i18n.t('faq.items', { returnObjects: true }) as FaqItem[]).map(({ q, a }) => ({ q, a }));
};
