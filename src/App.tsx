import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import SiteKinds from './components/SiteKinds';
import LightySection from './components/LightySection';
import Features from './components/Features';
import HowItWorks from './components/HowItWorks';
import Showcase from './components/Showcase';
import Contact from './components/Contact';
import Footer from './components/Footer';
import './i18n';
import { isRtl } from './i18n/languages';

function App() {
  const { i18n } = useTranslation();
  const [darkMode, setDarkMode] = React.useState(false);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark');
    // Update theme-color meta tag
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', !darkMode ? '#000000' : '#ffffff');
    }
  };

  React.useEffect(() => {
    document.documentElement.dir = isRtl(i18n.language) ? 'rtl' : 'ltr';
    document.documentElement.lang = i18n.language;
  }, [i18n.language]);

  // LT-263: an address like lightor.app/#lighty (the /sites page links here)
  // lands on its section. The browser looks for the section while the page
  // is still loading, before React has drawn it, and then gives up.
  React.useEffect(() => {
    // A malformed escape (lightor.app/#%E0, #50%) makes decodeURIComponent
    // throw, and with no error boundary above App that blanked the whole page
    // (LT-315). Such a hash names no section anyway: just stay at the top.
    let id: string;
    try {
      id = decodeURIComponent(window.location.hash.slice(1));
    } catch {
      return;
    }
    if (!id) return;
    const frame = requestAnimationFrame(() => document.getElementById(id)?.scrollIntoView({ block: 'start' }));
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <BrowserRouter>
      <div className={`min-h-screen ${darkMode ? 'dark' : ''}`}>
        <div className="bg-white dark:bg-primary transition-colors duration-200">
          <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:p-4 focus:bg-white dark:focus:bg-black focus:text-black dark:focus:text-white">
            Skip to main content
          </a>
          <Navbar darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
          <main id="main-content" tabIndex={-1}>
            <Hero />
            <SiteKinds />
            <LightySection />
            <Features />
            <HowItWorks />
            <Showcase />
            <Contact />
          </main>
          <Footer />
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;