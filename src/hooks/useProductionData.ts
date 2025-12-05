import { useEffect, useState, useCallback } from 'react';
import { productionService } from '@/services/production/productionService';
import { useVersionRecetaService } from '@/services/recetas/useVersionRecetaService';
import type {
    EstructuraProduccionDTO,
    EstadoActualProduccionResponseDTO,
    ProduccionMetadataModifyRequestDTO,
    FieldUpdatePayload,
    TableCellUpdatePayload,
    ProductionStateUpdatePayload,
    ProductionMetadataUpdatedPayload,
    ProduccionCambioEstadoRequestDTO,
} from '@/pages/common/DetalleProduccion/types/Productions';
import { useProduccionService } from '@/services/producciones/useProduccionService';

interface UseProductionDataReturn {
    loading: boolean;
    error: boolean;
    estadoActual: EstadoActualProduccionResponseDTO | null;
    estructura: EstructuraProduccionDTO | null;
    isSaving: boolean;
    getUltimasRespuestas: (codigo: string) => Promise<void>;
    guardarRespuestaCampo: (codigoProduccion: string, idCampo: number, data: any) => Promise<void>;
    guardarRespuestaCeldaTabla: (codigoProduccion: string, idTabla: number, idFila: number, idColumna: number, data: any) => Promise<void>;
    cambiarEstadoProduccion: (codigoProduccion: string, data: ProduccionCambioEstadoRequestDTO) => Promise<void>;
    guardarMetadata: (codigoProduccion: string, data: ProduccionMetadataModifyRequestDTO) => Promise<void>;
    updateFieldResponse: (update: FieldUpdatePayload) => void;
    updateTableCellResponse: (update: TableCellUpdatePayload) => void;
    updateProductionState: (update: ProductionStateUpdatePayload) => void;
    updateProductionMetadata: (update: ProductionMetadataUpdatedPayload) => void;
}

export const useProductionData = (codigoProduccion: string | undefined): UseProductionDataReturn => {
    const {
        loading: loadingRespuestas,
        error: errorRespuestas,
        estadoActual,
        isSaving: isSavingRespuestas,
        getUltimasRespuestas,
        guardarRespuestaCampo,
        guardarRespuestaCeldaTabla,
        updateFieldResponse,
        updateTableCellResponse,
        updateProductionState,
        updateProductionMetadata,
        setEstructura,
    } = useProduccionService();

    const {
        loading: loadingEstructura,
        error: errorEstructura,
        estructura,
        getEstructuraCompleta,
    } = useVersionRecetaService();

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

    const cambiarEstadoProduccion = useCallback(async (codigoProduccion: string, data: ProduccionCambioEstadoRequestDTO) => {
        setIsSaving(true);
        setError(null);
        try {
            await productionService.changeProductionState(codigoProduccion, data);
        } catch (err) {
            setError('Failed to change production state');
            console.error(err);
        } finally {
            setIsSaving(false);
        }
    }, []);

    useEffect(() => {
        if (codigoProduccion) {
            getUltimasRespuestas(codigoProduccion);
        }
    }, [codigoProduccion, getUltimasRespuestas]);

    useEffect(() => {
        if (estadoActual?.produccion.codigoVersion && !estructura) {
            getEstructuraCompleta(estadoActual.produccion.codigoVersion);
        }
        if (estructura && estadoActual && !estadoActual.estructura) {
            setEstructura(estructura);
        }
    }, [estadoActual, getEstructuraCompleta, estructura, setEstructura]);

    const loadingCombined = loadingRespuestas || loadingEstructura;
    const errorCombined = errorRespuestas || !!errorEstructura || !!error;
    const isSavingCombined = isSavingRespuestas || isSaving;

    return {
        loading: loadingCombined,
        error: errorCombined,
        estadoActual,
        estructura,
        isSaving: isSavingCombined,
        getUltimasRespuestas,
        guardarRespuestaCampo,
        guardarRespuestaCeldaTabla,
        cambiarEstadoProduccion,
        guardarMetadata,
        updateFieldResponse,
        updateTableCellResponse,
        updateProductionState,
        updateProductionMetadata,
    };
};
