export interface Department {
  id?: number;
  code: string;
  name: string;
  description: string;
  active: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface Project {
  id?: number;
  code: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  status: ProjectStatus;
  active: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export const ProjectStatus = {
  ACTIVE: 'ACTIVE',
  COMPLETED: 'COMPLETED',
  ON_HOLD: 'ON_HOLD',
  CANCELLED: 'CANCELLED'
} as const;

export type ProjectStatus = typeof ProjectStatus[keyof typeof ProjectStatus];

export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
}
