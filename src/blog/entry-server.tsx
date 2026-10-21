import { StrictMode } from 'react';
import { renderToString } from 'react-dom/server';
import '../i18n';
import BlogApp from './BlogApp';
import type { BlogData } from './types';

/**
 * LT-430: built by `vite build --ssr` into dist-ssr/ and called by
 * scripts/blog/build.mjs, which writes each blog page with this HTML inside
 * #root. The browser's entry (entry-client) renders the same tree over it.
 */
export const render = (data: BlogData, html: string): string =>
  renderToString(
    <StrictMode>
      <BlogApp data={data} html={html} />
    </StrictMode>
  );
