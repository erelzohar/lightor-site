/**
 * LT-430: the blog. Every article is one Markdown file in blog/posts/; this
 * script, run after `vite build`, turns them into static pages:
 *
 *   dist/blog/index.html          https://lightor.app/blog/
 *   dist/blog/<slug>/index.html   https://lightor.app/blog/<slug>/
 *
 * and adds them to dist/sitemap.xml. nginx serves a folder's index.html at
 * its URL with the trailing slash (and 301s the bare one there), as it does
 * for /en/.
 *
 * It is also the gate: an article with a missing field, a broken link, an
 * em-dash (LT-350), too few words or a duplicate title fails the build, so
 * nothing half-written can deploy. See blog/README.md.
 */
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { Marked } from 'marked';
import { ORIGIN, articlePage, esc, indexPage, inlineCta } from './template.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const POSTS_DIR = join(ROOT, 'blog', 'posts');
const DIST = join(ROOT, 'dist');

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
    for (const key of ['title', 'description', 'date', 'keyword']) if (!meta[key]) fail(file, `"${key}" is missing`);
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

const main = () => {
  if (!existsSync(join(DIST, 'index.html'))) {
    console.error('✗ blog: dist/index.html is missing - run `vite build` first (npm run build does both).');
    process.exit(1);
  }
  const posts = loadPosts();
  checkLinks(posts);

  const pages = [];
  for (const post of posts) pages.push([`blog/${post.slug}/index.html`, articlePage(post, relatedFor(post, posts))]);
  if (posts.length) pages.push(['blog/index.html', indexPage(posts)]);

  for (const [rel, html] of pages) if (DASHES.test(html)) fail(rel, 'the built page contains an em-dash (LT-350)');

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

main();
