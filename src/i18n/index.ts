import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import en from './locales/en';
import he from './locales/he';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      he: { translation: he }
    },
    // LT-276: the page reads i18n.language === 'he' for its direction, so the
    // language must be exactly 'he' or 'en'. Without this a phone set to
    // 'he-IL' (how iPhones in Israel report it) got Hebrew laid out left to
    // right, and any other language got Hebrew text left to right as well.
    // The region comes off before matching, so 'en-US' still beats the
    // page's own lang="he".
    supportedLngs: ['he', 'en'],
    detection: { convertDetectedLanguage: (lng: string) => lng.split('-')[0] },
    fallbackLng: 'he',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;