import { LANGS, DEFAULT_LANG, NATIVE_NAME, isRtl, pathFor, type Lang } from './languages';

/**
 * LT-349: what each language's HTML carries before any script runs: the
 * title and description a search engine shows, the share card, and the links
 * between the versions. The title starts "Lightor | <the name as written in
 * that language>" (Erel), so a search for "לייטור" or "لايتور" finds it.
 * Plain hyphens only: no em-dash anywhere users read (LT-350).
 */
export const ORIGIN = 'https://lightor.app';

export interface Seo {
  title: string;
  description: string;
  ogTitle: string;
  ogDescription: string;
  ogLocale: string;
  imageAlt: string;
}

export const SEO: Record<Lang, Seo> = {
  he: {
    title: 'Lightor | לייטור | אתר לכל עסק, אירוע או רעיון - עם AI',
    description:
      'לייטור בונה לך אתר מתוך שיחה עם Lighty, העוזר החכם - לעסק, לאירוע, דף נחיתה או אתר תדמית, בכתובת משלך. האתר יכול גם לקבל תורים או פניות, עם תזכורות, התראות ולוח בקרה. כל אתר בנוי כדי שימצאו אותו בגוגל ובמנועי AI.',
    ogTitle: 'Lightor | לייטור - האתר שלך, תוך 60 שניות',
    ogDescription: 'Lighty בונה לך אתר משלך מתוך שיחה - לעסק, לאירוע, דף נחיתה או כל רעיון. מתחילים בחינם.',
    ogLocale: 'he_IL',
    imageAlt: 'Lighty, הדמות של לייטור, ליד הכותרת: האתר שלך, תוך 60 שניות',
  },
  en: {
    title: 'Lightor | A website for any business, event or idea - with AI',
    description:
      'Lightor builds you a website from a conversation with Lighty, its smart assistant - for a business, an event, a landing page or a brochure site, at your own address. A site can also take bookings or inquiries, with reminders, alerts and a dashboard. Every site is built to be found on Google and in AI search.',
    ogTitle: 'Lightor - Your website, in 60 seconds',
    ogDescription: 'Lighty builds you a site of your own from a conversation - for a business, an event, a landing page or any idea. Start free.',
    ogLocale: 'en_US',
    imageAlt: 'Lighty, the Lightor character, next to the headline: your website, in 60 seconds',
  },
  ar: {
    title: 'Lightor | لايتور | موقع لأي عمل أو حدث أو فكرة - بالذكاء الاصطناعي',
    description:
      'لايتور يبني لك موقعًا من محادثة مع Lighty، المساعد الذكي - لعملك أو لحدث أو صفحة هبوط أو موقع تعريفي، على عنوانك الخاص. ويمكن للموقع أيضًا استقبال الحجوزات أو الاستفسارات، مع تذكيرات وتنبيهات ولوحة تحكم. كل موقع مبني ليظهر في Google ومحركات البحث بالذكاء الاصطناعي.',
    ogTitle: 'Lightor | لايتور - موقعك خلال 60 ثانية',
    ogDescription: 'Lighty يبني لك موقعك الخاص من محادثة - لعملك أو لحدث أو صفحة هبوط أو أي فكرة. ابدأ مجانًا.',
    ogLocale: 'ar_AR',
    imageAlt: 'Lighty، شخصية لايتور، بجانب العنوان: موقعك خلال 60 ثانية',
  },
  fr: {
    title: "Lightor | Un site pour toute entreprise, tout événement ou toute idée - avec l'IA",
    description:
      "Lightor crée votre site à partir d'une conversation avec Lighty, son assistant intelligent - pour une entreprise, un événement, une page d'atterrissage ou un site vitrine, à votre propre adresse. Le site peut aussi prendre des rendez-vous ou recevoir des demandes, avec rappels, alertes et tableau de bord. Chaque site est conçu pour être trouvé sur Google et dans la recherche IA.",
    ogTitle: 'Lightor - Votre site, en 60 secondes',
    ogDescription: "Lighty crée votre propre site à partir d'une conversation - pour une entreprise, un événement, une page d'atterrissage ou toute idée. Commencez gratuitement.",
    ogLocale: 'fr_FR',
    imageAlt: 'Lighty, le personnage de Lightor, à côté du titre : votre site, en 60 secondes',
  },
  es: {
    title: 'Lightor | Un sitio web para cualquier negocio, evento o idea - con IA',
    description:
      'Lightor crea tu sitio web a partir de una conversación con Lighty, su asistente inteligente - para un negocio, un evento, una landing page o un sitio institucional, en tu propia dirección. El sitio también puede recibir reservas o consultas, con recordatorios, alertas y un panel de control. Cada sitio está hecho para aparecer en Google y en la búsqueda con IA.',
    ogTitle: 'Lightor - Tu sitio web, en 60 segundos',
    ogDescription: 'Lighty crea tu propio sitio a partir de una conversación - para un negocio, un evento, una landing page o cualquier idea. Empieza gratis.',
    ogLocale: 'es_ES',
    imageAlt: 'Lighty, el personaje de Lightor, junto al titular: tu sitio web, en 60 segundos',
  },
};

