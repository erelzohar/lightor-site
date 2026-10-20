/**
 * LT-430: the blog's page shell. Plain static HTML, so a crawler reads the
 * whole article without running a script; the only script is the
 * accessibility menu, the same choices (and the same stored preferences,
 * `lt-a11y`) as the menu on the rest of lightor.app (LT-357).
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

const CSS = `
:root{--violet:#6d28d9;--violet-2:#7c3aed;--violet-soft:#f5f3ff;--violet-line:#ddd6fe;--ink:#111827;--text:#1f2937;--muted:#4b5563;--line:#e5e7eb;--bg:#fff;--surface:#f9fafb}
*{box-sizing:border-box;margin:0;padding:0}
html{-webkit-text-size-adjust:100%;text-size-adjust:100%}
body{font-family:Assistant,system-ui,-apple-system,"Segoe UI",Arial,sans-serif;color:var(--text);background:var(--bg);line-height:1.75;overflow-x:hidden}
img{max-width:100%;height:auto}
a{color:var(--violet)}
:focus-visible{outline:3px solid var(--violet);outline-offset:2px;border-radius:4px}
.skip{position:absolute;top:.75rem;inset-inline-start:-100vw;z-index:60;background:#fff;color:var(--ink);padding:.6rem 1rem;border-radius:.75rem;box-shadow:0 8px 30px rgba(0,0,0,.15)}
.skip:focus{inset-inline-start:.75rem}
.top{position:sticky;top:0;z-index:40;background:#fff;border-bottom:1px solid var(--line)}
.top-in{position:relative;max-width:72rem;margin:0 auto;padding:.7rem 1rem;display:flex;align-items:center;gap:1rem}
.brand{display:inline-flex;align-items:center;gap:.6rem;text-decoration:none;color:var(--ink);font-weight:700;font-size:1.25rem;line-height:1}
.brand img{width:2.25rem;height:2.25rem;border-radius:.75rem;flex:none}
.nav{display:flex;gap:1.25rem;margin-inline-start:1rem}
.nav a{color:var(--text);text-decoration:none;font-weight:600}
.nav a:hover,.nav a[aria-current]{color:var(--violet)}
.top-end{margin-inline-start:auto;display:flex;align-items:center;gap:.5rem}
.icon-btn{display:inline-flex;align-items:center;justify-content:center;width:2.75rem;height:2.75rem;border:0;border-radius:.75rem;background:transparent;color:var(--ink);cursor:pointer}
.icon-btn:hover{background:#f3f4f6}
.icon-btn svg{width:1.5rem;height:1.5rem}
.btn{display:inline-flex;align-items:center;justify-content:center;background:var(--violet);color:#fff;font-weight:700;text-decoration:none;padding:.65rem 1.25rem;border-radius:999px;line-height:1.3;text-align:center}
.btn:hover{background:#5b21b6}
.wrap{max-width:46rem;margin:0 auto;padding:2rem 1rem 3rem}
.crumbs{font-size:.95rem;color:var(--muted);margin-bottom:1rem}
.crumbs a{color:var(--muted)}
.crumbs span[aria-hidden]{margin:0 .4rem}
h1{font-size:2.5rem;line-height:1.2;color:var(--ink);font-weight:800}
.meta{color:var(--muted);margin-top:.75rem;font-size:.95rem}
.intro{font-size:1.2rem;color:var(--muted);margin-top:1rem}
.toc{background:var(--surface);border:1px solid var(--line);border-radius:1rem;padding:1rem 1.25rem;margin:1.75rem 0 .5rem}
.toc h2{font-size:1rem;color:var(--ink);margin-bottom:.4rem}
.toc ol{padding-inline-start:1.25rem}
.toc li{margin:.2rem 0}
.prose{font-size:1.125rem;margin-top:1.75rem}
.prose h2{font-size:1.65rem;line-height:1.3;color:var(--ink);margin:2.5rem 0 .75rem;scroll-margin-top:5.5rem}
.prose h3{font-size:1.25rem;line-height:1.4;color:var(--ink);margin:1.75rem 0 .5rem;scroll-margin-top:5.5rem}
.prose p{margin:0 0 1.1rem}
.prose ul,.prose ol{margin:0 0 1.2rem;padding-inline-start:1.5rem}
.prose li{margin-bottom:.45rem}
.prose li>ul,.prose li>ol{margin:.4rem 0 0}
.prose strong{color:var(--ink)}
.prose blockquote{border-inline-start:4px solid var(--violet-2);background:var(--violet-soft);padding:1rem 1.25rem;border-radius:.75rem;margin:1.5rem 0}
.prose blockquote p:last-child{margin:0}
.prose .table{overflow-x:auto;margin:1.5rem 0}
.prose table{border-collapse:collapse;width:100%;font-size:1rem}
.prose th,.prose td{border:1px solid var(--line);padding:.6rem .75rem;text-align:start;vertical-align:top}
.prose th{background:var(--surface);color:var(--ink)}
.prose hr{border:0;border-top:1px solid var(--line);margin:2rem 0}
.cta-inline{display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:.75rem 1rem;border:1px solid var(--violet-line);background:var(--violet-soft);border-radius:1rem;padding:1rem 1.25rem;margin:2rem 0}
.cta-inline p{margin:0;font-weight:600;color:var(--ink);flex:1 1 16rem}
.cta{display:flex;gap:1.5rem;align-items:center;background:linear-gradient(135deg,#5b21b6,#6d28d9 50%,#7c3aed);color:#fff;border-radius:1.5rem;padding:1.75rem;margin-top:3rem}
.cta img{width:8rem;height:8rem;flex:none}
.cta h2{color:#fff;font-size:1.6rem;line-height:1.3;margin:0 0 .5rem}
.cta p{color:#fff;margin:0 0 1.1rem;font-size:1.05rem}
.cta .btn{background:#fff;color:#4c1d95}
.cta .btn:hover{background:#ede9fe}
.cta .more{display:inline-block;color:#fff;font-weight:600;margin-inline-start:1rem}
.cta-actions{display:flex;flex-wrap:wrap;align-items:center;gap:.75rem 0}
.related{max-width:72rem;margin:0 auto;padding:1rem 1rem 4rem}
.related h2,.list h2{font-size:1.5rem;color:var(--ink);margin-bottom:1rem}
.cards{display:grid;gap:1rem;grid-template-columns:repeat(auto-fill,minmax(17rem,1fr));list-style:none}
.card{display:flex;flex-direction:column;height:100%;border:1px solid var(--line);border-radius:1.25rem;padding:1.25rem;text-decoration:none;color:var(--text);background:#fff;transition:border-color .2s,box-shadow .2s}
.card:hover{border-color:#c4b5fd;box-shadow:0 8px 30px rgba(0,0,0,.06)}
.card h3{color:var(--ink);font-size:1.2rem;line-height:1.35;margin-bottom:.4rem}
.card p{color:var(--muted);font-size:1rem;flex:1}
.card .when{display:block;color:var(--muted);font-size:.9rem;margin-top:.75rem}
.hero{max-width:72rem;margin:0 auto;padding:2.5rem 1rem 1.5rem}
.hero p{font-size:1.2rem;color:var(--muted);margin-top:.75rem;max-width:44rem}
.list{max-width:72rem;margin:0 auto;padding:1rem 1rem 2rem}
.list-cta{max-width:72rem;margin:0 auto;padding:0 1rem 4rem}
.foot{background:#000;color:#fff}
.foot-in{max-width:72rem;margin:0 auto;padding:3rem 1rem 2rem}
.foot .brand{color:#fff}
.foot p{color:#d1d5db;margin-top:.75rem}
.foot ul{list-style:none;display:flex;flex-wrap:wrap;gap:.5rem 1.5rem;margin-top:1.5rem}
.foot a{color:#d1d5db;text-decoration:none}
.foot a:hover{color:#fff;text-decoration:underline}
.foot .copy{border-top:1px solid rgba(255,255,255,.14);margin-top:2rem;padding-top:1.5rem;font-size:.9rem;text-align:center;color:#9ca3af}
.a11y-panel{position:absolute;inset-inline-end:1rem;top:calc(100% + .5rem);width:min(20rem,calc(100vw - 2rem));max-height:calc(100svh - 6rem);overflow-y:auto;background:#fff;color:var(--ink);border:1px solid var(--line);border-radius:1rem;box-shadow:0 20px 50px rgba(0,0,0,.18);padding:1rem;z-index:50;font-size:1rem;line-height:1.4}
.a11y-panel[hidden]{display:none}
.a11y-head{display:flex;align-items:center;justify-content:space-between;gap:.5rem;margin-bottom:.75rem}
.a11y-head h2{font-size:1.1rem;font-weight:700}
.a11y-size{display:flex;align-items:center;justify-content:space-between;gap:.5rem;background:#f3f4f6;border-radius:.75rem;padding:.5rem;margin-bottom:.75rem}
.a11y-size button{width:2.5rem;height:2.5rem;border:0;border-radius:.5rem;background:#fff;color:var(--ink);font-size:1.25rem;font-weight:700;cursor:pointer}
.a11y-size button:disabled{opacity:.4;cursor:default}
.a11y-grid{display:grid;grid-template-columns:1fr 1fr;gap:.5rem;margin-bottom:.75rem}
.a11y-grid button{position:relative;min-height:3.25rem;border:2px solid transparent;border-radius:.75rem;background:#f3f4f6;color:var(--ink);font:inherit;font-weight:600;padding:.5rem;cursor:pointer}
.a11y-grid button[aria-pressed="true"]{border-color:#6d28d9;background:#f5f3ff}
.a11y-grid button[aria-pressed="true"]::after{content:"\\2713";position:absolute;top:.2rem;inset-inline-end:.4rem;color:#6d28d9;font-size:.9rem}
.a11y-grid button:disabled{opacity:.4;cursor:default}
.a11y-panel>a{display:block;text-align:center;font-size:.95rem;padding:.25rem 0;text-decoration:underline}
@media (max-width:719px){.nav{display:none}h1{font-size:2rem}.prose h2{font-size:1.45rem}.hero{padding-top:1.75rem}}
@media (max-width:560px){.cta{flex-direction:column;text-align:center;padding:1.5rem 1.25rem}.cta img{width:6.5rem;height:6.5rem}.cta-actions{justify-content:center}.cta .more{margin:0 .75rem}.top .btn{padding:.55rem .9rem;font-size:.95rem}}
@media (max-width:379px){.brand span{display:none}}
html.a11y-text-1{font-size:115%!important}
html.a11y-text-2{font-size:130%!important}
html.a11y-text-3{font-size:150%!important}
html:is(.a11y-text-1,.a11y-text-2,.a11y-text-3,.a11y-spacing) body *{overflow-wrap:break-word}
html:is(.a11y-text-1,.a11y-text-2,.a11y-text-3,.a11y-spacing) .nav{display:none}
@media (max-width:479px){html:is(.a11y-text-2,.a11y-text-3) .brand span{display:none}}
html.a11y-contrast{--ink:#000;--text:#000;--muted:#000;--violet:#4c1d95;--line:#4b5563;--violet-line:#4c1d95}
html.a11y-contrast .cta{background:#3b0764}
html.a11y-contrast .foot :is(p,a,.copy){color:#fff}
html.a11y-links a[href]{text-decoration:underline!important;text-decoration-thickness:2px!important;text-underline-offset:.2em;outline:2px dashed currentColor;outline-offset:2px}
html.a11y-links :focus-visible{outline:3px solid #6d28d9!important;outline-offset:3px!important}
html.a11y-font *{font-family:Arial,Assistant,sans-serif!important;font-style:normal!important}
html.a11y-spacing body *{line-height:1.6!important;letter-spacing:.06em!important;word-spacing:.16em!important}
html.a11y-still *,html.a11y-still *::before,html.a11y-still *::after{animation-duration:.01ms!important;animation-iteration-count:1!important;animation-delay:0s!important;transition-duration:.01ms!important;transition-delay:0s!important;scroll-behavior:auto!important}
@media (prefers-reduced-motion:reduce){*,*::before,*::after{transition-duration:.01ms!important;scroll-behavior:auto!important}}
`
  .trim()
  .replace(/\n/g, '');

/** Applied in <head>, before the first paint: a stored choice never flashes in late. */
const A11Y_EARLY = `try{var j=JSON.parse(localStorage.getItem('lt-a11y')||'null');if(j){var c=document.documentElement.classList;if([1,2,3].indexOf(j.text)>-1)c.add('a11y-text-'+j.text);['contrast','links','font','spacing','still'].forEach(function(k){if(j[k]===true)c.add('a11y-'+k)})}}catch(e){}`;

