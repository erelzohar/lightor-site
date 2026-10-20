/**
 * LT-430: after a deploy, tell Bing and the other IndexNow engines about the
 * blog pages whose sitemap date is today (Israel time): a new article, the
 * blog index it joined, an updated article. Google does not take IndexNow; it
 * reads the sitemap.
 *
 * The tenant sites already notify through the API (LT-221) with the same
 * public key; lightor.app serves it from public/<key>.txt. Pass URLs as
 * arguments to notify those instead. Always exits 0: a refused notice must
 * never fail a deploy.
 */
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const KEY = '0e6e301d6e2837cf656a5b6321dad7d4';
const HOST = 'lightor.app';
const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');

const todayIL = () => new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Jerusalem' }).format(new Date());

const fromSitemap = () => {
  const xml = readFileSync(join(ROOT, 'dist', 'sitemap.xml'), 'utf8');
  const today = todayIL();
  return [...xml.matchAll(/<url>\s*<loc>([^<]+)<\/loc>\s*<lastmod>([^<]+)<\/lastmod>/g)]
    .filter(([, loc, lastmod]) => loc.startsWith(`https://${HOST}/blog/`) && lastmod === today)
    .map(([, loc]) => loc);
};

const main = async () => {
  const urls = process.argv.length > 2 ? process.argv.slice(2) : fromSitemap();
  if (!urls.length) return console.log('IndexNow: no blog page dated today, nothing to send');

  const keyLocation = `https://${HOST}/${KEY}.txt`;
  const served = await fetch(keyLocation).then((r) => (r.ok ? r.text() : ''), () => '');
  if (served.trim() !== KEY) return console.warn(`IndexNow: ${keyLocation} does not serve the key yet, skipped`);

  const res = await fetch('https://api.indexnow.org/indexnow', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify({ host: HOST, key: KEY, keyLocation, urlList: urls }),
  });
  console.log(`IndexNow: ${res.status} for ${urls.length} URL(s)\n  ${urls.join('\n  ')}`);
  if (!res.ok) console.warn((await res.text()).slice(0, 300));
};

main().catch((error) => console.warn(`IndexNow: not sent (${error})`));
