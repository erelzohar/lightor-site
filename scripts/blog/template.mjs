/**
 * LT-430: what goes into a blog page's <head> (title, description, canonical,
 * share card, structured data) and the `[[cta]]` box inside an article. The
 * page itself (navbar, article, footer) is the site's React code, rendered by
 * src/blog/entry-server.tsx.
 *
 * Plain "-" only, never an em-dash, in anything a reader sees (LT-350).
 */

export const ORIGIN = 'https://lightor.app';
export const REGISTER_URL = 'https://register.lightor.app';
export const BLOG_NAME = 'הבלוג של לייטור';

export const esc = (s) =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/** JSON for a <script type="application/ld+json">: no "</script>" can close it early. */
const ld = (data) => JSON.stringify(data, null, 2).replace(/</g, '\\u003c');

const HE_DATE = new Intl.DateTimeFormat('he-IL', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });
export const heDate = (iso) => HE_DATE.format(new Date(`${iso}T00:00:00Z`));

const socialMeta = ({ url, title, description, type, image, imageAlt }) => `
  <link rel="canonical" href="${url}" />
  <meta property="og:type" content="${type}" />
  <meta property="og:site_name" content="Lightor" />
  <meta property="og:locale" content="he_IL" />
  <meta property="og:url" content="${url}" />
  <meta property="og:title" content="${esc(title)}" />
  <meta property="og:description" content="${esc(description)}" />
  <meta property="og:image" content="${image.url}" />
  <meta property="og:image:width" content="${image.width}" />
  <meta property="og:image:height" content="${image.height}" />
  <meta property="og:image:alt" content="${esc(imageAlt)}" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${esc(title)}" />
  <meta name="twitter:description" content="${esc(description)}" />
  <meta name="twitter:image" content="${image.url}" />`;

export const DEFAULT_IMAGE = { url: `${ORIGIN}/og-image.jpg`, width: 1200, height: 630 };
const DEFAULT_IMAGE_ALT = 'Lighty, הדמות של לייטור, ליד הכותרת: האתר שלך, תוך 60 שניות';

const PUBLISHER = {
  '@type': 'Organization',
  name: 'Lightor',
  alternateName: 'לייטור',
  url: `${ORIGIN}/`,
  logo: { '@type': 'ImageObject', url: `${ORIGIN}/lightor192.png`, width: 192, height: 192 },
};

const crumbsLd = (items) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: items.map(([name, item], i) => ({ '@type': 'ListItem', position: i + 1, name, item })),
});

/** `[[cta]]` on its own line in an article: a short invitation mid-way. */
export const inlineCta = (text) => `
<div class="cta-inline">
  <p>${esc(text || 'רוצים לראות איך זה נראה אצלכם? Lighty בונה לכם אתר בכמה דקות, בחינם.')}</p>
  <a class="btn" href="${REGISTER_URL}">לבניית האתר שלי - בחינם</a>
</div>`;

/** An article's <head> lines: title, description, canonical, share card, structured data. */
export const articleHead = (post) => {
  const url = `${ORIGIN}${post.path}`;
  const image = post.og || DEFAULT_IMAGE;
  const article = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.description,
    inLanguage: 'he',
    url,
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    datePublished: post.date,
    dateModified: post.updated || post.date,
    author: PUBLISHER,
    publisher: PUBLISHER,
    image: [image.url, ...(post.image ? [`${ORIGIN}${post.image.src1200}`] : [])],
    wordCount: post.words,
    ...(post.keyword ? { keywords: post.keyword } : {}),
    isPartOf: { '@type': 'Blog', name: BLOG_NAME, url: `${ORIGIN}/blog/` },
  };
  return `<title>${esc(post.title)} | לייטור</title>
    <meta name="description" content="${esc(post.description)}" />${socialMeta({ url, title: post.title, description: post.description, type: 'article', image, imageAlt: post.imageAlt || DEFAULT_IMAGE_ALT })}${
      post.image
        ? `\n    <link rel="preload" as="image" href="${post.image.src1200}" imagesrcset="${post.image.src640} 640w, ${post.image.src1200} 1200w" imagesizes="(min-width: 1024px) 1024px, 100vw" fetchpriority="high" />`
        : ''
    }
    <meta property="article:published_time" content="${post.date}" />
    <meta property="article:modified_time" content="${post.updated || post.date}" />
    <script type="application/ld+json">${ld(article)}</script>
    <script type="application/ld+json">${ld(crumbsLd([['לייטור', `${ORIGIN}/`], ['בלוג', `${ORIGIN}/blog/`], [post.title, url]]))}</script>`;
};

export const INDEX_TITLE = 'הבלוג של לייטור - מדריכים לבניית אתר, תורים ולידים';
export const INDEX_DESCRIPTION =
  'מדריכים קצרים ומעשיים לבעלי עסקים קטנים: איך בונים אתר, מקבלים תורים ולידים אונליין, שולחים תזכורות ללקוחות ומופיעים בגוגל.';

/** The blog index's <head> lines. */
export const indexHead = (posts) => {
  const url = `${ORIGIN}/blog/`;
  const blog = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: BLOG_NAME,
    description: INDEX_DESCRIPTION,
    url,
    inLanguage: 'he',
    publisher: PUBLISHER,
    blogPost: posts.map((p) => ({
      '@type': 'BlogPosting',
      headline: p.title,
      url: `${ORIGIN}${p.path}`,
      datePublished: p.date,
      dateModified: p.updated || p.date,
    })),
  };
  return `<title>${esc(INDEX_TITLE)}</title>
    <meta name="description" content="${esc(INDEX_DESCRIPTION)}" />${socialMeta({ url, title: INDEX_TITLE, description: INDEX_DESCRIPTION, type: 'website', image: DEFAULT_IMAGE, imageAlt: DEFAULT_IMAGE_ALT })}
    <script type="application/ld+json">${ld(blog)}</script>
    <script type="application/ld+json">${ld(crumbsLd([['לייטור', `${ORIGIN}/`], ['בלוג', url]]))}</script>`;
};