/**
 * The crawlable summary in each language (the <noscript> block of
 * index.html): what a crawler that runs no script reads as the page, so it
 * must be in the page's language. Keep it in step with the hero and the
 * features copy.
 */
interface Summary {
  h1: string;
  intro: string;
  canTitle: string;
  can: [string, string, string];
  lightyTitle: string;
  lighty: [string, string, string];
  promo: string;
  links: {
    build: string;
    sites: string;
    blog: string;
    signIn: string;
    pricing: string;
    support: string;
    privacy: string;
    terms: string;
    refund: string;
  };
}

export const SUMMARY: Record<Lang, Summary> = {
  he: {
    h1: 'לייטור - האתר שלכם תוך 60 שניות, עם Lighty',
    intro:
      'לייטור נותן לכל אחד אתר משלו - לעסק, לאירוע, לדף נחיתה או לכל רעיון. מספרים ל-Lighty, העוזר החכם, על מה האתר, ו-Lighty כותב את הטקסטים, בוחר עיצוב ומעלה את האתר לאוויר בכתובת lightor.app משלכם.',
    canTitle: 'מה האתר יכול לעשות',
    can: [
      'כל אתר: עמוד שמספר מי אתם ומה אתם מציעים, גלריה, המלצות ושאלות נפוצות, כפתורי וואטסאפ וטלפון, וכתובת משלכם בגוגל.',
      'קביעת תורים: לקוחות בוחרים שירות ושעה פנויה בעצמם, לפי השעות האמיתיות שלכם - כולל שיעורים וקבוצות - ומקבלים אישור ותזכורת ב-SMS או בוואטסאפ.',
      'קבלת פניות: טופס עם השאלות שלכם - להצעות מחיר, להרשמה או לחזרה טלפונית - כל פנייה במקום אחד עם סטטוס, והתראה מיידית.',
    ],
    lightyTitle: 'Lighty, העוזר החכם',
    lighty: [
      'בונה את האתר מתוך שיחה.',
      'עורכים כל חלק באתר בלחיצה - לבד או עם Lighty.',
      'עונה על שאלות מתוך הנתונים שלכם: תורים, לקוחות ופניות.',
    ],
    promo:
      'כל אתר מקודם אורגנית: מנועי החיפוש מתעדכנים בכל שינוי, התוכן מסומן כך שמנועי חיפוש מבינים אותו, וכל אתר מקושר מ-lightor.app/sites. לייטור מתאים לעסקים, לאירועים, לדפי נחיתה ולכל רעיון. מתחילים בחינם, בלי התקנה, בעברית, אנגלית, ערבית, צרפתית וספרדית.',
    links: {
      build: 'בונים אתר בחינם',
      sites: 'אתרים שנבנו עם לייטור',
      blog: 'בלוג',
      signIn: 'כניסה',
      pricing: 'מחירים',
      support: 'תמיכה',
      privacy: 'מדיניות פרטיות',
      terms: 'תנאי שימוש',
      refund: 'מדיניות החזרים',
    },
  },
  en: {
    h1: 'Lightor - your website in 60 seconds, built with Lighty',
    intro:
      'Lightor gives anyone a website of their own - for a business, an event, a landing page or any idea. You tell Lighty, its AI assistant, what the site is about, and Lighty writes the copy, picks a design and publishes the site at your own lightor.app address.',
    canTitle: 'What a site can do',
    can: [
      'Every site: a page about who you are and what you offer, a gallery, reviews and FAQ, WhatsApp and phone buttons, and your own address on Google.',
      'Take bookings: customers choose a service and a free slot themselves, from your real hours - classes and groups included - and get a confirmation and a reminder by text message or WhatsApp.',
      'Get inquiries: a form with your own questions - for quotes, sign-ups or call-backs - every inquiry in one place with its status, and an instant alert.',
    ],
    lightyTitle: 'Lighty, the AI assistant',
    lighty: [
      'Builds your site from a conversation.',
      'Edit any part of your site with a click - by hand or with Lighty.',
      'Answers questions from your own data: bookings, customers and inquiries.',
    ],
    promo:
      'Every site is promoted organically: search engines are updated on every change, the content is marked up so search engines understand it, and each site is linked from lightor.app/sites. Lightor works for businesses, events, landing pages and any idea. It is free to start, needs no installation, and is available in Hebrew, English, Arabic, French and Spanish.',
    links: {
      build: 'Build your site free',
      sites: 'Sites built with Lightor',
      blog: 'Blog',
      signIn: 'Sign in',
      pricing: 'Pricing',
      support: 'Support',
      privacy: 'Privacy Policy',
      terms: 'Terms of Service',
      refund: 'Refund Policy',
    },
  },
  ar: {
    h1: 'لايتور - موقعك خلال 60 ثانية، مع Lighty',
    intro:
      'لايتور يمنح أي شخص موقعًا خاصًا به - لعمل أو حدث أو صفحة هبوط أو أي فكرة. تخبر Lighty، المساعد الذكي، عن موضوع موقعك، فيكتب Lighty النصوص ويختار التصميم وينشر الموقع على عنوانك الخاص في lightor.app.',
    canTitle: 'ماذا يستطيع الموقع أن يفعل',
    can: [
      'كل موقع: صفحة تعرّف بك وبما تقدّمه، ومعرض صور، وآراء وأسئلة شائعة، وأزرار واتساب وهاتف، وعنوانك الخاص على Google.',
      'استقبال الحجوزات: يختار العملاء الخدمة والموعد المتاح بأنفسهم، حسب ساعات عملك الحقيقية - بما في ذلك الدروس والمجموعات - ويتلقون تأكيدًا وتذكيرًا برسالة نصية أو عبر واتساب.',
      'استقبال الاستفسارات: نموذج بأسئلتك الخاصة - لعروض الأسعار أو التسجيل أو طلب اتصال - كل استفسار في مكان واحد مع حالته، وتنبيه فوري.',
    ],
    lightyTitle: 'Lighty، المساعد الذكي',
    lighty: [
      'يبني موقعك من محادثة.',
      'عدّل أي جزء من موقعك بنقرة - بنفسك أو مع Lighty.',
      'يجيب عن الأسئلة من بياناتك: الحجوزات والعملاء والاستفسارات.',
    ],
    promo:
      'كل موقع يحظى بترويج طبيعي: تُحدَّث محركات البحث مع كل تغيير، ويُوسَم المحتوى بحيث تفهمه محركات البحث، وكل موقع مرتبط من lightor.app/sites. لايتور يناسب الأعمال والأحداث وصفحات الهبوط وأي فكرة. البدء مجاني، بلا تثبيت، ومتوفر بالعبرية والإنجليزية والعربية والفرنسية والإسبانية.',
    links: {
      build: 'أنشئ موقعك مجانًا',
      sites: 'مواقع بُنيت مع لايتور',
      blog: 'المدونة',
      signIn: 'تسجيل الدخول',
      pricing: 'الأسعار',
      support: 'الدعم',
      privacy: 'سياسة الخصوصية',
      terms: 'شروط الخدمة',
      refund: 'سياسة الاسترداد',
    },
  },
  fr: {
    h1: 'Lightor - votre site en 60 secondes, créé avec Lighty',
    intro:
      "Lightor offre à chacun son propre site - pour une entreprise, un événement, une page d'atterrissage ou toute idée. Vous dites à Lighty, son assistant IA, de quoi parle le site, et Lighty rédige les textes, choisit un design et publie le site à votre propre adresse lightor.app.",
    canTitle: 'Ce que peut faire un site',
    can: [
      'Chaque site : une page qui dit qui vous êtes et ce que vous proposez, une galerie, des avis et une FAQ, des boutons WhatsApp et téléphone, et votre propre adresse sur Google.',
      'Prendre des rendez-vous : les clients choisissent eux-mêmes un service et un créneau libre, selon vos vrais horaires - cours et groupes compris - et reçoivent une confirmation et un rappel par SMS ou WhatsApp.',
      'Recevoir des demandes : un formulaire avec vos propres questions - pour des devis, des inscriptions ou des rappels - chaque demande au même endroit avec son statut, et une alerte immédiate.',
    ],
    lightyTitle: "Lighty, l'assistant IA",
    lighty: [
      "Crée votre site à partir d'une conversation.",
      "Modifiez n'importe quelle partie de votre site en un clic - vous-même ou avec Lighty.",
      'Répond aux questions à partir de vos propres données : rendez-vous, clients et demandes.',
    ],
    promo:
      "Chaque site est promu de façon organique : les moteurs de recherche sont informés de chaque modification, le contenu est balisé pour que les moteurs le comprennent, et chaque site est lié depuis lightor.app/sites. Lightor convient aux entreprises, aux événements, aux pages d'atterrissage et à toute idée. Le démarrage est gratuit, sans installation, en hébreu, anglais, arabe, français et espagnol.",
    links: {
      build: 'Créez votre site gratuitement',
      sites: 'Sites créés avec Lightor',
      blog: 'Blog',
      signIn: 'Connexion',
      pricing: 'Tarifs',
      support: 'Assistance',
      privacy: 'Politique de confidentialité',
      terms: "Conditions d'utilisation",
      refund: 'Politique de remboursement',
    },
  },
  es: {
    h1: 'Lightor - tu sitio web en 60 segundos, creado con Lighty',
    intro:
      'Lightor le da a cualquiera un sitio web propio - para un negocio, un evento, una landing page o cualquier idea. Le cuentas a Lighty, su asistente de IA, de qué trata el sitio, y Lighty escribe los textos, elige un diseño y publica el sitio en tu propia dirección de lightor.app.',
    canTitle: 'Lo que puede hacer un sitio',
    can: [
      'Cada sitio: una página sobre quién eres y qué ofreces, una galería, reseñas y preguntas frecuentes, botones de WhatsApp y teléfono, y tu propia dirección en Google.',
      'Recibir reservas: los clientes eligen ellos mismos un servicio y un horario libre, según tu horario real - clases y grupos incluidos - y reciben una confirmación y un recordatorio por SMS o WhatsApp.',
      'Recibir consultas: un formulario con tus propias preguntas - para presupuestos, inscripciones o llamadas - cada consulta en un solo lugar con su estado, y un aviso al instante.',
    ],
    lightyTitle: 'Lighty, el asistente de IA',
    lighty: [
      'Crea tu sitio a partir de una conversación.',
      'Edita cualquier parte de tu sitio con un clic - tú mismo o con Lighty.',
      'Responde preguntas con tus propios datos: reservas, clientes y consultas.',
    ],
    promo:
      'Cada sitio se promociona de forma orgánica: los buscadores se actualizan con cada cambio, el contenido está marcado para que los buscadores lo entiendan, y cada sitio está enlazado desde lightor.app/sites. Lightor sirve para negocios, eventos, landing pages y cualquier idea. Empezar es gratis, sin instalación, en hebreo, inglés, árabe, francés y español.',
    links: {
      build: 'Crea tu sitio gratis',
      sites: 'Sitios creados con Lightor',
      blog: 'Blog',
      signIn: 'Iniciar sesión',
      pricing: 'Precios',
      support: 'Soporte',
      privacy: 'Política de privacidad',
      terms: 'Términos del servicio',
      refund: 'Política de reembolso',
    },
  },
};

