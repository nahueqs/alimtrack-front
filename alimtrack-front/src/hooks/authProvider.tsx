/* eslint-disable react-refresh/only-export-components */
// hooks/AuthProvider.tsx
import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { User, LoginRequest, RegisterRequest } from '../types/Auth';
import { authService } from '../services/authService';

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
        console.log('🔐 AuthProvider - Token encontrado:', token);

        if (token) {
          console.log('🔐 AuthProvider - Obteniendo usuario...');
          const userData = await authService.getCurrentUser();
          console.log('🔐 AuthProvider - Usuario recibido:', userData);

          setUser(userData);
        } else {
          console.log('🔐 AuthProvider - No hay token');

          setUser(null);
        }
      } catch (error) {
        console.error('❌ AuthProvider - Error en checkAuth:', error);
        localStorage.removeItem('authToken');
        localStorage.removeItem('userData');
        setError('La sesión ha expirado');
        setUser(null);
      } finally {
        setLoading(false);
        console.log('🔐 AuthProvider - Loading terminado. User:', user);
      }
    };

    checkAuth();
  }, []);

  const login = async (credentials: LoginRequest) => {
    console.log('🔐 AuthProvider - Iniciando login...', credentials);
    setLoading(true);
    setError(null);
    try {
      const response = await authService.login(credentials);
      console.log('🔐 AuthProvider - Login exitoso:', response);

      localStorage.setItem('authToken', response.token);
      localStorage.setItem('userData', JSON.stringify(response.user));
      console.log('🔐 AuthProvider - Guardado en localStorage. User a establecer:', response.user);

      setUser(response.user);
      console.log('🔐 AuthProvider - User establecido. Estado actual:', {
        user,
        isAuthenticated: !!response.user,
      });

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
