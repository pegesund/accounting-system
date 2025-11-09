function App() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Expenses</h1>
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Expense Tracking</h2>
        <p className="text-gray-600">Record and categorize your business expenses.</p>
        <button className="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
          Add Expense
        </button>
      </div>
    </div>
  );
}

export default App;
