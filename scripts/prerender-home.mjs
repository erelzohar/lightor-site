/**
 * LT-579: the home page drawn into each language's page, so a reader that
 * runs no script (most AI tools: ChatGPT and Gemini read lightor.app as an
 * empty page) gets its words, the same ones a visitor sees. Runs inside
 * `npm run build`, after `vite build` (which writes dist/index.html for
 * Hebrew and dist/<lang>/index.html for the rest, LT-349) and the
 * server-side build of src/entry-server.tsx into dist-ssr-home/. The browser
 * takes the drawn page over (src/main.tsx). Fails, and writes nothing, when
 * a page lost its empty #root or came out without its navbar, heading or
 * words.
 */
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const DIST = join(ROOT, 'dist');
const ENTRY = join(ROOT, 'dist-ssr-home', 'entry-server.js');
const EMPTY_ROOT = '<div id="root"></div>';
const DASHES = /[—―]/; // em-dash, horizontal bar: never in what a reader sees
/** As React writes text into HTML. */
const esc = (text) => text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#x27;');

const fail = (message) => {
  console.error(`✗ home: ${message}`);
  process.exit(1);
};

if (!existsSync(ENTRY)) fail('dist-ssr-home/entry-server.js is missing - run `npm run build`.');
const { render, faqOf, LANGS, DEFAULT_LANG } = await import(pathToFileURL(ENTRY).href);

/** LT-618: the page's questions as FAQPage data, in the very words it shows. */
const faqData = (items, url) =>
  JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    url,
    mainEntity: items.map(({ q, a }) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })),
  }).replace(/</g, '\\u003c');

const pages = [];
for (const lang of LANGS) {
  const rel = lang === DEFAULT_LANG ? 'index.html' : `${lang}/index.html`;
  const file = join(DIST, rel);
  if (!existsSync(file)) fail(`dist/${rel} is missing - run \`npm run build\` (vite first).`);
  const page = readFileSync(file, 'utf8');
  if (page.split(EMPTY_ROOT).length !== 2) fail(`dist/${rel} has no empty #root (drawn already? run \`npm run build\`).`);
  const body = await render(lang);
  if (!body.includes('id="main-content"') || !body.includes('<nav') || !body.includes('<h1')) fail(`the ${lang} page has no navbar, main content or heading`);
  if (DASHES.test(body)) fail(`the ${lang} page contains an em-dash (LT-350)`);
  const words = body.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().length;
  if (words < 2000) fail(`the ${lang} page has only ${words} characters of text`);
  const faq = await faqOf(lang);
  if (faq.length < 5) fail(`the ${lang} page has only ${faq.length} questions`);
  for (const { q, a } of faq) if (!body.includes(esc(q)) || !body.includes(esc(a))) fail(`the ${lang} page does not show the question "${q}" as its FAQ data says`);
  if (page.split('</head>').length !== 2) fail(`dist/${rel} has no single </head>`);
  const url = `https://lightor.app/${lang === DEFAULT_LANG ? '' : `${lang}/`}`;
  const withFaq = page.replace('</head>', () => `    <script type="application/ld+json">${faqData(faq, url)}</script>\n  </head>`);
  pages.push([file, withFaq.replace(EMPTY_ROOT, () => `<div id="root">${body}</div>`), rel, words]);
}
for (const [file, html, rel, words] of pages) {
  writeFileSync(file, html);
  console.log(`  ${rel.padEnd(16)} ${words} characters drawn`);
}
