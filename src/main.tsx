import { StrictMode } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { applyA11yPrefs } from './services/a11yPrefs';

// LT-357: the visitor's accessibility choices are on <html> before the first paint.
applyA11yPrefs();

const root = document.getElementById('root')!;
const app = (
  <StrictMode>
    <App />
  </StrictMode>
);
// LT-579: the built page arrives drawn (scripts/prerender-home.mjs); the dev
// server's does not.
if (root.firstElementChild) hydrateRoot(root, app);
else createRoot(root).render(app);
