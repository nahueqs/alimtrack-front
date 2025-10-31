import axios from 'axios';
import type { LoginRequest, RegisterRequest, AuthResponse, User } from '../types/Auth';

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
            localStorage.removeItem('authToken');
            localStorage.removeItem('userData');
        }
        return Promise.reject(error);
    }
);

export const authService = {
    async login(credentials: LoginRequest): Promise<AuthResponse> {
        console.log('🔐 authService.login - Enviando credenciales a:', `${API_BASE_URL}/auth/login`);
        console.log('🔐 authService.login - Credenciales:', {
            email: credentials.email,
            password: '***'
        });

        try {

            const loginResponse = await api.post('/auth/login', credentials);
            console.log('🔐 authService.login -  token recibido');

            if (!loginResponse.data.token) {
                throw new Error('El servidor no devolvió un token');
            }

            const token = loginResponse.data.token;
            localStorage.setItem('authToken', token);
            console.log('🔐 authService.login - Obteniendo datos del usuario...');
            const userResponse = await api.get('/auth/me');
            console.log('🔐 authService.login - ✅ Usuario obtenido:', userResponse.data);

            // 4. Construir la respuesta completa
            const authResponse: AuthResponse = {
                token: token,
                user: userResponse.data
            };

            console.log('🔐 authService.login - ✅ Login completado:', authResponse);
            return authResponse;

        } catch (error: any) {
            console.error('❌ authService.login - Error:', {
                message: error.message,
                response: error.response?.data,
                status: error.response?.status
            });
            throw error;
        }
    },

    async register(userData: RegisterRequest): Promise<AuthResponse> {
        console.log('🔐 authService.register - Registrando usuario...');
        try {
            const response = await api.post('/auth/register', userData);
            console.log('🔐 authService.register - Respuesta:', response.data);
            return response.data;
        } catch (error: any) {
            console.error('❌ authService.register - Error:', error.response?.data || error.message);
            throw error;
        }
    },

    async getCurrentUser(): Promise<User> {
        console.log('🔐 authService.getCurrentUser - Obteniendo usuario actual...');
        const token = localStorage.getItem('authToken');
        console.log('🔐 authService.getCurrentUser - Token disponible:', !!token);

        try {
            const response = await api.get('/auth/me');
            console.log('🔐 authService.getCurrentUser - ✅ Usuario obtenido:', response.data);
            return response.data;
        } catch (error: any) {
            console.error('❌ authService.getCurrentUser - Error:', {
                message: error.message,
                status: error.response?.status,
                data: error.response?.data
            });
            throw error;
        }
    },
};

// Exportar api para usar en otros servicios
export default api;