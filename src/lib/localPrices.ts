import { isRtl } from '../i18n/languages';

/**
 * LT-695: the plan prices of the visitor's own country. The pages are written
 * in shekels, and that is what is drawn first and what a crawler reads. The
 * API (GET /api/paddle/prices) says whether the country the request came from
 * has prices of its own; only then are the shekel prices swapped, with the
 * amounts the API sent. No amount of any other currency is written in this
 * repo. public/pricing.html does the same in its own small script and shares
 * the kept answer (STORAGE_KEY).
 */
export interface Money {
  /** Minor units: cents, agorot. */
  amount: number;
  currency: string;
}

export interface LocalPrices {
  local: true;
  plans: { plus: { month: Money; year: Money }; pro: { month: Money; year: Money } };
  extraBooking: Money;
}

/** The prices a page prints, as words ready for its text. */
export type PriceWords = Record<'plusMonth' | 'plusYear' | 'proMonth' | 'proYear' | 'extraBooking', string>;

export const STORAGE_KEY = 'lightor:local-prices';
/** A slower answer than this is no answer: the page stays as it was drawn. */
const WAIT_MS = 4000;
const API_URL = import.meta.env?.DEV ? 'http://localhost:3000' : 'https://api.lightor.app';
export const PRICES_URL = `${API_URL}/api/paddle/prices`;

const isMoney = (value: unknown): value is Money => {
  const money = value as Money | null;
  return !!money && typeof money === 'object' && Number.isFinite(money.amount) && money.amount >= 0 && /^[A-Z]{3}$/.test(String(money.currency));
};

/**
 * The API's `data` (or the answer kept for the session) as local prices, or
 * null when the page keeps its shekels: the base prices (`local: false`), no
 * plans (the billing provider did not answer), anything missing or two
 * currencies in one answer.
 */
export const readLocalPrices = (data: unknown): LocalPrices | null => {
  const found = data as Partial<LocalPrices> | null;
  if (!found || typeof found !== 'object' || found.local !== true) return null;
  const { plans, extraBooking } = found;
  const all = [plans?.plus?.month, plans?.plus?.year, plans?.pro?.month, plans?.pro?.year, extraBooking];
  if (!all.every(isMoney)) return null;
  if (all.some((money) => money.currency !== extraBooking!.currency)) return null;
  return { local: true, plans: plans!, extraBooking: extraBooking! };
};

/**
 * An amount as a price: the currency's short sign (never "US$"), no ".00" on
 * a whole amount. Dollars are always written the American way, sign first;
 * any other currency the way the page's language writes it.
 */
export const formatMoney = ({ amount, currency }: Money, lang: string): string => {
  const digits = new Intl.NumberFormat('en', { style: 'currency', currency }).resolvedOptions().maximumFractionDigits ?? 2;
  const value = amount / 10 ** digits;
  return new Intl.NumberFormat(currency === 'USD' ? 'en-US' : lang, {
    style: 'currency',
    currency,
    currencyDisplay: 'narrowSymbol',
    minimumFractionDigits: Number.isInteger(value) ? 0 : digits,
    maximumFractionDigits: digits,
  }).format(value);
};

/**
 * The local prices as words for a page in `lang`, or null when one cannot be
 * written (a currency this browser does not know): the page keeps its shekels.
 * In Hebrew and Arabic each price is isolated as left-to-right text, so the
 * sign stays before the number inside a right-to-left sentence.
 */
export const priceWords = (prices: LocalPrices, lang: string): PriceWords | null => {
  const word = (money: Money) => (isRtl(lang) ? `\u2066${formatMoney(money, lang)}\u2069` : formatMoney(money, lang));
  try {
    return {
      plusMonth: word(prices.plans.plus.month),
      plusYear: word(prices.plans.plus.year),
      proMonth: word(prices.plans.pro.month),
      proYear: word(prices.plans.pro.year),
      extraBooking: word(prices.extraBooking),
    };
  } catch {
    return null;
  }
};

/** A crawler that runs scripts reads the page as it was drawn, in shekels, like the page's own FAQ data. */
export const isCrawler = (userAgent: string): boolean => /bot|crawl|spider/i.test(userAgent);

export interface PriceSource {
  fetch: (url: string, init: { signal: AbortSignal }) => Promise<{ ok: boolean; json: () => Promise<unknown> }>;
  /** sessionStorage, or nothing where the browser keeps none. */
  storage?: Pick<Storage, 'getItem' | 'setItem'>;
  url?: string;
  waitMs?: number;
}

/**
 * The visitor's local prices, asked of the API once a visit: the answer, "no
 * local prices" included, is kept for the session, so the next page does not
 * ask again. A failed, missing or slow answer is null and never throws.
 */
export const loadLocalPrices = async ({ fetch, storage, url = PRICES_URL, waitMs = WAIT_MS }: PriceSource): Promise<LocalPrices | null> => {
  try {
    const kept = storage?.getItem(STORAGE_KEY);
    if (kept) return readLocalPrices(JSON.parse(kept));
  } catch {
    /* an unreadable note: ask again */
  }
  let found: LocalPrices | null = null;
  const abort = new AbortController();
  const timer = setTimeout(() => abort.abort(), waitMs);
  try {
    const response = await fetch(url, { signal: abort.signal });
    if (response.ok) found = readLocalPrices(((await response.json()) as { data?: unknown } | null)?.data);
  } catch {
    /* no answer: the page stays in shekels */
  } finally {
    clearTimeout(timer);
  }
  try {
    storage?.setItem(STORAGE_KEY, JSON.stringify(found ?? { local: false }));
  } catch {
    /* nowhere to keep it */
  }
  return found;
};
