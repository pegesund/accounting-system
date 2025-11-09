import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import translationsNO from './locales/no.json';
import translationsEN from './locales/en.json';

// Translation resources
const resources = {
  no: {
    translation: translationsNO,
  },
  en: {
    translation: translationsEN,
  },
};

i18n
  // Detect user language
  .use(LanguageDetector)
  // Pass the i18n instance to react-i18next
  .use(initReactI18next)
  // Initialize i18next
  .init({
    resources,
    fallbackLng: 'no', // Norwegian as default fallback
    lng: 'no', // Default language is Norwegian
    detection: {
      order: ['navigator', 'htmlTag', 'path', 'subdomain'],
      caches: ['localStorage', 'cookie'],
    },
    interpolation: {
      escapeValue: false, // React already escapes values
    },
    react: {
      useSuspense: false, // Disable suspense for now
    },
  });

export default i18n;
