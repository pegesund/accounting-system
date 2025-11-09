import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';

const Dashboard = lazy(() => import('dashboard/Module'));
const Invoicing = lazy(() => import('invoicing/Module'));
const Expenses = lazy(() => import('expenses/Module'));
const Reports = lazy(() => import('reports/Module'));
const Clients = lazy(() => import('clients/Module'));

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between h-16">
            <div className="flex space-x-8">
              <Link to="/" className="flex items-center px-2 text-gray-700 hover:text-blue-600">
                Dashboard
              </Link>
              <Link to="/invoices" className="flex items-center px-2 text-gray-700 hover:text-blue-600">
                Invoices
              </Link>
              <Link to="/expenses" className="flex items-center px-2 text-gray-700 hover:text-blue-600">
                Expenses
              </Link>
              <Link to="/reports" className="flex items-center px-2 text-gray-700 hover:text-blue-600">
                Reports
              </Link>
              <Link to="/clients" className="flex items-center px-2 text-gray-700 hover:text-blue-600">
                Clients
              </Link>
            </div>
            <div className="flex items-center">
              <span className="text-gray-700">Demo User</span>
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

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Layout>
          <Suspense fallback={<div className="text-center py-10">Loading...</div>}>
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
