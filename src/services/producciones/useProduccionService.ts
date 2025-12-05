import { useCallback, useState } from 'react';
import { productionService } from './ProduccionService';
import type {
    EstadoActualProduccionResponseDTO,
    ProduccionFilterRequestDTO,
    ProduccionProtectedResponseDTO,
    RespuestaCampoRequestDTO,
    RespuestaCeldaTablaRequestDTO,
    ProduccionCambioEstadoRequestDTO,
    ProduccionCreateRequestDTO,
    RespuestaCampoDTO,
    RespuestaTablaDTO,
    ProgresoProduccionResponseDTO,
    EstructuraProduccionDTO,
} from '@/pages/common/DetalleProduccion/types/Productions';

interface FieldUpdatePayload {
    idCampo: number;
    valor: string;
}

interface TableCellUpdatePayload {
    idTabla: number;
    idFila: number;
    idColumna: number;
    valor: string;
}

interface ProductionStateUpdatePayload {
    estado: 'EN_PROCESO' | 'FINALIZADA' | 'CANCELADA';
    fechaFin?: string | null;
}

interface ProductionMetadataUpdatePayload {
    codigoVersion?: string;
    lote?: string | null;
    encargado?: string | null;
    emailCreador?: string;
    observaciones?: string | null;
    fechaInicio?: string;
    fechaFin?: string | null;
    fechaModificacion?: string | null;
}


interface UseProduccionesReturn {
    loading: boolean;
    isSaving: boolean;
    producciones: ProduccionProtectedResponseDTO[];
    estadoActual: EstadoActualProduccionResponseDTO | null;
    error: boolean;
    getProducciones: (filters?: ProduccionFilterRequestDTO) => Promise<void>;
    getProduccionByCodigo: (codigo: string) => Promise<void>;
    createProduction: (data: ProduccionCreateRequestDTO) => Promise<ProduccionProtectedResponseDTO>;
    getUltimasRespuestas: (codigo: string) => Promise<void>;
    guardarRespuestaCampo: (codigoProduccion: string, idCampo: number, data: RespuestaCampoRequestDTO) => Promise<void>;
    guardarRespuestaCeldaTabla: (codigoProduccion: string, idTabla: number, idFila: number, idColumna: number, data: RespuestaCeldaTablaRequestDTO) => Promise<void>;
    cambiarEstadoProduccion: (codigoProduccion: string, data: ProduccionCambioEstadoRequestDTO) => Promise<void>;
    updateFieldResponse: (update: FieldUpdatePayload & { timestamp: string }) => void;
    updateTableCellResponse: (update: TableCellUpdatePayload & { timestamp: string }) => void;
    updateProductionState: (update: ProductionStateUpdatePayload & { timestamp: string }) => void;
    updateProductionMetadata: (update: ProductionMetadataUpdatePayload & { timestamp: string }) => void;
    setEstructura: (estructura: EstructuraProduccionDTO) => void; // New function
}

// Helper function to recalculate progress
const recalculateProgreso = (
    estructura: EstructuraProduccionDTO,
    respuestasCampos: RespuestaCampoDTO[],
    respuestasTablas: RespuestaTablaDTO[]
): ProgresoProduccionResponseDTO => {
    // console.log("[recalculateProgreso] Inputs:", { estructura, respuestasCampos, respuestasTablas }); // Removed log

    const totalCampos = estructura.totalCampos;
    const totalCeldasTablas = estructura.totalCeldas;

    const filteredCampos = respuestasCampos
        .filter(rc => rc.valor !== null && rc.valor.trim() !== '');
    console.log("[recalculateProgreso] Filtered campos:", filteredCampos); // Added log
    const camposRespondidos = new Set(
        filteredCampos
            .map(rc => rc.idCampo)
    ).size;

    const filteredCeldas = respuestasTablas
        .filter(rt => rt.valor !== null && rt.valor.trim() !== '');
    console.log("[recalculateProgreso] Filtered celdas:", filteredCeldas); // Added log
    const celdasRespondidas = new Set(
        filteredCeldas
            .map(rt => `${rt.idTabla}-${rt.idFila}-${rt.idColumna}`)
    ).size;

    const totalElementos = totalCampos + totalCeldasTablas;
    const elementosRespondidos = camposRespondidos + celdasRespondidas;

    const porcentajeCompletado = totalElementos > 0 ? (elementosRespondidos * 100.0) / totalElementos : 0.0;

    const progreso = {
        totalCampos,
        camposRespondidos,
        totalCeldasTablas,
        celdasRespondidas,
        totalElementos,
        elementosRespondidos,
        porcentajeCompletado,
    };
    // console.log("[recalculateProgreso] Calculated progress:", progreso); // Removed log
    return progreso;
};