/**
 * The menu itself: the same choices as src/services/a11yPrefs.ts, stored the
 * same way, so a choice made on the home page holds here too.
 */
const A11Y_MENU = `(function(){
var KEY='lt-a11y',BOOLS=['contrast','links','font','spacing','still'],SCALE=[100,115,130,150];
var root=document.documentElement,btn=document.getElementById('a11y-btn'),panel=document.getElementById('a11y-panel');
if(!btn||!panel)return;
function read(){try{var j=JSON.parse(localStorage.getItem(KEY)||'null')||{},p={text:[0,1,2,3].indexOf(j.text)>-1?j.text:0};BOOLS.forEach(function(k){p[k]=j[k]===true});return p}catch(e){return{text:0,contrast:false,links:false,font:false,spacing:false,still:false}}}
var p=read();
function custom(){return p.text!==0||BOOLS.some(function(k){return p[k]})}
function sync(){
[1,2,3].forEach(function(n){root.classList.toggle('a11y-text-'+n,p.text===n)});
BOOLS.forEach(function(k){root.classList.toggle('a11y-'+k,p[k])});
panel.querySelector('[data-size]').textContent=SCALE[p.text]+'%';
panel.querySelector('[data-step="-1"]').disabled=p.text===0;
panel.querySelector('[data-step="1"]').disabled=p.text===3;
BOOLS.forEach(function(k){panel.querySelector('[data-toggle="'+k+'"]').setAttribute('aria-pressed',String(p[k]))});
panel.querySelector('[data-reset]').disabled=!custom();
}
function save(){try{if(custom())localStorage.setItem(KEY,JSON.stringify(p));else localStorage.removeItem(KEY)}catch(e){}sync()}
function open(){panel.hidden=false;btn.setAttribute('aria-expanded','true');panel.focus()}
function close(back){panel.hidden=true;btn.setAttribute('aria-expanded','false');if(back)btn.focus()}
btn.addEventListener('click',function(){panel.hidden?open():close(false)});
panel.addEventListener('click',function(e){
var t=e.target.closest('button');if(!t)return;
if(t.hasAttribute('data-close'))return close(true);
if(t.hasAttribute('data-step')){p.text=Math.min(3,Math.max(0,p.text+Number(t.getAttribute('data-step'))));return save()}
if(t.hasAttribute('data-toggle')){var k=t.getAttribute('data-toggle');p[k]=!p[k];return save()}
if(t.hasAttribute('data-reset')){p={text:0,contrast:false,links:false,font:false,spacing:false,still:false};save()}
});
document.addEventListener('keydown',function(e){if(e.key==='Escape'&&!panel.hidden)close(true)});
document.addEventListener('pointerdown',function(e){if(!panel.hidden&&!panel.contains(e.target)&&!btn.contains(e.target))close(false)});
sync();
})();`;

