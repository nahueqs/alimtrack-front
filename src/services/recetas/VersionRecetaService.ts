import { apiClient } from '../ApiClient';
import type {
  EstructuraProduccionDTO,
  VersionRecetaMetadataResponseDTO,
} from '@/types/production';

class VersionRecetaService {
  /**
   * Obtiene los metadatos de todas las versiones de recetas.
   */
  async getAllVersiones(): Promise<VersionRecetaMetadataResponseDTO[]> {
    return apiClient.get<VersionRecetaMetadataResponseDTO[]>('/versiones-receta');
  }

  /**
   * Obtiene los metadatos de una versión de receta específica por su código.
   */
  async getByCodigoVersion(codigoVersion: string): Promise<VersionRecetaMetadataResponseDTO> {
    if (!codigoVersion) {
      throw new Error('El código de versión es requerido.');
    }
    return apiClient.get<VersionRecetaMetadataResponseDTO>(
      `/versiones-receta/${encodeURIComponent(codigoVersion)}`
    );
  }

  /**
   * Obtiene la estructura completa de una versión de receta.
   */
  async getEstructuraCompleta(codigoVersion: string): Promise<EstructuraProduccionDTO> {
    if (!codigoVersion) {
      throw new Error('El código de versión es requerido.');
    }
    return apiClient.get<EstructuraProduccionDTO>(
      `/versiones-receta/${encodeURIComponent(codigoVersion)}/estructura-completa`
    );
  }

  // Aquí puedes añadir en el futuro los métodos para POST, PUT, DELETE si los necesitas.
}

export const versionRecetaService = new VersionRecetaService();
