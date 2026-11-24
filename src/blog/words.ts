import type { BlogLang } from './types';

/**
 * LT-715: the blog's own words, in each of its languages. The posts are
 * written in their language (blog/posts, blog/en/posts, blog/ar/posts); these
 * are the words around them: the index, the byline, the closing box and the
 * buttons. A page's <head> says its words in scripts/blog/languages.mjs.
 *
 * Hebrew is word for word what the blog said before LT-715. Plain "-" only,
 * never an em-dash (LT-350).
 */
export interface BlogWords {
  dir: 'rtl' | 'ltr';
  /** The language's home page, before its section anchors ("/#how"). */
  home: string;
  /** The language's blog. */
  blog: string;
  /** LT-710: the wizard opens in the page's language. */
  registerUrl: string;
  /** The sites built with Lightor, in the language where there is a page for it. */
  sitesUrl: string;
  crumbs: { label: string; home: string; blog: string };
  /** "6 דקות קריאה": the number and the words around it, as separate pieces. */
  minutes: (n: number) => (string | number)[];
  byline: string;
  /** Before an update's date, after the publish date. */
  updated: string;
  /** A guide's line: before and after the day its steps were checked. */
  verified: [string, string];
  /** Before the photographer's name. */
  photoBy: string;
  toc: string;
  related: string;
  guideChip: string;
  video: { play: string; pause: string; replay: string; caption: string };
  cta: { title: string; text: string; button: string; sites: string };
  index: { title: string; intro: string; jump: string; guides: string; guidesIntro: string; articles: string; featured: string };
}

/** Arabic counts minutes with the noun's dual and plural (one, two, 3-10, 11 and up). */
const arMinutes = (n: number): string =>
  n === 1 ? 'دقيقة واحدة' : n === 2 ? 'دقيقتان' : n % 100 >= 3 && n % 100 <= 10 ? `${n} دقائق` : `${n} دقيقة`;

export const WORDS: Record<BlogLang, BlogWords> = {
  he: {
    dir: 'rtl',
    home: '/',
    blog: '/blog/',
    registerUrl: 'https://register.lightor.app/?lang=he',
    sitesUrl: '/sites',
    crumbs: { label: 'פירורי לחם', home: 'לייטור', blog: 'בלוג' },
    minutes: (n) => [n, ' דקות קריאה'],
    byline: 'צוות לייטור',
    updated: ' · עודכן ב-',
    verified: ['כל שלב במדריך נבדק במערכת עצמה ב-', '.'],
    photoBy: 'צילום: ',
    toc: 'בכתבה',
    related: 'עוד בבלוג',
    guideChip: 'מדריך ללייטור',
    video: { play: 'הפעלת הסרטון', pause: 'עצירת הסרטון', replay: 'הפעלה מההתחלה', caption: 'סרטון קצר, בלי קול, מהמסכים של Lightor' },
    cta: {
      title: 'האתר שלכם, תוך 60 שניות',
      text: 'מספרים ל-Lighty על העסק במילים פשוטות, והוא בונה את האתר - עם קביעת תורים או טופס לידים, תזכורות ללקוחות וכתובת משלכם. ללא אשראי וללא התחייבות.',
      button: 'לבניית האתר שלי - בחינם',
      sites: 'לראות אתרים שנבנו',
    },
    index: {
      title: 'בלוג',
      intro: 'מדריכים קצרים ומעשיים: איך בונים אתר, מקבלים תורים ולידים אונליין, שולחים תזכורות ללקוחות ומופיעים בגוגל.',
      jump: 'בבלוג',
      guides: 'מדריכים ללייטור',
      guidesIntro: 'צעד אחר צעד, עם צילומי מסך מהמערכת עצמה.',
      articles: 'כתבות',
      featured: 'מומלץ',
    },
  },
  en: {
    dir: 'ltr',
    home: '/en/',
    blog: '/en/blog/',
    registerUrl: 'https://register.lightor.app/?lang=en',
    sitesUrl: '/en/sites',
    crumbs: { label: 'Breadcrumb', home: 'Lightor', blog: 'Blog' },
    minutes: (n) => [n, ' min read'],
    byline: 'Lightor team',
    updated: ' · Updated ',
    verified: ['Every step in this guide was checked in Lightor itself on ', '.'],
    photoBy: 'Photo: ',
    toc: 'In this article',
    related: 'More from the blog',
    guideChip: 'Lightor guide',
    video: { play: 'Play the video', pause: 'Pause the video', replay: 'Play from the start', caption: "A short silent clip of Lightor's screens" },
    cta: {
      title: 'Your website, in 60 seconds',
      text: 'Tell Lighty about your business in plain words, and he builds the site - with online booking or an inquiry form and an address of your own. No credit card, no commitment.',
      button: 'Build my site - free',
      sites: 'See sites we built',
    },
    index: {
      title: 'Blog',
      intro: 'Short, practical guides for small businesses: building a website, taking bookings and inquiries online, reminding customers and getting found on Google.',
      jump: 'In the blog',
      guides: 'Lightor guides',
      guidesIntro: 'Step by step, with screenshots from Lightor itself.',
      articles: 'Articles',
      featured: 'Featured',
    },
  },
  ar: {
    dir: 'rtl',
    home: '/ar/',
    blog: '/ar/blog/',
    registerUrl: 'https://register.lightor.app/?lang=ar',
    sitesUrl: '/ar/sites',
    crumbs: { label: 'مسار التنقل', home: 'لايتور', blog: 'المدونة' },
    minutes: (n) => [`مدة القراءة: ${arMinutes(n)}`],
    byline: 'فريق لايتور',
    updated: ' · حُدّث في ',
    verified: ['جُرّبت كل خطوة في هذا الدليل في لايتور نفسه في ', '.'],
    photoBy: 'تصوير: ',
    toc: 'في هذا المقال',
    related: 'المزيد من المدونة',
    guideChip: 'دليل لايتور',
    video: { play: 'تشغيل الفيديو', pause: 'إيقاف الفيديو', replay: 'التشغيل من البداية', caption: 'فيديو قصير بلا صوت من شاشات Lightor' },
    cta: {
      title: 'موقعكم خلال 60 ثانية',
      text: 'أخبروا Lighty عن عملكم بكلمات بسيطة، وهو يبني الموقع - مع حجز المواعيد أو نموذج للاستفسارات، وعنوان خاص بكم. بدون بطاقة ائتمان وبدون التزام.',
      button: 'ابنوا موقعكم مجانًا',
      sites: 'شاهدوا مواقع بنيناها',
    },
    index: {
      title: 'المدونة',
      intro: 'أدلة قصيرة وعملية لأصحاب الأعمال الصغيرة: كيف تبنون موقعًا، وتستقبلون الحجوزات والاستفسارات عبر الإنترنت، وتظهرون في Google.',
      jump: 'في المدونة',
      guides: 'أدلة لايتور',
      guidesIntro: 'خطوة بخطوة، مع صور شاشة من لايتور نفسه.',
      articles: 'مقالات',
      featured: 'مختارات',
    },
  },
};