const ICON_A11Y =
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="16" cy="4" r="1"/><path d="m18 19 1-7-6 1"/><path d="m5 8 3-3 5.5 3-2.36 3.5"/><path d="M4.24 14.5a5 5 0 0 0 6.88 6"/><path d="M13.76 17.5a5 5 0 0 0-6.88-6"/></svg>';

const a11yMenu = () => `
      <button type="button" class="icon-btn" id="a11y-btn" aria-label="תפריט נגישות" aria-expanded="false" aria-controls="a11y-panel">${ICON_A11Y}</button>
      <div class="a11y-panel" id="a11y-panel" role="dialog" aria-labelledby="a11y-title" tabindex="-1" hidden>
        <div class="a11y-head"><h2 id="a11y-title">נגישות</h2><button type="button" class="icon-btn" data-close aria-label="סגירה">&#x2715;</button></div>
        <div class="a11y-size" role="group" aria-label="גודל טקסט">
          <button type="button" data-step="-1" aria-label="הקטנת טקסט">&#x2212;</button>
          <span aria-live="polite">גודל טקסט <bdi data-size>100%</bdi></span>
          <button type="button" data-step="1" aria-label="הגדלת טקסט">+</button>
        </div>
        <div class="a11y-grid">
          <button type="button" data-toggle="contrast" aria-pressed="false">ניגודיות גבוהה</button>
          <button type="button" data-toggle="links" aria-pressed="false">הדגשת קישורים</button>
          <button type="button" data-toggle="font" aria-pressed="false">גופן קריא</button>
          <button type="button" data-toggle="spacing" aria-pressed="false">ריווח טקסט</button>
          <button type="button" data-toggle="still" aria-pressed="false">עצירת אנימציות</button>
          <button type="button" data-reset>איפוס</button>
        </div>
        <a href="/accessibility.html">הצהרת נגישות</a>
      </div>`;

