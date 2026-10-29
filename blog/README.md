# The lightor.app blog (LT-430)

Every article is one Markdown file in `blog/posts/`. The blog is part of the
marketing site: its pages are the site's own React code (the same navbar,
footer, dark mode, language and accessibility menus as the home page, see
`src/blog/` and `src/components/SiteShell.tsx`), rendered to HTML when the
site is built, so a search engine reads the whole article without running a
script, and then taken over by the browser.

`npm run build` runs, in order:
1. `vite build` - the site, plus `blog.html`, the shell of every blog page;
2. `vite build --ssr src/blog/entry-server.tsx` - the same blog components,
   for rendering on the build machine (into `dist-ssr/`);
3. `scripts/blog/build.mjs` - reads the articles, checks them, and writes
   - `https://lightor.app/blog/` - the index, newest first
   - `https://lightor.app/blog/<file-name>/` - one page per article (keep the
     trailing slash; nginx 301s the bare URL to it, as it does for `/en/`)

   and adds every URL to `dist/sitemap.xml`. `npm run blog` repeats steps 2-3.

After a deploy, the workflow tells Bing and the other IndexNow engines about
the blog pages dated today (`scripts/blog/indexnow.mjs`); Google reads the
sitemap.

## Adding an article

1. Pick the next unused topic in `blog/topics.md`.
2. Create `blog/posts/<english-words-with-dashes>.md`:

```markdown
---
title: The H1 and the <title>, at most 70 characters, the search phrase near the start
description: 70-165 characters, what the reader gets; Google shows it under the title
date: 2026-10-20
keyword: the search phrase this article answers
tags: קוסמטיקה, תורים
related: other-slug, another-slug
image_alt: what the photo shows, in Hebrew, 15-160 characters
image_credit: Photographer Name / Unsplash
---

Opening paragraph (no "# " heading: the title is the page's heading).

## A section
...
[[cta]]
...
```

Optional fields: `kind: guide` (see "Guides"), `updated: YYYY-MM-DD` (after a real revision), `cta_title`
and `cta_text` (the closing box), `draft: true` (left out of the build),
`featured: true` (pinned to the top of /blog/; the first two pins by date
show there, and with no pins the top shows the newest guide and the newest
article - pins are Erel's call, the recurring task leaves them alone).
`[[cta]]` on its own line puts a short call to action there;
`[[cta: your own sentence]]` changes its sentence. Link other articles as
`/blog/<slug>/` (with the slash), the showcase as `/sites`, pricing as
`/pricing.html`.

3. Add its photo as `blog/images/<the same file name>.jpg` (see "The
   photo" below). The build cuts it into the page's sizes and the share
   preview.
4. `npm run build`. It fails, and writes nothing, when an article has a
   missing field, a title or description out of range, fewer than 800 or more
   than 1,600 words, an em-dash, a link to an article that does not exist, a
   date in the future, the same title/description as another article, or no
   photo (or one smaller than 1200x630, or not landscape).
5. Look at it: `npm run preview`, then `/blog/<slug>/`.
6. Mark the topic as used in `blog/topics.md`, commit, push to main.

## The photo

Every article has one real photo: the cover under the title, the card on
the blog's pages, and the share preview on WhatsApp and Facebook.

- Free licence only, from Unsplash: open
  `https://unsplash.com/s/photos/<english-query>?license=free&orientation=landscape`
  in the browser (its JSON API needs a key). A photo page whose title ends
  "Free Photo on Unsplash" is free; never one marked Unsplash+.
- It shows the article's world: a person at work in a studio, a client with
  a phone, a treatment, products on a table. No brand logos, readable product
  names or app logos; no photo another article already uses.
- Download the 16:9 crop straight into the repo:
  `curl -sf -o blog/images/<slug>.jpg "https://images.unsplash.com/<photo-id>?w=1600&h=900&fit=crop&crop=entropy&q=80&fm=jpg"`
  (`photo-id` is the `photo-...` part of the image address; for people use
  `crop=faces,entropy`). Look at it before committing.
- `image_alt`: what the photo shows, in Hebrew. `image_credit`: the
  photographer's name as Unsplash shows it, then ` / Unsplash`.

## Guides

A guide (`kind: guide`) shows how to do one thing in Lightor itself, as the
product is on the day in `verified: YYYY-MM-DD`. Every step in it was done
in the product and photographed; nothing is written from memory or from the
code alone. Guides may be shorter than articles (450 words or more): the
screenshots carry part of them.

- **Screenshots** go in `blog/shots/<slug>/<name>.png` (PNG, 600-1600 wide)
  and into the text on a line of their own:
  `![what it shows, in Hebrew](shots/<name>.png "short caption")`.
  The build turns each into a figure that opens full size when tapped.
- **Cover:** `node scripts/blog/guide-cover.mjs blog/shots/<slug>/<name>.png blog/images/<slug>.jpg`
  frames one screenshot on the brand gradient; `image_credit: מסך מתוך Lightor`.
- **Made in batches** by a session that runs the whole product locally with
  nothing sent: the API from a lightor-back worktree with
  `scripts/qa/outbox.js` (see the header of `scripts/qa/lib.js`), its own
  Redis, the dashboard, register and front dev servers (`VITE_CLIENT_APP_URL`
  pointing the editor and the wizard at the local front, Cloudflare's test
  Turnstile key, a dummy `VITE_GOOGLE_CLIENT_ID`), and headless Chrome
  (Playwright) at 2x for the screenshots. The demo site of the first batch is
  "סטודיו אורה" (`studio-ora`, owner `guide.ora.mvtubzjz@example.com` in
  Lightor-test); reuse it so the guides look alike. Never use a real
  customer's site or a production account.
- **Ready guides wait** with `draft: true` under "Guides ready" in
  `blog/topics.md`; the recurring task publishes them in turn with articles. A
  link from a published article to a draft shows as plain text until the
  draft is live, so guides can link to each other ahead of time.
- **Screenshot tips** from the second batch: element screenshots inside the
  dashboard's scroll container come out blank, so use a tall viewport
  (2300-3000) and crop; hide the site's floating buttons before shooting;
  a modal is `[role=dialog]:visible` (hidden ones stay in the page).
- **When the product changes,** a guide whose steps changed is re-done in the
  product (screenshots too) and gets a new `verified` date, or is taken down.

## Writing rules

- **Answer one real search.** Use the phrasing people type (Google
  autocomplete, Bing's related searches). One article per question; no two
  articles chasing the same phrase.
- **Be useful first.** Concrete steps, checklists, examples, ready-to-copy
  texts. A reader who never signs up should still leave with something.
  No filler, no generic intros ("in today's digital world").
- **Lightor appears naturally**, usually in one section near the end ("how it
  works in Lightor") plus the `[[cta]]` and the closing box. Never claim a
  feature that is not in `blog/FACTS.md`; when in doubt, check the code and
  update FACTS.md, or leave it out. Say plainly what Lightor does not do when
  the reader would otherwise assume it does (deposits, own domain).
- **Never promise results**: no "first page on Google", no "zero
  cancellations". No invented statistics or quotes. No medical claims.
- **Hebrew, plural address** ("אתם", "לכם"), short sentences, plain words.
  Product names stay as written: Lighty, Lightor+, SMS.
- **Plain "-" only, never an em-dash** (LT-350). The build rejects one.
- **800-1,300 words** is the target (Hebrew is compact; the build allows up to
  1,600).
- **Link**: 1-3 related articles, `/sites`, and `/pricing.html` when plans are
  mentioned.
- Do not name or criticise competitors.
