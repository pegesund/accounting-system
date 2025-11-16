import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import type { Department } from '../types';
import { apiService } from '../services/api';

interface DepartmentFormProps {
  department: Department | null;
  onSuccess: () => void;
  onCancel: () => void;
}

const DepartmentForm: React.FC<DepartmentFormProps> = ({ department, onSuccess, onCancel }) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState<Omit<Department, 'id' | 'createdAt' | 'updatedAt'>>({
    code: '',
    name: '',
    description: '',
    active: true,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (department) {
      setFormData({
        code: department.code,
        name: department.name,
        description: department.description,
        active: department.active,
      });
    }
  }, [department]);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.code.trim()) {
      newErrors.code = t('departments.validation.codeRequired');
    }

    if (!formData.name.trim()) {
      newErrors.name = t('departments.validation.nameRequired');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    setSubmitting(true);
    try {
      if (department?.id) {
        await apiService.updateDepartment(department.id, formData);
      } else {
        await apiService.createDepartment(formData);
      }
      onSuccess();
    } catch (err: any) {
      if (err.errors) {
        setErrors(err.errors);
      } else {
        setErrors({ general: err.message || t('departments.error.save') });
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h3 className="text-xl font-semibold mb-4">
        {department ? t('departments.edit') : t('departments.create')}
      </h3>

      {errors.general && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {errors.general}
        </div>
      )}

      <div>
        <label htmlFor="code" className="block text-sm font-medium text-gray-700 mb-1">
          {t('departments.fields.code')}
        </label>
        <input
          type="text"
          id="code"
          name="code"
          value={formData.code}
          onChange={handleChange}
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.code ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        {errors.code && <p className="mt-1 text-sm text-red-600">{errors.code}</p>}
      </div>

      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
          {t('departments.fields.name')}
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.name ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
          {t('departments.fields.description')}
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          id="active"
          name="active"
          checked={formData.active}
          onChange={handleChange}
          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
        />
        <label htmlFor="active" className="ml-2 block text-sm text-gray-900">
          {t('departments.fields.active')}
        </label>
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition"
        >
          {t('common.cancel')}
        </button>
        <button
          type="submit"
          disabled={submitting}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          {submitting ? t('common.saving') : t('common.save')}
        </button>
      </div>
    </form>
  );
};

export default DepartmentForm;