const header = (current) => `
  <a class="skip" href="#main">דילוג לתוכן</a>
  <header class="top">
    <div class="top-in">
      <a class="brand" href="/" aria-label="לייטור - לעמוד הבית"><img src="/lightor-logo.webp" alt="" width="36" height="36" /><span>Lightor</span></a>
      <nav class="nav" aria-label="ניווט ראשי">
        <a href="/blog/"${current === 'blog' ? ' aria-current="page"' : ''}>בלוג</a>
        <a href="/sites">אתרים שנבנו</a>
        <a href="/pricing.html">מחירים</a>
      </nav>
      <div class="top-end">${a11yMenu()}
        <a class="btn" href="${REGISTER_URL}">התחלה בחינם</a>
      </div>
    </div>
  </header>`;

const footer = () => `
  <footer class="foot">
    <div class="foot-in">
      <a class="brand" href="/"><img src="/lightor-logo.webp" alt="" width="36" height="36" /><span>Lightor</span></a>
      <p>אתר לעסק, לאירוע או לכל רעיון - בשיחה עם Lighty.</p>
      <nav aria-label="קישורים">
        <ul>
          <li><a href="/blog/">בלוג</a></li>
          <li><a href="/sites">אתרים שנבנו עם לייטור</a></li>
          <li><a href="${REGISTER_URL}">התחלה בחינם</a></li>
          <li><a href="/pricing.html">מחירים</a></li>
          <li><a href="/support.html">תמיכה</a></li>
          <li><a href="/privacy.html">מדיניות פרטיות</a></li>
          <li><a href="/terms.html">תנאי שימוש</a></li>
          <li><a href="/accessibility.html">הצהרת נגישות</a></li>
        </ul>
      </nav>
      <p class="copy">© 2026 לייטור. כל הזכויות שמורות.</p>
    </div>
  </footer>`;

