import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Menu, Moon, Sun, X } from 'lucide-react';

interface NavbarProps {
  darkMode: boolean;
  toggleDarkMode: () => void;
  toggleLanguage: () => void;
}

const REGISTER_URL = 'https://register.lightor.app';
const DASHBOARD_URL = 'https://dashboard.lightor.app';

const Navbar = ({ darkMode, toggleDarkMode, toggleLanguage }: NavbarProps) => {
  const { t } = useTranslation();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      const target = e.target as Node;
      if (!menuRef.current?.contains(target) && !buttonRef.current?.contains(target)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false);
        buttonRef.current?.focus();
      }
    };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const links = [
    { href: '#how', label: t('nav.how') },
    { href: '#lighty', label: t('nav.lighty') },
    { href: '#features', label: t('nav.features') },
    { href: 'https://lightor.app/sites', label: t('nav.sites') },
  ];

  const iconButton =
    'rounded-xl p-2 text-gray-700 transition-colors hover:bg-black/5 dark:text-gray-200 dark:hover:bg-white/10';

  return (
    <header className="fixed inset-x-0 top-0 z-40 px-3 pt-3 sm:px-6">
      <nav
        aria-label="Main navigation"
        className={`mx-auto max-w-7xl rounded-2xl transition-all duration-300 ${
          scrolled || open
            ? 'bg-white/85 shadow-[0_8px_30px_rgba(0,0,0,0.08)] backdrop-blur-lg dark:bg-black/80'
            : 'bg-transparent'
        }`}
      >
        <div className="flex h-16 items-center justify-between gap-4 px-4 sm:px-5">
          <a href="#home" className="flex items-center gap-2.5" aria-label={t('nav.home')}>
            <img src="/lightor-logo.webp" alt="" width={36} height={36} className="h-9 w-9 rounded-xl" />
            <span className="text-xl font-bold text-gray-950 dark:text-white">Lightor</span>
          </a>

          <div className="hidden items-center gap-1 md:flex">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="rounded-lg px-3 py-2 font-medium text-gray-700 transition-colors hover:text-black dark:text-gray-300 dark:hover:text-white"
              >
                {l.label}
              </a>
            ))}
          </div>

          <div className="hidden items-center gap-1.5 md:flex">
            <button onClick={toggleDarkMode} className={iconButton} aria-label={darkMode ? t('nav.lightMode') : t('nav.darkMode')}>
              {darkMode ? <Sun className="h-5 w-5" aria-hidden="true" /> : <Moon className="h-5 w-5" aria-hidden="true" />}
            </button>
            <button onClick={toggleLanguage} className={`${iconButton} px-3 text-sm font-semibold`}>
              {t('nav.language')}
            </button>
            <a href={DASHBOARD_URL} className="rounded-lg px-3 py-2 font-medium text-gray-700 hover:text-black dark:text-gray-300 dark:hover:text-white">
              {t('nav.signIn')}
            </a>
            <a
              href={REGISTER_URL}
              className="rounded-full bg-gradient-to-r from-violet-600 to-pink-600 px-5 py-2.5 font-semibold text-white shadow-md shadow-violet-600/20 transition hover:shadow-lg"
            >
              {t('nav.start')}
            </a>
          </div>

          <button
            ref={buttonRef}
            onClick={() => setOpen((v) => !v)}
            className={`${iconButton} md:hidden`}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={t('nav.menu')}
          >
            {open ? <X className="h-6 w-6" aria-hidden="true" /> : <Menu className="h-6 w-6" aria-hidden="true" />}
          </button>
        </div>

        <div
          ref={menuRef}
          id="mobile-menu"
          hidden={!open}
          className="border-t border-gray-200/70 px-4 pb-4 pt-2 md:hidden dark:border-gray-800"
        >
          <ul className="space-y-1">
            {links.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="block rounded-lg px-3 py-2.5 text-base font-medium text-gray-800 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-white/10"
                >
                  {l.label}
                </a>
              </li>
            ))}
            <li>
              <a href={DASHBOARD_URL} className="block rounded-lg px-3 py-2.5 text-base font-medium text-gray-800 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-white/10">
                {t('nav.signIn')}
              </a>
            </li>
          </ul>
          <div className="mt-3 flex items-center gap-2">
            <a
              href={REGISTER_URL}
              className="flex-1 rounded-full bg-gradient-to-r from-violet-600 to-pink-600 px-5 py-3 text-center font-semibold text-white"
            >
              {t('nav.start')}
            </a>
            <button onClick={toggleDarkMode} className={iconButton} aria-label={darkMode ? t('nav.lightMode') : t('nav.darkMode')}>
              {darkMode ? <Sun className="h-5 w-5" aria-hidden="true" /> : <Moon className="h-5 w-5" aria-hidden="true" />}
            </button>
            <button onClick={toggleLanguage} className={`${iconButton} px-3 text-sm font-semibold`}>
              {t('nav.language')}
            </button>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
