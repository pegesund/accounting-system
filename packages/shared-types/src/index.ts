export interface User {
  id: number;
  name: string;
  email: string;
}

export interface AuthContextValue {
  user: User | null;
  login: (credentials: Credentials) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

export interface Credentials {
  email: string;
  password: string;
}
