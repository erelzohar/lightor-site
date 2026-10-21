import React from 'react';
import { useTranslation } from 'react-i18next';
import { MotionConfig } from 'framer-motion';
import Navbar from './Navbar';
import Footer from './Footer';
import { useStill } from '../hooks/useA11yPrefs';
import { isRtl } from '../i18n/languages';

interface SiteShellProps {
  children: React.ReactNode;
  /**
   * LT-430: where the home page's sections live. "" on the home page itself
   * (#how), "/" on the blog (/#how), so the same navbar and footer link back
   * to them.
   */
  home?: string;
  /** The page the navbar marks as current. */
  current?: 'blog';
}

/**
 * The frame every lightor.app page shares: skip link, navbar, footer, dark
 * mode, the visitor's motion choice. The home page (App) and the blog
 * (src/blog) both render inside it.
 */
const SiteShell = ({ children, home = '', current }: SiteShellProps) => {
  const { t, i18n } = useTranslation();
  const still = useStill();
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

  return (
    // LT-357: framer's reveals hold still when the device asks for less
    // motion, and always once the visitor chooses "stop animations".
    <MotionConfig reducedMotion={still ? 'always' : 'user'}>
      <div className={`min-h-screen ${darkMode ? 'dark' : ''}`}>
        <div className="bg-white dark:bg-primary transition-colors duration-200">
          <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:p-4 focus:bg-white dark:focus:bg-black focus:text-black dark:focus:text-white">
            {t('a11y.skip')}
          </a>
          <Navbar darkMode={darkMode} toggleDarkMode={toggleDarkMode} home={home} current={current} />
          <main id="main-content" tabIndex={-1}>
            {children}
          </main>
          <Footer home={home} />
        </div>
      </div>
    </MotionConfig>
  );
};

export default SiteShell;
