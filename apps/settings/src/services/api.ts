import type { Department, Project, ApiError } from '../types';

const API_BASE_URL = 'http://localhost:8080/api';

class ApiService {
  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const error: ApiError = await response.json().catch(() => ({
        message: `HTTP error! status: ${response.status}`
      }));
      throw error;
    }
    return response.json();
  }

  // Department API methods
  async getDepartments(): Promise<Department[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/departments`);
      return this.handleResponse<Department[]>(response);
    } catch (error) {
      // Network error or fetch failed
      throw { message: 'Network error' };
    }
  }

  async getDepartment(id: number): Promise<Department> {
    const response = await fetch(`${API_BASE_URL}/departments/${id}`);
    return this.handleResponse<Department>(response);
  }

  async createDepartment(department: Omit<Department, 'id' | 'createdAt' | 'updatedAt'>): Promise<Department> {
    const response = await fetch(`${API_BASE_URL}/departments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(department),
    });
    return this.handleResponse<Department>(response);
  }

  async updateDepartment(id: number, department: Omit<Department, 'id' | 'createdAt' | 'updatedAt'>): Promise<Department> {
    const response = await fetch(`${API_BASE_URL}/departments/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(department),
    });
    return this.handleResponse<Department>(response);
  }

  async deleteDepartment(id: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/departments/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      const error: ApiError = await response.json().catch(() => ({
        message: `HTTP error! status: ${response.status}`
      }));
      throw error;
    }
  }

  // Project API methods
  async getProjects(): Promise<Project[]> {
    const response = await fetch(`${API_BASE_URL}/projects`);
    return this.handleResponse<Project[]>(response);
  }

  async getProject(id: number): Promise<Project> {
    const response = await fetch(`${API_BASE_URL}/projects/${id}`);
    return this.handleResponse<Project>(response);
  }

  async createProject(project: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>): Promise<Project> {
    const response = await fetch(`${API_BASE_URL}/projects`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(project),
    });
    return this.handleResponse<Project>(response);
  }

  async updateProject(id: number, project: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>): Promise<Project> {
    const response = await fetch(`${API_BASE_URL}/projects/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(project),
    });
    return this.handleResponse<Project>(response);
  }

  async deleteProject(id: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/projects/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      const error: ApiError = await response.json().catch(() => ({
        message: `HTTP error! status: ${response.status}`
      }));
      throw error;
    }
  }
}

export const apiService = new ApiService();
