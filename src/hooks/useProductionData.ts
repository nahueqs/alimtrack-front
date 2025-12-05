import { useEffect } from 'react';
import { useProduccionService } from '@/services/producciones/useProduccionService';
import { useVersionRecetaService } from '@/services/recetas/useVersionRecetaService';
import type { EstructuraProduccionDTO, EstadoActualProduccionResponseDTO } from '@/pages/common/DetalleProduccion/types/Productions';

interface UseProductionDataReturn {
    loading: boolean;
    error: boolean; // This is expected to be a boolean
    estadoActual: EstadoActualProduccionResponseDTO | null;
    estructura: EstructuraProduccionDTO | null;
    // Exposing all relevant functions and state from useProduccionService
    isSaving: boolean;
    getUltimasRespuestas: (codigo: string) => Promise<void>;
    guardarRespuestaCampo: (codigoProduccion: string, idCampo: number, data: any) => Promise<void>;
    guardarRespuestaCeldaTabla: (codigoProduccion: string, idTabla: number, idFila: number, idColumna: number, data: any) => Promise<void>;
    cambiarEstadoProduccion: (codigoProduccion: string, data: any) => Promise<void>;
    updateFieldResponse: (update: any) => void;
    updateTableCellResponse: (update: any) => void;
    updateProductionState: (update: any) => void;
    updateProductionMetadata: (update: any) => void;
    setEstructura: (estructura: EstructuraProduccionDTO) => void;
}

export const useProductionData = (codigoProduccion: string | undefined): UseProductionDataReturn => {
    const {
        loading: loadingRespuestas,
        error: errorRespuestas, // This is boolean
        estadoActual,
        isSaving, // Expose isSaving
        getUltimasRespuestas,
        guardarRespuestaCampo, // Expose guardarRespuestaCampo
        guardarRespuestaCeldaTabla, // Expose guardarRespuestaCeldaTabla
        cambiarEstadoProduccion, // Expose cambiarEstadoProduccion
        updateFieldResponse, // Expose updateFieldResponse
        updateTableCellResponse, // Expose updateTableCellResponse
        updateProductionState, // Expose updateProductionState
        updateProductionMetadata, // Expose updateProductionMetadata
        setEstructura,
    } = useProduccionService(); // Only one call to useProduccionService

    const {
        loading: loadingEstructura,
        error: errorEstructura, // This is string | null
        estructura,
        getEstructuraCompleta,
    } = useVersionRecetaService();

    // Effect for initial data fetching (runs once on mount or codigoProduccion change)
    useEffect(() => {
        if (codigoProduccion) {
            // console.log(`[useProductionData] Initial data fetch effect triggered for ${codigoProduccion}.`); // Removed log
            getUltimasRespuestas(codigoProduccion);
        }
    }, [codigoProduccion, getUltimasRespuestas]);

    // Effect to fetch structure and update estadoActual in useProduccionService
    useEffect(() => {
        if (estadoActual?.produccion.codigoVersion && !estructura) {
            // console.log("[useProductionData] estadoActual updated, fetching estructura."); // Removed log
            getEstructuraCompleta(estadoActual.produccion.codigoVersion);
        }
        if (estructura && estadoActual && !estadoActual.estructura) {
            // console.log("[useProductionData] Estructura loaded, setting in useProduccionService."); // Removed log
            setEstructura(estructura);
            // console.log("[useProductionData] setEstructura called successfully."); // Removed log
        }
    }, [estadoActual, getEstructuraCompleta, estructura, setEstructura]);

    const loadingCombined = loadingRespuestas || loadingEstructura;
    // Convert errorEstructura to boolean using !!
    const errorCombined = errorRespuestas || !!errorEstructura;

    return {
        loading: loadingCombined,
        error: errorCombined,
        estadoActual,
        estructura,
        isSaving,
        getUltimasRespuestas,
        guardarRespuestaCampo,
        guardarRespuestaCeldaTabla,
        cambiarEstadoProduccion,
        updateFieldResponse,
        updateTableCellResponse,
        updateProductionState,
        updateProductionMetadata,
        setEstructura,
    };
};
