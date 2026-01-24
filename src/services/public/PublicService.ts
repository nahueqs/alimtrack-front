import {apiClient} from '../ApiClient';
import type {
    EstructuraProduccionDTO,
    ProduccionPublicMetadataDTO,
    RespuestasProduccionPublicDTO,
    UltimaModificacionDTO
} from '@/pages/common/DetalleProduccion/types/Productions.ts'; // All types now from common/DetalleProduccion/types/Productions.ts

type ProduccionListResponse = ProduccionPublicMetadataDTO[]; // Changed type

class PublicService {
    /**
     * Obtiene todas las producciones de forma pública.
     */
    async getProduccionesPublicas(): Promise<ProduccionListResponse> {
        // Add a cache-busting timestamp to the request
        return apiClient.get<ProduccionListResponse>('public/producciones', {_t: Date.now()});
    }

    /**
     * Obtiene la estructura de una producción de forma pública.
     * @param codigoProduccion El código de la producción a consultar.
     */
    async getEstructuraProduccion(codigoProduccion: string): Promise<EstructuraProduccionDTO> {
        if (!codigoProduccion) {
            throw new Error('El código de producción es requerido.');
        }
        return apiClient.get<EstructuraProduccionDTO>(
            `public/producciones/${encodeURIComponent(codigoProduccion)}/estructura`
        );
    }

    /**
     * Obtiene las últimas respuestas de una producción de forma pública.
     * @param codigoProduccion El código de la producción a consultar.
     */
    async getUltimasRespuestasProduccion(codigoProduccion: string): Promise<RespuestasProduccionPublicDTO> { // Changed type
        if (!codigoProduccion) {
            throw new Error('El código de producción es requerido.');
        }
        return apiClient.get<RespuestasProduccionPublicDTO>(
            `public/producciones/${encodeURIComponent(codigoProduccion)}/ultimas-respuestas`
        );
    }

    /**
     * Obtiene la fecha de la última modificación de una producción de forma pública.
     * @param codigoProduccion El código de la producción a consultar.
     */
    async getUltimaModificacionProduccion(codigoProduccion: string): Promise<UltimaModificacionDTO> {
        if (!codigoProduccion) {
            throw new Error('El código de producción es requerido.');
        }
        return apiClient.get<UltimaModificacionDTO>(
            `public/producciones/${encodeURIComponent(codigoProduccion)}/ultima-modificacion`
        );
    }
}

export const publicService = new PublicService();
