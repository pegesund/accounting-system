import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import DepartmentList from './components/DepartmentList';
import ProjectList from './components/ProjectList';
import './App.css';

type Tab = 'departments' | 'projects';

function App() {
  const { t, i18n } = useTranslation();
  const [activeTab, setActiveTab] = useState<Tab>('departments');

  useEffect(() => {
    // Listen for language changes from localStorage
    const handleLanguageChange = () => {
      const newLang = localStorage.getItem('i18nextLng');
      if (newLang && i18n.language !== newLang) {
        i18n.changeLanguage(newLang);
      }
    };

    // Poll localStorage every 500ms to detect language changes
    const interval = setInterval(handleLanguageChange, 500);

    return () => clearInterval(interval);
  }, [i18n]);

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div className="p-6">
        <div className="bg-white rounded-lg shadow">
          <div className="border-b border-gray-200 bg-gray-50">
            <nav className="flex px-4">
              <button
                onClick={() => setActiveTab('departments')}
                className={`py-4 px-6 text-center border-b-4 font-semibold text-base transition-colors ${
                  activeTab === 'departments'
                    ? 'border-blue-600 text-blue-700 bg-white'
                    : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
                }`}
              >
                {t('tabs.departments')}
              </button>
              <button
                onClick={() => setActiveTab('projects')}
                className={`py-4 px-6 text-center border-b-4 font-semibold text-base transition-colors ${
                  activeTab === 'projects'
                    ? 'border-blue-600 text-blue-700 bg-white'
                    : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
                }`}
              >
                {t('tabs.projects')}
              </button>
            </nav>
          </div>

          <div className="p-8">
            {activeTab === 'departments' && <DepartmentList />}
            {activeTab === 'projects' && <ProjectList />}
          </div>
        </div>
    </div>
  );
}

export default App;
