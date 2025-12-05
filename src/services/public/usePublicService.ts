import {useCallback, useState} from 'react';
import {publicService} from './PublicService';
import type {
    ProduccionPublicMetadataDTO,
    EstructuraProduccionDTO,
    RespuestasProduccionPublicDTO,
    UltimaModificacionDTO,
    RespuestaCampoDTO,
    RespuestaTablaDTO,
    ProgresoProduccionResponseDTO,
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
    fechaInicio?: string;
    fechaFin?: string | null;
}


interface UsePublicServiceReturn {
    loading: boolean;
    producciones: ProduccionPublicMetadataDTO[];
    estructura: EstructuraProduccionDTO | null;
    respuestas: RespuestasProduccionPublicDTO | null;
    ultimaModificacion: UltimaModificacionDTO | null;
    error: string | null;
    getProduccionesPublicas: () => Promise<void>;
    getEstructuraProduccion: (codigo: string) => Promise<void>;
    getUltimasRespuestasProduccion: (codigo: string) => Promise<void>;
    getUltimaModificacionProduccion: (codigo: string) => Promise<void>;
    updateFieldResponse: (update: FieldUpdatePayload & { timestamp: string }) => void;
    updateTableCellResponse: (update: TableCellUpdatePayload & { timestamp: string }) => void;
    updateProductionState: (update: ProductionStateUpdatePayload & { timestamp: string }) => void;
    updateProductionMetadata: (update: ProductionMetadataUpdatePayload & { timestamp: string }) => void;
    updateProductionStateInList: (codigoProduccion: string, update: ProductionStateUpdatePayload & { timestamp: string }) => void; // New function
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

    const camposRespondidos = new Set(
        respuestasCampos
            .filter(rc => rc.valor !== null && rc.valor.trim() !== '')
            .map(rc => rc.idCampo)
    ).size;

