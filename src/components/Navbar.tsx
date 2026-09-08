import React, { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Code2, Moon, Sun, Globe, Menu, X } from 'lucide-react';

interface NavbarProps {
  darkMode: boolean;
  toggleDarkMode: () => void;
  toggleLanguage: () => void;
}

const Navbar = ({ darkMode, toggleDarkMode, toggleLanguage }: NavbarProps) => {
  const { t } = useTranslation();
  const [isScrollingUp, setIsScrollingUp] = React.useState(true);
  const [lastScrollY, setLastScrollY] = React.useState(0);
  const [isAtTop, setIsAtTop] = React.useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const mobileButtonRef = useRef<HTMLButtonElement>(null);
  
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setIsScrollingUp(currentScrollY < lastScrollY || currentScrollY <= 0);
      setLastScrollY(currentScrollY);
      setIsAtTop(currentScrollY <= 10);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isMobileMenuOpen &&
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target as Node) &&
        !mobileButtonRef.current?.contains(event.target as Node)
      ) {
        setIsMobileMenuOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
        mobileButtonRef.current?.focus();
      }
    };

    if (isMobileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isMobileMenuOpen]);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const href = e.currentTarget.getAttribute('href');
    if (!href) return;
    
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMobileMenuOpen(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ behavior: 'smooth', top: 0 });
  };

  const navLinks = [
    { href: '#about', label: t('nav.about') },
    { href: '#services', label: t('nav.services') },
    { href: '#projects', label: t('nav.projects') },
    { href: '#contact', label: t('nav.contact') }
  ];

  return (
    <motion.nav
      initial={{ y: 0 }}
      animate={{ 
        y: isScrollingUp ? 0 : -100,
        scale: isScrollingUp ? 1 : 0.98
      }}
      transition={{ duration: 0.3 }}
      className="fixed w-full z-40 px-4 sm:px-8 py-4"
      role="navigation"
      aria-label="Main navigation"
    >
      <div 
        className={`max-w-7xl mx-auto rounded-2xl transition-all duration-300 ${
          isAtTop && !isMobileMenuOpen
            ? 'bg-transparent shadow-none' 
            : 'bg-white/80 dark:bg-black/80 backdrop-blur-lg shadow-[0_8px_32px_rgba(0,0,0,0.1)] dark:shadow-[0_8px_32px_rgba(255,255,255,0.1)]'
        }`}
      >
        <div className="flex items-center justify-between h-16 px-6">
          {/* Logo */}
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center cursor-pointer"
            onClick={scrollToTop}
            aria-label="Go to top"
          >
            <div
              className={`rounded-xl p-2 transition-colors duration-300 ${
                isAtTop && !isMobileMenuOpen
                  ? 'bg-black/5 dark:bg-white/5' 
                  : 'bg-black/10 dark:bg-white/10'
              }`}
              aria-hidden="true"
            >
              <Code2 className="h-8 w-8 text-black dark:text-white" />
            </div>
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="ml-2 rtl:ml-0 rtl:mr-2 text-xl font-bold text-black dark:text-white"
            >
              Lightor
            </motion.span>
          </motion.button>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8 rtl:space-x-reverse">
            {navLinks.map((link, index) => (
              <motion.a
                key={link.href}
                href={link.href}
                onClick={handleClick}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -2 }}
                className="relative px-3 py-2 text-base font-medium text-gray-700 hover:text-black dark:text-gray-300 dark:hover:text-white transition-colors group focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 dark:focus-visible:ring-pink-500 rounded-lg"
              >
                {link.label}
                <motion.span
                  className="absolute bottom-0 left-0 w-0 h-0.5 bg-black dark:bg-white transition-all duration-300 group-hover:w-full"
                  aria-hidden="true"
                />
              </motion.a>
            ))}

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="flex items-center space-x-2 rtl:space-x-reverse border-l rtl:border-l-0 rtl:border-r border-gray-200 dark:border-gray-700 ml-4 rtl:ml-0 rtl:mr-4 pl-4 rtl:pl-0 rtl:pr-4"
            >
              <button
                onClick={toggleDarkMode}
                className={`relative p-2 rounded-xl transition-colors duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 dark:focus-visible:ring-pink-500 ${
                  isAtTop && !isMobileMenuOpen
                    ? 'bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10' 
                    : 'bg-black/10 dark:bg-white/10 hover:bg-black/20 dark:hover:bg-white/20'
                }`}
                aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
              >
                {darkMode ? 
                  <Sun className="w-5 h-5 text-black dark:text-white" aria-hidden="true" /> : 
                  <Moon className="w-5 h-5 text-black dark:text-white" aria-hidden="true" />
                }
              </button>
              <button
                onClick={toggleLanguage}
                className={`relative p-2 rounded-xl transition-colors duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 dark:focus-visible:ring-pink-500 ${
                  isAtTop && !isMobileMenuOpen
                    ? 'bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10' 
                    : 'bg-black/10 dark:bg-white/10 hover:bg-black/20 dark:hover:bg-white/20'
                }`}
                aria-label="Toggle language"
              >
                <Globe className="w-5 h-5 text-black dark:text-white" aria-hidden="true" />
              </button>
            </motion.div>
          </div>

          {/* Mobile Menu Button */}
          <button
            ref={mobileButtonRef}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 dark:focus-visible:ring-pink-500"
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-menu"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6 text-black dark:text-white" aria-hidden="true" />
            ) : (
              <Menu className="w-6 h-6 text-black dark:text-white" aria-hidden="true" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        <div 
          ref={mobileMenuRef}
          id="mobile-menu"
          className={`md:hidden overflow-hidden transition-all duration-300 ${
            isMobileMenuOpen 
              ? 'max-h-96 opacity-100 visible bg-white dark:bg-black shadow-lg rounded-b-2xl'
              : 'max-h-0 opacity-0 invisible'
          }`}
          aria-hidden={!isMobileMenuOpen}
        >
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={handleClick}
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-black hover:bg-gray-100 dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 dark:focus-visible:ring-pink-500"
              >
                {link.label}
              </a>
            ))}
          </div>
          <div className="px-5 py-3 border-t border-gray-200 dark:border-gray-700">
            <div className="flex justify-center space-x-4">
              <button
                onClick={toggleDarkMode}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 dark:focus-visible:ring-pink-500"
                aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
              >
                {darkMode ? 
                  <Sun className="w-5 h-5 text-black dark:text-white" aria-hidden="true" /> : 
                  <Moon className="w-5 h-5 text-black dark:text-white" aria-hidden="true" />
                }
              </button>
              <button
                onClick={toggleLanguage}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 dark:focus-visible:ring-pink-500"
                aria-label="Toggle language"
              >
                <Globe className="w-5 h-5 text-black dark:text-white" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;