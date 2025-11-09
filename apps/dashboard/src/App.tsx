import { useTranslation } from 'react-i18next';
import './i18n/config';

function App() {
  const { t } = useTranslation();

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">{t('dashboard.title')}</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-700">{t('dashboard.totalRevenue')}</h3>
          <p className="text-3xl font-bold text-green-600 mt-2">$45,231</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-700">{t('dashboard.pendingInvoices')}</h3>
          <p className="text-3xl font-bold text-blue-600 mt-2">12</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-700">{t('dashboard.activeClients')}</h3>
          <p className="text-3xl font-bold text-purple-600 mt-2">48</p>
        </div>
      </div>
      <div className="mt-8 bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">{t('dashboard.recentActivity')}</h2>
        <p className="text-gray-600">{t('dashboard.recentActivityDescription')}</p>
      </div>
    </div>
  );
}

export default App;
