import type { TFunction } from 'i18next';
import type { FaqItem } from '../components/Faq';
import type { PriceWords } from './localPrices';

/**
 * The home's questions as the page prints them. LT-695: the plan prices in an
 * answer are the language's own shekel words (`faq.prices`), unless the
 * visitor's country has prices of its own (`local`). Everything that reads
 * the questions goes through here: the page, and its FAQPage data
 * (entry-server.tsx), which is always in shekels.
 */
export const faqItems = (t: TFunction, local?: PriceWords | null): FaqItem[] => {
  const prices = local ?? (t('faq.prices', { returnObjects: true }) as PriceWords);
  return t('faq.items', { returnObjects: true, ...prices }) as FaqItem[];
};
