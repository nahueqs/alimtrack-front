import axios from 'axios';
import type { AuthResponse, LoginRequest, RegisterRequest } from '../types/Auth';
import type { User } from '../types/User.ts';

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
  config => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar respuestas de error
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('userData');
    }
    return Promise.reject(error);
  }
);

export const authService = {
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    try {
      const loginResponse = await api.post('/auth/login', credentials);

      if (!loginResponse.data.token) {
        throw new Error('El servidor no devolvió un token');
      }

      const token = loginResponse.data.token;
      localStorage.setItem('authToken', token);
      const userResponse = await api.get('/auth/me');

      // Construir la respuesta completa
      const authResponse: AuthResponse = {
        token: token,
        user: userResponse.data,
      };

      return authResponse;
    } catch (error: any) {
      throw error;
    }
  },

  async register(userData: RegisterRequest): Promise<AuthResponse> {
    try {
      const response = await api.post('/auth/register', userData);
      return response.data;
    } catch (error: any) {
      throw error;
    }
  },

  async getCurrentUser(): Promise<User> {
    const token = localStorage.getItem('authToken');

    try {
      const response = await api.get('/auth/me');
      return response.data;
    } catch (error: any) {
      throw error;
    }
  },
};

// Exportar api para usar en otros servicios
export default api;
