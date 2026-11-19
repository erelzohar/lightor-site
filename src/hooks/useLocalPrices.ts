import { useEffect, useState } from 'react';
import { isCrawler, loadLocalPrices, type LocalPrices } from '../lib/localPrices';

/** One question a page, whoever asks. */
let asked: Promise<LocalPrices | null> | undefined;

const ask = (): Promise<LocalPrices | null> => {
  if (isCrawler(navigator.userAgent)) return Promise.resolve(null);
  let storage: Storage | undefined;
  try {
    storage = window.sessionStorage;
  } catch {
    /* blocked: ask without keeping the answer */
  }
  return loadLocalPrices({ fetch: (url, init) => fetch(url, init), storage });
};

/**
 * LT-695: the visitor's country's own plan prices, or null: while the page is
 * drawn (on the server and at first in the browser), and for good wherever
 * the shekel prices apply or the API did not answer. Null means "print what
 * the page says".
 */
export const useLocalPrices = (): LocalPrices | null => {
  const [prices, setPrices] = useState<LocalPrices | null>(null);

  useEffect(() => {
    let live = true;
    asked ??= ask();
    void asked.then((found) => {
      if (live && found) setPrices(found);
    });
    return () => {
      live = false;
    };
  }, []);

  return prices;
};
