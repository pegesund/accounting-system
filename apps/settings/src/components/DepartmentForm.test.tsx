import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import DepartmentForm from './DepartmentForm';
import { apiService } from '../services/api';
import { Department } from '../types';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key })
}));

vi.mock('../services/api', () => ({
  apiService: {
    createDepartment: vi.fn(),
    updateDepartment: vi.fn()
  }
}));

describe('DepartmentForm', () => {
  const mockOnSuccess = vi.fn();
  const mockOnCancel = vi.fn();

  const existingDepartment: Department = {
    id: 1,
    code: 'DEPT001',
    name: 'Department 1',
    description: 'Description 1',
    active: true,
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z'
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('basic rendering', () => {
    it('should render create form when department is null', () => {
      render(
        <DepartmentForm
          department={null}
          onSuccess={mockOnSuccess}
          onCancel={mockOnCancel}
        />
      );

      expect(screen.getByText('departments.create')).toBeInTheDocument();
      expect(screen.getByLabelText('departments.fields.code')).toBeInTheDocument();
      expect(screen.getByLabelText('departments.fields.name')).toBeInTheDocument();
      expect(screen.getByLabelText('departments.fields.description')).toBeInTheDocument();
      expect(screen.getByLabelText('departments.fields.active')).toBeInTheDocument();
    });

    it('should render edit form when department is provided', () => {
      render(
        <DepartmentForm
          department={existingDepartment}
          onSuccess={mockOnSuccess}
          onCancel={mockOnCancel}
        />
      );

      expect(screen.getByText('departments.edit')).toBeInTheDocument();
      expect(screen.getByDisplayValue('DEPT001')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Department 1')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Description 1')).toBeInTheDocument();
    });

    it('should display save and cancel buttons', () => {
      render(
        <DepartmentForm
          department={null}
          onSuccess={mockOnSuccess}
          onCancel={mockOnCancel}
        />
      );

      expect(screen.getByText('common.save')).toBeInTheDocument();
      expect(screen.getByText('common.cancel')).toBeInTheDocument();
    });

    it('should have active checkbox checked by default for new department', () => {
      render(
        <DepartmentForm
          department={null}
          onSuccess={mockOnSuccess}
          onCancel={mockOnCancel}
        />
      );

      const activeCheckbox = screen.getByLabelText('departments.fields.active') as HTMLInputElement;
      expect(activeCheckbox.checked).toBe(true);
    });
  });

  describe('form input handling', () => {
    it('should update code input when typing', () => {
      render(
        <DepartmentForm
          department={null}
          onSuccess={mockOnSuccess}
          onCancel={mockOnCancel}
        />
      );

      const codeInput = screen.getByLabelText('departments.fields.code') as HTMLInputElement;
      fireEvent.change(codeInput, { target: { value: 'DEPT123' } });

      expect(codeInput.value).toBe('DEPT123');
    });

    it('should update name input when typing', () => {
      render(
        <DepartmentForm
          department={null}
          onSuccess={mockOnSuccess}
          onCancel={mockOnCancel}
        />
      );

      const nameInput = screen.getByLabelText('departments.fields.name') as HTMLInputElement;
      fireEvent.change(nameInput, { target: { value: 'New Department' } });

      expect(nameInput.value).toBe('New Department');
    });

    it('should update description textarea when typing', () => {
      render(
        <DepartmentForm
          department={null}
          onSuccess={mockOnSuccess}
          onCancel={mockOnCancel}
        />
      );

      const descriptionInput = screen.getByLabelText('departments.fields.description') as HTMLTextAreaElement;
      fireEvent.change(descriptionInput, { target: { value: 'New description' } });

      expect(descriptionInput.value).toBe('New description');
    });

    it('should toggle active checkbox when clicked', () => {
      render(
        <DepartmentForm
          department={null}
          onSuccess={mockOnSuccess}
          onCancel={mockOnCancel}
        />
      );

      const activeCheckbox = screen.getByLabelText('departments.fields.active') as HTMLInputElement;
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
        <DepartmentForm
          department={null}
          onSuccess={mockOnSuccess}
          onCancel={mockOnCancel}
        />
      );

      const nameInput = screen.getByLabelText('departments.fields.name');
      fireEvent.change(nameInput, { target: { value: 'Department Name' } });

      const submitButton = screen.getByText('common.save');
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('departments.validation.codeRequired')).toBeInTheDocument();
      });

      expect(apiService.createDepartment).not.toHaveBeenCalled();
    });

    it('should show validation error when name is empty', async () => {
      render(
        <DepartmentForm
          department={null}
          onSuccess={mockOnSuccess}
          onCancel={mockOnCancel}
        />
      );

      const codeInput = screen.getByLabelText('departments.fields.code');
      fireEvent.change(codeInput, { target: { value: 'DEPT001' } });

      const submitButton = screen.getByText('common.save');
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('departments.validation.nameRequired')).toBeInTheDocument();
      });

      expect(apiService.createDepartment).not.toHaveBeenCalled();
    });

    it('should clear validation errors when user types', async () => {
      render(
        <DepartmentForm
          department={null}
          onSuccess={mockOnSuccess}
          onCancel={mockOnCancel}
        />
      );

      const submitButton = screen.getByText('common.save');
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('departments.validation.codeRequired')).toBeInTheDocument();
      });

      const codeInput = screen.getByLabelText('departments.fields.code');
      fireEvent.change(codeInput, { target: { value: 'DEPT001' } });

      await waitFor(() => {
        expect(screen.queryByText('departments.validation.codeRequired')).not.toBeInTheDocument();
      });
    });

    it('should not submit with whitespace-only values', async () => {
      render(
        <DepartmentForm
          department={null}
          onSuccess={mockOnSuccess}
          onCancel={mockOnCancel}
        />
      );

      const codeInput = screen.getByLabelText('departments.fields.code');
      const nameInput = screen.getByLabelText('departments.fields.name');

      fireEvent.change(codeInput, { target: { value: '   ' } });
      fireEvent.change(nameInput, { target: { value: '   ' } });

      const submitButton = screen.getByText('common.save');
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('departments.validation.codeRequired')).toBeInTheDocument();
        expect(screen.getByText('departments.validation.nameRequired')).toBeInTheDocument();
      });

      expect(apiService.createDepartment).not.toHaveBeenCalled();
    });
  });

  describe('create department', () => {
    it('should call createDepartment API when form is valid', async () => {
      vi.mocked(apiService.createDepartment).mockResolvedValue(existingDepartment);

      render(
        <DepartmentForm
          department={null}
          onSuccess={mockOnSuccess}
          onCancel={mockOnCancel}
        />
      );

      const codeInput = screen.getByLabelText('departments.fields.code');
      const nameInput = screen.getByLabelText('departments.fields.name');
      const descriptionInput = screen.getByLabelText('departments.fields.description');

      fireEvent.change(codeInput, { target: { value: 'DEPT001' } });
      fireEvent.change(nameInput, { target: { value: 'Department 1' } });
      fireEvent.change(descriptionInput, { target: { value: 'Description 1' } });

      const submitButton = screen.getByText('common.save');
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(apiService.createDepartment).toHaveBeenCalledWith({
          code: 'DEPT001',
          name: 'Department 1',
          description: 'Description 1',
          active: true
        });
        expect(mockOnSuccess).toHaveBeenCalled();
      });
    });

    it('should display saving state during submission', async () => {
      vi.mocked(apiService.createDepartment).mockImplementation(() => new Promise(() => {}));

      render(
        <DepartmentForm
          department={null}
          onSuccess={mockOnSuccess}
          onCancel={mockOnCancel}
        />
      );

      const codeInput = screen.getByLabelText('departments.fields.code');
      const nameInput = screen.getByLabelText('departments.fields.name');

      fireEvent.change(codeInput, { target: { value: 'DEPT001' } });
      fireEvent.change(nameInput, { target: { value: 'Department 1' } });

      const submitButton = screen.getByText('common.save');
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('common.saving')).toBeInTheDocument();
        const button = screen.getByText('common.saving') as HTMLButtonElement;
        expect(button.disabled).toBe(true);
      });
    });

    it('should display error message when creation fails', async () => {
      vi.mocked(apiService.createDepartment).mockRejectedValue({
        message: 'Creation failed'
      });

      render(
        <DepartmentForm
          department={null}
          onSuccess={mockOnSuccess}
          onCancel={mockOnCancel}
        />
      );

      const codeInput = screen.getByLabelText('departments.fields.code');
      const nameInput = screen.getByLabelText('departments.fields.name');

      fireEvent.change(codeInput, { target: { value: 'DEPT001' } });
      fireEvent.change(nameInput, { target: { value: 'Department 1' } });

      const submitButton = screen.getByText('common.save');
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('Creation failed')).toBeInTheDocument();
        expect(mockOnSuccess).not.toHaveBeenCalled();
      });
    });

    it('should display field-specific errors from API', async () => {
      vi.mocked(apiService.createDepartment).mockRejectedValue({
        message: 'Validation failed',
        errors: {
          code: 'Code already exists'
        }
      });

      render(
        <DepartmentForm
          department={null}
          onSuccess={mockOnSuccess}
          onCancel={mockOnCancel}
        />
      );

      const codeInput = screen.getByLabelText('departments.fields.code');
      const nameInput = screen.getByLabelText('departments.fields.name');

      fireEvent.change(codeInput, { target: { value: 'DEPT001' } });
      fireEvent.change(nameInput, { target: { value: 'Department 1' } });

      const submitButton = screen.getByText('common.save');
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('Code already exists')).toBeInTheDocument();
      });
    });
  });

  describe('update department', () => {
    it('should call updateDepartment API when editing existing department', async () => {
      vi.mocked(apiService.updateDepartment).mockResolvedValue(existingDepartment);

      render(
        <DepartmentForm
          department={existingDepartment}
          onSuccess={mockOnSuccess}
          onCancel={mockOnCancel}
        />
      );

      const nameInput = screen.getByLabelText('departments.fields.name');
      fireEvent.change(nameInput, { target: { value: 'Updated Department' } });

      const submitButton = screen.getByText('common.save');
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(apiService.updateDepartment).toHaveBeenCalledWith(1, {
          code: 'DEPT001',
          name: 'Updated Department',
          description: 'Description 1',
          active: true
        });
        expect(mockOnSuccess).toHaveBeenCalled();
      });
    });

    it('should display error message when update fails', async () => {
      vi.mocked(apiService.updateDepartment).mockRejectedValue({
        message: 'Update failed'
      });

      render(
        <DepartmentForm
          department={existingDepartment}
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
        <DepartmentForm
          department={null}
          onSuccess={mockOnSuccess}
          onCancel={mockOnCancel}
        />
      );

      const cancelButton = screen.getByText('common.cancel');
      fireEvent.click(cancelButton);

      expect(mockOnCancel).toHaveBeenCalled();
      expect(apiService.createDepartment).not.toHaveBeenCalled();
    });

    it('should not submit form when cancel is clicked', () => {
      render(
        <DepartmentForm
          department={null}
          onSuccess={mockOnSuccess}
          onCancel={mockOnCancel}
        />
      );

      const codeInput = screen.getByLabelText('departments.fields.code');
      fireEvent.change(codeInput, { target: { value: 'DEPT001' } });

      const cancelButton = screen.getByText('common.cancel');
      fireEvent.click(cancelButton);

      expect(mockOnCancel).toHaveBeenCalled();
      expect(apiService.createDepartment).not.toHaveBeenCalled();
    });
  });
});
