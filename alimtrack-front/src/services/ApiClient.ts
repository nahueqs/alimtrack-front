class ApiClient {
  private baseURL: string;

  constructor(baseURL: string = 'http://localhost:8080/api/v1') {
    this.baseURL = baseURL;
  }

  async get<T>(endpoint: string, params?: Record<string, any>): Promise<T> {
    let url = endpoint;
    if (params && Object.keys(params).length > 0) {
      const queryString = this.buildQueryString(params);
      url += `?${queryString}`;
    }
    return this.request<T>(url, {
      method: 'GET',
    });
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
    return this.request<T>(endpoint, {
      method: 'DELETE',
    });
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const token = localStorage.getItem('authToken');
    // Ensure there's exactly one slash between baseURL and endpoint
    const url = `${this.baseURL.replace(/\/+$/, '')}/${endpoint.replace(/^\/+/, '')}`;

    const headers: HeadersInit = new Headers({
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    });

    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }

    const config: RequestInit = {
      ...options,
      headers,
      credentials: 'include' as RequestCredentials,
    };

    try {
      console.log(`Making request to: ${url}`, { config });
      const response = await fetch(url, config);
      const text = await response.text();
      console.log('Raw API response:', text.substring(0, 200));
      let responseData;

      try {
        return JSON.parse(text);
      } catch (jsonError) {
        console.error('JSON parse error:', jsonError);
        console.error('Full response:', text);
        throw new Error(`Invalid JSON response: ${text.substring(0, 100)}`);
      }

      if (!response.ok) {
        const error = new Error(response.statusText || 'Error en la petición');
        // @ts-ignore
        error.response = {
          status: response.status,
          statusText: response.statusText,
          data: responseData,
          headers: Object.fromEntries(response.headers.entries()),
        };
        throw error;
      }

      // Para respuestas sin contenido (204 No Content)
      if (response.status === 204) {
        return {} as T;
      }

      return responseData;
    } catch (error: any) {
      console.error(`API Error [${endpoint}]:`, {
        message: error.message,
        response: error.response,
        stack: error.stack,
      });
      throw error;
    }
  }

  private buildQueryString(params: Record<string, any>): string {
    const searchParams = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== '') {
        if (Array.isArray(value)) {
          value.forEach(item => searchParams.append(key, item.toString()));
        } else if (value instanceof Date) {
          searchParams.append(key, value.toISOString());
        } else {
          searchParams.append(key, value.toString());
        }
      }
    });

    return searchParams.toString();
  }
}

export const apiClient = new ApiClient();
