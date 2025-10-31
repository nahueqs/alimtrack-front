import { useState, useEffect } from 'react';
import type { User, LoginRequest, RegisterRequest } from '../types/auth';
import { authService } from '../services/authService';

export const useAuth = () => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    // Solo verificar al cargar
    useEffect(() => {
        const checkAuth = async () => {
            try {
                const token = localStorage.getItem('authToken');
                if (token) {
                    const userData = await authService.getCurrentUser();
                    setUser(userData);
                }
            } catch (error) {
                console.error('Auth check failed:', error);
                localStorage.removeItem('authToken');
                localStorage.removeItem('userData');
            } finally {
                setLoading(false);
            }
        };

        checkAuth();
    }, []); // ✅ Solo se ejecuta una vez

    const login = async (credentials: LoginRequest) => {
        setLoading(true);
        try {
            const response = await authService.login(credentials);
            localStorage.setItem('authToken', response.token);
            localStorage.setItem('userData', JSON.stringify(response.user));
            setUser(response.user);
            return response;
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || err.message || 'Error de conexión';
            throw new Error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const register = async (userData: RegisterRequest) => {
        setLoading(true);
        try {
            const response = await authService.register(userData);
            localStorage.setItem('authToken', response.token);
            localStorage.setItem('userData', JSON.stringify(response.user));
            setUser(response.user);
            return response;
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || err.message || 'Error en el registro';
            throw new Error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('userData');
        setUser(null);
    };

    return {
        user,
        loading,
        login,
        register,
        logout,
        isAuthenticated: !!user
    };
};