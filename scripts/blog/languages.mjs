/**
 * LT-715: the blog's languages. Hebrew is the blog as it has always been
 * (blog/posts, /blog/); English and Arabic each have their own folder of
 * posts and their own address under the language's folder, as the home page
 * does (LT-349):
 *
 *   he  blog/posts/*.md     https://lightor.app/blog/<slug>/
 *   en  blog/en/posts/*.md  https://lightor.app/en/blog/<slug>/
 *   ar  blog/ar/posts/*.md  https://lightor.app/ar/blog/<slug>/
 *
 * Posts are written in their language, never translated, so no post has a
 * twin in another language: only the three blog index pages name each other
 * with hreflang. The photos stay in one folder (blog/images), so a file name
 * is unique across the languages.
 *
 * Everything a page's <head> says in words lives here; the words on the page
 * itself are the site's React code (src/blog/words.ts). vite.config.ts reads
 * the same folders to decide which languages' navbars link their blog.
 *
 * Plain "-" only, never an em-dash, in anything a reader sees (LT-350).
 */
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

export const ORIGIN = 'https://lightor.app';
const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');

/** A language's navbar links its blog once it has this many published posts (vite.config.ts). */
export const BLOG_MIN_POSTS = 3;

const lang = (code, fields) => ({
  code,
  /** The posts' folder, from the repository's root. */
  postsRel: code === 'he' ? 'blog/posts' : `blog/${code}/posts`,
  /** The blog's address on lightor.app; a post is `${base}<slug>/`. */
  base: code === 'he' ? '/blog/' : `/${code}/blog/`,
  /** The language's home page, the breadcrumbs' first step. */
  home: code === 'he' ? '/' : `/${code}/`,
  // LT-710: the wizard opens in the page's language.
  registerUrl: `https://register.lightor.app/?lang=${code}`,
  ...fields,
});

export const BLOG_LANGS = [
  lang('he', {
    dir: 'rtl',
    inLanguage: 'he',
    ogLocale: 'he_IL',
    dateLocale: 'he-IL',
    // LT-619: the post's last section, word for word.
    faqTitle: 'שאלות נפוצות',
    // Hebrew is compact: 800 words read like 1,100 in English.
    words: [800, 1600],
    titleSuffix: ' | לייטור',
    blogName: 'הבלוג של לייטור',
    crumbHome: 'לייטור',
    crumbBlog: 'בלוג',
    indexTitle: 'הבלוג של לייטור - מדריכים לבניית אתר, תורים ולידים',
    indexDescription:
      'מדריכים קצרים ומעשיים לבעלי עסקים קטנים: איך בונים אתר, מקבלים תורים ולידים אונליין, שולחים תזכורות ללקוחות ומופיעים בגוגל.',
    imageAlt: 'Lighty, הדמות של לייטור, ליד הכותרת: האתר שלך, תוך 60 שניות',
    ctaText: 'רוצים לראות איך זה נראה אצלכם? Lighty בונה לכם אתר בכמה דקות, בחינם.',
    ctaButton: 'לבניית האתר שלי - בחינם',
  }),
  lang('en', {
    dir: 'ltr',
    inLanguage: 'en',
    ogLocale: 'en_US',
    // Written for small businesses in the United States.
    dateLocale: 'en-US',
    faqTitle: 'Frequently asked questions',
    // English takes more words than Hebrew to say the same.
    words: [1000, 1800],
    titleSuffix: ' | Lightor',
    blogName: 'The Lightor blog',
    crumbHome: 'Lightor',
    crumbBlog: 'Blog',
    indexTitle: 'The Lightor blog - websites, booking and reminders for small business',
    indexDescription:
      'Short, practical guides for small business owners: building a website, taking bookings and inquiries online, sending reminders and getting found on Google.',
    imageAlt: 'Lighty, the Lightor character, next to the headline: your website, in 60 seconds',
    ctaText: 'Want to see how it would look for your business? Lighty builds you a website in minutes, free.',
    ctaButton: 'Build my site - free',
  }),
  lang('ar', {
    dir: 'rtl',
    inLanguage: 'ar',
    // Written for businesses in Israel.
    ogLocale: 'ar_IL',
    // Western digits, as the dashboard writes Arabic dates (lightor-dashboard businessFormats.ts).
    dateLocale: 'ar-u-nu-latn',
    faqTitle: 'الأسئلة الشائعة',
    words: [800, 1600],
    titleSuffix: ' | لايتور',
    blogName: 'مدونة لايتور',
    crumbHome: 'لايتور',
    crumbBlog: 'المدونة',
    indexTitle: 'مدونة لايتور - مواقع وحجز مواعيد واستفسارات للأعمال الصغيرة',
    indexDescription:
      'أدلة قصيرة وعملية لأصحاب الأعمال الصغيرة: كيف تبنون موقعًا، وتستقبلون الحجوزات والاستفسارات عبر الإنترنت، وتظهرون في جوجل.',
    imageAlt: 'Lighty، شخصية لايتور، بجانب العنوان: موقعك خلال 60 ثانية',
    ctaText: 'هل تريدون أن تروا كيف سيبدو موقعكم؟ Lighty يبني لكم موقعًا خلال دقائق، مجانًا.',
    ctaButton: 'ابنوا موقعكم مجانًا',
  }),
];

export const BLOG_LANG = Object.fromEntries(BLOG_LANGS.map((L) => [L.code, L]));

/** The posts' folder on disk. */
export const postsDir = (root, L) => join(root, ...L.postsRel.split('/'));

/**
 * The languages whose blog the site's navbar and footer link (vite.config.ts):
 * those with at least BLOG_MIN_POSTS posts that are not `draft: true`. The
 * build's own gate (build.mjs) still decides whether a post can go out.
 */
export const linkedBlogLanguages = () =>
  BLOG_LANGS.filter((L) => {
    const dir = postsDir(ROOT, L);
    if (!existsSync(dir)) return false;
    const published = readdirSync(dir).filter((name) => {
      if (!name.endsWith('.md')) return false;
      const front = readFileSync(join(dir, name), 'utf8').match(/^---\r?\n([\s\S]*?)\r?\n---/)?.[1] ?? '';
      return !/^draft:\s*true\s*$/m.test(front);
    });
    return published.length >= BLOG_MIN_POSTS;
  }).map((L) => L.code);

const formatters = new Map();
/** A YYYY-MM-DD date written out in the language ("24 בנובמבר 2026", "November 24, 2026"). */
export const dateIn = (iso, L) => {
  if (!formatters.has(L.code))
    formatters.set(L.code, new Intl.DateTimeFormat(L.dateLocale, { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }));
  return formatters.get(L.code).format(new Date(`${iso}T00:00:00Z`));
};
