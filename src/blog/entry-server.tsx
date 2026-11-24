import { StrictMode } from 'react';
import { renderToString } from 'react-dom/server';
import i18n from '../i18n';
import BlogApp from './BlogApp';
import type { BlogData } from './types';
import { SITES } from '../components/showcaseSites';

/**
 * LT-430: built by `vite build --ssr` into dist-ssr/ and called by
 * scripts/blog/build.mjs, which writes each blog page with this HTML inside
 * #root. The browser's entry (entry-client) renders the same tree over it.
 * LT-715: in the page's language (the navbar and the footer follow it), as
 * the browser reads it from the page's address.
 */
export const render = async (data: BlogData, html: string): Promise<string> => {
  await i18n.changeLanguage(data.lang ?? 'he');
  return renderToString(
    <StrictMode>
      <BlogApp data={data} html={html} />
    </StrictMode>
  );
};

/**
 * LT-698: the Hebrew showcase sites a landing page may show (its `shots`),
 * so scripts/blog/build.mjs refuses one the page could not draw.
 */
export const showcaseSites = (): { sub: string; name: string }[] => SITES.he.map(({ sub, name }) => ({ sub, name }));
