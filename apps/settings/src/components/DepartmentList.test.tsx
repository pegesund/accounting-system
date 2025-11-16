import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import DepartmentList from './DepartmentList';
import { apiService } from '../services/api';
import { Department } from '../types';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key })
}));

vi.mock('../services/api', () => ({
  apiService: {
    getDepartments: vi.fn(),
    deleteDepartment: vi.fn()
  }
}));

vi.mock('./DepartmentForm', () => ({
  default: ({ onSuccess, onCancel }: any) => (
    <div data-testid="department-form">
      <button onClick={onSuccess}>Success</button>
      <button onClick={onCancel}>Cancel</button>
    </div>
  )
}));

describe('DepartmentList', () => {
  const mockDepartments: Department[] = [
    {
      id: 1,
      code: 'DEPT001',
      name: 'Department 1',
      description: 'Description 1',
      active: true,
      createdAt: '2025-01-01T00:00:00Z',
      updatedAt: '2025-01-01T00:00:00Z'
    },
    {
      id: 2,
      code: 'DEPT002',
      name: 'Department 2',
      description: 'Description 2',
      active: false,
      createdAt: '2025-01-01T00:00:00Z',
      updatedAt: '2025-01-01T00:00:00Z'
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
      vi.mocked(apiService.getDepartments).mockImplementation(() => new Promise(() => {}));
      render(<DepartmentList />);
      expect(screen.getByText('common.loading')).toBeInTheDocument();
    });

    it('should display departments after loading', async () => {
      vi.mocked(apiService.getDepartments).mockResolvedValue(mockDepartments);
      render(<DepartmentList />);

      await waitFor(() => {
        expect(screen.getByText('DEPT001')).toBeInTheDocument();
        expect(screen.getByText('DEPT002')).toBeInTheDocument();
        expect(screen.getByText('Department 1')).toBeInTheDocument();
        expect(screen.getByText('Department 2')).toBeInTheDocument();
      });
    });

    it('should display no data message when departments list is empty', async () => {
      vi.mocked(apiService.getDepartments).mockResolvedValue([]);
      render(<DepartmentList />);

      await waitFor(() => {
        expect(screen.getByText('departments.noData')).toBeInTheDocument();
      });
    });

    it('should display error message when loading fails', async () => {
      vi.mocked(apiService.getDepartments).mockRejectedValue(new Error('Load failed'));
      render(<DepartmentList />);

      await waitFor(() => {
        expect(screen.getByText('Load failed')).toBeInTheDocument();
      });
    });

    it('should display title and add button', async () => {
      vi.mocked(apiService.getDepartments).mockResolvedValue(mockDepartments);
      render(<DepartmentList />);

      await waitFor(() => {
        expect(screen.getByText('departments.title')).toBeInTheDocument();
        expect(screen.getByText('departments.addNew')).toBeInTheDocument();
      });
    });

    it('should display active/inactive badges correctly', async () => {
      vi.mocked(apiService.getDepartments).mockResolvedValue(mockDepartments);
      render(<DepartmentList />);

      await waitFor(() => {
        const badges = screen.getAllByText(/common\.(active|inactive)/);
        expect(badges).toHaveLength(2);
      });
    });
  });

  describe('add department functionality', () => {
    it('should show form when add button is clicked', async () => {
      vi.mocked(apiService.getDepartments).mockResolvedValue(mockDepartments);
      render(<DepartmentList />);

      await waitFor(() => {
        expect(screen.getByText('departments.addNew')).toBeInTheDocument();
      });

      fireEvent.click(screen.getByText('departments.addNew'));

      await waitFor(() => {
        expect(screen.getByTestId('department-form')).toBeInTheDocument();
      });
    });

    it('should hide form when cancel is clicked', async () => {
      vi.mocked(apiService.getDepartments).mockResolvedValue(mockDepartments);
      render(<DepartmentList />);

      await waitFor(() => {
        expect(screen.getByText('departments.addNew')).toBeInTheDocument();
      });

      fireEvent.click(screen.getByText('departments.addNew'));

      await waitFor(() => {
        expect(screen.getByTestId('department-form')).toBeInTheDocument();
      });

      fireEvent.click(screen.getByText('Cancel'));

      await waitFor(() => {
        expect(screen.queryByTestId('department-form')).not.toBeInTheDocument();
      });
    });

    it('should reload departments after successful form submission', async () => {
      vi.mocked(apiService.getDepartments).mockResolvedValue(mockDepartments);
      render(<DepartmentList />);

      await waitFor(() => {
        expect(screen.getByText('departments.addNew')).toBeInTheDocument();
      });

      fireEvent.click(screen.getByText('departments.addNew'));

      await waitFor(() => {
        expect(screen.getByTestId('department-form')).toBeInTheDocument();
      });

      fireEvent.click(screen.getByText('Success'));

      await waitFor(() => {
        expect(apiService.getDepartments).toHaveBeenCalledTimes(2);
        expect(screen.queryByTestId('department-form')).not.toBeInTheDocument();
      });
    });
  });

  describe('edit department functionality', () => {
    it('should show form with department data when edit is clicked', async () => {
      vi.mocked(apiService.getDepartments).mockResolvedValue(mockDepartments);
      render(<DepartmentList />);

      await waitFor(() => {
        expect(screen.getByText('DEPT001')).toBeInTheDocument();
      });

      const editButtons = screen.getAllByText('common.edit');
      fireEvent.click(editButtons[0]);

      await waitFor(() => {
        expect(screen.getByTestId('department-form')).toBeInTheDocument();
      });
    });

    it('should reload departments after successful edit', async () => {
      vi.mocked(apiService.getDepartments).mockResolvedValue(mockDepartments);
      render(<DepartmentList />);

      await waitFor(() => {
        expect(screen.getByText('DEPT001')).toBeInTheDocument();
      });

      const editButtons = screen.getAllByText('common.edit');
      fireEvent.click(editButtons[0]);

      await waitFor(() => {
        expect(screen.getByTestId('department-form')).toBeInTheDocument();
      });

      fireEvent.click(screen.getByText('Success'));

      await waitFor(() => {
        expect(apiService.getDepartments).toHaveBeenCalledTimes(2);
        expect(screen.queryByTestId('department-form')).not.toBeInTheDocument();
      });
    });
  });

  describe('delete department functionality', () => {
    it('should not delete when user cancels confirmation', async () => {
      vi.mocked(apiService.getDepartments).mockResolvedValue(mockDepartments);
      vi.mocked(window.confirm).mockReturnValue(false);

      render(<DepartmentList />);

      await waitFor(() => {
        expect(screen.getByText('DEPT001')).toBeInTheDocument();
      });

      const deleteButtons = screen.getAllByText('common.delete');
      fireEvent.click(deleteButtons[0]);

      await waitFor(() => {
        expect(window.confirm).toHaveBeenCalledWith('departments.confirmDelete');
        expect(apiService.deleteDepartment).not.toHaveBeenCalled();
      });
    });

    it('should delete department when user confirms', async () => {
      vi.mocked(apiService.getDepartments).mockResolvedValue(mockDepartments);
      vi.mocked(apiService.deleteDepartment).mockResolvedValue();
      vi.mocked(window.confirm).mockReturnValue(true);

      render(<DepartmentList />);

      await waitFor(() => {
        expect(screen.getByText('DEPT001')).toBeInTheDocument();
      });

      const deleteButtons = screen.getAllByText('common.delete');
      fireEvent.click(deleteButtons[0]);

      await waitFor(() => {
        expect(window.confirm).toHaveBeenCalledWith('departments.confirmDelete');
        expect(apiService.deleteDepartment).toHaveBeenCalledWith(1);
        expect(apiService.getDepartments).toHaveBeenCalledTimes(2);
      });
    });

    it('should display error when delete fails', async () => {
      vi.mocked(apiService.getDepartments).mockResolvedValue(mockDepartments);
      vi.mocked(apiService.deleteDepartment).mockRejectedValue(new Error('Delete failed'));
      vi.mocked(window.confirm).mockReturnValue(true);

      render(<DepartmentList />);

      await waitFor(() => {
        expect(screen.getByText('DEPT001')).toBeInTheDocument();
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
      vi.mocked(apiService.getDepartments).mockResolvedValue(mockDepartments);
      render(<DepartmentList />);

      await waitFor(() => {
        expect(screen.getByText('departments.fields.code')).toBeInTheDocument();
        expect(screen.getByText('departments.fields.name')).toBeInTheDocument();
        expect(screen.getByText('departments.fields.description')).toBeInTheDocument();
        expect(screen.getByText('departments.fields.active')).toBeInTheDocument();
        expect(screen.getByText('common.actions')).toBeInTheDocument();
      });
    });

    it('should display department data in correct columns', async () => {
      vi.mocked(apiService.getDepartments).mockResolvedValue(mockDepartments);
      render(<DepartmentList />);

      await waitFor(() => {
        expect(screen.getByText('DEPT001')).toBeInTheDocument();
        expect(screen.getByText('Description 1')).toBeInTheDocument();
        expect(screen.getByText('DEPT002')).toBeInTheDocument();
        expect(screen.getByText('Description 2')).toBeInTheDocument();
      });
    });

    it('should display edit and delete buttons for each department', async () => {
      vi.mocked(apiService.getDepartments).mockResolvedValue(mockDepartments);
      render(<DepartmentList />);

      await waitFor(() => {
        const editButtons = screen.getAllByText('common.edit');
        const deleteButtons = screen.getAllByText('common.delete');
        expect(editButtons).toHaveLength(2);
        expect(deleteButtons).toHaveLength(2);
      });
    });
  });
});
