/**
 * LT-430: what goes into a blog page's <head> (title, description, canonical,
 * share card, structured data) and the `[[cta]]` box inside an article; since
 * LT-698 also a landing page's head (`landingHead`). The page itself (navbar,
 * article, footer) is the site's React code, rendered by
 * src/blog/entry-server.tsx.
 *
 * LT-715: in the post's language (`L`, one of scripts/blog/languages.mjs):
 * Hebrew, English or Arabic. The landing pages are Hebrew only.
 *
 * Plain "-" only, never an em-dash, in anything a reader sees (LT-350).
 */
import { BLOG_LANG, ORIGIN, dateIn } from './languages.mjs';

export { ORIGIN };
const HE = BLOG_LANG.he;

export const esc = (s) =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/** JSON for a <script type="application/ld+json">: no "</script>" can close it early. */
const ld = (data) => JSON.stringify(data, null, 2).replace(/</g, '\\u003c');

/** A date written out in the language (LT-715; Hebrew as before). */
export const dateLabel = (iso, L = HE) => dateIn(iso, L);

const socialMeta = ({ url, title, description, type, image, imageAlt, L = HE }) => `
  <link rel="canonical" href="${url}" />
  <meta property="og:type" content="${type}" />
  <meta property="og:site_name" content="Lightor" />
  <meta property="og:locale" content="${L.ogLocale}" />
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

/**
 * The site's Organization, exactly the node on the home page (LT-619), so the
 * engines merge the two by its @id. Author and publisher of every post: a
 * named person is Erel's decision.
 */
const PUBLISHER = {
  '@type': 'Organization',
  '@id': `${ORIGIN}/#organization`,
  name: 'Lightor',
  alternateName: ['לייטור', 'لايتور'],
  url: `${ORIGIN}/`,
  logo: { '@type': 'ImageObject', url: `${ORIGIN}/lightor192.png`, width: 192, height: 192 },
  // LT-652: the same profiles as the home's Organization (index.html) and the footer.
  sameAs: [
    'https://www.instagram.com/lightor.ai/',
    'https://www.facebook.com/profile.php?id=61590494095586',
    'https://www.linkedin.com/company/lightor/',
    'https://www.tiktok.com/@lightor.ai',
    'https://play.google.com/store/apps/details?id=app.lightor.dashboard',
    'https://apps.apple.com/app/lightor/id6819305092',
  ],
};

/**
 * LT-619: the post's "## שאלות נפוצות", word for word as the page shows it
 * (build.mjs reads it from the rendered HTML). Honest markup for the answer
 * engines; Google no longer shows FAQ rich results, and this is not for one.
 */
const faqLd = (url, faq, L = HE) => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  url,
  inLanguage: L.inLanguage,
  mainEntity: faq.map(({ question, answer }) => ({
    '@type': 'Question',
    name: question,
    acceptedAnswer: { '@type': 'Answer', text: answer },
  })),
});

const crumbsLd = (items) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: items.map(([name, item], i) => ({ '@type': 'ListItem', position: i + 1, name, item })),
});

/** `[[cta]]` on its own line in an article: a short invitation mid-way, in the post's language. */
export const inlineCta = (text, L = HE) => `
<div class="cta-inline">
  <p>${esc(text || L.ctaText)}</p>
  <a class="btn" href="${L.registerUrl}">${L.ctaButton}</a>
</div>`;

/** The breadcrumbs' first two steps in a language: its home page, its blog. */
const blogCrumbs = (L) => [
  [L.crumbHome, `${ORIGIN}${L.home}`],
  [L.crumbBlog, `${ORIGIN}${L.base}`],
];

