import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Translation resources defined inline to avoid JSON import issues
const resources = {
  no: {
    translation: {
      nav: {
        dashboard: "Dashbord",
        invoices: "Fakturaer",
        expenses: "Utgifter",
        reports: "Rapporter",
        clients: "Kunder",
        demoUser: "Demo Bruker"
      },
      common: {
        loading: "Laster...",
        error: "Feil",
        save: "Lagre",
        cancel: "Avbryt",
        delete: "Slett",
        edit: "Rediger",
        add: "Legg til",
        search: "Søk",
        filter: "Filter",
        export: "Eksporter",
        import: "Importer",
        settings: "Innstillinger",
        logout: "Logg ut",
        login: "Logg inn",
        language: "Språk"
      },
      languages: {
        no: "Norsk",
        en: "Engelsk"
      }
    }
  },
  en: {
    translation: {
      nav: {
        dashboard: "Dashboard",
        invoices: "Invoices",
        expenses: "Expenses",
        reports: "Reports",
        clients: "Clients",
        demoUser: "Demo User"
      },
      common: {
        loading: "Loading...",
        error: "Error",
        save: "Save",
        cancel: "Cancel",
        delete: "Delete",
        edit: "Edit",
        add: "Add",
        search: "Search",
        filter: "Filter",
        export: "Export",
        import: "Import",
        settings: "Settings",
        logout: "Logout",
        login: "Login",
        language: "Language"
      },
      languages: {
        no: "Norwegian",
        en: "English"
      }
    }
  }
};

// Initialize i18next
i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'no',
    lng: 'no',
    detection: {
      order: ['localStorage', 'cookie', 'navigator', 'htmlTag'],
      caches: ['localStorage', 'cookie'],
    },
    interpolation: {
      escapeValue: false,
    },
    react: {
      useSuspense: false,
    },
    load: 'languageOnly',
  })
  .then(() => {
    // Force add shell translations (deep merge, overwrite existing keys)
    i18n.addResourceBundle('no', 'translation', resources.no.translation, true, true);
    i18n.addResourceBundle('en', 'translation', resources.en.translation, true, true);
    console.log('Shell i18n initialized', i18n.t('nav.dashboard'));
  });

export default i18n;
