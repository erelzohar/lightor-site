import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import i18n from '../src/i18n/index.ts';
import { LANGS } from '../src/i18n/languages.ts';
import { faqItems } from '../src/lib/faqItems.ts';
import { STORAGE_KEY, formatMoney, isCrawler, loadLocalPrices, priceWords, readLocalPrices } from '../src/lib/localPrices.ts';

/**
 * LT-695: a visitor whose country has prices of its own reads them, in every
 * language; everyone else reads the page exactly as it was before. The dollar
 * amounts here are a sample of the API's answer: the site's own code and
 * texts hold none.
 */

/** The home's answer about prices, word for word as it was before LT-695. */
const TODAY = {
  he: "אפשר להתחיל בחינם ולהישאר בחינם: התוכנית החינמית כוללת עד 15 תורים ו-15 פניות בחודש. כל חשבון חדש מקבל 60 יום של Lightor+ בלי כרטיס אשראי. אחר כך Lightor+ עולה ₪89 לחודש או ₪890 לשנה, ו-Lightor Pro עולה ₪119 לחודש או ₪1,190 לשנה.",
  en: "You can start free and stay free: the free plan includes up to 15 bookings and 15 inquiries a month. Every new account gets 60 days of Lightor+ with no credit card. After that, Lightor+ is ₪89 a month or ₪890 a year, and Lightor Pro is ₪119 a month or ₪1,190 a year.",
  ar: "يمكنك البدء مجانًا والبقاء مجانًا: تشمل الخطة المجانية حتى 15 حجزًا و15 استفسارًا في الشهر. يحصل كل حساب جديد على 60 يومًا من Lightor+ بدون بطاقة ائتمان. بعد ذلك يكلف Lightor+ مبلغ 89 ₪ في الشهر أو 890 ₪ في السنة، ويكلف Lightor Pro مبلغ 119 ₪ في الشهر أو 1,190 ₪ في السنة.",
  fr: "Vous pouvez commencer gratuitement et rester gratuit : le forfait gratuit comprend jusqu’à 15 rendez-vous et 15 demandes par mois. Chaque nouveau compte reçoit 60 jours de Lightor+ sans carte bancaire. Ensuite, Lightor+ coûte 89 ₪ par mois ou 890 ₪ par an, et Lightor Pro 119 ₪ par mois ou 1 190 ₪ par an.",
  es: "Puedes empezar gratis y seguir gratis: el plan gratuito incluye hasta 15 reservas y 15 consultas al mes. Cada cuenta nueva recibe 60 días de Lightor+ sin tarjeta de crédito. Después, Lightor+ cuesta 89 ₪ al mes o 890 ₪ al año, y Lightor Pro 119 ₪ al mes o 1.190 ₪ al año.",
};

/** The shekel words of each language, in the order the answer prints them. */
const SHEKELS = {
  he: ['₪89', '₪890', '₪119', '₪1,190'],
  en: ['₪89', '₪890', '₪119', '₪1,190'],
  ar: ['89 ₪', '890 ₪', '119 ₪', '1,190 ₪'],
  fr: ['89 ₪', '890 ₪', '119 ₪', '1 190 ₪'],
  es: ['89 ₪', '890 ₪', '119 ₪', '1.190 ₪'],
};
const DOLLARS = ['$29', '$290', '$49', '$490'];
const RTL = ['he', 'ar'];

const usd = (amount) => ({ amount, currency: 'USD' });
const US = {
  country: 'US',
  local: true,
  plans: { plus: { month: usd(2900), year: usd(29000) }, pro: { month: usd(4900), year: usd(49000) } },
  extraBooking: usd(17),
  extraBookingFloor: usd(300),
  included: 500,
  plusIncluded: 200,
};
const ISRAEL = { ...US, country: 'IL', local: false };
const NO_PLANS = { ...US, plans: null };

const answer = (data) => async () => ({ ok: true, json: async () => ({ success: true, data }) });
const memory = () => {
  const kept = new Map();
  return { getItem: (key) => kept.get(key) ?? null, setItem: (key, value) => void kept.set(key, value), kept };
};
/** The answer about prices on the page in `lang`, for a visitor with these prices (null: none of their own). */
const priceAnswer = async (lang, prices) => {
  await i18n.changeLanguage(lang);
  return faqItems(i18n.t, prices && priceWords(prices, lang))[1].a;
};