/** The brand as written in the scripts we speak, for structured data. */
export const BRAND_ALTERNATE_NAMES = ['לייטור', 'لايتور'];

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/** The hreflang links every version carries: itself, the rest, and x-default (Hebrew, the root). */
export const hreflangLinks = (): string =>
  [
    ...LANGS.map((l) => `<link rel="alternate" hreflang="${l}" href="${ORIGIN}${pathFor(l)}" />`),
    `<link rel="alternate" hreflang="x-default" href="${ORIGIN}${pathFor(DEFAULT_LANG)}" />`,
  ].join('\n    ');

/** The <noscript> block in `lang`, with links to the page in every other language. */
export const summaryHtml = (lang: Lang): string => {
  const sum = SUMMARY[lang];
  const li = (items: readonly string[]) => items.map((item) => `<li>${esc(item)}</li>`).join('\n          ');
  const links: [string, string][] = [
    ['https://register.lightor.app', sum.links.build],
    [`${ORIGIN}/sites`, sum.links.sites],
    [`${ORIGIN}/blog/`, sum.links.blog],
    ['https://dashboard.lightor.app', sum.links.signIn],
    [`${ORIGIN}/pricing.html`, sum.links.pricing],
    [`${ORIGIN}/support.html`, sum.links.support],
    [`${ORIGIN}/privacy.html`, sum.links.privacy],
    [`${ORIGIN}/terms.html`, sum.links.terms],
    [`${ORIGIN}/refund.html`, sum.links.refund],
  ];
  const others = LANGS.filter((l) => l !== lang).map(
    (l) => `<a href="${ORIGIN}${pathFor(l)}" hreflang="${l}" lang="${l}">${esc(NATIVE_NAME[l])}</a>`,
  );
  return `<noscript>
      <main>
        <h1>${esc(sum.h1)}</h1>
        <p>${esc(sum.intro)}</p>
        <h2>${esc(sum.canTitle)}</h2>
        <ul>
          ${li(sum.can)}
        </ul>
        <h2>${esc(sum.lightyTitle)}</h2>
        <ul>
          ${li(sum.lighty)}
        </ul>
        <p>${esc(sum.promo)}</p>
        <p>
          ${links.map(([href, label]) => `<a href="${href}">${esc(label)}</a>`).join(' &middot;\n          ')}
        </p>
        <p>
          ${others.join(' &middot;\n          ')}
        </p>
      </main>
    </noscript>`;
};

