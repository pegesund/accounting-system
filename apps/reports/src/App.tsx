import { useTranslation } from 'react-i18next';
import './i18n/config';

function App() {
  const { t } = useTranslation();

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">{t('reports.title')}</h1>
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">{t('reports.title')}</h2>
        <p className="text-gray-600 mb-4">{t('reports.description')}</p>
        <div className="flex space-x-4">
          <button className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700">
            {t('reports.plReport')}
          </button>
          <button className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700">
            {t('reports.balanceSheet')}
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
