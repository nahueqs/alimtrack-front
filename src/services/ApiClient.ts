let onUnauthorized: (() => void) | null = null;

export const setOnUnauthorizedHandler = (callback: () => void) => {
  onUnauthorized = callback;
};

interface ApiError extends Error {
  response?: {
    status: number;
    data: any;
  };
}

class ApiClient {
  private baseURL: string;

  constructor(baseURL: string = 'http://localhost:8080/api/v1') {
    this.baseURL = baseURL;
  }

  async get<T>(endpoint: string, params?: Record<string, any>): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET', params });
  }

  async post<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async patch<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' });
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

    if (token) {
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
          // Si falla el parseo pero el status es error, intentamos usar el texto como mensaje
          if (!response.ok) {
            data = { message: responseText };
          }
        }
      } else {
        // If not JSON, read as text and include in error message if not ok
        const responseText = await response.text();
        if (!response.ok) {
          // Limitar longitud para no ensuciar logs si es HTML gigante
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
      console.groupCollapsed(`[ApiClient] Error Capturado`);
      console.error(error);

      let friendlyError: Error;

      if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
        console.log('[ApiClient] Interpretado como: Error de Red.');
        friendlyError = new Error('Error de Conexión: No se pudo comunicar con el servidor.');
        // message.error(friendlyError.message); // Opcional: comentar si el componente lo maneja
      } else if (error.response) {
        const status = error.response.status;
        const apiMessage = error.message;
        console.log(`[ApiClient] Interpretado como: Error HTTP ${status}.`);

        switch (status) {
          case 400:
            friendlyError = new Error(
              apiMessage || 'La solicitud es incorrecta. Revisa los datos enviados.'
            );
            break;
          case 401:
            friendlyError = new Error(
              apiMessage || 'Sesión expirada. Por favor, inicie sesión de nuevo.'
            );
            if (onUnauthorized) onUnauthorized();
            break;
          case 403:
            friendlyError = new Error(apiMessage || 'No tienes permisos para realizar esta acción.');
            break;
          case 404:
            friendlyError = new Error(apiMessage || 'El recurso solicitado no fue encontrado.');
            break;
          case 409:
            friendlyError = new Error(
              apiMessage || 'Conflicto: El recurso ya existe o hay un conflicto de datos.'
            );
            break;
          case 500:
          case 502:
          case 503:
          case 504:
            friendlyError = new Error(
              'Error del Servidor: Problema inesperado. Intente más tarde.'
            );
            break;
          default:
            friendlyError = error;
            break;
        }
        // message.error(friendlyError.message); // Opcional: comentar si el componente lo maneja
      } else if (error instanceof SyntaxError) {
        console.log('[ApiClient] Interpretado como: Error de parseo JSON.');
        friendlyError = new Error(
          'Error de Respuesta: El formato de la respuesta del servidor no es válido.'
        );
        // message.error(friendlyError.message);
      } else {
        friendlyError = error;
      }

      console.groupEnd();
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
