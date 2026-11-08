/**
 * LT-618: every page of dist/sitemap.xml gets the date its own files last
 * changed in git, so the dates Google and Bing read are true (Google uses
 * lastmod only when it is "consistently and verifiably accurate"; one stale
 * date and the whole file's dates are discounted). Runs inside `npm run
 * build`, after `vite build` copied public/sitemap.xml into dist/ and before
 * the blog adds its own pages (their dates come from each post's front
 * matter).
 *
 * A page whose files git cannot date (no history in the checkout) keeps the
 * date written in public/sitemap.xml; the deploy workflow checks out the
 * whole history (fetch-depth: 0) so that never happens there.
 */
import { execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const FILE = join(ROOT, 'dist', 'sitemap.xml');
const ORIGIN = 'https://lightor.app';

/** What each page is made of. The home pages are the site's code and texts, the blog's own code apart. */
const HOME = ['index.html', 'src', ':(exclude)src/blog', 'vite.config.ts', 'scripts/prerender-home.mjs'];
const SOURCES = {
  '/': HOME,
  '/en/': HOME,
  '/ar/': HOME,
  '/fr/': HOME,
  '/es/': HOME,
  '/pricing.html': ['public/pricing.html'],
  '/support.html': ['public/support.html'],
  '/privacy.html': ['public/privacy.html'],
  '/terms.html': ['public/terms.html'],
  '/refund.html': ['public/refund.html'],
  '/accessibility.html': ['public/accessibility.html'],
};

const fail = (message) => {
  console.error(`✗ sitemap dates: ${message}`);
  process.exit(1);
};

/** The day of the last commit that touched these paths, or null (no git, no history). */
const lastChange = (paths) => {
  try {
    const out = execFileSync('git', ['log', '-1', '--format=%cs', '--', ...paths], { cwd: ROOT, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();
    return /^\d{4}-\d{2}-\d{2}$/.test(out) ? out : null;
  } catch {
    return null;
  }
};

let xml;
try {
  xml = readFileSync(FILE, 'utf8');
} catch {
  fail('dist/sitemap.xml is missing - run `npm run build` (vite first).');
}

const report = [];
for (const [path, paths] of Object.entries(SOURCES)) {
  const loc = `<loc>${ORIGIN}${path}</loc>`;
  if (!xml.includes(loc)) fail(`${ORIGIN}${path} is not in public/sitemap.xml`);
  const date = lastChange(paths);
  if (!date) {
    report.push(`  ${path.padEnd(20)} kept (git has no date for it)`);
    continue;
  }
  const entry = new RegExp(`(${loc.replace(/[.*+?^${}()|[\]\\/]/g, '\\$&')}\\s*)(<lastmod>[^<]*</lastmod>\\s*)?`);
  xml = xml.replace(entry, (_, head) => `${head}<lastmod>${date}</lastmod>\n    `);
  report.push(`  ${path.padEnd(20)} ${date}`);
}
writeFileSync(FILE, xml.replace(/\n {4}\n/g, '\n'));
console.log(`✓ sitemap dates from git:\n${report.join('\n')}`);