const shell = ({ head, body, current }) => `<!DOCTYPE html>
<html lang="he" dir="rtl">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <script>${A11Y_EARLY}</script>
${head}
  <link rel="icon" type="image/png" sizes="192x192" href="/lightor192.png" />
  <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
  <meta name="theme-color" content="#ffffff" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Assistant:wght@400;600;700;800&display=swap" rel="stylesheet" />
  <style>${CSS}</style>
</head>
<body>${header(current)}
${body}
${footer()}
  <script>${A11Y_MENU}</script>
</body>
</html>
`;

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

const card = (post) => `
      <li><a class="card" href="${post.path}">
        <h3>${esc(post.title)}</h3>
        <p>${esc(post.description)}</p>
        <span class="when"><time datetime="${post.date}">${heDate(post.date)}</time> · ${post.minutes} דקות קריאה</span>
      </a></li>`;

/** The closing call to action every article ends with. */
const ctaBox = (post) => `
      <aside class="cta" aria-labelledby="cta-title">
        <img src="/lighty-cheer.webp" alt="" width="128" height="128" loading="lazy" />
        <div>
          <h2 id="cta-title">${esc(post.ctaTitle || 'האתר שלכם, תוך 60 שניות')}</h2>
          <p>${esc(post.ctaText || 'מספרים ל-Lighty על העסק במילים פשוטות, והוא בונה את האתר - עם קביעת תורים או טופס לידים, תזכורות ללקוחות וכתובת משלכם. ללא אשראי וללא התחייבות.')}</p>
          <div class="cta-actions">
            <a class="btn" href="${REGISTER_URL}">לבניית האתר שלי - בחינם</a>
            <a class="more" href="/sites">לראות אתרים שנבנו</a>
          </div>
        </div>
      </aside>`;

