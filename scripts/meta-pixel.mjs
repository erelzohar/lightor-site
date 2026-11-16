/**
 * LT-674: the pixel's id goes into dist/meta-pixel.js at build time, from
 * VITE_META_PIXEL_ID in .env.production (a public id; every visitor's browser
 * sees it). No id in the build: the placeholder is emptied and the script
 * stays idle, so a page never loads a broken pixel.
 *
 * The check at the end is the one that matters: every page meant to carry the
 * pixel does, and the pages that must not (the legal pages) do not.
 */
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { loadEnv } from 'vite';

const FILE = 'dist/meta-pixel.js';
const PLACEHOLDER = '%VITE_META_PIXEL_ID%';
const TAG = '<script src="/meta-pixel.js" defer></script>';

// Pages a visitor from an ad may land on or browse: the home page in every
// language, the pricing page, the blog. Not the legal and support pages.
const WITH_PIXEL = ['dist/index.html', 'dist/en/index.html', 'dist/pricing.html'];
const WITHOUT_PIXEL = ['dist/privacy.html', 'dist/terms.html', 'dist/data-deletion.html'];

const id = (loadEnv('production', process.cwd(), '').VITE_META_PIXEL_ID ?? '').trim();
if (id && !/^\d+$/.test(id)) {
  throw new Error(`LT-674: VITE_META_PIXEL_ID must be digits only, got "${id}"`);
}

const source = readFileSync(FILE, 'utf8');
if (!source.includes(PLACEHOLDER)) {
  throw new Error(`LT-674: ${FILE} has no ${PLACEHOLDER} to fill`);
}
writeFileSync(FILE, source.replace(PLACEHOLDER, id));

for (const page of WITH_PIXEL) {
  if (!existsSync(page) || !readFileSync(page, 'utf8').includes(TAG)) {
    throw new Error(`LT-674: ${page} does not load /meta-pixel.js`);
  }
}
for (const page of WITHOUT_PIXEL) {
  if (existsSync(page) && readFileSync(page, 'utf8').includes('meta-pixel.js')) {
    throw new Error(`LT-674: ${page} must not load the pixel`);
  }
}

console.log(id ? 'meta pixel: id set in dist/meta-pixel.js' : 'meta pixel: no id in this build, the script stays idle');
