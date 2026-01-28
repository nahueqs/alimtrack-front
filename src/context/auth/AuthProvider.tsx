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
  updateUser: (user: User) => void; // Nuevo método para actualizar usuario sin full login
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

  // Singleton Promise: Almacena la promesa de refresh en curso para evitar llamadas múltiples
  const activeRefreshPromise = useRef<Promise<string | null> | null>(null);
  
  // Resolver para el modal: Permite desbloquear la promesa cuando el usuario interactúa con el modal
  const modalResolver = useRef<((token: string | null) => void) | null>(null);

  const logout = useCallback(() => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('userData');
    setUser(null);
    setError(null);
    setIsSessionExpired(false);
    activeRefreshPromise.current = null;
    modalResolver.current = null;
  }, []);

  const updateUser = useCallback((newUser: User) => {
    setUser(newUser);
    localStorage.setItem('userData', JSON.stringify(newUser));
  }, []);

  // Lógica central de Refresh Token
  const handleTokenRefresh = useCallback(async (): Promise<string | null> => {
    // Si ya hay un proceso de refresh ocurriendo, devolver esa misma promesa (evita race conditions)
    if (activeRefreshPromise.current) {
      return activeRefreshPromise.current;
    }

    // Crear nueva promesa que engloba todo el proceso (Silent + Modal)
    const promise = (async () => {
      try {
        // 1. Intentar Refresh Silencioso
        const storedRefreshToken = localStorage.getItem('refreshToken');
        if (storedRefreshToken) {
          try {
            console.log('[AuthProvider] Intentando refresh silencioso...');
            const response = await authService.refreshToken(storedRefreshToken);
            const newAccessToken = response.access_token;

            if (newAccessToken) {
              console.log('[AuthProvider] Refresh silencioso exitoso.');
              localStorage.setItem('authToken', newAccessToken);
              if (response.refresh_token) {
                localStorage.setItem('refreshToken', response.refresh_token);
              }
              return newAccessToken;
            }
          } catch (err) {
            console.warn('[AuthProvider] Falló el refresh silencioso.', err);
            // No hacemos throw, dejamos que pase al modal
          }
        }

        // 2. Si falla el silencioso, activar Modal y esperar interacción del usuario
        console.log('[AuthProvider] Activando modal de sesión expirada...');
        setIsSessionExpired(true);

        // Crear una promesa que se resolverá cuando el usuario use el modal
        return await new Promise<string | null>((resolve) => {
          modalResolver.current = resolve;
        });

      } catch (e) {
        console.error('[AuthProvider] Error fatal en proceso de refresh', e);
        return null;
      } finally {
        // Limpiar la promesa activa al terminar (sea éxito o fallo)
        activeRefreshPromise.current = null;
      }
    })();

    activeRefreshPromise.current = promise;
    return promise;
  }, []);

  // Configurar handlers de ApiClient al montar
  useEffect(() => {
    setOnUnauthorizedHandler(() => {
        // Solo hacer logout si NO estamos en medio de un proceso de recuperación
        // Esto previene que un 401 final mate la sesión mientras el modal está abierto
        if (!isSessionExpired && !activeRefreshPromise.current) {
            logout();
        }
    });

    setTokenRefreshHandler(handleTokenRefresh);
  }, [logout, handleTokenRefresh, isSessionExpired]);

  // Callbacks del Modal
  const handleSessionRestored = (token: string, updatedUser: User) => {
    console.log('[AuthProvider] Sesión restaurada manualmente.');
    setIsSessionExpired(false);
    localStorage.setItem('authToken', token);
    updateUser(updatedUser); // Asegurar que el usuario esté actualizado

    if (modalResolver.current) {
      modalResolver.current(token);
      modalResolver.current = null;
    }
  };

  const handleSessionCancel = () => {
    console.log('[AuthProvider] Recuperación cancelada por usuario.');
    setIsSessionExpired(false);
    if (modalResolver.current) {
      modalResolver.current(null);
      modalResolver.current = null;
    }
    logout();
  };

  // Verificación inicial de sesión
  useEffect(() => {
    const checkAuthStatus = async () => {
      const token = localStorage.getItem('authToken');
      if (!token) {
        setInitialLoading(false);
        return;
      }

      const storedUserData = localStorage.getItem('userData');
      if (storedUserData) {
        try {
          setUser(JSON.parse(storedUserData));
        } catch (e) {
          localStorage.removeItem('userData');
        }
      }

      try {
        const freshUserData = await authService.getCurrentUser();
        updateUser(freshUserData);
      } catch (err) {
        console.error('[AuthProvider] Token inválido al inicio. Deslogueando.');
        logout();
      } finally {
        setInitialLoading(false);
      }
    };

    checkAuthStatus();
  }, [logout, updateUser]);

  const login = async (credentials: LoginRequest) => {
    setLoading(true);
    setError(null);
    try {
      const response: AuthResponse = await authService.login(credentials);
      if (!response.access_token || !response.user) {
        throw new Error('Respuesta inválida del servidor.');
      }

      localStorage.setItem('authToken', response.access_token);
      if (response.refresh_token) {
        localStorage.setItem('refreshToken', response.refresh_token);
      }
      updateUser(response.user);
    } catch (err: any) {
      setError(err.message || 'Error al iniciar sesión.');
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
      if (!response.access_token || !response.user) {
        throw new Error('Respuesta inválida del servidor.');
      }

      localStorage.setItem('authToken', response.access_token);
      if (response.refresh_token) {
        localStorage.setItem('refreshToken', response.refresh_token);
      }
      updateUser(response.user);
    } catch (err: any) {
      setError(err.message || 'Error al registrarse.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => setError(null);

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
    updateUser,
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
