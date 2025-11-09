import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import translationsNO from './locales/no.json';
import translationsEN from './locales/en.json';

// Get language from parent (shell) if available, otherwise default to Norwegian
const getLanguage = () => {
  try {
    // Check if parent window has i18n configured
    if (window.parent && window.parent !== window) {
      const parentLang = window.parent.localStorage.getItem('i18nextLng');
      if (parentLang) return parentLang;
    }
  } catch (e) {
    // Cross-origin restrictions, fall through to default
  }

  // Check browser language
  const browserLang = navigator.language.split('-')[0];
  return browserLang === 'no' || browserLang === 'nb' || browserLang === 'nn' ? 'no' : 'no'; // Default to Norwegian
};

const resources = {
  no: {
    translation: translationsNO,
  },
  en: {
    translation: translationsEN,
  },
};

// Don't reinitialize if already initialized (shell has already done it)
if (!i18n.isInitialized) {
  i18n
    .use(initReactI18next)
    .init({
      resources,
      fallbackLng: 'no',
      lng: getLanguage(),
      interpolation: {
        escapeValue: false,
      },
      react: {
        useSuspense: false,
      },
    });
} else {
  // Just add our translations to the existing i18n instance
  i18n.addResourceBundle('no', 'translation', resources.no.translation, true, true);
  i18n.addResourceBundle('en', 'translation', resources.en.translation, true, true);
}

// Listen for language changes from parent window
window.addEventListener('storage', (e) => {
  if (e.key === 'i18nextLng' && e.newValue) {
    i18n.changeLanguage(e.newValue);
  }
});

export default i18n;
