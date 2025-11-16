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
        settings: "Innstillinger",
        demoUser: "Demo Bruker"
      },
      app: {
        title: "Innstillinger"
      },
      tabs: {
        departments: "Avdelinger",
        projects: "Prosjekter"
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
        language: "Språk",
        saving: "Lagrer...",
        actions: "Handlinger",
        active: "Aktiv",
        inactive: "Inaktiv"
      },
      departments: {
        title: "Avdelinger",
        addNew: "Legg til avdeling",
        create: "Opprett avdeling",
        edit: "Rediger avdeling",
        confirmDelete: "Er du sikker på at du vil slette denne avdelingen?",
        noData: "Ingen avdelinger funnet",
        fields: {
          code: "Kode",
          name: "Navn",
          description: "Beskrivelse",
          active: "Aktiv"
        },
        validation: {
          codeRequired: "Kode er påkrevd",
          nameRequired: "Navn er påkrevd"
        },
        error: {
          load: "Kunne ikke laste avdelinger",
          save: "Kunne ikke lagre avdeling",
          delete: "Kunne ikke slette avdeling"
        }
      },
      projects: {
        title: "Prosjekter",
        addNew: "Legg til prosjekt",
        create: "Opprett prosjekt",
        edit: "Rediger prosjekt",
        confirmDelete: "Er du sikker på at du vil slette dette prosjektet?",
        noData: "Ingen prosjekter funnet",
        fields: {
          code: "Kode",
          name: "Navn",
          description: "Beskrivelse",
          startDate: "Startdato",
          endDate: "Sluttdato",
          dates: "Datoer",
          status: "Status",
          active: "Aktiv"
        },
        status: {
          ACTIVE: "Aktiv",
          COMPLETED: "Fullført",
          ON_HOLD: "På vent",
          CANCELLED: "Kansellert"
        },
        validation: {
          codeRequired: "Kode er påkrevd",
          nameRequired: "Navn er påkrevd",
          startDateRequired: "Startdato er påkrevd",
          endDateRequired: "Sluttdato er påkrevd",
          endDateAfterStart: "Sluttdato må være etter startdato"
        },
        error: {
          load: "Kunne ikke laste prosjekter",
          save: "Kunne ikke lagre prosjekt",
          delete: "Kunne ikke slette prosjekt"
        }
      },
      languages: {
        no: "Norsk",
        en: "Engelsk",
        pl: "Polsk",
        uk: "Ukrainsk"
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
        settings: "Settings",
        demoUser: "Demo User"
      },
      app: {
        title: "Settings Management"
      },
      tabs: {
        departments: "Departments",
        projects: "Projects"
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
        language: "Language",
        saving: "Saving...",
        actions: "Actions",
        active: "Active",
        inactive: "Inactive"
      },
      departments: {
        title: "Departments",
        addNew: "Add Department",
        create: "Create Department",
        edit: "Edit Department",
        confirmDelete: "Are you sure you want to delete this department?",
        noData: "No departments found",
        fields: {
          code: "Code",
          name: "Name",
          description: "Description",
          active: "Active"
        },
        validation: {
          codeRequired: "Code is required",
          nameRequired: "Name is required"
        },
        error: {
          load: "Failed to load departments",
          save: "Failed to save department",
          delete: "Failed to delete department"
        }
      },
      projects: {
        title: "Projects",
        addNew: "Add Project",
        create: "Create Project",
        edit: "Edit Project",
        confirmDelete: "Are you sure you want to delete this project?",
        noData: "No projects found",
        fields: {
          code: "Code",
          name: "Name",
          description: "Description",
          startDate: "Start Date",
          endDate: "End Date",
          dates: "Dates",
          status: "Status",
          active: "Active"
        },
        status: {
          ACTIVE: "Active",
          COMPLETED: "Completed",
          ON_HOLD: "On Hold",
          CANCELLED: "Cancelled"
        },
        validation: {
          codeRequired: "Code is required",
          nameRequired: "Name is required",
          startDateRequired: "Start date is required",
          endDateRequired: "End date is required",
          endDateAfterStart: "End date must be after start date"
        },
        error: {
          load: "Failed to load projects",
          save: "Failed to save project",
          delete: "Failed to delete project"
        }
      },
      languages: {
        no: "Norwegian",
        en: "English",
        pl: "Polish",
        uk: "Ukrainian"
      }
    }
  },
  pl: {
    translation: {
      nav: {
        dashboard: "Pulpit",
        invoices: "Faktury",
        expenses: "Wydatki",
        reports: "Raporty",
        clients: "Klienci",
        settings: "Ustawienia",
        demoUser: "Użytkownik Demo"
      },
      app: {
        title: "Zarządzanie ustawieniami"
      },
      tabs: {
        departments: "Działy",
        projects: "Projekty"
      },
      common: {
        loading: "Ładowanie...",
        error: "Błąd",
        save: "Zapisz",
        cancel: "Anuluj",
        delete: "Usuń",
        edit: "Edytuj",
        add: "Dodaj",
        search: "Szukaj",
        filter: "Filtruj",
        export: "Eksportuj",
        import: "Importuj",
        settings: "Ustawienia",
        logout: "Wyloguj",
        login: "Zaloguj",
        language: "Język",
        saving: "Zapisywanie...",
        actions: "Akcje",
        active: "Aktywny",
        inactive: "Nieaktywny"
      },
      departments: {
        title: "Działy",
        addNew: "Dodaj dział",
        create: "Utwórz dział",
        edit: "Edytuj dział",
        confirmDelete: "Czy na pewno chcesz usunąć ten dział?",
        noData: "Nie znaleziono działów",
        fields: {
          code: "Kod",
          name: "Nazwa",
          description: "Opis",
          active: "Aktywny"
        },
        validation: {
          codeRequired: "Kod jest wymagany",
          nameRequired: "Nazwa jest wymagana"
        },
        error: {
          load: "Nie udało się załadować działów",
          save: "Nie udało się zapisać działu",
          delete: "Nie udało się usunąć działu"
        }
      },
      projects: {
        title: "Projekty",
        addNew: "Dodaj projekt",
        create: "Utwórz projekt",
        edit: "Edytuj projekt",
        confirmDelete: "Czy na pewno chcesz usunąć ten projekt?",
        noData: "Nie znaleziono projektów",
        fields: {
          code: "Kod",
          name: "Nazwa",
          description: "Opis",
          startDate: "Data rozpoczęcia",
          endDate: "Data zakończenia",
          dates: "Daty",
          status: "Status",
          active: "Aktywny"
        },
        status: {
          ACTIVE: "Aktywny",
          COMPLETED: "Zakończony",
          ON_HOLD: "Wstrzymany",
          CANCELLED: "Anulowany"
        },
        validation: {
          codeRequired: "Kod jest wymagany",
          nameRequired: "Nazwa jest wymagana",
          startDateRequired: "Data rozpoczęcia jest wymagana",
          endDateRequired: "Data zakończenia jest wymagana",
          endDateAfterStart: "Data zakończenia musi być po dacie rozpoczęcia"
        },
        error: {
          load: "Nie udało się załadować projektów",
          save: "Nie udało się zapisać projektu",
          delete: "Nie udało się usunąć projektu"
        }
      },
      languages: {
        no: "Norweski",
        en: "Angielski",
        pl: "Polski",
        uk: "Ukraiński"
      }
    }
  },
  uk: {
    translation: {
      nav: {
        dashboard: "Панель",
        invoices: "Рахунки",
        expenses: "Витрати",
        reports: "Звіти",
        clients: "Клієнти",
        settings: "Налаштування",
        demoUser: "Демо Користувач"
      },
      app: {
        title: "Управління налаштуваннями"
      },
      tabs: {
        departments: "Відділи",
        projects: "Проєкти"
      },
      common: {
        loading: "Завантаження...",
        error: "Помилка",
        save: "Зберегти",
        cancel: "Скасувати",
        delete: "Видалити",
        edit: "Редагувати",
        add: "Додати",
        search: "Пошук",
        filter: "Фільтр",
        export: "Експорт",
        import: "Імпорт",
        settings: "Налаштування",
        logout: "Вийти",
        login: "Увійти",
        language: "Мова",
        saving: "Збереження...",
        actions: "Дії",
        active: "Активний",
        inactive: "Неактивний"
      },
      departments: {
        title: "Відділи",
        addNew: "Додати відділ",
        create: "Створити відділ",
        edit: "Редагувати відділ",
        confirmDelete: "Ви впевнені, що хочете видалити цей відділ?",
        noData: "Відділи не знайдено",
        fields: {
          code: "Код",
          name: "Назва",
          description: "Опис",
          active: "Активний"
        },
        validation: {
          codeRequired: "Код є обов'язковим",
          nameRequired: "Назва є обов'язковою"
        },
        error: {
          load: "Не вдалося завантажити відділи",
          save: "Не вдалося зберегти відділ",
          delete: "Не вдалося видалити відділ"
        }
      },
      projects: {
        title: "Проєкти",
        addNew: "Додати проєкт",
        create: "Створити проєкт",
        edit: "Редагувати проєкт",
        confirmDelete: "Ви впевнені, що хочете видалити цей проєкт?",
        noData: "Проєкти не знайдено",
        fields: {
          code: "Код",
          name: "Назва",
          description: "Опис",
          startDate: "Дата початку",
          endDate: "Дата завершення",
          dates: "Дати",
          status: "Статус",
          active: "Активний"
        },
        status: {
          ACTIVE: "Активний",
          COMPLETED: "Завершено",
          ON_HOLD: "Призупинено",
          CANCELLED: "Скасовано"
        },
        validation: {
          codeRequired: "Код є обов'язковим",
          nameRequired: "Назва є обов'язковою",
          startDateRequired: "Дата початку є обов'язковою",
          endDateRequired: "Дата завершення є обов'язковою",
          endDateAfterStart: "Дата завершення повинна бути після дати початку"
        },
        error: {
          load: "Не вдалося завантажити проєкти",
          save: "Не вдалося зберегти проєкт",
          delete: "Не вдалося видалити проєкт"
        }
      },
      languages: {
        no: "Норвезька",
        en: "Англійська",
        pl: "Польська",
        uk: "Українська"
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
    i18n.addResourceBundle('pl', 'translation', resources.pl.translation, true, true);
    i18n.addResourceBundle('uk', 'translation', resources.uk.translation, true, true);
    console.log('Shell i18n initialized', i18n.t('nav.dashboard'));
  });

export default i18n;
