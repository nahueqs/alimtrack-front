let onUnauthorized: (() => void) | null = null;
let tokenRefreshHandler: (() => Promise<string | null>) | null = null;

export const setOnUnauthorizedHandler = (callback: () => void) => {
  onUnauthorized = callback;
};

export const setTokenRefreshHandler = (handler: () => Promise<string | null>) => {
  tokenRefreshHandler = handler;
};

interface ApiError extends Error {
  response?: {
    status: number;
    data: any;
  };
}

// URL base por defecto: usa la variable de entorno si existe, sino localhost
const DEFAULT_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'https://alimtrackunlu.onrender.com/api/v1';

class ApiClient {
  private baseURL: string;

  constructor(baseURL: string = DEFAULT_BASE_URL) {
    this.baseURL = baseURL;
  }

  async get<T>(endpoint: string, params?: Record<string, any>, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET', params, ...options });
  }

  async post<T>(endpoint: string, data?: any, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
      ...options,
    });
  }

  async put<T>(endpoint: string, data?: any, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
      ...options,
    });
  }

  async patch<T>(endpoint: string, data?: any, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
      ...options,
    });
  }

  async delete<T>(endpoint: string, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE', ...options });
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit & { params?: Record<string, any> }
  ): Promise<T> {
    const token = localStorage.getItem('authToken');
    let url = `${this.baseURL.replace(/\/+$/, '')}/${endpoint.replace(/^\/+/, '')}`;

    if (options.method === 'GET' && options.params) {
      const queryString = this.buildQueryString(options.params);
      if (queryString) {
        url += `?${queryString}`;
      }
    }

    const headers: HeadersInit = new Headers({
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    });

    // Solo agregamos el token si no viene ya un Authorization en los headers (para permitir override en refresh)
    if (token && !headers.has('Authorization')) {
      headers.set('Authorization', `Bearer ${token}`);
    }

    const config: RequestInit = { ...options, headers, credentials: 'include' };

    try {
      const response = await fetch(url, config);

      if (response.status === 204) return {} as T;

      const contentType = response.headers.get('content-type');
      let data: any = {};

      if (contentType && contentType.includes('application/json')) {
        const responseText = await response.text();
        try {
          data = responseText ? JSON.parse(responseText) : {};
        } catch (e) {
          console.warn('[ApiClient] Error parsing JSON response:', e);
          if (!response.ok) {
            data = { message: responseText };
          }
        }
      } else {
        const responseText = await response.text();
        if (!response.ok) {
          const msg =
            responseText.length > 200 ? responseText.substring(0, 200) + '...' : responseText;
          data = { message: msg || `Error ${response.status}` };
        }
      }

      if (!response.ok) {
        const error = new Error(data.message || `Error ${response.status}`) as ApiError;
        error.response = { status: response.status, data };
        throw error;
      }

      return data;
    } catch (error: any) {
      if (error.response && error.response.status === 401 && tokenRefreshHandler) {
        // Silencioso
      } else {
        console.groupCollapsed(`[ApiClient] Error Capturado`);
        console.error(error);
      }

      let friendlyError: Error;

      if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
        console.log('[ApiClient] Interpretado como: Error de Red.');
        friendlyError = new Error('Error de Conexión: No se pudo comunicar con el servidor.');
      } else if (error.response) {
        const status = error.response.status;
        const apiMessage = error.message;

        switch (status) {
          case 400:
            friendlyError = new Error(
              apiMessage || 'La solicitud es incorrecta. Revisa los datos enviados.'
            );
            break;
          case 401:
            if (tokenRefreshHandler) {
              console.log('[ApiClient] 401 detectado. Intentando recuperar sesión...');
              try {
                const newToken = await tokenRefreshHandler();
                if (newToken) {
                  console.log('[ApiClient] Sesión recuperada. Reintentando petición...');
                  const newHeaders: Record<string, string> = {};
                  headers.forEach((value, key) => {
                    newHeaders[key] = value;
                  });
                  newHeaders['Authorization'] = `Bearer ${newToken}`;

                  return await this.request<T>(endpoint, {
                    ...options,
                    headers: newHeaders,
                  });
                }
              } catch (refreshError) {
                console.error('[ApiClient] Falló la recuperación de sesión.', refreshError);
              }
            }
            console.log(`[ApiClient] Interpretado como: Error HTTP ${status}.`);
            friendlyError = new Error(
              apiMessage || 'Sesión expirada. Por favor, inicie sesión de nuevo.'
            );
            if (onUnauthorized) onUnauthorized();
            break;
          case 403:
            console.log(`[ApiClient] Interpretado como: Error HTTP ${status}.`);
            friendlyError = new Error(apiMessage || 'No tienes permisos para realizar esta acción.');
            break;
          case 404:
            console.log(`[ApiClient] Interpretado como: Error HTTP ${status}.`);
            friendlyError = new Error(apiMessage || 'El recurso solicitado no fue encontrado.');
            break;
          case 409:
            console.log(`[ApiClient] Interpretado como: Error HTTP ${status}.`);
            friendlyError = new Error(
              apiMessage || 'Conflicto: El recurso ya existe o hay un conflicto de datos.'
            );
            break;
          case 500:
          case 502:
          case 503:
          case 504:
            console.log(`[ApiClient] Interpretado como: Error HTTP ${status}.`);
            friendlyError = new Error(
              'Error del Servidor: Problema inesperado. Intente más tarde.'
            );
            break;
          default:
            console.log(`[ApiClient] Interpretado como: Error HTTP ${status}.`);
            friendlyError = error;
            break;
        }
      } else if (error instanceof SyntaxError) {
        console.log('[ApiClient] Interpretado como: Error de parseo JSON.');
        friendlyError = new Error(
          'Error de Respuesta: El formato de la respuesta del servidor no es válido.'
        );
      } else {
        friendlyError = error;
      }

      if (
        !(error.response && error.response.status === 401 && tokenRefreshHandler)
      ) {
          console.groupEnd();
      }
      
      throw friendlyError;
    }
  }

  private buildQueryString(params: Record<string, any>): string {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== '') {
        if (Array.isArray(value)) {
          value.forEach((item) => searchParams.append(key, item.toString()));
        } else {
          searchParams.append(key, value.toString());
        }
      }
    });
    return searchParams.toString();
  }
}

export const apiClient = new ApiClient();
