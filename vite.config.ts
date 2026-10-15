import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import { LANGS, DEFAULT_LANG } from './src/i18n/languages';
import { localizeHtml } from './src/i18n/seo';

/**
 * LT-349: one HTML page per language. The built index.html (Hebrew, the root)
 * gets the hreflang links, and a copy goes to dist/<lang>/index.html for every
 * other language with its own title, description, canonical URL, share card
 * and lang/dir: what a search engine reads before any script. nginx serves
 * dist/en/index.html at /en/ on its own (try_files $uri/).
 */
const languagePages = (): Plugin => ({
  name: 'lightor-language-pages',
  apply: 'build',
  enforce: 'post',
  generateBundle(_options, bundle) {
    const page = bundle['index.html'];
    if (page?.type !== 'asset') throw new Error('LT-349: index.html missing from the bundle');
    const built = String(page.source);
    for (const lang of LANGS) {
      const html = localizeHtml(built, lang);
      if (lang === DEFAULT_LANG) page.source = html;
      else this.emitFile({ type: 'asset', fileName: `${lang}/index.html`, source: html });
    }
  },
});

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), languagePages()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
