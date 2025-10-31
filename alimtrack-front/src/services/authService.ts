import axios from 'axios';
import type { LoginRequest, RegisterRequest, AuthResponse, User } from '../types/auth';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api/v1';
const API_TIMEOUT = parseInt(import.meta.env.VITE_API_TIMEOUT || '10000');

// Configurar axios instance
export const api = axios.create({
    baseURL: API_BASE_URL,
    timeout: API_TIMEOUT,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor para agregar token a las requests
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('authToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Interceptor para manejar respuestas de error
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            if (error.response?.status === 401) {
                localStorage.removeItem('authToken');
                localStorage.removeItem('userData');
            }
        }
        return Promise.reject(error);
    }
);

export const authService = {
    async login(credentials: LoginRequest): Promise<AuthResponse> {
        const response = await api.post('/auth/login', credentials);
        return response.data;
    },

    async register(userData: RegisterRequest): Promise<AuthResponse> {
        const response = await api.post('/auth/register', userData);
        return response.data;
    },

    async getCurrentUser(): Promise<User> {
        const response = await api.get('/auth/me');
        return response.data;
    },


};

// Exportar api para usar en otros servicios
export default api;