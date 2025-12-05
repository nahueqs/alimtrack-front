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
    ProduccionMetadataModifyRequestDTO,
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

interface ProductionMetadataCreationPayload {
    codigoVersion?: string;
    lote?: string | null;
    fechaInicio?: string;
    fechaFin?: string | null;
}

interface ProductionMetadataUpdatePayload {
    codigoVersion: string;
    lote: string;
    encargado: string;
    observaciones: string;
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
    guardarMetadata: (codigoProduccion: string, data: ProduccionMetadataModifyRequestDTO) => Promise<void>;
    updateFieldResponse: (update: FieldUpdatePayload & { timestamp: string }) => void;
    updateTableCellResponse: (update: TableCellUpdatePayload & { timestamp: string }) => void;
    updateProductionState: (update: ProductionStateUpdatePayload & { timestamp: string }) => void;
    updateProductionMetadata: (update: ProductionMetadataUpdatePayload & { timestamp: string }) => void;
    setEstructura: (estructura: EstructuraProduccionDTO) => void;
}

const recalculateProgreso = (
    estructura: EstructuraProduccionDTO,
    respuestasCampos: RespuestaCampoDTO[],
    respuestasTablas: RespuestaTablaDTO[]
): ProgresoProduccionResponseDTO => {
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

    return {
        totalCampos,
        camposRespondidos,
        totalCeldasTablas,
        celdasRespondidas,
        totalElementos,
        elementosRespondidos,
        porcentajeCompletado,
    };
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
    
    const guardarMetadata = useCallback(async (codigoProduccion: string, data: ProduccionMetadataModifyRequestDTO) => {
        setIsSaving(true);
        setError(false);
        try {
            await productionService.guardarMetadata(codigoProduccion, data);
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
        setEstadoActual(prevEstadoActual => {
            if (!prevEstadoActual) {
                return null;
            }
            if (!prevEstadoActual.estructura) {
                return prevEstadoActual;
            }

            const newRespuestasCampos = prevEstadoActual.respuestasCampos.map(campo =>
                campo.idCampo === update.idCampo
                    ? {...campo, valor: update.valor, timestamp: update.timestamp}
                    : campo
            );

            if (!newRespuestasCampos.some(campo => campo.idCampo === update.idCampo)) {
                newRespuestasCampos.push({
                    idRespuesta: Date.now(),
                    idCampo: update.idCampo,
                    valor: update.valor,
                    timestamp: update.timestamp
                });
            }

            const newProgreso = recalculateProgreso(prevEstadoActual.estructura, newRespuestasCampos, prevEstadoActual.respuestasTablas);

            return {
                ...prevEstadoActual,
                respuestasCampos: newRespuestasCampos,
                progreso: newProgreso,
                timestampConsulta: new Date().toISOString(),
            };
        });
    }, []);

    const updateTableCellResponse = useCallback((update: TableCellUpdatePayload & { timestamp: string }) => {
        setEstadoActual(prevEstadoActual => {
            if (!prevEstadoActual) {
                return null;
            }
            if (!prevEstadoActual.estructura) {
                return prevEstadoActual;
            }

            const newRespuestasTablas = prevEstadoActual.respuestasTablas.map(celda =>
                celda.idTabla === update.idTabla && celda.idFila === update.idFila && celda.idColumna === update.idColumna
                    ? {...celda, valor: update.valor, timestampRespuesta: update.timestamp}
                    : celda
            );

            if (!newRespuestasTablas.some(celda => celda.idTabla === update.idTabla && celda.idFila === update.idFila && celda.idColumna === update.idColumna)) {
                newRespuestasTablas.push({
                    idTabla: update.idTabla,
                    idFila: update.idFila,
                    idColumna: update.idColumna,
                    valor: update.valor,
                    timestampRespuesta: update.timestamp,
                    tipoDatoColumna: 'TEXTO',
                    nombreFila: `Fila ${update.idFila}`,
                    nombreColumna: `Columna ${update.idColumna}`,
                });
            }

            const newProgreso = recalculateProgreso(prevEstadoActual.estructura, prevEstadoActual.respuestasCampos, newRespuestasTablas);

            return {
                ...prevEstadoActual,
                respuestasTablas: newRespuestasTablas,
                progreso: newProgreso,
                timestampConsulta: new Date().toISOString(),
            };
        });
    }, []);

    const updateProductionState = useCallback((update: ProductionStateUpdatePayload & { timestamp: string }) => {
        setEstadoActual(prevEstadoActual => {
            if (!prevEstadoActual) {
                return null;
            }
            return {
                ...prevEstadoActual,
                produccion: {
                    ...prevEstadoActual.produccion,
                    estado: update.estado,
                    fechaFin: update.fechaFin || null,
                },
                timestampConsulta: new Date().toISOString(),
            };
        });
    }, []);

    const updateProductionMetadata = useCallback((update: ProductionMetadataUpdatePayload & { timestamp: string }) => {
        setEstadoActual(prevEstadoActual => {
            if (!prevEstadoActual) {
                return null;
            }
            return {
                ...prevEstadoActual,
                produccion: {
                    ...prevEstadoActual.produccion,
                    lote: update.lote,
                    encargado: update.encargado,
                    observaciones: update.observaciones,
                },
                timestampConsulta: new Date().toISOString(),
            };
        });
    }, []);

    const setEstructura = useCallback((estructura: EstructuraProduccionDTO) => {
        setEstadoActual(prevEstadoActual => {
            if (!prevEstadoActual) {
                return null;
            }
            if (prevEstadoActual.estructura && prevEstadoActual.estructura.metadata.codigoVersionReceta === estructura.metadata.codigoVersionReceta) {
                return prevEstadoActual;
            }

            const newProgreso = recalculateProgreso(estructura, prevEstadoActual.respuestasCampos, prevEstadoActual.respuestasTablas);

            return {
                ...prevEstadoActual,
                estructura: estructura,
                progreso: newProgreso,
                timestampConsulta: new Date().toISOString(),
            };
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
        guardarMetadata,
        updateFieldResponse,
        updateTableCellResponse,
        updateProductionState,
        updateProductionMetadata,
        setEstructura,
    };
};