/**
 * The built page in `lang`: the <html> lang/dir, the title, the description,
 * the canonical URL, the share card, the hreflang links and the crawlable
 * summary: everything a crawler reads before scripts. `html` is the Hebrew build (index.html).
 */
export const localizeHtml = (html: string, lang: Lang): string => {
  const seo = SEO[lang];
  const url = `${ORIGIN}${pathFor(lang)}`;
  const set = (re: RegExp, value: string) => {
    if (!re.test(html)) throw new Error(`LT-349: ${re} not found in index.html`);
    html = html.replace(re, value);
  };
  set(/<html lang="[^"]*" dir="[^"]*">/, `<html lang="${lang}" dir="${isRtl(lang) ? 'rtl' : 'ltr'}">`);
  set(/<title>[^<]*<\/title>/, `<title>${esc(seo.title)}</title>`);
  set(/<meta name="description" content="[^"]*" \/>/, `<meta name="description" content="${esc(seo.description)}" />`);
  set(/<link rel="canonical" href="[^"]*" \/>/, `<link rel="canonical" href="${url}" />\n    ${hreflangLinks()}`);
  set(/<meta property="og:locale" content="[^"]*" \/>/, [
    `<meta property="og:locale" content="${seo.ogLocale}" />`,
    ...LANGS.filter((l) => l !== lang).map((l) => `<meta property="og:locale:alternate" content="${SEO[l].ogLocale}" />`),
  ].join('\n    '));
  set(/<meta property="og:url" content="[^"]*" \/>/, `<meta property="og:url" content="${url}" />`);
  set(/<meta property="og:title" content="[^"]*" \/>/, `<meta property="og:title" content="${esc(seo.ogTitle)}" />`);
  set(/<meta property="og:description" content="[^"]*" \/>/, `<meta property="og:description" content="${esc(seo.ogDescription)}" />`);
  set(/<meta property="og:image:alt" content="[^"]*" \/>/, `<meta property="og:image:alt" content="${esc(seo.imageAlt)}" />`);
  set(/<meta name="twitter:title" content="[^"]*" \/>/, `<meta name="twitter:title" content="${esc(seo.ogTitle)}" />`);
  set(/<meta name="twitter:description" content="[^"]*" \/>/, `<meta name="twitter:description" content="${esc(seo.ogDescription)}" />`);
  set(/<noscript>[\s\S]*?<\/noscript>/, summaryHtml(lang));
  return html;
};
