import { apiClient } from '../ApiClient';
import type {
  EstructuraProduccionDTO,
  ProduccionPublicMetadataDTO,
  RespuestasProduccionPublicDTO,
  UltimaModificacionDTO,
} from '@/types/production'; // All types now from common/DetalleProduccion/types/Productions.ts

class PublicService {
  async getProduccionesPublicas(): Promise<ProduccionPublicMetadataDTO[]> {
    return apiClient.get<ProduccionPublicMetadataDTO[]>('/public/producciones');
  }

  async getEstructuraProduccion(codigoProduccion: string): Promise<EstructuraProduccionDTO> {
    if (!codigoProduccion) throw new Error('El código de producción es requerido.');
    return apiClient.get<EstructuraProduccionDTO>(
      `/public/producciones/${encodeURIComponent(codigoProduccion)}/estructura`
    );
  }

  async getUltimasRespuestasProduccion(
    codigoProduccion: string
  ): Promise<RespuestasProduccionPublicDTO> {
    if (!codigoProduccion) throw new Error('El código de producción es requerido.');
    return apiClient.get<RespuestasProduccionPublicDTO>(
      `/public/producciones/${encodeURIComponent(codigoProduccion)}/ultimas-respuestas`
    );
  }

  async getUltimaModificacionProduccion(codigoProduccion: string): Promise<UltimaModificacionDTO> {
    if (!codigoProduccion) throw new Error('El código de producción es requerido.');
    return apiClient.get<UltimaModificacionDTO>(
      `/public/producciones/${encodeURIComponent(codigoProduccion)}/ultima-modificacion`
    );
  }
}

export const publicService = new PublicService();