test('the answer is read as local prices only when the country has its own', () => {
  assert.deepEqual(readLocalPrices(US), { local: true, plans: US.plans, extraBooking: US.extraBooking, extraBookingFloor: US.extraBookingFloor });
  assert.equal(readLocalPrices(ISRAEL), null);
  assert.equal(readLocalPrices(NO_PLANS), null);
  assert.equal(readLocalPrices({ ...US, extraBooking: null }), null);
  assert.equal(readLocalPrices({ ...US, extraBooking: { amount: 17, currency: 'EUR' } }), null, 'two currencies in one answer');
  assert.equal(readLocalPrices({ ...US, plans: { ...US.plans, pro: { month: usd(4900) } } }), null);
  assert.equal(readLocalPrices({ ...US, extraBooking: { amount: '17', currency: 'USD' } }), null);
  for (const nothing of [null, undefined, '', 'US', 7, [], {}]) assert.equal(readLocalPrices(nothing), null);
});

test('dollars are written the American way in every language', () => {
  for (const lang of LANGS) {
    assert.equal(formatMoney(usd(2900), lang), '$29');
    assert.equal(formatMoney(usd(29000), lang), '$290');
    assert.equal(formatMoney(usd(4900), lang), '$49');
    assert.equal(formatMoney(usd(49000), lang), '$490');
    assert.equal(formatMoney(usd(17), lang), '$0.17');
    assert.equal(formatMoney(usd(119000), lang), '$1,190');
    assert.equal(formatMoney(usd(2950), lang), '$29.50');
    assert.equal(formatMoney(usd(0), lang), '$0');
  }
});

test('a price in a right-to-left sentence is isolated as left-to-right', () => {
  assert.equal(priceWords(readLocalPrices(US), 'en').extraBooking, '$0.17');
  assert.equal(priceWords(readLocalPrices(US), 'fr').plusMonth, '$29');
  assert.equal(priceWords(readLocalPrices(US), 'he').plusMonth, '\u2066$29\u2069');
  assert.equal(priceWords(readLocalPrices(US), 'ar').proYear, '\u2066$490\u2069');
});

test('a currency that cannot be written keeps the page in shekels', () => {
  const odd = { amount: 2900, currency: 'dollars' };
  assert.equal(priceWords({ local: true, plans: { plus: { month: odd, year: odd }, pro: { month: odd, year: odd } }, extraBooking: odd }, 'en'), null);
});

test('with no local prices every language prints its answer exactly as before', async () => {
  for (const lang of LANGS) {
    assert.equal(await priceAnswer(lang, null), TODAY[lang]);
    for (const { q, a } of faqItems(i18n.t)) assert.doesNotMatch(q + a, /\{\{|\}\}|\$/, `${lang}: ${q}`);
  }
});

