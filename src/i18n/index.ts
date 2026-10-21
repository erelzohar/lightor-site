import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './locales/en';
import he from './locales/he';
import ar from './locales/ar';
import fr from './locales/fr';
import es from './locales/es';
import { LANGS, DEFAULT_LANG, langFromPath } from './languages';

// LT-349: the language is the address (/ is Hebrew, /en/, /ar/, /fr/, /es/),
// never the browser's setting: the HTML at each address is already in its
// language (title, description, lang/dir), and a page that switched to the
// visitor's language after loading would show a crawler one language and a
// person another. The switcher in the navbar is a plain link to the other
// address.
i18n
  .use(initReactI18next)
  .init({
    resources: {
      he: { translation: he },
      en: { translation: en },
      ar: { translation: ar },
      fr: { translation: fr },
      es: { translation: es }
    },
    lng: typeof window === 'undefined' ? DEFAULT_LANG : langFromPath(window.location.pathname),
    supportedLngs: [...LANGS],
    fallbackLng: DEFAULT_LANG,
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
