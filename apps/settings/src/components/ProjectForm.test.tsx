import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ProjectForm from './ProjectForm';
import { apiService } from '../services/api';
import { Project, ProjectStatus } from '../types';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key })
}));

vi.mock('../services/api', () => ({
  apiService: {
    createProject: vi.fn(),
    updateProject: vi.fn()
  }
}));

describe('ProjectForm', () => {
  const mockOnSuccess = vi.fn();
  const mockOnCancel = vi.fn();

  const existingProject: Project = {
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
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('basic rendering', () => {
    it('should render create form when project is null', () => {
      render(
        <ProjectForm
          project={null}
          onSuccess={mockOnSuccess}
          onCancel={mockOnCancel}
        />
      );

      expect(screen.getByText('projects.create')).toBeInTheDocument();
      expect(screen.getByLabelText('projects.fields.code')).toBeInTheDocument();
      expect(screen.getByLabelText('projects.fields.name')).toBeInTheDocument();
      expect(screen.getByLabelText('projects.fields.description')).toBeInTheDocument();
      expect(screen.getByLabelText('projects.fields.startDate')).toBeInTheDocument();
      expect(screen.getByLabelText('projects.fields.endDate')).toBeInTheDocument();
      expect(screen.getByLabelText('projects.fields.status')).toBeInTheDocument();
      expect(screen.getByLabelText('projects.fields.active')).toBeInTheDocument();
    });

    it('should render edit form when project is provided', () => {
      render(
        <ProjectForm
          project={existingProject}
          onSuccess={mockOnSuccess}
          onCancel={mockOnCancel}
        />
      );

      expect(screen.getByText('projects.edit')).toBeInTheDocument();
      expect(screen.getByDisplayValue('PROJ001')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Project 1')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Description 1')).toBeInTheDocument();
      expect(screen.getByDisplayValue('2025-01-01')).toBeInTheDocument();
      expect(screen.getByDisplayValue('2025-12-31')).toBeInTheDocument();
    });

    it('should display save and cancel buttons', () => {
      render(
        <ProjectForm
          project={null}
          onSuccess={mockOnSuccess}
          onCancel={mockOnCancel}
        />
      );

      expect(screen.getByText('common.save')).toBeInTheDocument();
      expect(screen.getByText('common.cancel')).toBeInTheDocument();
    });

    it('should have active checkbox checked by default for new project', () => {
      render(
        <ProjectForm
          project={null}
          onSuccess={mockOnSuccess}
          onCancel={mockOnCancel}
        />
      );

      const activeCheckbox = screen.getByLabelText('projects.fields.active') as HTMLInputElement;
      expect(activeCheckbox.checked).toBe(true);
    });

    it('should display status dropdown with all options', () => {
      render(
        <ProjectForm
          project={null}
          onSuccess={mockOnSuccess}
          onCancel={mockOnCancel}
        />
      );

      const statusSelect = screen.getByLabelText('projects.fields.status') as HTMLSelectElement;
      expect(statusSelect).toBeInTheDocument();

      const options = Array.from(statusSelect.options).map(opt => opt.value);
      expect(options).toContain(ProjectStatus.ACTIVE);
      expect(options).toContain(ProjectStatus.COMPLETED);
      expect(options).toContain(ProjectStatus.ON_HOLD);
      expect(options).toContain(ProjectStatus.CANCELLED);
    });
  });

  describe('form input handling', () => {
    it('should update code input when typing', () => {
      render(
        <ProjectForm
          project={null}
          onSuccess={mockOnSuccess}
          onCancel={mockOnCancel}
        />
      );

      const codeInput = screen.getByLabelText('projects.fields.code') as HTMLInputElement;
      fireEvent.change(codeInput, { target: { value: 'PROJ123' } });

      expect(codeInput.value).toBe('PROJ123');
    });

    it('should update name input when typing', () => {
      render(
        <ProjectForm
          project={null}
          onSuccess={mockOnSuccess}
          onCancel={mockOnCancel}
        />
      );

      const nameInput = screen.getByLabelText('projects.fields.name') as HTMLInputElement;
      fireEvent.change(nameInput, { target: { value: 'New Project' } });

      expect(nameInput.value).toBe('New Project');
    });

    it('should update description textarea when typing', () => {
      render(
        <ProjectForm
          project={null}
          onSuccess={mockOnSuccess}
          onCancel={mockOnCancel}
        />
      );

      const descriptionInput = screen.getByLabelText('projects.fields.description') as HTMLTextAreaElement;
      fireEvent.change(descriptionInput, { target: { value: 'New description' } });

      expect(descriptionInput.value).toBe('New description');
    });

    it('should update start date when changed', () => {
      render(
        <ProjectForm
          project={null}
          onSuccess={mockOnSuccess}
          onCancel={mockOnCancel}
        />
      );

      const startDateInput = screen.getByLabelText('projects.fields.startDate') as HTMLInputElement;
      fireEvent.change(startDateInput, { target: { value: '2025-06-01' } });

      expect(startDateInput.value).toBe('2025-06-01');
    });

    it('should update end date when changed', () => {
      render(
        <ProjectForm
          project={null}
          onSuccess={mockOnSuccess}
          onCancel={mockOnCancel}
        />
      );

      const endDateInput = screen.getByLabelText('projects.fields.endDate') as HTMLInputElement;
      fireEvent.change(endDateInput, { target: { value: '2025-12-31' } });

      expect(endDateInput.value).toBe('2025-12-31');
    });

    it('should update status dropdown when changed', () => {
      render(
        <ProjectForm
          project={null}
          onSuccess={mockOnSuccess}
          onCancel={mockOnCancel}
        />
      );

      const statusSelect = screen.getByLabelText('projects.fields.status') as HTMLSelectElement;
      fireEvent.change(statusSelect, { target: { value: ProjectStatus.COMPLETED } });

      expect(statusSelect.value).toBe(ProjectStatus.COMPLETED);
    });

    it('should toggle active checkbox when clicked', () => {
      render(
        <ProjectForm
          project={null}
          onSuccess={mockOnSuccess}
          onCancel={mockOnCancel}
        />
      );

      const activeCheckbox = screen.getByLabelText('projects.fields.active') as HTMLInputElement;
      expect(activeCheckbox.checked).toBe(true);

      fireEvent.click(activeCheckbox);
      expect(activeCheckbox.checked).toBe(false);

      fireEvent.click(activeCheckbox);
      expect(activeCheckbox.checked).toBe(true);
    });
  });

  describe('form validation', () => {
    it('should show validation error when code is empty', async () => {
      render(
        <ProjectForm
          project={null}
          onSuccess={mockOnSuccess}
          onCancel={mockOnCancel}
        />
      );

      const nameInput = screen.getByLabelText('projects.fields.name');
      fireEvent.change(nameInput, { target: { value: 'Project Name' } });

      const submitButton = screen.getByText('common.save');
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('projects.validation.codeRequired')).toBeInTheDocument();
      });

      expect(apiService.createProject).not.toHaveBeenCalled();
    });

    it('should show validation error when name is empty', async () => {
      render(
        <ProjectForm
          project={null}
          onSuccess={mockOnSuccess}
          onCancel={mockOnCancel}
        />
      );

      const codeInput = screen.getByLabelText('projects.fields.code');
      fireEvent.change(codeInput, { target: { value: 'PROJ001' } });

      const submitButton = screen.getByText('common.save');
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('projects.validation.nameRequired')).toBeInTheDocument();
      });

      expect(apiService.createProject).not.toHaveBeenCalled();
    });

    it('should show validation error when start date is empty', async () => {
      render(
        <ProjectForm
          project={null}
          onSuccess={mockOnSuccess}
          onCancel={mockOnCancel}
        />
      );

      const codeInput = screen.getByLabelText('projects.fields.code');
      const nameInput = screen.getByLabelText('projects.fields.name');

      fireEvent.change(codeInput, { target: { value: 'PROJ001' } });
      fireEvent.change(nameInput, { target: { value: 'Project 1' } });

      const submitButton = screen.getByText('common.save');
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('projects.validation.startDateRequired')).toBeInTheDocument();
      });

      expect(apiService.createProject).not.toHaveBeenCalled();
    });

    it('should show validation error when end date is empty', async () => {
      render(
        <ProjectForm
          project={null}
          onSuccess={mockOnSuccess}
          onCancel={mockOnCancel}
        />
      );

      const codeInput = screen.getByLabelText('projects.fields.code');
      const nameInput = screen.getByLabelText('projects.fields.name');
      const startDateInput = screen.getByLabelText('projects.fields.startDate');

      fireEvent.change(codeInput, { target: { value: 'PROJ001' } });
      fireEvent.change(nameInput, { target: { value: 'Project 1' } });
      fireEvent.change(startDateInput, { target: { value: '2025-01-01' } });

      const submitButton = screen.getByText('common.save');
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('projects.validation.endDateRequired')).toBeInTheDocument();
      });

      expect(apiService.createProject).not.toHaveBeenCalled();
    });

    it('should show validation error when end date is before start date', async () => {
      render(
        <ProjectForm
          project={null}
          onSuccess={mockOnSuccess}
          onCancel={mockOnCancel}
        />
      );

      const codeInput = screen.getByLabelText('projects.fields.code');
      const nameInput = screen.getByLabelText('projects.fields.name');
      const startDateInput = screen.getByLabelText('projects.fields.startDate');
      const endDateInput = screen.getByLabelText('projects.fields.endDate');

      fireEvent.change(codeInput, { target: { value: 'PROJ001' } });
      fireEvent.change(nameInput, { target: { value: 'Project 1' } });
      fireEvent.change(startDateInput, { target: { value: '2025-12-31' } });
      fireEvent.change(endDateInput, { target: { value: '2025-01-01' } });

      const submitButton = screen.getByText('common.save');
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('projects.validation.endDateAfterStart')).toBeInTheDocument();
      });

      expect(apiService.createProject).not.toHaveBeenCalled();
    });

    it('should clear validation errors when user types', async () => {
      render(
        <ProjectForm
          project={null}
          onSuccess={mockOnSuccess}
          onCancel={mockOnCancel}
        />
      );

      const submitButton = screen.getByText('common.save');
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('projects.validation.codeRequired')).toBeInTheDocument();
      });

      const codeInput = screen.getByLabelText('projects.fields.code');
      fireEvent.change(codeInput, { target: { value: 'PROJ001' } });

      await waitFor(() => {
        expect(screen.queryByText('projects.validation.codeRequired')).not.toBeInTheDocument();
      });
    });

    it('should not submit with whitespace-only values', async () => {
      render(
        <ProjectForm
          project={null}
          onSuccess={mockOnSuccess}
          onCancel={mockOnCancel}
        />
      );

      const codeInput = screen.getByLabelText('projects.fields.code');
      const nameInput = screen.getByLabelText('projects.fields.name');

      fireEvent.change(codeInput, { target: { value: '   ' } });
      fireEvent.change(nameInput, { target: { value: '   ' } });

      const submitButton = screen.getByText('common.save');
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('projects.validation.codeRequired')).toBeInTheDocument();
        expect(screen.getByText('projects.validation.nameRequired')).toBeInTheDocument();
      });

      expect(apiService.createProject).not.toHaveBeenCalled();
    });
  });

  describe('create project', () => {
    it('should call createProject API when form is valid', async () => {
      vi.mocked(apiService.createProject).mockResolvedValue(existingProject);

      render(
        <ProjectForm
          project={null}
          onSuccess={mockOnSuccess}
          onCancel={mockOnCancel}
        />
      );

      const codeInput = screen.getByLabelText('projects.fields.code');
      const nameInput = screen.getByLabelText('projects.fields.name');
      const descriptionInput = screen.getByLabelText('projects.fields.description');
      const startDateInput = screen.getByLabelText('projects.fields.startDate');
      const endDateInput = screen.getByLabelText('projects.fields.endDate');

      fireEvent.change(codeInput, { target: { value: 'PROJ001' } });
      fireEvent.change(nameInput, { target: { value: 'Project 1' } });
      fireEvent.change(descriptionInput, { target: { value: 'Description 1' } });
      fireEvent.change(startDateInput, { target: { value: '2025-01-01' } });
      fireEvent.change(endDateInput, { target: { value: '2025-12-31' } });

      const submitButton = screen.getByText('common.save');
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(apiService.createProject).toHaveBeenCalledWith({
          code: 'PROJ001',
          name: 'Project 1',
          description: 'Description 1',
          startDate: '2025-01-01',
          endDate: '2025-12-31',
          status: ProjectStatus.ACTIVE,
          active: true
        });
        expect(mockOnSuccess).toHaveBeenCalled();
      });
    });

    it('should display saving state during submission', async () => {
      vi.mocked(apiService.createProject).mockImplementation(() => new Promise(() => {}));

      render(
        <ProjectForm
          project={null}
          onSuccess={mockOnSuccess}
          onCancel={mockOnCancel}
        />
      );

      const codeInput = screen.getByLabelText('projects.fields.code');
      const nameInput = screen.getByLabelText('projects.fields.name');
      const startDateInput = screen.getByLabelText('projects.fields.startDate');
      const endDateInput = screen.getByLabelText('projects.fields.endDate');

      fireEvent.change(codeInput, { target: { value: 'PROJ001' } });
      fireEvent.change(nameInput, { target: { value: 'Project 1' } });
      fireEvent.change(startDateInput, { target: { value: '2025-01-01' } });
      fireEvent.change(endDateInput, { target: { value: '2025-12-31' } });

      const submitButton = screen.getByText('common.save');
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('common.saving')).toBeInTheDocument();
        const button = screen.getByText('common.saving') as HTMLButtonElement;
        expect(button.disabled).toBe(true);
      });
    });

    it('should display error message when creation fails', async () => {
      vi.mocked(apiService.createProject).mockRejectedValue({
        message: 'Creation failed'
      });

      render(
        <ProjectForm
          project={null}
          onSuccess={mockOnSuccess}
          onCancel={mockOnCancel}
        />
      );

      const codeInput = screen.getByLabelText('projects.fields.code');
      const nameInput = screen.getByLabelText('projects.fields.name');
      const startDateInput = screen.getByLabelText('projects.fields.startDate');
      const endDateInput = screen.getByLabelText('projects.fields.endDate');

      fireEvent.change(codeInput, { target: { value: 'PROJ001' } });
      fireEvent.change(nameInput, { target: { value: 'Project 1' } });
      fireEvent.change(startDateInput, { target: { value: '2025-01-01' } });
      fireEvent.change(endDateInput, { target: { value: '2025-12-31' } });

      const submitButton = screen.getByText('common.save');
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('Creation failed')).toBeInTheDocument();
        expect(mockOnSuccess).not.toHaveBeenCalled();
      });
    });

    it('should display field-specific errors from API', async () => {
      vi.mocked(apiService.createProject).mockRejectedValue({
        message: 'Validation failed',
        errors: {
          code: 'Code already exists'
        }
      });

      render(
        <ProjectForm
          project={null}
          onSuccess={mockOnSuccess}
          onCancel={mockOnCancel}
        />
      );

      const codeInput = screen.getByLabelText('projects.fields.code');
      const nameInput = screen.getByLabelText('projects.fields.name');
      const startDateInput = screen.getByLabelText('projects.fields.startDate');
      const endDateInput = screen.getByLabelText('projects.fields.endDate');

      fireEvent.change(codeInput, { target: { value: 'PROJ001' } });
      fireEvent.change(nameInput, { target: { value: 'Project 1' } });
      fireEvent.change(startDateInput, { target: { value: '2025-01-01' } });
      fireEvent.change(endDateInput, { target: { value: '2025-12-31' } });

      const submitButton = screen.getByText('common.save');
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('Code already exists')).toBeInTheDocument();
      });
    });
  });

  describe('update project', () => {
    it('should call updateProject API when editing existing project', async () => {
      vi.mocked(apiService.updateProject).mockResolvedValue(existingProject);

      render(
        <ProjectForm
          project={existingProject}
          onSuccess={mockOnSuccess}
          onCancel={mockOnCancel}
        />
      );

      const nameInput = screen.getByLabelText('projects.fields.name');
      fireEvent.change(nameInput, { target: { value: 'Updated Project' } });

      const submitButton = screen.getByText('common.save');
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(apiService.updateProject).toHaveBeenCalledWith(1, {
          code: 'PROJ001',
          name: 'Updated Project',
          description: 'Description 1',
          startDate: '2025-01-01',
          endDate: '2025-12-31',
          status: ProjectStatus.ACTIVE,
          active: true
        });
        expect(mockOnSuccess).toHaveBeenCalled();
      });
    });

    it('should display error message when update fails', async () => {
      vi.mocked(apiService.updateProject).mockRejectedValue({
        message: 'Update failed'
      });

      render(
        <ProjectForm
          project={existingProject}
          onSuccess={mockOnSuccess}
          onCancel={mockOnCancel}
        />
      );

      const submitButton = screen.getByText('common.save');
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('Update failed')).toBeInTheDocument();
        expect(mockOnSuccess).not.toHaveBeenCalled();
      });
    });
  });

  describe('cancel functionality', () => {
    it('should call onCancel when cancel button is clicked', () => {
      render(
        <ProjectForm
          project={null}
          onSuccess={mockOnSuccess}
          onCancel={mockOnCancel}
        />
      );

      const cancelButton = screen.getByText('common.cancel');
      fireEvent.click(cancelButton);

      expect(mockOnCancel).toHaveBeenCalled();
      expect(apiService.createProject).not.toHaveBeenCalled();
    });

    it('should not submit form when cancel is clicked', () => {
      render(
        <ProjectForm
          project={null}
          onSuccess={mockOnSuccess}
          onCancel={mockOnCancel}
        />
      );

      const codeInput = screen.getByLabelText('projects.fields.code');
      fireEvent.change(codeInput, { target: { value: 'PROJ001' } });

      const cancelButton = screen.getByText('common.cancel');
      fireEvent.click(cancelButton);

      expect(mockOnCancel).toHaveBeenCalled();
      expect(apiService.createProject).not.toHaveBeenCalled();
    });
  });
});