/** An article's <head> lines: title, description, canonical, share card, structured data. */
export const articleHead = (post, L = HE) => {
  const url = `${ORIGIN}${post.path}`;
  const image = post.og || DEFAULT_IMAGE;
  const article = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.description,
    inLanguage: L.inLanguage,
    url,
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    datePublished: post.date,
    dateModified: post.updated || post.date,
    author: PUBLISHER,
    publisher: PUBLISHER,
    image: [image.url, ...(post.image ? [`${ORIGIN}${post.image.src1200}`] : [])],
    wordCount: post.words,
    ...(post.keyword ? { keywords: post.keyword } : {}),
    isPartOf: { '@type': 'Blog', name: L.blogName, url: `${ORIGIN}${L.base}` },
    ...(post.video
      ? {
          video: {
            '@type': 'VideoObject',
            name: post.title,
            description: post.video.alt,
            thumbnailUrl: `${ORIGIN}${post.video.poster}`,
            contentUrl: `${ORIGIN}${post.video.mp4}`,
            uploadDate: post.updated || post.date,
            inLanguage: L.inLanguage,
          },
        }
      : {}),
  };
  return `<title>${esc(post.title)}${L.titleSuffix}</title>
    <meta name="description" content="${esc(post.description)}" />${socialMeta({ url, title: post.title, description: post.description, type: 'article', image, imageAlt: post.imageAlt || L.imageAlt, L })}${
      post.video
        ? `\n    <link rel="preload" as="image" href="${post.video.poster}" fetchpriority="high" />`
        : post.image
        ? `\n    <link rel="preload" as="image" href="${post.image.src1200}" imagesrcset="${post.image.src640} 640w, ${post.image.src1200} 1200w" imagesizes="(min-width: 1024px) 1024px, 100vw" fetchpriority="high" />`
        : ''
    }
    <meta property="article:published_time" content="${post.date}" />
    <meta property="article:modified_time" content="${post.updated || post.date}" />
    <script type="application/ld+json">${ld(article)}</script>${
      post.faq?.length ? `\n    <script type="application/ld+json">${ld(faqLd(url, post.faq, L))}</script>` : ''
    }
    <script type="application/ld+json">${ld(crumbsLd([...blogCrumbs(L), [post.title, url]]))}</script>`;
};

/**
 * LT-698: a landing page's <head> lines (/booking-system/, /free-website-builder/):
 * a WebPage published by the site's Organization, its place under the home
 * page, and its questions word for word. Hebrew only, so no hreflang.
 */
export const landingHead = (page) => {
  const url = `${ORIGIN}${page.path}`;
  const webPage = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': url,
    url,
    name: page.title,
    description: page.description,
    inLanguage: 'he',
    datePublished: page.date,
    dateModified: page.updated || page.date,
    ...(page.keyword ? { keywords: page.keyword } : {}),
    isPartOf: { '@type': 'WebSite', name: 'Lightor', url: `${ORIGIN}/` },
    publisher: PUBLISHER,
  };
  return `<title>${esc(page.title)} | לייטור</title>
    <meta name="description" content="${esc(page.description)}" />${socialMeta({ url, title: page.title, description: page.description, type: 'website', image: DEFAULT_IMAGE, imageAlt: HE.imageAlt })}
    <script type="application/ld+json">${ld(webPage)}</script>${
      page.faq?.length ? `\n    <script type="application/ld+json">${ld(faqLd(url, page.faq))}</script>` : ''
    }
    <script type="application/ld+json">${ld(crumbsLd([['לייטור', `${ORIGIN}/`], [page.title, url]]))}</script>`;
};

/**
 * LT-715: the blog index pages of every language that has one name each
 * other, and only they do: the posts are written in their own language, with
 * no twin elsewhere.
 */
const hreflangLinks = (others) =>
  others.length > 1 ? others.map((O) => `\n    <link rel="alternate" hreflang="${O.inLanguage}" href="${ORIGIN}${O.base}" />`).join('') : '';

/** The blog index's <head> lines; `others` are the languages whose blog index exists, this one included. */
export const indexHead = (posts, L = HE, others = []) => {
  const url = `${ORIGIN}${L.base}`;
  const blog = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: L.blogName,
    description: L.indexDescription,
    url,
    inLanguage: L.inLanguage,
    publisher: PUBLISHER,
    blogPost: posts.map((p) => ({
      '@type': 'BlogPosting',
      headline: p.title,
      url: `${ORIGIN}${p.path}`,
      datePublished: p.date,
      dateModified: p.updated || p.date,
    })),
  };
  return `<title>${esc(L.indexTitle)}</title>
    <meta name="description" content="${esc(L.indexDescription)}" />${socialMeta({ url, title: L.indexTitle, description: L.indexDescription, type: 'website', image: DEFAULT_IMAGE, imageAlt: L.imageAlt, L })}${hreflangLinks(others)}
    <script type="application/ld+json">${ld(blog)}</script>
    <script type="application/ld+json">${ld(crumbsLd(blogCrumbs(L)))}</script>`;
};
