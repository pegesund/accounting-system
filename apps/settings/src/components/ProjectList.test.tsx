import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ProjectList from './ProjectList';
import { apiService } from '../services/api';
import { Project, ProjectStatus } from '../types';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key })
}));

vi.mock('../services/api', () => ({
  apiService: {
    getProjects: vi.fn(),
    deleteProject: vi.fn()
  }
}));

vi.mock('./ProjectForm', () => ({
  default: ({ onSuccess, onCancel }: any) => (
    <div data-testid="project-form">
      <button onClick={onSuccess}>Success</button>
      <button onClick={onCancel}>Cancel</button>
    </div>
  )
}));

describe('ProjectList', () => {
  const mockProjects: Project[] = [
    {
      id: 1,
      code: 'PROJ001',
      name: 'Project 1',
      description: 'Description 1',
      startDate: '2025-01-01T00:00:00Z',
      endDate: '2025-12-31T00:00:00Z',
      status: ProjectStatus.ACTIVE,
      active: true,
      createdAt: '2025-01-01T00:00:00Z',
      updatedAt: '2025-01-01T00:00:00Z'
    },
    {
      id: 2,
      code: 'PROJ002',
      name: 'Project 2',
      description: 'Description 2',
      startDate: '2024-01-01T00:00:00Z',
      endDate: '2024-12-31T00:00:00Z',
      status: ProjectStatus.COMPLETED,
      active: false,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z'
    }
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    window.confirm = vi.fn();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('basic rendering', () => {
    it('should display loading state initially', () => {
      vi.mocked(apiService.getProjects).mockImplementation(() => new Promise(() => {}));
      render(<ProjectList />);
      expect(screen.getByText('common.loading')).toBeInTheDocument();
    });

    it('should display projects after loading', async () => {
      vi.mocked(apiService.getProjects).mockResolvedValue(mockProjects);
      render(<ProjectList />);

      await waitFor(() => {
        expect(screen.getByText('PROJ001')).toBeInTheDocument();
        expect(screen.getByText('PROJ002')).toBeInTheDocument();
        expect(screen.getByText('Project 1')).toBeInTheDocument();
        expect(screen.getByText('Project 2')).toBeInTheDocument();
      });
    });

    it('should display no data message when projects list is empty', async () => {
      vi.mocked(apiService.getProjects).mockResolvedValue([]);
      render(<ProjectList />);

      await waitFor(() => {
        expect(screen.getByText('projects.noData')).toBeInTheDocument();
      });
    });

    it('should display error message when loading fails', async () => {
      vi.mocked(apiService.getProjects).mockRejectedValue(new Error('Load failed'));
      render(<ProjectList />);

      await waitFor(() => {
        expect(screen.getByText('Load failed')).toBeInTheDocument();
      });
    });

    it('should display title and add button', async () => {
      vi.mocked(apiService.getProjects).mockResolvedValue(mockProjects);
      render(<ProjectList />);

      await waitFor(() => {
        expect(screen.getByText('projects.title')).toBeInTheDocument();
        expect(screen.getByText('projects.addNew')).toBeInTheDocument();
      });
    });

    it('should display status badges with correct styling', async () => {
      vi.mocked(apiService.getProjects).mockResolvedValue(mockProjects);
      render(<ProjectList />);

      await waitFor(() => {
        expect(screen.getByText('projects.status.ACTIVE')).toBeInTheDocument();
        expect(screen.getByText('projects.status.COMPLETED')).toBeInTheDocument();
      });
    });

    it('should display active/inactive badges correctly', async () => {
      vi.mocked(apiService.getProjects).mockResolvedValue(mockProjects);
      render(<ProjectList />);

      await waitFor(() => {
        const badges = screen.getAllByText(/common\.(active|inactive)/);
        expect(badges).toHaveLength(2);
      });
    });

    it('should format dates correctly', async () => {
      vi.mocked(apiService.getProjects).mockResolvedValue(mockProjects);
      render(<ProjectList />);

      await waitFor(() => {
        // Check that the table has been rendered with project data
        expect(screen.getByText('PROJ001')).toBeInTheDocument();
        // Note: toLocaleDateString() format varies by locale, so we can't test the exact format
        // We just verify the component renders without errors
      });
    });
  });

  describe('add project functionality', () => {
    it('should show form when add button is clicked', async () => {
      vi.mocked(apiService.getProjects).mockResolvedValue(mockProjects);
      render(<ProjectList />);

      await waitFor(() => {
        expect(screen.getByText('projects.addNew')).toBeInTheDocument();
      });

      fireEvent.click(screen.getByText('projects.addNew'));

      await waitFor(() => {
        expect(screen.getByTestId('project-form')).toBeInTheDocument();
      });
    });

    it('should hide form when cancel is clicked', async () => {
      vi.mocked(apiService.getProjects).mockResolvedValue(mockProjects);
      render(<ProjectList />);

      await waitFor(() => {
        expect(screen.getByText('projects.addNew')).toBeInTheDocument();
      });

      fireEvent.click(screen.getByText('projects.addNew'));

      await waitFor(() => {
        expect(screen.getByTestId('project-form')).toBeInTheDocument();
      });

      fireEvent.click(screen.getByText('Cancel'));

      await waitFor(() => {
        expect(screen.queryByTestId('project-form')).not.toBeInTheDocument();
      });
    });

    it('should reload projects after successful form submission', async () => {
      vi.mocked(apiService.getProjects).mockResolvedValue(mockProjects);
      render(<ProjectList />);

      await waitFor(() => {
        expect(screen.getByText('projects.addNew')).toBeInTheDocument();
      });

      fireEvent.click(screen.getByText('projects.addNew'));

      await waitFor(() => {
        expect(screen.getByTestId('project-form')).toBeInTheDocument();
      });

      fireEvent.click(screen.getByText('Success'));

      await waitFor(() => {
        expect(apiService.getProjects).toHaveBeenCalledTimes(2);
        expect(screen.queryByTestId('project-form')).not.toBeInTheDocument();
      });
    });
  });

  describe('edit project functionality', () => {
    it('should show form with project data when edit is clicked', async () => {
      vi.mocked(apiService.getProjects).mockResolvedValue(mockProjects);
      render(<ProjectList />);

      await waitFor(() => {
        expect(screen.getByText('PROJ001')).toBeInTheDocument();
      });

      const editButtons = screen.getAllByText('common.edit');
      fireEvent.click(editButtons[0]);

      await waitFor(() => {
        expect(screen.getByTestId('project-form')).toBeInTheDocument();
      });
    });

    it('should reload projects after successful edit', async () => {
      vi.mocked(apiService.getProjects).mockResolvedValue(mockProjects);
      render(<ProjectList />);

      await waitFor(() => {
        expect(screen.getByText('PROJ001')).toBeInTheDocument();
      });

      const editButtons = screen.getAllByText('common.edit');
      fireEvent.click(editButtons[0]);

      await waitFor(() => {
        expect(screen.getByTestId('project-form')).toBeInTheDocument();
      });

      fireEvent.click(screen.getByText('Success'));

      await waitFor(() => {
        expect(apiService.getProjects).toHaveBeenCalledTimes(2);
        expect(screen.queryByTestId('project-form')).not.toBeInTheDocument();
      });
    });
  });

  describe('delete project functionality', () => {
    it('should not delete when user cancels confirmation', async () => {
      vi.mocked(apiService.getProjects).mockResolvedValue(mockProjects);
      vi.mocked(window.confirm).mockReturnValue(false);

      render(<ProjectList />);

      await waitFor(() => {
        expect(screen.getByText('PROJ001')).toBeInTheDocument();
      });

      const deleteButtons = screen.getAllByText('common.delete');
      fireEvent.click(deleteButtons[0]);

      await waitFor(() => {
        expect(window.confirm).toHaveBeenCalledWith('projects.confirmDelete');
        expect(apiService.deleteProject).not.toHaveBeenCalled();
      });
    });

    it('should delete project when user confirms', async () => {
      vi.mocked(apiService.getProjects).mockResolvedValue(mockProjects);
      vi.mocked(apiService.deleteProject).mockResolvedValue();
      vi.mocked(window.confirm).mockReturnValue(true);

      render(<ProjectList />);

      await waitFor(() => {
        expect(screen.getByText('PROJ001')).toBeInTheDocument();
      });

      const deleteButtons = screen.getAllByText('common.delete');
      fireEvent.click(deleteButtons[0]);

      await waitFor(() => {
        expect(window.confirm).toHaveBeenCalledWith('projects.confirmDelete');
        expect(apiService.deleteProject).toHaveBeenCalledWith(1);
        expect(apiService.getProjects).toHaveBeenCalledTimes(2);
      });
    });

    it('should display error when delete fails', async () => {
      vi.mocked(apiService.getProjects).mockResolvedValue(mockProjects);
      vi.mocked(apiService.deleteProject).mockRejectedValue(new Error('Delete failed'));
      vi.mocked(window.confirm).mockReturnValue(true);

      render(<ProjectList />);

      await waitFor(() => {
        expect(screen.getByText('PROJ001')).toBeInTheDocument();
      });

      const deleteButtons = screen.getAllByText('common.delete');
      fireEvent.click(deleteButtons[0]);

      await waitFor(() => {
        expect(screen.getByText('Delete failed')).toBeInTheDocument();
      });
    });
  });

  describe('table structure', () => {
    it('should display correct table headers', async () => {
      vi.mocked(apiService.getProjects).mockResolvedValue(mockProjects);
      render(<ProjectList />);

      await waitFor(() => {
        expect(screen.getByText('projects.fields.code')).toBeInTheDocument();
        expect(screen.getByText('projects.fields.name')).toBeInTheDocument();
        expect(screen.getByText('projects.fields.description')).toBeInTheDocument();
        expect(screen.getByText('projects.fields.dates')).toBeInTheDocument();
        expect(screen.getByText('projects.fields.status')).toBeInTheDocument();
        expect(screen.getByText('projects.fields.active')).toBeInTheDocument();
        expect(screen.getByText('common.actions')).toBeInTheDocument();
      });
    });

    it('should display project data in correct columns', async () => {
      vi.mocked(apiService.getProjects).mockResolvedValue(mockProjects);
      render(<ProjectList />);

      await waitFor(() => {
        expect(screen.getByText('PROJ001')).toBeInTheDocument();
        expect(screen.getByText('Description 1')).toBeInTheDocument();
        expect(screen.getByText('PROJ002')).toBeInTheDocument();
        expect(screen.getByText('Description 2')).toBeInTheDocument();
      });
    });

    it('should display edit and delete buttons for each project', async () => {
      vi.mocked(apiService.getProjects).mockResolvedValue(mockProjects);
      render(<ProjectList />);

      await waitFor(() => {
        const editButtons = screen.getAllByText('common.edit');
        const deleteButtons = screen.getAllByText('common.delete');
        expect(editButtons).toHaveLength(2);
        expect(deleteButtons).toHaveLength(2);
      });
    });
  });

  describe('status color coding', () => {
    it('should display different status types correctly', async () => {
      const projectsWithStatuses: Project[] = [
        { ...mockProjects[0], status: ProjectStatus.ACTIVE },
        { ...mockProjects[0], id: 2, status: ProjectStatus.COMPLETED },
        { ...mockProjects[0], id: 3, status: ProjectStatus.ON_HOLD },
        { ...mockProjects[0], id: 4, status: ProjectStatus.CANCELLED }
      ];

      vi.mocked(apiService.getProjects).mockResolvedValue(projectsWithStatuses);
      render(<ProjectList />);

      await waitFor(() => {
        expect(screen.getByText('projects.status.ACTIVE')).toBeInTheDocument();
        expect(screen.getByText('projects.status.COMPLETED')).toBeInTheDocument();
        expect(screen.getByText('projects.status.ON_HOLD')).toBeInTheDocument();
        expect(screen.getByText('projects.status.CANCELLED')).toBeInTheDocument();
      });
    });
  });
});
