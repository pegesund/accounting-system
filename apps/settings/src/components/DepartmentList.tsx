import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { Department } from '../types';
import { apiService } from '../services/api';
import DepartmentForm from './DepartmentForm';

const DepartmentList: React.FC = () => {
  const { t } = useTranslation();
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingDepartment, setEditingDepartment] = useState<Department | null>(null);
  const [showForm, setShowForm] = useState(false);

  const loadDepartments = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiService.getDepartments();
      setDepartments(data);
    } catch (err: any) {
      setError(err.message || t('departments.error.load'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDepartments();
  }, []);

  const handleEdit = (department: Department) => {
    setEditingDepartment(department);
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm(t('departments.confirmDelete'))) {
      return;
    }

    try {
      await apiService.deleteDepartment(id);
      await loadDepartments();
    } catch (err: any) {
      // Only show error for delete operation (user initiated)
      setError(t('departments.error.delete'));
    }
  };

  const handleFormSuccess = async () => {
    setShowForm(false);
    setEditingDepartment(null);
    await loadDepartments();
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingDepartment(null);
  };

  const handleAddNew = () => {
    setEditingDepartment(null);
    setShowForm(true);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="text-gray-600">{t('common.loading')}</div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">{t('departments.title')}</h2>
        <button
          onClick={handleAddNew}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          {t('departments.addNew')}
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {showForm && (
        <div className="bg-white border border-gray-300 rounded-lg p-6 shadow-sm">
          <DepartmentForm
            department={editingDepartment}
            onSuccess={handleFormSuccess}
            onCancel={handleFormCancel}
          />
        </div>
      )}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t('departments.fields.code')}
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t('departments.fields.name')}
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t('departments.fields.description')}
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t('departments.fields.active')}
              </th>
              <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t('common.actions')}
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {departments.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-6 text-center text-gray-500">
                  {t('departments.noData')}
                </td>
              </tr>
            ) : (
              departments.map((department) => (
                <tr key={department.id} className="hover:bg-gray-50">
                  <td className="px-6 py-6 whitespace-nowrap text-sm font-medium text-gray-900">
                    {department.code}
                  </td>
                  <td className="px-6 py-6 whitespace-nowrap text-sm text-gray-900">
                    {department.name}
                  </td>
                  <td className="px-6 py-6 text-sm text-gray-500">
                    {department.description}
                  </td>
                  <td className="px-6 py-6 whitespace-nowrap text-sm">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        department.active
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {department.active ? t('common.active') : t('common.inactive')}
                    </span>
                  </td>
                  <td className="px-6 py-6 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleEdit(department)}
                      className="text-blue-600 hover:text-blue-900 mr-4"
                    >
                      {t('common.edit')}
                    </button>
                    <button
                      onClick={() => handleDelete(department.id!)}
                      className="text-red-600 hover:text-red-900"
                    >
                      {t('common.delete')}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DepartmentList;