/** `[[cta]]` on its own line in an article: a short invitation mid-way. */
export const inlineCta = (text) => `
<div class="cta-inline">
  <p>${esc(text || 'רוצים לראות איך זה נראה אצלכם? Lighty בונה לכם אתר בכמה דקות, בחינם.')}</p>
  <a class="btn" href="${REGISTER_URL}">לבניית האתר שלי - בחינם</a>
</div>`;

export const articlePage = (post, related) => {
  const url = `${ORIGIN}${post.path}`;
  const image = post.image || DEFAULT_IMAGE;
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
    image: [image.url],
    wordCount: post.words,
    ...(post.keyword ? { keywords: post.keyword } : {}),
    isPartOf: { '@type': 'Blog', name: BLOG_NAME, url: `${ORIGIN}/blog/` },
  };
  const head = `  <title>${esc(post.title)} | לייטור</title>
  <meta name="description" content="${esc(post.description)}" />${socialMeta({ url, title: post.title, description: post.description, type: 'article', image, imageAlt: post.imageAlt || DEFAULT_IMAGE_ALT })}
  <meta property="article:published_time" content="${post.date}" />
  <meta property="article:modified_time" content="${post.updated || post.date}" />
  <script type="application/ld+json">${ld(article)}</script>
  <script type="application/ld+json">${ld(crumbsLd([['לייטור', `${ORIGIN}/`], ['בלוג', `${ORIGIN}/blog/`], [post.title, url]]))}</script>`;

  const toc = post.headings.length >= 4
    ? `
      <nav class="toc" aria-labelledby="toc-title">
        <h2 id="toc-title">בכתבה</h2>
        <ol>${post.headings.map((h) => `<li><a href="#${h.id}">${h.html}</a></li>`).join('')}</ol>
      </nav>`
    : '';

  const body = `
  <main id="main">
    <article class="wrap">
      <nav class="crumbs" aria-label="פירורי לחם"><a href="/">לייטור</a><span aria-hidden="true">/</span><a href="/blog/">בלוג</a></nav>
      <h1>${esc(post.title)}</h1>
      <p class="meta"><time datetime="${post.date}">${heDate(post.date)}</time>${post.updated ? ` · עודכן <time datetime="${post.updated}">${heDate(post.updated)}</time>` : ''} · ${post.minutes} דקות קריאה</p>${toc}
      <div class="prose">
${post.html}
      </div>${ctaBox(post)}
    </article>${related.length ? `
    <section class="related" aria-labelledby="related-title">
      <h2 id="related-title">עוד בבלוג</h2>
      <ul class="cards">${related.map(card).join('')}
      </ul>
    </section>` : ''}
  </main>`;
  return shell({ head, body, current: 'article' });
};

export const INDEX_TITLE = 'הבלוג של לייטור - מדריכים לבניית אתר, תורים ולידים';
export const INDEX_DESCRIPTION =
  'מדריכים קצרים ומעשיים לבעלי עסקים קטנים: איך בונים אתר, מקבלים תורים ולידים אונליין, שולחים תזכורות ללקוחות ומופיעים בגוגל.';

export const indexPage = (posts) => {
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
  const head = `  <title>${esc(INDEX_TITLE)}</title>
  <meta name="description" content="${esc(INDEX_DESCRIPTION)}" />${socialMeta({ url, title: INDEX_TITLE, description: INDEX_DESCRIPTION, type: 'website', image: DEFAULT_IMAGE, imageAlt: DEFAULT_IMAGE_ALT })}
  <script type="application/ld+json">${ld(blog)}</script>
  <script type="application/ld+json">${ld(crumbsLd([['לייטור', `${ORIGIN}/`], ['בלוג', url]]))}</script>`;
  const body = `
  <main id="main">
    <div class="hero">
      <nav class="crumbs" aria-label="פירורי לחם"><a href="/">לייטור</a><span aria-hidden="true">/</span>בלוג</nav>
      <h1>${BLOG_NAME}</h1>
      <p>${esc(INDEX_DESCRIPTION)}</p>
    </div>
    <section class="list" aria-labelledby="list-title">
      <h2 id="list-title">כל הכתבות</h2>
      <ul class="cards">${posts.map(card).join('')}
      </ul>
    </section>
    <div class="list-cta">${ctaBox({})}
    </div>
  </main>`;
  return shell({ head, body, current: 'blog' });
};
