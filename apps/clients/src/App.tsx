function App() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Clients</h1>
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Client Directory</h2>
        <p className="text-gray-600">Manage client contacts and billing information.</p>
        <button className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700">
          Add New Client
        </button>
      </div>
    </div>
  );
}

export default App;
