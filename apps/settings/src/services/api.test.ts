import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { apiService } from './api';
import { Department, Project, ProjectStatus } from '../types';

describe('ApiService', () => {
  const mockDepartment: Department = {
    id: 1,
    code: 'DEPT001',
    name: 'Department 1',
    description: 'Description 1',
    active: true,
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z'
  };

  const mockProject: Project = {
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
    global.fetch = vi.fn();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Department API methods', () => {
    describe('getDepartments', () => {
      it('should fetch all departments successfully', async () => {
        const mockResponse = [mockDepartment];
        vi.mocked(global.fetch).mockResolvedValue({
          ok: true,
          json: async () => mockResponse
        } as Response);

        const result = await apiService.getDepartments();

        expect(global.fetch).toHaveBeenCalledWith('http://localhost:8082/api/departments');
        expect(result).toEqual(mockResponse);
      });

      it('should throw error when fetch fails', async () => {
        vi.mocked(global.fetch).mockResolvedValue({
          ok: false,
          status: 500,
          json: async () => ({ message: 'Server error' })
        } as Response);

        await expect(apiService.getDepartments()).rejects.toEqual({ message: 'Server error' });
      });

      it('should handle network error', async () => {
        vi.mocked(global.fetch).mockResolvedValue({
          ok: false,
          status: 404,
          json: async () => { throw new Error('Parse error'); }
        } as Response);

        await expect(apiService.getDepartments()).rejects.toEqual({
          message: 'HTTP error! status: 404'
        });
      });
    });

    describe('getDepartment', () => {
      it('should fetch a single department successfully', async () => {
        vi.mocked(global.fetch).mockResolvedValue({
          ok: true,
          json: async () => mockDepartment
        } as Response);

        const result = await apiService.getDepartment(1);

        expect(global.fetch).toHaveBeenCalledWith('http://localhost:8082/api/departments/1');
        expect(result).toEqual(mockDepartment);
      });

      it('should throw error when department not found', async () => {
        vi.mocked(global.fetch).mockResolvedValue({
          ok: false,
          status: 404,
          json: async () => ({ message: 'Department not found' })
        } as Response);

        await expect(apiService.getDepartment(999)).rejects.toEqual({
          message: 'Department not found'
        });
      });
    });

    describe('createDepartment', () => {
      it('should create a department successfully', async () => {
        const newDepartment = {
          code: 'DEPT001',
          name: 'Department 1',
          description: 'Description 1',
          active: true
        };

        vi.mocked(global.fetch).mockResolvedValue({
          ok: true,
          json: async () => mockDepartment
        } as Response);

        const result = await apiService.createDepartment(newDepartment);

        expect(global.fetch).toHaveBeenCalledWith('http://localhost:8082/api/departments', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(newDepartment)
        });
        expect(result).toEqual(mockDepartment);
      });

      it('should throw error when creation fails with validation errors', async () => {
        const newDepartment = {
          code: '',
          name: '',
          description: '',
          active: true
        };

        vi.mocked(global.fetch).mockResolvedValue({
          ok: false,
          status: 400,
          json: async () => ({
            message: 'Validation failed',
            errors: {
              code: 'Code is required',
              name: 'Name is required'
            }
          })
        } as Response);

        await expect(apiService.createDepartment(newDepartment)).rejects.toEqual({
          message: 'Validation failed',
          errors: {
            code: 'Code is required',
            name: 'Name is required'
          }
        });
      });
    });

    describe('updateDepartment', () => {
      it('should update a department successfully', async () => {
        const updateData = {
          code: 'DEPT001',
          name: 'Updated Department',
          description: 'Updated Description',
          active: true
        };

        const updatedDepartment = { ...mockDepartment, ...updateData };

        vi.mocked(global.fetch).mockResolvedValue({
          ok: true,
          json: async () => updatedDepartment
        } as Response);

        const result = await apiService.updateDepartment(1, updateData);

        expect(global.fetch).toHaveBeenCalledWith('http://localhost:8082/api/departments/1', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(updateData)
        });
        expect(result).toEqual(updatedDepartment);
      });

      it('should throw error when update fails', async () => {
        const updateData = {
          code: 'DEPT001',
          name: 'Updated Department',
          description: 'Updated Description',
          active: true
        };

        vi.mocked(global.fetch).mockResolvedValue({
          ok: false,
          status: 500,
          json: async () => ({ message: 'Update failed' })
        } as Response);

        await expect(apiService.updateDepartment(1, updateData)).rejects.toEqual({
          message: 'Update failed'
        });
      });
    });

    describe('deleteDepartment', () => {
      it('should delete a department successfully', async () => {
        vi.mocked(global.fetch).mockResolvedValue({
          ok: true
        } as Response);

        await apiService.deleteDepartment(1);

        expect(global.fetch).toHaveBeenCalledWith('http://localhost:8082/api/departments/1', {
          method: 'DELETE'
        });
      });

      it('should throw error when delete fails', async () => {
        vi.mocked(global.fetch).mockResolvedValue({
          ok: false,
          status: 404,
          json: async () => ({ message: 'Department not found' })
        } as Response);

        await expect(apiService.deleteDepartment(999)).rejects.toEqual({
          message: 'Department not found'
        });
      });

      it('should handle delete with constraint error', async () => {
        vi.mocked(global.fetch).mockResolvedValue({
          ok: false,
          status: 409,
          json: async () => ({ message: 'Cannot delete department with associated records' })
        } as Response);

        await expect(apiService.deleteDepartment(1)).rejects.toEqual({
          message: 'Cannot delete department with associated records'
        });
      });
    });
  });

  describe('Project API methods', () => {
    describe('getProjects', () => {
      it('should fetch all projects successfully', async () => {
        const mockResponse = [mockProject];
        vi.mocked(global.fetch).mockResolvedValue({
          ok: true,
          json: async () => mockResponse
        } as Response);

        const result = await apiService.getProjects();

        expect(global.fetch).toHaveBeenCalledWith('http://localhost:8082/api/projects');
        expect(result).toEqual(mockResponse);
      });

      it('should throw error when fetch fails', async () => {
        vi.mocked(global.fetch).mockResolvedValue({
          ok: false,
          status: 500,
          json: async () => ({ message: 'Server error' })
        } as Response);

        await expect(apiService.getProjects()).rejects.toEqual({ message: 'Server error' });
      });
    });

    describe('getProject', () => {
      it('should fetch a single project successfully', async () => {
        vi.mocked(global.fetch).mockResolvedValue({
          ok: true,
          json: async () => mockProject
        } as Response);

        const result = await apiService.getProject(1);

        expect(global.fetch).toHaveBeenCalledWith('http://localhost:8082/api/projects/1');
        expect(result).toEqual(mockProject);
      });

      it('should throw error when project not found', async () => {
        vi.mocked(global.fetch).mockResolvedValue({
          ok: false,
          status: 404,
          json: async () => ({ message: 'Project not found' })
        } as Response);

        await expect(apiService.getProject(999)).rejects.toEqual({
          message: 'Project not found'
        });
      });
    });

    describe('createProject', () => {
      it('should create a project successfully', async () => {
        const newProject = {
          code: 'PROJ001',
          name: 'Project 1',
          description: 'Description 1',
          startDate: '2025-01-01',
          endDate: '2025-12-31',
          status: ProjectStatus.ACTIVE,
          active: true
        };

        vi.mocked(global.fetch).mockResolvedValue({
          ok: true,
          json: async () => mockProject
        } as Response);

        const result = await apiService.createProject(newProject);

        expect(global.fetch).toHaveBeenCalledWith('http://localhost:8082/api/projects', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(newProject)
        });
        expect(result).toEqual(mockProject);
      });

      it('should throw error when creation fails with validation errors', async () => {
        const newProject = {
          code: '',
          name: '',
          description: '',
          startDate: '',
          endDate: '',
          status: ProjectStatus.ACTIVE,
          active: true
        };

        vi.mocked(global.fetch).mockResolvedValue({
          ok: false,
          status: 400,
          json: async () => ({
            message: 'Validation failed',
            errors: {
              code: 'Code is required',
              name: 'Name is required',
              startDate: 'Start date is required'
            }
          })
        } as Response);

        await expect(apiService.createProject(newProject)).rejects.toEqual({
          message: 'Validation failed',
          errors: {
            code: 'Code is required',
            name: 'Name is required',
            startDate: 'Start date is required'
          }
        });
      });
    });

    describe('updateProject', () => {
      it('should update a project successfully', async () => {
        const updateData = {
          code: 'PROJ001',
          name: 'Updated Project',
          description: 'Updated Description',
          startDate: '2025-01-01',
          endDate: '2025-12-31',
          status: ProjectStatus.COMPLETED,
          active: false
        };

        const updatedProject = { ...mockProject, ...updateData };

        vi.mocked(global.fetch).mockResolvedValue({
          ok: true,
          json: async () => updatedProject
        } as Response);

        const result = await apiService.updateProject(1, updateData);

        expect(global.fetch).toHaveBeenCalledWith('http://localhost:8082/api/projects/1', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(updateData)
        });
        expect(result).toEqual(updatedProject);
      });

      it('should throw error when update fails', async () => {
        const updateData = {
          code: 'PROJ001',
          name: 'Updated Project',
          description: 'Updated Description',
          startDate: '2025-01-01',
          endDate: '2025-12-31',
          status: ProjectStatus.ACTIVE,
          active: true
        };

        vi.mocked(global.fetch).mockResolvedValue({
          ok: false,
          status: 500,
          json: async () => ({ message: 'Update failed' })
        } as Response);

        await expect(apiService.updateProject(1, updateData)).rejects.toEqual({
          message: 'Update failed'
        });
      });
    });

    describe('deleteProject', () => {
      it('should delete a project successfully', async () => {
        vi.mocked(global.fetch).mockResolvedValue({
          ok: true
        } as Response);

        await apiService.deleteProject(1);

        expect(global.fetch).toHaveBeenCalledWith('http://localhost:8082/api/projects/1', {
          method: 'DELETE'
        });
      });

      it('should throw error when delete fails', async () => {
        vi.mocked(global.fetch).mockResolvedValue({
          ok: false,
          status: 404,
          json: async () => ({ message: 'Project not found' })
        } as Response);

        await expect(apiService.deleteProject(999)).rejects.toEqual({
          message: 'Project not found'
        });
      });

      it('should handle delete with constraint error', async () => {
        vi.mocked(global.fetch).mockResolvedValue({
          ok: false,
          status: 409,
          json: async () => ({ message: 'Cannot delete project with associated records' })
        } as Response);

        await expect(apiService.deleteProject(1)).rejects.toEqual({
          message: 'Cannot delete project with associated records'
        });
      });
    });
  });

  describe('Error handling', () => {
    it('should handle fetch throwing an exception', async () => {
      vi.mocked(global.fetch).mockRejectedValue(new Error('Network error'));

      await expect(apiService.getDepartments()).rejects.toThrow('Network error');
    });

    it('should handle malformed JSON response', async () => {
      vi.mocked(global.fetch).mockResolvedValue({
        ok: false,
        status: 500,
        json: async () => { throw new SyntaxError('Unexpected token'); }
      } as Response);

      await expect(apiService.getDepartments()).rejects.toEqual({
        message: 'HTTP error! status: 500'
      });
    });
  });
});
