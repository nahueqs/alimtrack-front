/* eslint-disable react-refresh/only-export-components */
import React, {createContext, type ReactNode, useCallback, useContext, useEffect, useState} from 'react';
import {Spin} from 'antd';
import type {AuthResponse, LoginRequest, RegisterRequest} from '@/services/auth/Auth.ts';
import {authService} from '@/services/auth/AuthService.ts';
import type {User} from '@/services/auth/User.ts';
import {setOnUnauthorizedHandler} from '@/services/ApiClient.ts';

interface AuthContextType {
    user: User | null;
    loading: boolean;
    initialLoading: boolean;
    error: string | null; // Cambiado a string | null
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

export const AuthProvider: React.FC<AuthProviderProps> = ({children}) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);
    const [error, setError] = useState<string | null>(null); // Cambiado a string | null

    const logout = useCallback(() => {
        // console.log('[AuthProvider] Logout ejecutado.'); // Removed log
        localStorage.removeItem('authToken');
        localStorage.removeItem('userData');
        setUser(null);
        setError(null);
    }, []);

    useEffect(() => {
        // console.log('[AuthProvider] Montado. Configurando handler de 401 y verificando sesión...'); // Removed log
        setOnUnauthorizedHandler(logout);

        const checkAuthStatus = async () => {
            // console.log('[AuthProvider] Verificando token existente...'); // Removed log
            const token = localStorage.getItem('authToken');
            if (!token) {
                // console.log('[AuthProvider] No se encontró token. Finalizando carga inicial.'); // Removed log
                setInitialLoading(false);
                return;
            }

            try {
                // console.log('[AuthProvider] Token encontrado. Validando con el servidor...'); // Removed log
                const freshUserData = await authService.getCurrentUser();
                console.log('[AuthProvider] Token válido. Usuario obtenido:', freshUserData); // Keep this log
                setUser(freshUserData);
                localStorage.setItem('userData', JSON.stringify(freshUserData));
            } catch (err) {
                console.error('[AuthProvider] Falló la validación del token. Deslogueando.', err); // Keep this error log
                logout();
            } finally {
                // console.log('[AuthProvider] Verificación de sesión finalizada.'); // Removed log
                setInitialLoading(false);
            }
        };

        checkAuthStatus();
    }, [logout]);

    const login = async (credentials: LoginRequest) => {
        console.groupCollapsed('[AuthProvider] Iniciando proceso de Login'); // Keep this group start
        // console.log('Credenciales:', credentials); // Removed log
        setLoading(true);
        setError(null); // Limpiar error previo
        try {
            const response: AuthResponse = await authService.login(credentials);
            console.log('[AuthProvider] Login exitoso. Respuesta:', response); // Keep this log

            if (!response.token || !response.user) {
                throw new Error('Respuesta de login inválida desde el servidor.');
            }

            localStorage.setItem('authToken', response.token);
            localStorage.setItem('userData', JSON.stringify(response.user));
            setUser(response.user);
            console.groupEnd(); // Keep this group end
        } catch (err: any) {
            console.error('[AuthProvider] Login fallido.', err); // Keep this error log
            setError(err.message || 'Ocurrió un error inesperado.'); // Guardar el mensaje de error real
            console.groupEnd(); // Keep this group end
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const register = async (userData: RegisterRequest) => {
        console.groupCollapsed('[AuthProvider] Iniciando proceso de Registro'); // Keep this group start
        // console.log('Datos de usuario:', userData); // Removed log
        setLoading(true);
        setError(null); // Limpiar error previo
        try {
            const response: AuthResponse = await authService.register(userData);
            console.log('[AuthProvider] Registro exitoso. Respuesta:', response); // Keep this log

            if (!response.token || !response.user) {
                throw new Error('Respuesta de registro inválida desde el servidor.');
            }

            localStorage.setItem('authToken', response.token);
            localStorage.setItem('userData', JSON.stringify(response.user));
            setUser(response.user);
            console.groupEnd(); // Keep this group end
        } catch (err: any) {
            console.error('[AuthProvider] Registro fallido.', err); // Keep this error log
            setError(err.message || 'Ocurrió un error inesperado.'); // Guardar el mensaje de error real
            console.groupEnd(); // Keep this group end
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
            <Spin spinning={initialLoading} fullscreen tip="Verificando sesión..."/>
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
