import { useCallback, useState } from 'react';
import { publicService } from './PublicService';
import { useProductionState } from '@/hooks/useProductionState';
import type {
  EstructuraProduccionDTO,
  FieldUpdatePayload,
  ProduccionPublicMetadataDTO,
  ProductionMetadataUpdatedPayload,
  ProductionStateUpdatePayload,
  RespuestasProduccionPublicDTO,
  TableCellUpdatePayload,
  UltimaModificacionDTO,
} from '@/types/production';

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
  updateProductionMetadata: (
    update: ProductionMetadataUpdatedPayload & { timestamp: string }
  ) => void;
  updateProductionStateInList: (
    codigoProduccion: string,
    update: ProductionStateUpdatePayload & {
      timestamp: string;
    }
  ) => void;
}

export const usePublicService = (): UsePublicServiceReturn => {
  const [producciones, setProducciones] = useState<ProduccionPublicMetadataDTO[]>([]);
  const [estructura, setEstructura] = useState<EstructuraProduccionDTO | null>(null);
  const [ultimaModificacion, setUltimaModificacion] = useState<UltimaModificacionDTO | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Usamos el hook genérico para manejar el estado de las respuestas
  const {
    state: respuestas,
    setState: setRespuestas,
    updateField,
    updateTable,
    updateProductionStatus,
    updateMetadata: updateStateMetadata,
  } = useProductionState<RespuestasProduccionPublicDTO>();

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

  const getUltimasRespuestasProduccion = useCallback(
    async (codigo: string) => {
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
    },
    [setRespuestas]
  );

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

  // Delegamos las actualizaciones al hook genérico
  // Aquí pasamos explícitamente la estructura que tenemos en el estado local
  const updateFieldResponse = useCallback(
    (update: FieldUpdatePayload & { timestamp: string }) => {
      updateField(update, estructura);
    },
    [updateField, estructura]
  );

  const updateTableCellResponse = useCallback(
    (update: TableCellUpdatePayload & { timestamp: string }) => {
      updateTable(update, estructura);
    },
    [updateTable, estructura]
  );

  const updateProductionState = useCallback(
    (update: ProductionStateUpdatePayload & { timestamp: string }) => {
      updateProductionStatus(update);
    },
    [updateProductionStatus]
  );

  const updateProductionMetadata = useCallback(
    (update: ProductionMetadataUpdatedPayload & { timestamp: string }) => {
      updateStateMetadata(update);
    },
    [updateStateMetadata]
  );

  const updateProductionStateInList = useCallback(
    (codigoProduccion: string, update: ProductionStateUpdatePayload & { timestamp: string }) => {
      setProducciones((prevProducciones) => {
        if (!prevProducciones) return [];
        return prevProducciones.map((prod) =>
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
    },
    []
  );

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
