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
---

Opening paragraph (no "# " heading: the title is the page's heading).

## A section
...
[[cta]]
...
```

Optional fields: `updated: YYYY-MM-DD` (after a real revision), `cta_title`
and `cta_text` (the closing box), `draft: true` (left out of the build).
`[[cta]]` on its own line puts a short call to action there;
`[[cta: your own sentence]]` changes its sentence. Link other articles as
`/blog/<slug>/` (with the slash), the showcase as `/sites`, pricing as
`/pricing.html`.

3. `npm run build`. It fails, and writes nothing, when an article has a
   missing field, a title or description out of range, fewer than 800 or more
   than 1,600 words, an em-dash, a link to an article that does not exist, a
   date in the future, or the same title/description as another article.
4. Look at it: `npm run preview`, then `/blog/<slug>/`.
5. Mark the topic as used in `blog/topics.md`, commit, push to main.

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
