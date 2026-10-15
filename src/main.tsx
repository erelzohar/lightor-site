import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { applyA11yPrefs } from './services/a11yPrefs';

// LT-357: the visitor's accessibility choices are on <html> before the first paint.
applyA11yPrefs();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
