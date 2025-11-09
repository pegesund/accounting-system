function App() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Invoices</h1>
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Invoice Management</h2>
        <p className="text-gray-600">Create, edit, and manage your invoices here.</p>
        <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          Create New Invoice
        </button>
      </div>
    </div>
  );
}

export default App;
