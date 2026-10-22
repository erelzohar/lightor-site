/**
 * LT-430: the blog. Every article is one Markdown file in blog/posts/; this
 * script, run by `npm run build` after `vite build` (the site, and blog.html,
 * the blog pages' shell) and `vite build --ssr` (src/blog/entry-server), turns
 * them into pages of the site:
 *
 *   dist/blog/index.html          https://lightor.app/blog/
 *   dist/blog/<slug>/index.html   https://lightor.app/blog/<slug>/
 *
 * Each page is the site's own navbar, article and footer rendered to HTML, so
 * a search engine reads it without running a script, plus the JSON the
 * browser needs to take it over. They are added to dist/sitemap.xml. nginx
 * serves a folder's index.html at its URL with the trailing slash (and 301s
 * the bare one there), as it does for /en/.
 *
 * It is also the gate: an article with a missing field, a broken link, an
 * em-dash (LT-350), too few words or a duplicate title fails the build, so
 * nothing half-written can deploy. See blog/README.md.
 */
import { copyFileSync, existsSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { createHash } from 'node:crypto';
import { Marked } from 'marked';
import sharp from 'sharp';
import { ORIGIN, articleHead, esc, heDate, indexHead, inlineCta } from './template.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const POSTS_DIR = join(ROOT, 'blog', 'posts');
const IMAGES_DIR = join(ROOT, 'blog', 'images');
const DIST = join(ROOT, 'dist');
const SSR = join(ROOT, 'dist-ssr');
const SHELL = join(DIST, 'blog.html');
// Outside dist-ssr, which `vite build --ssr` empties on every run.
const SHELL_COPY = join(ROOT, 'node_modules', '.cache', 'lightor-blog', 'blog-shell.html');
const MARKS = ['<!--lt-blog-head-->', '<!--lt-blog-app-->', '<!--lt-blog-data-->'];

const MIN_WORDS = 800; // Hebrew is compact: 800 words read like 1,100 in English
const MAX_WORDS = 1600;
const TITLE_MAX = 70;
const DESCRIPTION_RANGE = [70, 165];
const DASHES = /[—―]/; // em-dash, horizontal bar: never in what a reader sees

const errors = [];
const fail = (where, message) => errors.push(`${where}: ${message}`);

/** Today in Israel, as YYYY-MM-DD: a CI runner is on UTC. */
export const todayIL = () => new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Jerusalem' }).format(new Date());

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;
const validDate = (s) => ISO_DATE.test(s) && !Number.isNaN(Date.parse(`${s}T00:00:00Z`));

/** `key: value` lines between two `---` lines; nothing fancier is needed. */
const parseFrontMatter = (raw, file) => {
  const m = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!m) {
    fail(file, 'no front matter (--- ... ---) at the top');
    return { meta: {}, body: raw };
  }
  const meta = {};
  for (const line of m[1].split('\n')) {
    if (!line.trim() || line.trim().startsWith('#')) continue;
    const i = line.indexOf(':');
    if (i < 1) {
      fail(file, `front matter line is not "key: value": ${line}`);
      continue;
    }
    meta[line.slice(0, i).trim()] = line.slice(i + 1).trim().replace(/^(["'])(.*)\1$/, '$2');
  }
  return { meta, body: m[2] };
};

const list = (s) => (s ? s.split(',').map((x) => x.trim()).filter(Boolean) : []);

const textOf = (html) =>
  html
    .replace(/<[^>]+>/g, ' ')
    .replace(/&[a-z#0-9]+;/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();

/** A heading's anchor: its words, Hebrew letters kept, joined by "-". */
const anchor = (text, used) => {
  const base =
    textOf(text)
      .toLowerCase()
      .replace(/[^\p{L}\p{N}\s-]/gu, '')
      .trim()
      .replace(/\s+/g, '-') || 'section';
  let id = base;
  for (let n = 2; used.has(id); n++) id = `${base}-${n}`;
  used.add(id);
  return id;
};

const marked = new Marked({ gfm: true });

const render = (body, file) => {
  let html = marked.parse(body);
  const used = new Set();
  const headings = [];
  html = html.replace(/<h([23])>([\s\S]*?)<\/h\1>/g, (_m, level, inner) => {
    const id = anchor(inner, used);
    if (level === '2') headings.push({ id, html: inner });
    return `<h${level} id="${id}">${inner}</h${level}>`;
  });
  html = html.replace(/<p>\[\[cta(?::\s*([^\]]+))?\]\]<\/p>/g, (_m, text) => inlineCta(text?.trim()));
  // "Lightor+" in a right-to-left line: the plus would jump to the word's other side.
  html = html.replace(/>([^<]*)/g, (_m, text) => `>${text.replace(/Lightor\+/g, '<bdi>Lightor+</bdi>')}`);
  html = html.replace(/<table>/g, '<div class="table"><table>').replace(/<\/table>/g, '</table></div>');
  // External links leave lightor.app without handing it the reader's page.
  html = html.replace(/<a href="(https?:\/\/[^"]+)"/g, (m, href) =>
    href.startsWith(ORIGIN) || /^https:\/\/[a-z0-9-]+\.lightor\.app/.test(href) ? m : `<a href="${href}" rel="noopener"`,
  );
  if (/<h1[\s>]/.test(html)) fail(file, 'the article has its own "# " heading; the title is the page heading, start sections with "## "');
  if (!headings.length) fail(file, 'no "## " section headings');
  if (/\[\[/.test(html)) fail(file, 'an unknown [[...]] marker is left in the text');
  return { html, headings };
};

const loadPosts = () => {
  if (!existsSync(POSTS_DIR)) return [];
  const today = todayIL();
  const posts = [];
  for (const name of readdirSync(POSTS_DIR).filter((f) => f.endsWith('.md')).sort()) {
    const file = `blog/posts/${name}`;
    const raw = readFileSync(join(POSTS_DIR, name), 'utf8').replace(/\r\n/g, '\n');
    const { meta, body } = parseFrontMatter(raw, file);
    if (meta.draft === 'true') continue;
    const slug = name.replace(/\.md$/, '');
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) fail(file, 'the file name (the URL) must be lowercase English words joined by "-"');
    for (const key of ['title', 'description', 'date', 'keyword', 'image_alt', 'image_credit']) if (!meta[key]) fail(file, `"${key}" is missing`);
    if (meta.image_alt && (meta.image_alt.length < 15 || meta.image_alt.length > 160)) fail(file, `image_alt is ${meta.image_alt.length} characters, keep it 15-160 (what the photo shows, in Hebrew)`);
    if (meta.title && meta.title.length > TITLE_MAX) fail(file, `title is ${meta.title.length} characters, at most ${TITLE_MAX}`);
    const d = meta.description || '';
    if (d && (d.length < DESCRIPTION_RANGE[0] || d.length > DESCRIPTION_RANGE[1]))
      fail(file, `description is ${d.length} characters, keep it ${DESCRIPTION_RANGE[0]}-${DESCRIPTION_RANGE[1]}`);
    if (meta.date && !validDate(meta.date)) fail(file, `date "${meta.date}" is not YYYY-MM-DD`);
    if (meta.date && validDate(meta.date) && meta.date > today) fail(file, `date ${meta.date} is in the future (today is ${today})`);
    if (meta.updated && (!validDate(meta.updated) || meta.updated < (meta.date || ''))) fail(file, `updated "${meta.updated}" must be a YYYY-MM-DD on or after the date`);
    if (DASHES.test(raw)) fail(file, 'contains an em-dash; write a plain "-" (LT-350)');
    const { html, headings } = render(body, file);
    const words = textOf(html).split(' ').filter(Boolean).length;
    if (words < MIN_WORDS || words > MAX_WORDS) fail(file, `${words} words; an article is ${MIN_WORDS}-${MAX_WORDS}`);
    posts.push({
      file,
      slug,
      path: `/blog/${slug}/`,
      title: meta.title || slug,
      description: d,
      date: meta.date || today,
      updated: meta.updated || '',
      keyword: meta.keyword || '',
      tags: list(meta.tags),
      relatedSlugs: list(meta.related),
      imageAlt: meta.image_alt || '',
      imageCredit: meta.image_credit || '',
      ctaTitle: meta.cta_title || '',
      ctaText: meta.cta_text || '',
      html,
      headings,
      words,
      minutes: Math.max(1, Math.round(words / 200)),
    });
  }
  return posts.sort((a, b) => b.date.localeCompare(a.date) || a.slug.localeCompare(b.slug));
};

/** Up to three: the ones the article names, then those sharing most tags, then the newest. */
const relatedFor = (post, posts) => {
  const bySlug = new Map(posts.map((p) => [p.slug, p]));
  const picked = post.relatedSlugs.map((s) => bySlug.get(s)).filter(Boolean);
  const rest = posts
    .filter((p) => p !== post && !picked.includes(p))
    .map((p) => ({ p, shared: p.tags.filter((t) => post.tags.includes(t)).length }))
    .sort((a, b) => b.shared - a.shared || b.p.date.localeCompare(a.p.date))
    .map(({ p }) => p);
  return [...picked, ...rest].slice(0, 3);
};

const checkLinks = (posts) => {
  const slugs = new Set(posts.map((p) => p.slug));
  for (const p of posts) {
    for (const s of p.relatedSlugs) if (!slugs.has(s)) fail(p.file, `related "${s}" is not an article`);
    for (const [, href] of p.html.matchAll(/href="([^"]+)"/g)) {
      const blog = href.match(/^(?:https:\/\/lightor\.app)?\/blog\/([^/#?]*)\/?(?:[#?].*)?$/);
      if (blog && blog[1] && !slugs.has(blog[1])) fail(p.file, `links to ${href}, which is not an article`);
      if (blog && blog[1] && !/\/blog\/[^/#?]+\/(?:[#?]|$)/.test(href)) fail(p.file, `link ${href} needs the trailing "/" (the article's URL)`);
      if (/^https?:\/\/(?:www\.)?lightor\.app\/?$/.test(href) === false && /^http:\/\//.test(href)) fail(p.file, `link ${href} is http, use https`);
    }
  }
  const seen = new Map();
  for (const p of posts)
    for (const key of ['title', 'description']) {
      const k = `${key}:${p[key]}`;
      if (seen.has(k)) fail(p.file, `same ${key} as ${seen.get(k)}`);
      else seen.set(k, p.file);
    }
};

const sitemapEntries = (posts) => {
  if (!posts.length) return '';
  const newest = posts.reduce((m, p) => ((p.updated || p.date) > m ? p.updated || p.date : m), '');
  const url = (loc, lastmod, priority) =>
    `  <url>\n    <loc>${esc(loc)}</loc>\n    <lastmod>${lastmod}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>${priority}</priority>\n  </url>\n`;
  return (
    `  <!-- LT-430: the blog, generated by scripts/blog/build.mjs -->\n` +
    url(`${ORIGIN}/blog/`, newest, '0.7') +
    posts.map((p) => url(`${ORIGIN}${p.path}`, p.updated || p.date, '0.6')).join('')
  );
};

const write = (rel, content) => {
  const path = join(DIST, rel);
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, content);
  return path;
};

/**
 * Every article has a photo at blog/images/<slug>.jpg (landscape, at least
 * 1200x630). The build cuts it into two 16:9 webp sizes for the page and a
 * 1200x630 jpg for share previews, named by the photo's hash so a new photo
 * is never served from an old cache.
 */
const preparePhotos = async (posts) => {
  const jobs = [];
  for (const post of posts) {
    const src = join(IMAGES_DIR, `${post.slug}.jpg`);
    if (!existsSync(src)) {
      fail(post.file, `no photo at blog/images/${post.slug}.jpg (see blog/README.md)`);
      continue;
    }
    const buf = readFileSync(src);
    const { width = 0, height = 0 } = await sharp(buf).metadata();
    if (width < 1200 || height < 630) fail(`blog/images/${post.slug}.jpg`, `${width}x${height}; the photo must be at least 1200x630`);
    else if (width / height < 1.3) fail(`blog/images/${post.slug}.jpg`, `${width}x${height} is not landscape (at least 4:3)`);
    const base = `/blog/img/${post.slug}-${createHash('sha1').update(buf).digest('hex').slice(0, 8)}`;
    post.image = { src640: `${base}-640.webp`, src1200: `${base}-1200.webp`, width: 1200, height: 675, alt: post.imageAlt };
    post.og = { url: `${ORIGIN}${base}-og.jpg`, width: 1200, height: 630, alt: post.imageAlt };
    jobs.push(
      [buf, 640, 360, `${base}-640.webp`],
      [buf, 1200, 675, `${base}-1200.webp`],
      [buf, 1200, 630, `${base}-og.jpg`],
    );
  }
  return jobs;
};

const writePhotos = (jobs) =>
  Promise.all(
    jobs.map(([buf, w, h, path]) => {
      const out = join(DIST, path);
      mkdirSync(dirname(out), { recursive: true });
      const img = sharp(buf).resize(w, h, { fit: 'cover', position: path.endsWith('-og.jpg') ? 'attention' : 'centre' });
      return (path.endsWith('.jpg') ? img.jpeg({ quality: 82, mozjpeg: true }) : img.webp({ quality: 78 })).toFile(out);
    }),
  );

/** What the page's React code gets (src/blog/types.ts): dates already in Hebrew. */
const card = (p) => ({
  slug: p.slug,
  path: p.path,
  title: p.title,
  description: p.description,
  date: p.date,
  dateLabel: heDate(p.date),
  minutes: p.minutes,
  image: p.image,
  ...(p.tags[0] ? { tag: p.tags[0] } : {}),
});

const articleData = (post, related) => ({
  kind: 'article',
  post: {
    ...card(post),
    tags: post.tags,
    credit: post.imageCredit,
    ...(post.updated ? { updated: post.updated, updatedLabel: heDate(post.updated) } : {}),
    headings: post.headings.map((h) => ({ id: h.id, text: textOf(h.html) })),
    ...(post.ctaTitle ? { ctaTitle: post.ctaTitle } : {}),
    ...(post.ctaText ? { ctaText: post.ctaText } : {}),
  },
  related: related.map(card),
});

const main = async () => {
  if (!existsSync(join(DIST, 'index.html'))) {
    console.error('✗ blog: dist/index.html is missing - run `npm run build` (vite, then the blog).');
    process.exit(1);
  }
  // The shell leaves dist (it is no page of its own); a second run uses the copy.
  if (existsSync(SHELL)) {
    mkdirSync(dirname(SHELL_COPY), { recursive: true });
    copyFileSync(SHELL, SHELL_COPY);
    rmSync(SHELL);
  }
  const entry = join(SSR, 'entry-server.js');
  if (!existsSync(SHELL_COPY) || !existsSync(entry)) {
    console.error('✗ blog: the blog shell or dist-ssr/entry-server.js is missing - run `npm run build`.');
    process.exit(1);
  }
  const shell = readFileSync(SHELL_COPY, 'utf8');
  for (const mark of MARKS) if (!shell.includes(mark)) fail('blog.html', `the built shell lost its ${mark} marker`);
  const { render } = await import(pathToFileURL(entry).href);

  const posts = loadPosts();
  checkLinks(posts);
  const photoJobs = await preparePhotos(posts);

  const page = (head, data, html) =>
    shell
      .replace(MARKS[0], () => head)
      .replace(MARKS[1], () => render(data, html))
      .replace(MARKS[2], () => `<script type="application/json" id="lt-blog-data">${JSON.stringify(data).replace(/</g, '\\u003c')}</script>`);

  const pages = [];
  if (!errors.length) {
    for (const post of posts) pages.push([`blog/${post.slug}/index.html`, page(articleHead(post), articleData(post, relatedFor(post, posts)), post.html)]);
    if (posts.length) pages.push(['blog/index.html', page(indexHead(posts), { kind: 'index', posts: posts.map(card) }, '')]);
  }

  for (const [rel, html] of pages) {
    if (DASHES.test(html)) fail(rel, 'the built page contains an em-dash (LT-350)');
    if (!html.includes('id="main-content"') || !html.includes('<nav')) fail(rel, 'the rendered page has no navbar or main content');
  }
  for (const post of posts) {
    const built = pages.find(([rel]) => rel === `blog/${post.slug}/index.html`)?.[1] || '';
    const firstWords = textOf(post.html).split(' ').slice(0, 8).join(' ');
    if (built && !textOf(built).includes(firstWords)) fail(post.file, 'the article text is missing from its built page');
  }

  const sitemapPath = join(DIST, 'sitemap.xml');
  let sitemap = existsSync(sitemapPath) ? readFileSync(sitemapPath, 'utf8') : '';
  // A second run (`npm run blog`) replaces the blog's entries, never doubles them.
  sitemap = sitemap.replace(/ {2}<!-- LT-430:[\s\S]*?(?=<\/urlset>)/, '');
  if (!sitemap.includes('</urlset>')) fail('dist/sitemap.xml', 'missing or has no </urlset> (public/sitemap.xml is the base)');
  else sitemap = sitemap.replace('</urlset>', `${sitemapEntries(posts)}</urlset>`);

  if (errors.length) {
    console.error(`✗ blog: ${errors.length} problem(s), nothing written:\n  - ${errors.join('\n  - ')}`);
    process.exit(1);
  }

  await writePhotos(photoJobs);
  for (const [rel, html] of pages) write(rel, html);
  writeFileSync(sitemapPath, sitemap);
  for (const p of posts) if (!sitemap.includes(`<loc>${ORIGIN}${p.path}</loc>`)) fail('sitemap', `${p.path} is not in it`);
  if (errors.length) {
    console.error(`✗ blog: ${errors.join('; ')}`);
    process.exit(1);
  }
  console.log(`✓ blog: ${posts.length} article(s) + index, sitemap updated`);
  for (const p of posts) console.log(`   ${p.path}  ${p.words} words  ${p.date}`);
};

main().catch((error) => {
  console.error(`✗ blog: ${error?.stack || error}`);
  process.exit(1);
});
