import {useCallback, useState} from 'react';
import {productionService} from './productionService';
import type {ProduccionMetadataModifyRequestDTO} from '@/pages/common/DetalleProduccion/types/Productions';

export const useProductionService = () => {
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const guardarMetadata = useCallback(async (codigoProduccion: string, data: ProduccionMetadataModifyRequestDTO) => {
        setIsSaving(true);
        setError(null);
        try {
            await productionService.updateMetadata(codigoProduccion, data);
        } catch (err) {
            setError('Failed to update metadata');
            console.error(err);
        } finally {
            setIsSaving(false);
        }
    }, []);

    const cambiarEstadoProduccion = useCallback(async (codigoProduccion: string, nuevoEstado: 'FINALIZADA' | 'CANCELADA') => {
        setIsSaving(true);
        setError(null);
        try {
            await productionService.changeProductionState(codigoProduccion, nuevoEstado);
        } catch (err) {
            setError('Failed to change production state');
            console.error(err);
        } finally {
            setIsSaving(false);
        }
    }, []);

    return {
        isSaving,
        error,
        guardarMetadata,
        cambiarEstadoProduccion,
    };
};
