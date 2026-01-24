/* eslint-disable react-refresh/only-export-components */
import React, {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { Spin } from 'antd';
import type { AuthResponse, LoginRequest, RegisterRequest } from '@/services/auth/Auth.ts';
import { authService } from '@/services/auth/AuthService.ts';
import type { User } from '@/services/auth/User.ts';
import { setOnUnauthorizedHandler } from '@/services/ApiClient.ts';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  initialLoading: boolean;
  error: string | null;
  login: (credentials: LoginRequest) => Promise<void>;
  register: (userData: RegisterRequest) => Promise<void>;
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
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const logout = useCallback(() => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    setUser(null);
    setError(null);
  }, []);

  useEffect(() => {
    setOnUnauthorizedHandler(logout);

    const checkAuthStatus = async () => {
      const token = localStorage.getItem('authToken');
      if (!token) {
        setInitialLoading(false);
        return;
      }

      try {
        const freshUserData = await authService.getCurrentUser();
        setUser(freshUserData);
        localStorage.setItem('userData', JSON.stringify(freshUserData));
      } catch (err) {
        console.error('[AuthProvider] Falló la validación del token. Deslogueando.', err);
        logout();
      } finally {
        setInitialLoading(false);
      }
    };

    checkAuthStatus();
  }, [logout]);

  const login = async (credentials: LoginRequest) => {
    setLoading(true);
    setError(null);
    try {
      const response: AuthResponse = await authService.login(credentials);

      if (!response.token || !response.user) {
        throw new Error('Respuesta de login inválida desde el servidor.');
      }

      localStorage.setItem('authToken', response.token);
      localStorage.setItem('userData', JSON.stringify(response.user));
      setUser(response.user);
    } catch (err: any) {
      console.error('[AuthProvider] Login fallido.', err);
      setError(err.message || 'Ocurrió un error inesperado.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData: RegisterRequest) => {
    setLoading(true);
    setError(null);
    try {
      const response: AuthResponse = await authService.register(userData);

      if (!response.token || !response.user) {
        throw new Error('Respuesta de registro inválida desde el servidor.');
      }

      localStorage.setItem('authToken', response.token);
      localStorage.setItem('userData', JSON.stringify(response.user));
      setUser(response.user);
    } catch (err: any) {
      console.error('[AuthProvider] Registro fallido.', err);
      setError(err.message || 'Ocurrió un error inesperado.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => {
    setError(null);
  };

  const value = {
    user,
    loading,
    initialLoading,
    error,
    login,
    register,
    logout,
    clearError,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      <Spin spinning={initialLoading} fullscreen tip="Verificando sesión..." />
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};
