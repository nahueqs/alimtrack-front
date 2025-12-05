import { apiClient } from '../ApiClient';
import type {
    EstadoActualProduccionResponseDTO,
    ProduccionFilterRequestDTO,
    ProduccionProtectedResponseDTO,
    RespuestaCampoRequestDTO,
    RespuestaCeldaTablaRequestDTO,
    RespuestaCampoDTO,
    RespuestaTablaDTO,
    ProduccionCambioEstadoRequestDTO,
} from '@/pages/common/DetalleProduccion/types/Productions';

type ProduccionListResponse = ProduccionProtectedResponseDTO[];

class ProduccionService {
    async getProducciones(filters: ProduccionFilterRequestDTO = {}): Promise<ProduccionListResponse> {
        return apiClient.get<ProduccionListResponse>('/producciones', filters);
    }

    async getProduccionByCodigo(codigoProduccion: string): Promise<ProduccionProtectedResponseDTO> {
        if (!codigoProduccion) throw new Error('El código de producción es requerido.');
        return apiClient.get<ProduccionProtectedResponseDTO>(`/producciones/${encodeURIComponent(codigoProduccion)}`);
    }

    async getUltimasRespuestas(codigoProduccion: string): Promise<EstadoActualProduccionResponseDTO> {
        if (!codigoProduccion) throw new Error('El código de producción es requerido.');
        return apiClient.get<EstadoActualProduccionResponseDTO>(`/producciones/${encodeURIComponent(codigoProduccion)}/ultimas-respuestas`);
    }

    async guardarRespuestaCampo(codigoProduccion: string, idCampo: number, data: RespuestaCampoRequestDTO): Promise<RespuestaCampoDTO> {
        if (!codigoProduccion || !idCampo) throw new Error('El código de producción y el ID del campo son requeridos.');
        return apiClient.put<RespuestaCampoDTO>(`/producciones/${encodeURIComponent(codigoProduccion)}/campos/${idCampo}`, data);
    }

    async guardarRespuestaCeldaTabla(codigoProduccion: string, idTabla: number, idFila: number, idColumna: number, data: RespuestaCeldaTablaRequestDTO): Promise<RespuestaTablaDTO> {
        if (!codigoProduccion || !idTabla || !idFila || !idColumna) throw new Error('Todos los IDs son requeridos.');
        return apiClient.put<RespuestaTablaDTO>(`/producciones/${encodeURIComponent(codigoProduccion)}/tablas/${idTabla}/${idFila}/${idColumna}`, data);
    }

    async cambiarEstado(codigoProduccion: string, data: ProduccionCambioEstadoRequestDTO): Promise<void> {
        if (!codigoProduccion) throw new Error('El código de producción es requerido.');
        return apiClient.put<void>(`/producciones/${encodeURIComponent(codigoProduccion)}/cambiar-estado`, data);
    }

    async createProduction(productionData: any): Promise<ProduccionProtectedResponseDTO> {
        if (!productionData) throw new Error('Los datos de producción son requeridos.');
        return apiClient.post<ProduccionProtectedResponseDTO>('/producciones', productionData);
    }

    async updateProduction(codigoProduccion: string, productionData: any): Promise<ProduccionProtectedResponseDTO> {
        if (!codigoProduccion || !productionData) throw new Error('El código de producción y los datos son requeridos.');
        return apiClient.put<ProduccionProtectedResponseDTO>(`/producciones/${encodeURIComponent(codigoProduccion)}`, productionData);
    }

    async deleteProduction(codigoProduccion: string): Promise<void> {
        if (!codigoProduccion) throw new Error('El código de producción es requerido.');
        return apiClient.delete<void>(`/producciones/${encodeURIComponent(codigoProduccion)}`);
    }
}

export const productionService = new ProduccionService();