    const celdasRespondidas = new Set(
        respuestasTablas
            .filter(rt => rt.valor !== null && rt.valor.trim() !== '')
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


export const usePublicService = (): UsePublicServiceReturn => {
    const [producciones, setProducciones] = useState<ProduccionPublicMetadataDTO[]>([]);
    const [estructura, setEstructura] = useState<EstructuraProduccionDTO | null>(null);
    const [respuestas, setRespuestas] = useState<RespuestasProduccionPublicDTO | null>(null);
    const [ultimaModificacion, setUltimaModificacion] = useState<UltimaModificacionDTO | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const getProduccionesPublicas = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await publicService.getProduccionesPublicas();
            setProducciones(response || []);
        } catch (err: any) {
            setError(err.message || 'Ocurrió un error al obtener las producciones.');
            setProducciones([]);
        } finally {
            setLoading(false);
        }
    }, []);

    const getEstructuraProduccion = useCallback(async (codigo: string) => {
        setLoading(true);
        setError(null);
        try {
            const response = await publicService.getEstructuraProduccion(codigo);
            setEstructura(response);
        } catch (err: any) {
            setError(err.message || `Error al obtener la estructura de la producción ${codigo}.`);
            setEstructura(null);
        } finally {
            setLoading(false);
        }
    }, []);

    const getUltimasRespuestasProduccion = useCallback(async (codigo: string) => {
        setLoading(true);
        setError(null);
        try {
            const response = await publicService.getUltimasRespuestasProduccion(codigo);
            setRespuestas(response);
        } catch (err: any) {
            setError(err.message || `Error al obtener las respuestas de la producción ${codigo}.`);
            setRespuestas(null);
        } finally {
            setLoading(false);
        }
    }, []);

    const getUltimaModificacionProduccion = useCallback(async (codigo: string) => {
        setLoading(true);
        setError(null);
        try {
            const response = await publicService.getUltimaModificacionProduccion(codigo);
            setUltimaModificacion(response);
        } catch (err: any) {
            setError(err.message || `Error al obtener la última modificación de la producción ${codigo}.`);
            setUltimaModificacion(null);
        } finally {
            setLoading(false);
        }
    }, []);

    const updateFieldResponse = useCallback((update: FieldUpdatePayload & { timestamp: string }) => {
        // console.log("[usePublicService] updateFieldResponse called with:", update); // Removed log
        setRespuestas(prevRespuestas => {
            if (!prevRespuestas || !estructura) { // Ensure estructura is available
                // console.log("[usePublicService] updateFieldResponse: No previous responses or estructura, returning null."); // Removed log
                return null;
            }

            const newRespuestasCampos = prevRespuestas.respuestasCampos.map(campo =>
                campo.idCampo === update.idCampo
                    ? {...campo, valor: update.valor, timestamp: update.timestamp}
                    : campo
            );

            if (!newRespuestasCampos.some(campo => campo.idCampo === update.idCampo)) {
                console.warn(`[usePublicService] Field ${update.idCampo} not found in current responses. Adding as new. idRespuesta will be placeholder.`);
                newRespuestasCampos.push({
                    idRespuesta: Date.now(), // Placeholder ID
                    idCampo: update.idCampo,
                    valor: update.valor,
                    timestamp: update.timestamp
                });
            }

            const newProgreso = recalculateProgreso(estructura, newRespuestasCampos, prevRespuestas.respuestasTablas);

            const newState = {
                ...prevRespuestas,
                respuestasCampos: newRespuestasCampos,
                progreso: newProgreso, // Update progreso
                timestampConsulta: new Date().toISOString(),
            };
            // console.log("[usePublicService] updateFieldResponse: New state for respuestas:", newState); // Removed log
            return newState;
        });
    }, [estructura]); // Add estructura to dependencies

    const updateTableCellResponse = useCallback((update: TableCellUpdatePayload & { timestamp: string }) => {
        // console.log("[usePublicService] updateTableCellResponse called with:", update); // Removed log
        setRespuestas(prevRespuestas => {
            if (!prevRespuestas || !estructura) { // Ensure estructura is available
                // console.log("[usePublicService] updateTableCellResponse: No previous responses or estructura, returning null."); // Removed log
                return null;
            }

            const newRespuestasTablas = prevRespuestas.respuestasTablas.map(celda =>
                celda.idTabla === update.idTabla && celda.idFila === update.idFila && celda.idColumna === update.idColumna
                    ? {...celda, valor: update.valor, timestampRespuesta: update.timestamp}
                    : celda
            );

            if (!newRespuestasTablas.some(celda => celda.idTabla === update.idTabla && celda.idFila === update.idFila && celda.idColumna === update.idColumna)) {
                console.warn(`[usePublicService] Table cell (T:${update.idTabla}, F:${update.idFila}, C:${update.idColumna}) not found in current responses. Adding as new with partial metadata.`);
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

            const newProgreso = recalculateProgreso(estructura, prevRespuestas.respuestasCampos, newRespuestasTablas);

            const newState = {
                ...prevRespuestas,
                respuestasTablas: newRespuestasTablas,
                progreso: newProgreso, // Update progreso
                timestampConsulta: new Date().toISOString(),
            };
            // console.log("[usePublicService] updateTableCellResponse: New state for respuestas:", newState); // Removed log
            return newState;
        });
    }, [estructura]); // Add estructura to dependencies

    const updateProductionState = useCallback((update: ProductionStateUpdatePayload & { timestamp: string }) => {
        // console.log("[usePublicService] updateProductionState called with:", update); // Removed log
        setRespuestas(prevRespuestas => {
            if (!prevRespuestas) {
                // console.log("[usePublicService] updateProductionState: No previous responses, returning null."); // Removed log
                return null;
            }
            const newState = {
                ...prevRespuestas,
                produccion: {
                    ...prevRespuestas.produccion,
                    estado: update.estado,
                    fechaFin: update.fechaFin || null,
                },
                timestampConsulta: new Date().toISOString(),
            };
            // console.log("[usePublicService] updateProductionState: New state for respuestas:", newState); // Removed log
            return newState;
        });
    }, []);

    const updateProductionMetadata = useCallback((update: ProductionMetadataUpdatePayload & { timestamp: string }) => {
        // console.log("[usePublicService] updateProductionMetadata called with:", update); // Removed log
        setRespuestas(prevRespuestas => {
            if (!prevRespuestas) {
                // console.log("[usePublicService] updateProductionMetadata: No previous responses, returning null."); // Removed log
                return null;
            }
            const newState = {
                ...prevRespuestas,
                produccion: {
                    ...prevRespuestas.produccion,
                    codigoVersion: update.codigoVersion || prevRespuestas.produccion.codigoVersion,
                    lote: update.lote !== undefined ? update.lote : prevRespuestas.produccion.lote,
                    fechaInicio: update.fechaInicio || prevRespuestas.produccion.fechaInicio,
                    fechaFin: update.fechaFin !== undefined ? update.fechaFin : prevRespuestas.produccion.fechaFin,
                },
                timestampConsulta: new Date().toISOString(),
            };
            // console.log("[usePublicService] updateProductionMetadata: New state for respuestas:", newState); // Removed log
            return newState;
        });
    }, []);

    const updateProductionStateInList = useCallback((
        codigoProduccion: string,
        update: ProductionStateUpdatePayload & { timestamp: string }
    ) => {
        // console.log(`[usePublicService] updateProductionStateInList called for ${codigoProduccion} with state:`, update.estado); // Removed log
        setProducciones(prevProducciones => {
            if (!prevProducciones) return [];

            const updatedProducciones = prevProducciones.map(prod => {
                if (prod.codigoProduccion === codigoProduccion) {
                    return {
                        ...prod,
                        estado: update.estado,
                        fechaFin: update.fechaFin !== undefined ? update.fechaFin : prod.fechaFin,
                        fechaModificacion: update.timestamp, // Update last modification time
                    };
                }
                return prod;
            });
            // console.log("[usePublicService] updateProductionStateInList: New list of productions:", updatedProducciones); // Removed log
            return updatedProducciones;
        });
    }, []);


    return {
        loading,
        producciones,
        estructura,
        respuestas,
        ultimaModificacion,
        error,
        getProduccionesPublicas,
        getEstructuraProduccion,
        getUltimasRespuestasProduccion,
        getUltimaModificacionProduccion,
        updateFieldResponse,
        updateTableCellResponse,
        updateProductionState,
        updateProductionMetadata,
        updateProductionStateInList, // Export new function
    };
};
