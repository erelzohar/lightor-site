import { StrictMode } from 'react';
import { hydrateRoot } from 'react-dom/client';
import '../i18n';
import '../index.css';
import './blog.css';
import BlogApp from './BlogApp';
import { BODY_ATTR, DATA_ID, type BlogData } from './types';
import { applyA11yPrefs } from '../services/a11yPrefs';

// LT-357: the visitor's accessibility choices are on <html> before React runs.
applyA11yPrefs();

/**
 * LT-430: the page arrives already drawn (scripts/blog/build.mjs). React takes
 * it over in place: the page's facts come from the JSON beside it, and the
 * article's text from the page itself, so it is never sent twice.
 */
const data = JSON.parse(document.getElementById(DATA_ID)?.textContent || '{}') as BlogData;
const html = document.querySelector(`[${BODY_ATTR}]`)?.innerHTML ?? '';

hydrateRoot(
  document.getElementById('root')!,
  <StrictMode>
    <BlogApp data={data} html={html} />
  </StrictMode>
);
