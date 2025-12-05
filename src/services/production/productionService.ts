import {apiClient} from '../apiClient';
import type {
    ProduccionMetadataModifyRequestDTO,
    ProduccionCambioEstadoRequestDTO
} from '@/pages/common/DetalleProduccion/types/Productions';

const updateMetadata = async (codigoProduccion: string, data: ProduccionMetadataModifyRequestDTO): Promise<void> => {
    await apiClient.put(`/producciones/${codigoProduccion}/metadata`, data);
};

const changeProductionState = async (codigoProduccion: string, data: ProduccionCambioEstadoRequestDTO): Promise<void> => {
    await apiClient.put(`/producciones/${codigoProduccion}/cambiar-estado`, data);
};

export const productionService = {
    updateMetadata,
    changeProductionState,
};
