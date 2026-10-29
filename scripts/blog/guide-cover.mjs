/**
 * LT-430: a guide's cover photo from one of its screenshots, framed on the
 * brand gradient: the screenshot rises from the bottom edge like a window,
 * rounded at the top. Writes the 1600x900 jpg the blog build expects at
 * blog/images/<slug>.jpg.
 *
 *   node scripts/blog/guide-cover.mjs blog/shots/<slug>/<name>.png blog/images/<slug>.jpg
 */
import sharp from 'sharp';

const [input, output] = process.argv.slice(2);
if (!input || !output) {
  console.error('usage: node scripts/blog/guide-cover.mjs <screenshot.png> <cover.jpg>');
  process.exit(1);
}

const W = 1600;
const H = 900;
const SHOT_W = 1360;
const TOP = 110;
const SHOT_H = H - TOP;
const R = 28;

const background = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#6d28d9"/><stop offset="0.55" stop-color="#9333ea"/><stop offset="1" stop-color="#db2777"/>
    </linearGradient>
    <radialGradient id="glow" cx="0.25" cy="0.1" r="0.6">
      <stop offset="0" stop-color="#ffffff" stop-opacity="0.28"/><stop offset="1" stop-color="#ffffff" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#g)"/>
  <rect width="${W}" height="${H}" fill="url(#glow)"/>
</svg>`);

const shadow = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
  <defs><filter id="b" x="-10%" y="-10%" width="120%" height="120%"><feGaussianBlur stdDeviation="22"/></filter></defs>
  <rect x="${(W - SHOT_W) / 2}" y="${TOP + 14}" width="${SHOT_W}" height="${SHOT_H + 60}" rx="${R}" fill="#2e1065" fill-opacity="0.45" filter="url(#b)"/>
</svg>`);

// Rounded at the top only: the bottom runs off the edge.
const mask = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${SHOT_W}" height="${SHOT_H}">
  <rect width="${SHOT_W}" height="${SHOT_H + R}" rx="${R}" fill="#fff"/>
</svg>`);

const shot = await sharp(input)
  .resize(SHOT_W, null)
  .extract({ left: 0, top: 0, width: SHOT_W, height: SHOT_H })
  .composite([{ input: mask, blend: 'dest-in' }])
  .png()
  .toBuffer()
  .catch((error) => {
    console.error(`✗ ${input}: ${error.message} (the screenshot must be at least ${SHOT_W}x${SHOT_H} once scaled to ${SHOT_W} wide)`);
    process.exit(1);
  });

await sharp(background)
  .composite([
    { input: shadow, left: 0, top: 0 },
    { input: shot, left: (W - SHOT_W) / 2, top: TOP },
  ])
  .jpeg({ quality: 88, mozjpeg: true })
  .toFile(output);
console.log(`✓ ${output}`);