export const useProduccionService = (): UseProduccionesReturn => {
    const [producciones, setProducciones] = useState<ProduccionProtectedResponseDTO[]>([]);
    const [estadoActual, setEstadoActual] = useState<EstadoActualProduccionResponseDTO | null>(null);
    const [loading, setLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState(false);

    const getProducciones = useCallback(async (filters: ProduccionFilterRequestDTO = {}) => {
        setLoading(true);
        setError(false);
        try {
            const response = await productionService.getProducciones(filters);
            setProducciones(response || []);
        } catch (err) {
            setError(true);
            setProducciones([]);
        } finally {
            setLoading(false);
        }
    }, []);

    const getProduccionByCodigo = useCallback(async (codigo: string) => {
        setLoading(true);
        setError(false);
        try {
            const response = await productionService.getProduccionByCodigo(codigo);
            setProducciones(response ? [response] : []);
        } catch (err) {
            setError(true);
            setProducciones([]);
        } finally {
            setLoading(false);
        }
    }, []);

    const getUltimasRespuestas = useCallback(async (codigo: string) => {
        setLoading(true);
        setError(false);
        try {
            const response = await productionService.getUltimasRespuestas(codigo);
            // console.log("[useProduccionService] Initial estadoActual received:", response); // Removed log
            setEstadoActual(response);
        } catch (err) {
            setError(true);
            setEstadoActual(null);
        } finally {
            setLoading(false);
        }
    }, []);

    const guardarRespuestaCampo = useCallback(async (codigoProduccion: string, idCampo: number, data: RespuestaCampoRequestDTO) => {
        setIsSaving(true);
        setError(false);
        try {
            await productionService.guardarRespuestaCampo(codigoProduccion, idCampo, data);
        } catch (err) {
            setError(true);
            throw err;
        } finally {
            setIsSaving(false);
        }
    }, []);

    const guardarRespuestaCeldaTabla = useCallback(async (codigoProduccion: string, idTabla: number, idFila: number, idColumna: number, data: RespuestaCeldaTablaRequestDTO) => {
        setIsSaving(true);
        setError(false);
        try {
            await productionService.guardarRespuestaCeldaTabla(codigoProduccion, idTabla, idFila, idColumna, data);
        } catch (err) {
            setError(true);
            throw err;
        } finally {
            setIsSaving(false);
        }
    }, []);

    const cambiarEstadoProduccion = useCallback(async (codigoProduccion: string, data: ProduccionCambioEstadoRequestDTO) => {
        setIsSaving(true);
        setError(false);
        try {
            await productionService.cambiarEstado(codigoProduccion, data);
        } catch (err) {
            setError(true);
            throw err;
        } finally {
            setIsSaving(false);
        }
    }, []);

    const createProduction = useCallback(async (data: ProduccionCreateRequestDTO) => {
        setLoading(true);
        setError(false);
        try {
            const newProduction = await productionService.createProduction(data);
            return newProduction;
        } catch (err) {
            setError(true);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const updateFieldResponse = useCallback((update: FieldUpdatePayload & { timestamp: string }) => {
        console.log("[useProduccionService] updateFieldResponse received update:", update); // Added log
        setEstadoActual(prevEstadoActual => {
            if (!prevEstadoActual) {
                // console.log("[useProduccionService] updateFieldResponse: No previous estadoActual, returning null."); // Removed log
                return null;
            }
            if (!prevEstadoActual.estructura) {
                console.warn("[useProduccionService] updateFieldResponse: No estructura found in estadoActual, cannot recalculate progress.");
                return prevEstadoActual; // Return current state if structure is missing
            }
            // console.log("[useProduccionService] updateFieldResponse: prevEstadoActual.estructura:", prevEstadoActual.estructura); // Removed log


            const newRespuestasCampos = prevEstadoActual.respuestasCampos.map(campo =>
                campo.idCampo === update.idCampo
                    ? {...campo, valor: update.valor, timestamp: update.timestamp}
                    : campo
            );

            if (!newRespuestasCampos.some(campo => campo.idCampo === update.idCampo)) {
                console.warn(`[useProduccionService] Field ${update.idCampo} not found in current responses. Adding as new. idRespuesta will be placeholder.`);
                newRespuestasCampos.push({
                    idRespuesta: Date.now(), // Placeholder ID
                    idCampo: update.idCampo,
                    valor: update.valor,
                    timestamp: update.timestamp
                });
            }

            const newProgreso = recalculateProgreso(prevEstadoActual.estructura, newRespuestasCampos, prevEstadoActual.respuestasTablas);

            const newState = {
                ...prevEstadoActual,
                respuestasCampos: newRespuestasCampos,
                progreso: newProgreso, // Update progreso
                timestampConsulta: new Date().toISOString(),
            };
            // console.log("[useProduccionService] updateFieldResponse: New state for estadoActual:", newState); // Removed log
            // console.log("[useProduccionService] updateFieldResponse: New progreso:", newProgreso); // Removed log
            return newState;
        });
    }, []);

    const updateTableCellResponse = useCallback((update: TableCellUpdatePayload & { timestamp: string }) => {
        // console.log("[useProduccionService] updateTableCellResponse called with:", update); // Removed log
        setEstadoActual(prevEstadoActual => {
            if (!prevEstadoActual) {
                // console.log("[useProduccionService] updateTableCellResponse: No previous estadoActual, returning null."); // Removed log
                return null;
            }
            if (!prevEstadoActual.estructura) {
                console.warn("[useProduccionService] updateTableCellResponse: No estructura found in estadoActual, cannot recalculate progress.");
                return prevEstadoActual; // Return current state if structure is missing
            }
            // console.log("[useProduccionService] updateTableCellResponse: prevEstadoActual.estructura:", prevEstadoActual.estructura); // Removed log


            const newRespuestasTablas = prevEstadoActual.respuestasTablas.map(celda =>
                celda.idTabla === update.idTabla && celda.idFila === update.idFila && celda.idColumna === update.idColumna
                    ? {...celda, valor: update.valor, timestampRespuesta: update.timestamp}
                    : celda
            );

            if (!newRespuestasTablas.some(celda => celda.idTabla === update.idTabla && celda.idFila === update.idFila && celda.idColumna === update.idColumna)) {
                console.warn(`[useProduccionService] Table cell (T:${update.idTabla}, F:${update.idFila}, C:${update.idColumna}) not found in current responses. Adding as new with partial metadata.`);
                newRespuestasTablas.push({
                    idTabla: update.idTabla,
                    idFila: update.idFila,
                    idColumna: update.idColumna,
                    valor: update.valor,
                    timestampRespuesta: update.timestamp,
                    tipoDatoColumna: 'TEXTO', // Placeholder
                    nombreFila: `Fila ${update.idFila}`, // Placeholder
                    nombreColumna: `Columna ${update.idColumna}`, // Placeholder
                });
            }

            const newProgreso = recalculateProgreso(prevEstadoActual.estructura, prevEstadoActual.respuestasCampos, newRespuestasTablas);

            const newState = {
                ...prevEstadoActual,
                respuestasTablas: newRespuestasTablas,
                progreso: newProgreso, // Update progreso
                timestampConsulta: new Date().toISOString(),
            };
            // console.log("[useProduccionService] updateTableCellResponse: New state for estadoActual:", newState); // Removed log
            // console.log("[useProduccionService] updateTableCellResponse: New progreso:", newProgreso); // Removed log
            return newState;
        });
    }, []);

    const updateProductionState = useCallback((update: ProductionStateUpdatePayload & { timestamp: string }) => {
        // console.log("[useProduccionService] updateProductionState called with:", update); // Removed log
        setEstadoActual(prevEstadoActual => {
            if (!prevEstadoActual) {
                // console.log("[useProduccionService] updateProductionState: No previous estadoActual, returning null."); // Removed log
                return null;
            }
            const newState = {
                ...prevEstadoActual,
                produccion: {
                    ...prevEstadoActual.produccion,
                    estado: update.estado,
                    fechaFin: update.fechaFin || null,
                },
                timestampConsulta: new Date().toISOString(),
            };
            // console.log("[useProduccionService] updateProductionState: New state for estadoActual:", newState); // Removed log
            return newState;
        });
    }, []);

    const updateProductionMetadata = useCallback((update: ProductionMetadataUpdatePayload & { timestamp: string }) => {
        // console.log("[useProduccionService] updateProductionMetadata called with:", update); // Removed log
        setEstadoActual(prevEstadoActual => {
            if (!prevEstadoActual) {
                // console.log("[useProduccionService] updateProductionMetadata: No previous estadoActual, returning null."); // Removed log
                return null;
            }
            const newState = {
                ...prevEstadoActual,
                produccion: {
                    ...prevEstadoActual.produccion,
                    codigoVersion: update.codigoVersion || prevEstadoActual.produccion.codigoVersion,
                    lote: update.lote !== undefined ? update.lote : prevEstadoActual.produccion.lote,
                    encargado: update.encargado !== undefined ? update.encargado : prevEstadoActual.produccion.encargado,
                    emailCreador: update.emailCreador !== undefined ? update.emailCreador : prevEstadoActual.produccion.emailCreador,
                    observaciones: update.observaciones !== undefined ? update.observaciones : prevEstadoActual.produccion.observaciones,
                    fechaInicio: update.fechaInicio || prevEstadoActual.produccion.fechaInicio,
                    fechaFin: update.fechaFin !== undefined ? update.fechaFin : prevEstadoActual.produccion.fechaFin,
                    fechaModificacion: update.fechaModificacion !== undefined ? update.fechaModificacion : prevEstadoActual.produccion.fechaModificacion,
                },
                timestampConsulta: new Date().toISOString(),
            };
            // console.log("[useProduccionService] updateProductionMetadata: New state for estadoActual:", newState); // Removed log
            return newState;
        });
    }, []);

    const setEstructura = useCallback((estructura: EstructuraProduccionDTO) => {
        // console.log("[useProduccionService] setEstructura called with:", estructura); // Removed log
        setEstadoActual(prevEstadoActual => {
            if (!prevEstadoActual) {
                console.warn("[useProduccionService] setEstructura: No previous estadoActual, cannot set estructura.");
                return null;
            }
            if (prevEstadoActual.estructura && prevEstadoActual.estructura.metadata.codigoVersionReceta === estructura.metadata.codigoVersionReceta) {
                // console.log("[useProduccionService] setEstructura: Estructura already present and matches, skipping update."); // Removed log
                return prevEstadoActual;
            }

            const newProgreso = recalculateProgreso(estructura, prevEstadoActual.respuestasCampos, prevEstadoActual.respuestasTablas);

            const newState = {
                ...prevEstadoActual,
                estructura: estructura,
                progreso: newProgreso, // Recalculate progress when structure is set
                timestampConsulta: new Date().toISOString(),
            };
            // console.log("[useProduccionService] setEstructura: New state for estadoActual with updated estructura:", newState); // Removed log
            // console.log("[useProduccionService] setEstructura: New progreso after setting estructura:", newProgreso); // Removed log
            return newState;
        });
    }, []);


    return {
        loading,
        isSaving,
        producciones,
        estadoActual,
        error,
        getProducciones,
        getProduccionByCodigo,
        createProduction,
        getUltimasRespuestas,
        guardarRespuestaCampo,
        guardarRespuestaCeldaTabla,
        cambiarEstadoProduccion,
        updateFieldResponse,
        updateTableCellResponse,
        updateProductionState,
        updateProductionMetadata,
        setEstructura, // Expose the new function
    };
};
