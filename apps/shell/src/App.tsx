import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AuthProvider } from './contexts/AuthContext';
import { LanguageSwitcher } from './components/LanguageSwitcher';

const Dashboard = lazy(() => import('dashboard/Module'));
const Invoicing = lazy(() => import('invoicing/Module'));
const Expenses = lazy(() => import('expenses/Module'));
const Reports = lazy(() => import('reports/Module'));
const Clients = lazy(() => import('clients/Module'));

function Layout({ children }: { children: React.ReactNode }) {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between h-16">
            <div className="flex space-x-8">
              <Link to="/" className="flex items-center px-2 text-gray-700 hover:text-blue-600">
                {t('nav.dashboard')}
              </Link>
              <Link to="/invoices" className="flex items-center px-2 text-gray-700 hover:text-blue-600">
                {t('nav.invoices')}
              </Link>
              <Link to="/expenses" className="flex items-center px-2 text-gray-700 hover:text-blue-600">
                {t('nav.expenses')}
              </Link>
              <Link to="/reports" className="flex items-center px-2 text-gray-700 hover:text-blue-600">
                {t('nav.reports')}
              </Link>
              <Link to="/clients" className="flex items-center px-2 text-gray-700 hover:text-blue-600">
                {t('nav.clients')}
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <LanguageSwitcher />
              <span className="text-gray-700">{t('nav.demoUser')}</span>
            </div>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto py-6 px-4">
        {children}
      </main>
    </div>
  );
}

function LoadingFallback() {
  const { t } = useTranslation();
  return <div className="text-center py-10">{t('common.loading')}</div>;
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Layout>
          <Suspense fallback={<LoadingFallback />}>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/invoices/*" element={<Invoicing />} />
              <Route path="/expenses/*" element={<Expenses />} />
              <Route path="/reports/*" element={<Reports />} />
              <Route path="/clients/*" element={<Clients />} />
            </Routes>
          </Suspense>
        </Layout>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
