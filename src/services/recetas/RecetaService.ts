import { apiClient } from '../ApiClient';
import type { RecetaResponseDTO } from '@/pages/Recetas/types/Recipes.ts';

// Asumo que la API puede devolver una lista de recetas dentro de un objeto contenedor.
interface RecipeListResponse {
  recetas: RecetaResponseDTO[];
  total?: number;
  // Se pueden agregar otros campos de paginación si es necesario.
}

// Asumo que los filtros para recetas son un objeto genérico.
type RecipeFilterDTO = Record<string, any>;

class RecetaService {
  /**
   * Obtiene una lista de recetas, con filtros opcionales.
   */
  async getRecetas(filters: RecipeFilterDTO = {}): Promise<RecipeListResponse> {
    return apiClient.get<RecipeListResponse>('/recetas', filters);
  }

  /**
   * Obtiene una única receta por su código.
   */
  async getRecetaByCodigo(codigoReceta: string): Promise<RecetaResponseDTO> {
    if (!codigoReceta) {
      throw new Error('El código de la receta es requerido.');
    }
    return apiClient.get<RecetaResponseDTO>(`/recetas/${encodeURIComponent(codigoReceta)}`);
  }

  /**
   * Crea una nueva receta.
   * El cuerpo de la petición puede ser un DTO específico o un objeto parcial.
   */
  async createReceta(recetaData: Partial<RecetaResponseDTO>): Promise<RecetaResponseDTO> {
    if (!recetaData) {
      throw new Error('Los datos de la receta son requeridos.');
    }
    return apiClient.post<RecetaResponseDTO>('/recetas', recetaData);
  }

  /**
   * Actualiza una receta existente.
   */
  async updateReceta(
    codigoReceta: string,
    recetaData: Partial<RecetaResponseDTO>
  ): Promise<RecetaResponseDTO> {
    if (!codigoReceta || !recetaData) {
      throw new Error('El código de la receta y los datos son requeridos.');
    }
    return apiClient.put<RecetaResponseDTO>(
      `/recetas/${encodeURIComponent(codigoReceta)}`,
      recetaData
    );
  }

  /**
   * Elimina una receta por su código.
   */
  async deleteReceta(codigoReceta: string): Promise<void> {
    if (!codigoReceta) {
      throw new Error('El código de la receta es requerido.');
    }
    return apiClient.delete<void>(`/recetas/${encodeURIComponent(codigoReceta)}`);
  }
}

export const recetaService = new RecetaService();
