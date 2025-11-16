import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { Project } from '../types';
import { apiService } from '../services/api';
import ProjectForm from './ProjectForm';

const ProjectList: React.FC = () => {
  const { t } = useTranslation();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [showForm, setShowForm] = useState(false);

  const loadProjects = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiService.getProjects();
      setProjects(data);
    } catch (err: any) {
      setError(err.message || t('projects.error.load'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const handleEdit = (project: Project) => {
    setEditingProject(project);
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm(t('projects.confirmDelete'))) {
      return;
    }

    try {
      await apiService.deleteProject(id);
      await loadProjects();
    } catch (err: any) {
      setError(err.message || t('projects.error.delete'));
    }
  };

  const handleFormSuccess = async () => {
    setShowForm(false);
    setEditingProject(null);
    await loadProjects();
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingProject(null);
  };

  const handleAddNew = () => {
    setEditingProject(null);
    setShowForm(true);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      ACTIVE: 'bg-green-100 text-green-800',
      COMPLETED: 'bg-blue-100 text-blue-800',
      ON_HOLD: 'bg-yellow-100 text-yellow-800',
      CANCELLED: 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
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
        <h2 className="text-2xl font-bold">{t('projects.title')}</h2>
        <button
          onClick={handleAddNew}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          {t('projects.addNew')}
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {showForm && (
        <div className="bg-white border border-gray-300 rounded-lg p-6 shadow-sm">
          <ProjectForm
            project={editingProject}
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
                {t('projects.fields.code')}
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t('projects.fields.name')}
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t('projects.fields.description')}
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t('projects.fields.dates')}
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t('projects.fields.status')}
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t('projects.fields.active')}
              </th>
              <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t('common.actions')}
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {projects.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-6 text-center text-gray-500">
                  {t('projects.noData')}
                </td>
              </tr>
            ) : (
              projects.map((project) => (
                <tr key={project.id} className="hover:bg-gray-50">
                  <td className="px-6 py-6 whitespace-nowrap text-sm font-medium text-gray-900">
                    {project.code}
                  </td>
                  <td className="px-6 py-6 whitespace-nowrap text-sm text-gray-900">
                    {project.name}
                  </td>
                  <td className="px-6 py-6 text-sm text-gray-500">
                    {project.description}
                  </td>
                  <td className="px-6 py-6 whitespace-nowrap text-sm text-gray-500">
                    <div>{formatDate(project.startDate)}</div>
                    <div>{formatDate(project.endDate)}</div>
                  </td>
                  <td className="px-6 py-6 whitespace-nowrap text-sm">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                        project.status
                      )}`}
                    >
                      {t(`projects.status.${project.status}`)}
                    </span>
                  </td>
                  <td className="px-6 py-6 whitespace-nowrap text-sm">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        project.active
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {project.active ? t('common.active') : t('common.inactive')}
                    </span>
                  </td>
                  <td className="px-6 py-6 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleEdit(project)}
                      className="text-blue-600 hover:text-blue-900 mr-4"
                    >
                      {t('common.edit')}
                    </button>
                    <button
                      onClick={() => handleDelete(project.id!)}
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

export default ProjectList;
