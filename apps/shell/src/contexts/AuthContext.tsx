import { createContext, useState, type ReactNode } from 'react';

interface User {
  id: number;
  name: string;
  email: string;
}

interface Credentials {
  email: string;
  password: string;
}

interface AuthContextValue {
  user: User | null;
  login: (credentials: Credentials) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    // Initialize with a demo user for now
    return { id: 1, name: 'Demo User', email: 'demo@example.com' };
  });

  const login = (credentials: Credentials) => {
    // Simple demo login - in production this would call an API
    console.log('Login attempt:', credentials.email);
    setUser({ id: 1, name: 'Demo User', email: credentials.email });
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
