import { apiClient } from './ApiClient.ts';
import type { RecipeResponseDTO } from '../types/Recipes.ts';

class RecetaService {
  /**
   * Obtener una versión de receta por ID
   */
  async getRecipeVersionById(id: string): Promise<RecipeResponseDTO> {
    try {
      const response = await apiClient.get<RecipeResponseDTO>(`/api/recetas/versiones/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener la versión de receta:', error);
      throw new Error('Receta no encontrada');
    }
  }

  /**
   * Obtener todas las versiones de recetas con filtros opcionales
   */
  async getVersions(): Promise<{
    versions: RecipeResponseDTO[];
    total: number;
    page: number;
    pageSize: number;
  }> {
    try {
      const response = await apiClient.get('/recetas/versiones');
      return response.data;
    } catch (error) {
      console.error('Error al obtener las versiones de recetas:', error);
      throw new Error('Error al obtener las versiones de recetas');
    }
  }

  /**
   * Crear una nueva versión de receta
   */ /*
  async createRecipeVersion(recipeData: CreateRecipeVersionDTO): Promise<VersionRecetaResponseDTO> {
    try {
      const response = await apiClient.post('/api/recetas/versiones', recipeData);
      message.success('Versión de receta creada exitosamente');
      return response.data;
    } catch (error) {
      console.error('Error al crear la versión de receta:', error);
      throw new Error('Error al crear la versión de receta');
    }
  }

  /**
   * Actualizar una versión de receta existente
   */ /*
  async updateRecipeVersion(
    id: string,
    recipeData: UpdateRecipeVersionDTO
  ): Promise<VersionRecetaResponseDTO> {
    try {
      const response = await apiClient.put(`/api/recetas/versiones/${id}`, recipeData);
      message.success('Versión de receta actualizada exitosamente');
      return response.data;
    } catch (error) {
      console.error('Error al actualizar la versión de receta:', error);
      throw new Error('Error al actualizar la versión de receta');
    }
  }*/

  /**
   * Eliminar una versión de receta
   */ /*
  async deleteRecipeVersion(id: string): Promise<void> {
    try {
      await apiClient.delete(`/api/recetas/versiones/${id}`);
      message.success('Versión de receta eliminada exitosamente');
    } catch (error) {
      console.error('Error al eliminar la versión de receta:', error);
      throw new Error('Error al eliminar la versión de receta');
    }
  }/*

  /**
   * Cambiar el estado activo/inactivo de una versión de receta
   */ /*
  async toggleRecipeVersionStatus(id: string, activo: boolean): Promise<VersionRecetaResponseDTO> {
    try {
      const response = await apiClient.patch(`/api/recetas/versiones/${id}/estado`, { activo });
      message.success(`Versión de receta ${activo ? 'activada' : 'desactivada'} exitosamente`);
      return response.data;
    } catch (error) {
      console.error('Error al cambiar el estado de la versión de receta:', error);
      throw new Error('Error al cambiar el estado de la versión de receta');
    }
  }*/

  /**
   * Buscar versiones de recetas por término
   */ /*
  async searchRecipeVersions(searchTerm: string): Promise<VersionRecetaResponseDTO[]> {
    try {
      const response = await apiClient.get(
        `/api/recetas/versiones/buscar?q=${encodeURIComponent(searchTerm)}`
      );
      return response.data;
    } catch (error) {
      console.error('Error al buscar versiones de recetas:', error);
      throw new Error('Error al buscar versiones de recetas');
    }
  }

  /**
   * Obtener el historial de cambios de una versión de receta
   */ /*
  async getRecipeVersionHistory(id: string): Promise<any[]> {
    try {
      const response = await apiClient.get(`/api/recetas/versiones/${id}/historial`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener el historial de la versión de receta:', error);
      throw new Error('Error al obtener el historial de la versión de receta');
    }
  }

  /**
   * Clonar una versión de receta existente
   */ /*
  async cloneRecipeVersion(id: string, nuevoCodigo: string): Promise<VersionRecetaResponseDTO> {
    try {
      const response = await apiClient.post(`/api/recetas/versiones/${id}/clonar`, {
        nuevoCodigoVersion: nuevoCodigo,
      });
      message.success('Versión de receta clonada exitosamente');
      return response.data;
    } catch (error) {
      console.error('Error al clonar la versión de receta:', error);
      throw new Error('Error al clonar la versión de receta');
    }
  }

  /**
   * Exportar versiones de recetas a Excel
   */ /*
  async exportRecipeVersions(filters: RecipeVersionFilterRequestDTO = {}): Promise<Blob> {
    try {
      const params = new URLSearchParams();

      // Agregar filtros a los parámetros
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, value.toString());
        }
      });

      const queryString = params.toString();
      const url = queryString
        ? `/api/recetas/versiones/exportar?${queryString}`
        : '/api/recetas/versiones/exportar';

      const response = await apiClient.get(url, {
        responseType: 'blob',
      });

      return response.data;
    } catch (error) {
      console.error('Error al exportar versiones de recetas:', error);
      throw new Error('Error al exportar versiones de recetas');
    }
  }*/
}

export const recipeService = new RecetaService();
