// typescript
// File: `src/services/VersionRecetaService.ts`
import { apiClient } from './ApiClient.ts';
import type { VersionRecetaResponseDTO } from '../types/RecipeVersions.ts';
import type { SeccionResponseDTO } from '../types/Productions.ts';

const handleResponse = <T>(response: any): T => {
  if (response?.data !== undefined && response?.data !== null) {
    return response.data as T;
  }
  return response as T;
};

type ServiceError = {
  message: string;
  code?: string;
  status?: number;
};

const handleServiceError = (error: any, context: string): ServiceError => {
  console.error(`Error in ${context}:`, error);

  if (error?.response?.data) {
    return {
      message: error.response.data?.message || `Error en ${context}`,
      code: error.response.data?.code,
      status: error.response.status,
    };
  }

  if (error instanceof Error) {
    return { message: error.message };
  }

  return { message: `Error desconocido en ${context}` };
};

const versionRecetaService = {
  async getAllVersions(): Promise<{ data: VersionRecetaResponseDTO[]; error?: ServiceError }> {
    try {
      const response = await apiClient.get<VersionRecetaResponseDTO[]>('/recetas/versiones');
      const data = handleResponse<VersionRecetaResponseDTO[]>(response);
      return { data: Array.isArray(data) ? data : [] };
    } catch (error) {
      return { data: [], error: handleServiceError(error, 'getAllVersions') };
    }
  },

  async getRecipeVersionById(
    id: string
  ): Promise<{ data: VersionRecetaResponseDTO | null; error?: ServiceError }> {
    try {
      if (!id) throw new Error('ID inválido proporcionado');

      const response = await apiClient.get<VersionRecetaResponseDTO>(`/versiones/${id}`);
      const data = handleResponse<VersionRecetaResponseDTO>(response);
      return { data: data || null };
    } catch (error) {
      return { data: null, error: handleServiceError(error, 'getRecipeVersionById') };
    }
  },

  async getVersionByCode(codigoVersion: string): Promise<{
    data: VersionRecetaResponseDTO | null;
    error?: ServiceError;
  }> {
    try {
      if (!codigoVersion) throw new Error('Código de versión inválido');

      const response = await apiClient.get<VersionRecetaResponseDTO>(
        `/recetas/versiones/${codigoVersion}`
      );
      const data = handleResponse<VersionRecetaResponseDTO>(response);
      return { data: data || null };
    } catch (error) {
      return { data: null, error: handleServiceError(error, 'getVersionByCode') };
    }
  },

  async getVersionsByRecipe(codigoReceta: string): Promise<{
    data: VersionRecetaResponseDTO[];
    error?: ServiceError;
  }> {
    try {
      if (!codigoReceta) throw new Error('Código de receta inválido');

      const response = await apiClient.get<VersionRecetaResponseDTO[]>(
        `/recetas/${codigoReceta}/versiones`
      );
      const data = handleResponse<VersionRecetaResponseDTO[]>(response);
      return { data: Array.isArray(data) ? data : [] };
    } catch (error) {
      return { data: [], error: handleServiceError(error, 'getVersionsByRecipe') };
    }
  },

  async getSectionsByVersion(
    codigoVersion: string
  ): Promise<{ data: SeccionResponseDTO[]; error?: ServiceError }> {
    try {
      if (!codigoVersion) throw new Error('Código de versión inválido');

      const response = await apiClient.get<SeccionResponseDTO[]>(
        `/versiones/${codigoVersion}/secciones`
      );
      const data = handleResponse<SeccionResponseDTO[]>(response);
      return { data: Array.isArray(data) ? data : [] };
    } catch (error) {
      return { data: [], error: handleServiceError(error, 'getSectionsByVersion') };
    }
  },
};

export default versionRecetaService;
