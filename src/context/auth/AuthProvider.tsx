/* eslint-disable react-refresh/only-export-components */
import React, {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { Spin } from 'antd';
import type { AuthResponse, LoginRequest, RegisterRequest } from '@/services/auth/Auth.ts';
import { authService } from '@/services/auth/AuthService.ts';
import type { User } from '@/services/auth/User.ts';
import { setOnUnauthorizedHandler, setTokenRefreshHandler } from '@/services/ApiClient.ts';
import { SessionExpiredModal } from '@/components/auth/SessionExpiredModal.tsx';

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
  const [isSessionExpired, setIsSessionExpired] = useState(false);

  // Referencia para guardar la función 'resolve' de la promesa de refresco
  const refreshResolver = useRef<((token: string | null) => void) | null>(null);

  const logout = useCallback(() => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('userData');
    setUser(null);
    setError(null);
  }, []);

  // Configurar handlers de ApiClient
  useEffect(() => {
    setOnUnauthorizedHandler(logout);

    setTokenRefreshHandler(async () => {
      // 1. Intentar Refresh Silencioso
      const storedRefreshToken = localStorage.getItem('refreshToken');
      if (storedRefreshToken) {
        try {
          console.log('[AuthProvider] Intentando refresh silencioso...');
          const response = await authService.refreshToken(storedRefreshToken);
          const newAccessToken = response.accessToken;

          if (newAccessToken) {
            console.log('[AuthProvider] Refresh silencioso exitoso.');
            localStorage.setItem('authToken', newAccessToken);
            if (response.refreshToken) {
              localStorage.setItem('refreshToken', response.refreshToken);
            }
            return newAccessToken;
          }
        } catch (err) {
          console.warn('[AuthProvider] Falló el refresh silencioso.', err);
          // Si falla, continuamos al modal
        }
      }

      // 2. Si falla el silencioso, mostrar Modal
      if (isSessionExpired && refreshResolver.current) {
        return new Promise<string | null>((resolve) => {
          const oldResolver = refreshResolver.current;
          refreshResolver.current = (token) => {
            if (oldResolver) oldResolver(token);
            resolve(token);
          };
        });
      }

      setIsSessionExpired(true);
      return new Promise<string | null>((resolve) => {
        refreshResolver.current = resolve;
      });
    });
  }, [logout, isSessionExpired]);

  const handleSessionRestored = (token: string) => {
    setIsSessionExpired(false);
    localStorage.setItem('authToken', token);

    if (refreshResolver.current) {
      refreshResolver.current(token);
      refreshResolver.current = null;
    }
  };

  const handleSessionCancel = () => {
    setIsSessionExpired(false);
    if (refreshResolver.current) {
      refreshResolver.current(null);
      refreshResolver.current = null;
    }
    logout();
  };

  useEffect(() => {
    const checkAuthStatus = async () => {
      const token = localStorage.getItem('authToken');
      if (!token) {
        setInitialLoading(false);
        return;
      }

      // Intentar recuperar usuario desde localStorage primero para evitar parpadeo
      const storedUserData = localStorage.getItem('userData');
      if (storedUserData) {
        try {
          const parsedUser = JSON.parse(storedUserData);
          setUser(parsedUser);
        } catch (e) {
          console.warn('[AuthProvider] Error parseando userData de localStorage', e);
          localStorage.removeItem('userData'); // Limpiar datos corruptos
        }
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

      const token = response.accessToken;

      if (!token || !response.user) {
        throw new Error('Respuesta de login inválida desde el servidor.');
      }

      localStorage.setItem('authToken', token);
      if (response.refreshToken) {
        localStorage.setItem('refreshToken', response.refreshToken);
      }
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

      const token = response.accessToken;

      if (!token || !response.user) {
        throw new Error('Respuesta de registro inválida desde el servidor.');
      }

      localStorage.setItem('authToken', token);
      if (response.refreshToken) {
        localStorage.setItem('refreshToken', response.refreshToken);
      }
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
      {initialLoading ? (
        <Spin spinning={initialLoading} fullscreen tip="Verificando sesión..." />
      ) : (
        <>
          {children}
          <SessionExpiredModal
            open={isSessionExpired}
            user={user}
            onSuccess={handleSessionRestored}
            onCancel={handleSessionCancel}
          />
        </>
      )}
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
