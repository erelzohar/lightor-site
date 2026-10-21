import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import SiteShell from './components/SiteShell';
import Hero from './components/Hero';
import SiteKinds from './components/SiteKinds';
import LightySection from './components/LightySection';
import Features from './components/Features';
import HowItWorks from './components/HowItWorks';
import Showcase from './components/Showcase';
import Contact from './components/Contact';
import './i18n';

function App() {
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
      <SiteShell>
        <Hero />
        <SiteKinds />
        <LightySection />
        <Features />
        <HowItWorks />
        <Showcase />
        <Contact />
      </SiteShell>
    </BrowserRouter>
  );
}

export default App;
