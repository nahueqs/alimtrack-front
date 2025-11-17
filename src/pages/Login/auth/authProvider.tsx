/* eslint-disable react-refresh/only-export-components */
// hooks/AuthProvider.tsx
import React, { createContext, type ReactNode, useContext, useEffect, useState } from 'react';
import type { LoginRequest, RegisterRequest } from '../../../types/Auth.ts';
import { authService } from '../../../services/AuthService.ts';
import type { User } from '../../../types/User.ts';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (credentials: LoginRequest) => Promise<any>;
  register: (userData: RegisterRequest) => Promise<any>;
  logout: () => void;
  clearError: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('authToken');

        if (token) {
          const userData = await authService.getCurrentUser();
          setUser(userData);
        } else {
          setUser(null);
        }
      } catch (error) {
        localStorage.removeItem('authToken');
        localStorage.removeItem('userData');
        setError('La sesión ha expirado');
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (credentials: LoginRequest) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authService.login(credentials);

      localStorage.setItem('authToken', response.token);
      localStorage.setItem('userData', JSON.stringify(response.user));

      setUser(response.user);
      return response;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Error de conexión';
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData: RegisterRequest) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authService.register(userData);
      localStorage.setItem('authToken', response.token);
      localStorage.setItem('userData', JSON.stringify(response.user));
      setUser(response.user);
      return response;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Error en el registro';
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    setUser(null);
    setError(null);
  };

  const clearError = () => {
    setError(null);
  };

  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    clearError,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};
