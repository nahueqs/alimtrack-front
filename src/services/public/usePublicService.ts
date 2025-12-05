import {useCallback, useState, useEffect} from 'react';
import {publicService} from './PublicService';
import type {
    ProduccionPublicMetadataDTO,
    EstructuraProduccionDTO,
    RespuestasProduccionPublicDTO,
    UltimaModificacionDTO,
    RespuestaCampoDTO,
    RespuestaTablaDTO,
    ProgresoProduccionResponseDTO,
    ProductionMetadataUpdatedPayload,
    FieldUpdatePayload,
    TableCellUpdatePayload,
    ProductionStateUpdatePayload,
} from '@/pages/common/DetalleProduccion/types/Productions';

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
    updateProductionMetadata: (update: ProductionMetadataUpdatedPayload & { timestamp: string }) => void;
    updateProductionStateInList: (codigoProduccion: string, update: ProductionStateUpdatePayload & { timestamp: string }) => void;
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

export const usePublicService = (): UsePublicServiceReturn => {
    const [producciones, setProducciones] = useState<ProduccionPublicMetadataDTO[]>([]);
    const [estructura, setEstructura] = useState<EstructuraProduccionDTO | null>(null);
    const [respuestas, setRespuestas] = useState<RespuestasProduccionPublicDTO | null>(null);
    const [ultimaModificacion, setUltimaModificacion] = useState<UltimaModificacionDTO | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (estructura && respuestas) {
            const newProgreso = recalculateProgreso(estructura, respuestas.respuestasCampos, respuestas.respuestasTablas);
            setRespuestas(prevRespuestas => prevRespuestas ? {...prevRespuestas, progreso: newProgreso} : null);
        }
    }, [estructura, respuestas?.respuestasCampos, respuestas?.respuestasTablas]);

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
        setRespuestas(prevRespuestas => {
            if (!prevRespuestas) return null;

            const newRespuestasCampos = prevRespuestas.respuestasCampos.map(campo =>
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

            return {
                ...prevRespuestas,
                respuestasCampos: newRespuestasCampos,
                timestampConsulta: new Date().toISOString(),
            };
        });
    }, []);

    const updateTableCellResponse = useCallback((update: TableCellUpdatePayload & { timestamp: string }) => {
        setRespuestas(prevRespuestas => {
            if (!prevRespuestas) return null;

            const newRespuestasTablas = prevRespuestas.respuestasTablas.map(celda =>
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

            return {
                ...prevRespuestas,
                respuestasTablas: newRespuestasTablas,
                timestampConsulta: new Date().toISOString(),
            };
        });
    }, []);

    const updateProductionState = useCallback((update: ProductionStateUpdatePayload & { timestamp: string }) => {
        setRespuestas(prevRespuestas => {
            if (!prevRespuestas) return null;
            return {
                ...prevRespuestas,
                produccion: {
                    ...prevRespuestas.produccion,
                    estado: update.estado,
                    fechaFin: update.fechaFin || null,
                },
                timestampConsulta: new Date().toISOString(),
            };
        });
    }, []);

    const updateProductionMetadata = useCallback((update: ProductionMetadataUpdatedPayload & { timestamp: string }) => {
        setRespuestas(prevRespuestas => {
            if (!prevRespuestas) return null;
            return {
                ...prevRespuestas,
                produccion: {
                    ...prevRespuestas.produccion,
                    lote: update.lote !== undefined ? update.lote : prevRespuestas.produccion.lote,
                },
                timestampConsulta: new Date().toISOString(),
            };
        });
    }, []);

    const updateProductionStateInList = useCallback((
        codigoProduccion: string,
        update: ProductionStateUpdatePayload & { timestamp: string }
    ) => {
        setProducciones(prevProducciones => {
            if (!prevProducciones) return [];
            return prevProducciones.map(prod =>
                prod.codigoProduccion === codigoProduccion
                    ? {
                        ...prod,
                        estado: update.estado,
                        fechaFin: update.fechaFin !== undefined ? update.fechaFin : prod.fechaFin,
                        fechaModificacion: update.timestamp,
                    }
                    : prod
            );
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
        updateProductionStateInList,
    };
};
