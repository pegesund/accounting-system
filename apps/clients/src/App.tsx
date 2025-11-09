import { useTranslation } from 'react-i18next';
import './i18n/config';

function App() {
  const { t } = useTranslation();

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">{t('clients.title')}</h1>
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">{t('clients.title')}</h2>
        <p className="text-gray-600">{t('clients.description')}</p>
        <button className="mt-4 px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-700">
          {t('clients.addClient')}
        </button>
      </div>
    </div>
  );
}

export default App;
