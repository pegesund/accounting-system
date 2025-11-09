function App() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Reports</h1>
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Financial Reports</h2>
        <p className="text-gray-600">View P&L, balance sheet, and other financial reports.</p>
        <div className="mt-4 space-x-2">
          <button className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700">
            P&L Report
          </button>
          <button className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700">
            Balance Sheet
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
