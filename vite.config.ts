import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import { LANGS, DEFAULT_LANG } from './src/i18n/languages';
import { localizeHtml } from './src/i18n/seo';
import { linkedBlogLanguages } from './scripts/blog/languages.mjs';

/**
 * LT-715: the languages whose blog the navbar, the footer and the crawlable
 * summary link: those with at least three published posts. The code reads the
 * list as `__LT_BLOG_LANGS__` (src/lib/siteLinks.ts).
 */
const BLOG_LANGS = linkedBlogLanguages();

/**
 * LT-349: one HTML page per language. The built index.html (Hebrew, the root)
 * gets the hreflang links, and a copy goes to dist/<lang>/index.html for every
 * other language with its own title, description, canonical URL, share card
 * and lang/dir: what a search engine reads before any script. nginx serves
 * dist/en/index.html at /en/ on its own (try_files $uri/).
 */
const languagePages = (): Plugin => ({
  name: 'lightor-language-pages',
  // Not in the blog's server-side build (LT-430), which has no index.html.
  apply: (_config, env) => env.command === 'build' && !env.isSsrBuild,
  enforce: 'post',
  generateBundle(_options, bundle) {
    const page = bundle['index.html'];
    if (page?.type !== 'asset') throw new Error('LT-349: index.html missing from the bundle');
    const built = String(page.source);
    for (const lang of LANGS) {
      const html = localizeHtml(built, lang, BLOG_LANGS);
      if (lang === DEFAULT_LANG) page.source = html;
      else this.emitFile({ type: 'asset', fileName: `${lang}/index.html`, source: html });
    }
  },
});

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), languagePages()],
  define: {
    __LT_BLOG_LANGS__: JSON.stringify(BLOG_LANGS),
  },
  build: {
    rollupOptions: {
      // LT-430: blog.html is the shell scripts/blog/build.mjs fills for every
      // blog page; `vite build --ssr src/blog/entry-server.tsx` replaces this
      // input with its own entry.
      input: { main: 'index.html', blog: 'blog.html' },
    },
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