test('a visitor from the United States reads dollars in all five languages', async () => {
  const prices = await loadLocalPrices({ fetch: answer(US), storage: memory() });
  for (const lang of LANGS) {
    const text = await priceAnswer(lang, prices);
    const expected = SHEKELS[lang].reduce(
      (words, shekels, at) => words.replace(shekels, RTL.includes(lang) ? `\u2066${DOLLARS[at]}\u2069` : DOLLARS[at]),
      TODAY[lang],
    );
    assert.equal(text, expected);
    for (const dollars of DOLLARS) assert.ok(text.includes(dollars), `${lang}: ${dollars}`);
    assert.doesNotMatch(text, /₪|US\$|\{\{|\.00|\u2014/, lang);
  }
  assert.equal(
    await priceAnswer('en', prices),
    'You can start free and stay free: the free plan includes up to 15 bookings and 15 inquiries a month. Every new account gets 60 days of Lightor+ with no credit card. After that, Lightor+ is $29 a month or $290 a year, and Lightor Pro is $49 a month or $490 a year.',
  );
});

test('the base prices, no plans, a failed, missing, broken or slow answer: the page is unchanged', async () => {
  const cases = {
    'local: false': answer(ISRAEL),
    'plans: null': answer(NO_PLANS),
    'the request fails': async () => {
      throw new TypeError('Failed to fetch');
    },
    'the endpoint is missing (404)': async () => ({ ok: false, json: async () => ({ success: false }) }),
    'the answer is not JSON': async () => ({
      ok: true,
      json: async () => {
        throw new SyntaxError('Unexpected token <');
      },
    }),
    'the answer is empty': async () => ({ ok: true, json: async () => null }),
    'the answer is slow': (_url, { signal }) => new Promise((_resolve, reject) => signal.addEventListener('abort', () => reject(new Error('aborted')))),
  };
  for (const [name, fetch] of Object.entries(cases)) {
    const prices = await loadLocalPrices({ fetch, storage: memory(), waitMs: 20 });
    assert.equal(prices, null, name);
    for (const lang of LANGS) assert.equal(await priceAnswer(lang, prices), TODAY[lang], `${name}, ${lang}`);
  }
});

test('one request a visit: the answer is kept for the session', async () => {
  for (const [data, expected] of [
    [US, readLocalPrices(US)],
    [ISRAEL, null],
  ]) {
    const storage = memory();
    let requests = 0;
    const fetch = async (url) => {
      requests += 1;
      assert.match(url, /\/api\/paddle\/prices$/);
      return answer(data)();
    };
    assert.deepEqual(await loadLocalPrices({ fetch, storage }), expected);
    assert.deepEqual(await loadLocalPrices({ fetch, storage }), expected);
    assert.equal(requests, 1);
    assert.ok(storage.kept.has(STORAGE_KEY));
  }
  // A failure is kept too, and a browser that keeps nothing still gets its answer.
  const storage = memory();
  let failures = 0;
  const failing = async () => {
    failures += 1;
    throw new TypeError('Failed to fetch');
  };
  await loadLocalPrices({ fetch: failing, storage });
  await loadLocalPrices({ fetch: failing, storage });
  assert.equal(failures, 1);
  assert.deepEqual(await loadLocalPrices({ fetch: answer(US) }), readLocalPrices(US));
  const blocked = { getItem: () => { throw new Error('blocked'); }, setItem: () => { throw new Error('blocked'); } };
  assert.deepEqual(await loadLocalPrices({ fetch: answer(US), storage: blocked }), readLocalPrices(US));
});

test('a crawler is told apart from a visitor', () => {
  assert.ok(isCrawler('Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)'));
  assert.ok(isCrawler('Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko; compatible; bingbot/2.0) Chrome/116.0 Safari/537.36'));
  assert.ok(!isCrawler('Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1'));
  assert.ok(!isCrawler('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36'));
});

/* ---------- public/pricing.html: the same swap, in the page's own script ---------- */

const PRICING = readFileSync('public/pricing.html', 'utf8');
/** What the page's script swaps for what, in the page's English and (isolated) in its Hebrew. */
const PRICING_US = { '₪0': '$0', '₪89': '$29', '₪890': '$290', '₪119': '$49', '₪1,190': '$490', '₪0.35': '$0.17', '₪10': '$3' };
const SHEKEL_PRICE = /₪[\d,.]*\d/g;

/** The page's two sections (Hebrew, then English) as the text a browser would hold. */
const pricingSections = () =>
  [...PRICING.matchAll(/<section[^>]*\blang="(\w+)"[^>]*>([\s\S]*?)<\/section>/g)].map(([, lang, html]) => ({
    lang,
    texts: html.split(/<[^>]+>/).filter(Boolean).map((nodeValue) => ({ nodeValue })),
  }));
const textOf = (section) => section.texts.map(({ nodeValue }) => nodeValue).join('');

/** Runs the page's script over its text, with a stand-in browser. */
const openPricing = async ({ fetch, storage = memory(), userAgent = 'Mozilla/5.0 Chrome/142.0.0.0 Safari/537.36' }) => {
  const sections = pricingSections();
  const script = PRICING.match(/<script>\n([\s\S]*?)<\/script>\n<\/body>/)[1];
  let requests = 0;
  const window = {
    fetch: (url, init) => {
      requests += 1;
      assert.equal(url, 'https://api.lightor.app/api/paddle/prices');
      return fetch(url, init);
    },
    Intl,
    AbortController,
    sessionStorage: storage,
    navigator: { userAgent },
    location: { hostname: 'lightor.app' },
    document: {
      querySelectorAll: (selector) => (assert.equal(selector, 'section[lang]'), sections),
      createTreeWalker: (section, what) => {
        assert.equal(what, 4);
        let at = 0;
        return { nextNode: () => section.texts[at++] ?? null };
      },
    },
    setTimeout,
    clearTimeout,
    isFinite,
    JSON,
    Math,
  };
  window.window = window;
  vm.runInNewContext(script, window);
  await new Promise((resolve) => setTimeout(resolve, 30));
  return { sections, storage, requests: () => requests };
};

const assertPricingInDollars = ({ sections }) => {
  const [hebrew, english] = pricingSections();
  const swap = (text, isolate) => text.replace(SHEKEL_PRICE, (shekels) => (PRICING_US[shekels] ? (isolate ? `\u2066${PRICING_US[shekels]}\u2069` : PRICING_US[shekels]) : shekels));
  assert.equal(textOf(sections[0]), swap(textOf(hebrew), true));
  assert.equal(textOf(sections[1]), swap(textOf(english), false));
  for (const section of sections) {
    // No shekel amount is left: the smallest extras charge (₪10) comes in the answer too.
    assert.equal(textOf(section).match(SHEKEL_PRICE), null);
    assert.deepEqual(textOf(section).match(/\$[\d,.]*\d/g), ['$0', '$29', '$290', '$49', '$490', '$0.17', '$29', '$290', '$49', '$490', '$0.17', '$3']);
  }
};
const assertPricingUnchanged = ({ sections }, name) => {
  assert.deepEqual(sections.map(textOf), pricingSections().map(textOf), name);
};

test('pricing.html: the page itself holds shekels only, and its script knows every plan price it prints', () => {
  const [hebrew, english] = pricingSections();
  assert.equal(hebrew.lang, 'he');
  assert.equal(english.lang, 'en');
  for (const section of [hebrew, english]) {
    assert.deepEqual(textOf(section).match(SHEKEL_PRICE), ['₪0', '₪89', '₪890', '₪119', '₪1,190', '₪0.35', '₪89', '₪890', '₪119', '₪1,190', '₪0.35', '₪10']);
    for (const text of section.texts) assert.doesNotMatch(text.nodeValue, /₪$/, 'a price cut in two by a tag would not be swapped');
  }
  assert.ok(PRICING.includes(`'${STORAGE_KEY}'`), 'the page and the home keep the answer under one name');
  assert.doesNotMatch(PRICING, /\$\d/);
});

test('pricing.html: a visitor from the United States reads dollars in every plan price', async () => {
  const page = await openPricing({ fetch: answer(US) });
  assertPricingInDollars(page);
  assert.equal(page.requests(), 1);
  // The next page of the visit, this one or the home, does not ask again.
  const mustNotAsk = async () => {
    throw new Error('must not ask');
  };
  const again = await openPricing({ fetch: mustNotAsk, storage: page.storage });
  assertPricingInDollars(again);
  assert.equal(again.requests(), 0);
  assert.deepEqual(await loadLocalPrices({ fetch: mustNotAsk, storage: page.storage }), readLocalPrices(US));
});

test('pricing.html: with any other answer the page is unchanged', async () => {
  const cases = {
    'local: false': answer(ISRAEL),
    'plans: null': answer(NO_PLANS),
    'the request fails': async () => {
      throw new TypeError('Failed to fetch');
    },
    'the endpoint is missing (404)': async () => ({ ok: false, json: async () => ({ success: false }) }),
  };
  for (const [name, fetch] of Object.entries(cases)) {
    const page = await openPricing({ fetch });
    assertPricingUnchanged(page, name);
    assert.equal(page.requests(), 1, name);
    assert.equal(page.storage.kept.get(STORAGE_KEY), '{"local":false}', name);
  }
  const crawler = await openPricing({ fetch: answer(US), userAgent: 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)' });
  assertPricingUnchanged(crawler, 'a crawler');
  assert.equal(crawler.requests(), 0);
});

test('pricing.html: an answer the home kept is used without asking', async () => {
  const storage = memory();
  await loadLocalPrices({ fetch: answer(US), storage });
  const page = await openPricing({
    fetch: async () => {
      throw new Error('must not ask');
    },
    storage,
  });
  assertPricingInDollars(page);
  assert.equal(page.requests(), 0);
});
