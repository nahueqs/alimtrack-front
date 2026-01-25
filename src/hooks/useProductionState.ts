import { useCallback, useState } from 'react';
import type {
  EstructuraProduccionDTO,
  FieldUpdatePayload,
  ProductionMetadataUpdatedPayload,
  ProductionStateUpdatePayload,
  ProgresoProduccionResponseDTO,
  RespuestaCampoDTO,
  RespuestaTablaDTO,
  TableCellUpdatePayload,
} from '@/types/production';
import { recalculateProgreso } from '@/utils/production/progressUtils';

// Interfaz base para el estado que maneja este hook
// Tanto el DTO público como el protegido cumplen con esta estructura mínima
interface ProductionStateBase {
  respuestasCampos: RespuestaCampoDTO[];
  respuestasTablas: RespuestaTablaDTO[];
  progreso: ProgresoProduccionResponseDTO;
  produccion: {
    lote: string | null;
    estado: string;
    fechaFin: string | null;
    [key: string]: any; // Para permitir otros campos específicos de cada DTO
  };
  timestampConsulta: string;

  [key: string]: any; // Para permitir estructura u otros campos
}

export const useProductionState = <T extends ProductionStateBase>(
  initialState: T | null = null
) => {
  const [state, setState] = useState<T | null>(initialState);

  // Helper para actualizar el estado y recalcular progreso si hay estructura disponible
  const updateStateWithProgress = useCallback(
    (updater: (prevState: T) => T, estructura: EstructuraProduccionDTO | null) => {
      setState((prev) => {
        if (!prev) return null;

        const newState = updater(prev);

        // Si tenemos estructura, recalculamos el progreso
        // Nota: En el DTO protegido, la estructura puede venir dentro del state
        const estructuraToUse = estructura || (newState as any).estructura;

        if (estructuraToUse) {
          newState.progreso = recalculateProgreso(
            estructuraToUse,
            newState.respuestasCampos,
            newState.respuestasTablas
          );
        }

        return newState;
      });
    },
    []
  );

  const updateField = useCallback(
    (
      update: FieldUpdatePayload & { timestamp: string },
      estructura: EstructuraProduccionDTO | null
    ) => {
      updateStateWithProgress((prev) => {
        const newRespuestasCampos = prev.respuestasCampos.map((campo) =>
          campo.idCampo === update.idCampo
            ? { ...campo, valor: update.valor, timestamp: update.timestamp }
            : campo
        );

        if (!newRespuestasCampos.some((campo) => campo.idCampo === update.idCampo)) {
          newRespuestasCampos.push({
            idRespuesta: Date.now(), // ID temporal
            idCampo: update.idCampo,
            valor: update.valor,
            timestamp: update.timestamp,
          });
        }

        return {
          ...prev,
          respuestasCampos: newRespuestasCampos,
          timestampConsulta: new Date().toISOString(),
        };
      }, estructura);
    },
    [updateStateWithProgress]
  );

  const updateTable = useCallback(
    (
      update: TableCellUpdatePayload & { timestamp: string },
      estructura: EstructuraProduccionDTO | null
    ) => {
      updateStateWithProgress((prev) => {
        const newRespuestasTablas = prev.respuestasTablas.map((celda) =>
          celda.idTabla === update.idTabla &&
          celda.idFila === update.idFila &&
          celda.idColumna === update.idColumna
            ? { ...celda, valor: update.valor, timestampRespuesta: update.timestamp }
            : celda
        );

        if (
          !newRespuestasTablas.some(
            (celda) =>
              celda.idTabla === update.idTabla &&
              celda.idFila === update.idFila &&
              celda.idColumna === update.idColumna
          )
        ) {
          newRespuestasTablas.push({
            idTabla: update.idTabla,
            idFila: update.idFila,
            idColumna: update.idColumna,
            valor: update.valor,
            timestampRespuesta: update.timestamp,
            tipoDatoColumna: 'TEXTO', // Default, se corregirá al recargar
            nombreFila: `Fila ${update.idFila}`,
            nombreColumna: `Columna ${update.idColumna}`,
          });
        }

        return {
          ...prev,
          respuestasTablas: newRespuestasTablas,
          timestampConsulta: new Date().toISOString(),
        };
      }, estructura);
    },
    [updateStateWithProgress]
  );

  const updateProductionStatus = useCallback(
    (update: ProductionStateUpdatePayload & { timestamp: string }) => {
      setState((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          produccion: {
            ...prev.produccion,
            estado: update.estado,
            fechaFin: update.fechaFin || null,
          },
          timestampConsulta: new Date().toISOString(),
        };
      });
    },
    []
  );

  const updateMetadata = useCallback(
    (update: ProductionMetadataUpdatedPayload & { timestamp: string }) => {
      setState((prev) => {
        if (!prev) return null;
        // Actualizamos solo lo que es común o genérico.
        // Los campos específicos como 'encargado' se manejan por spread si existen en 'produccion'
        return {
          ...prev,
          produccion: {
            ...prev.produccion,
            lote: update.lote !== undefined ? update.lote : prev.produccion.lote,
            encargado: update.encargado, // Si el tipo T no tiene encargado, esto se ignorará o agregará dinámicamente
            observaciones: update.observaciones,
          },
          timestampConsulta: new Date().toISOString(),
        };
      });
    },
    []
  );

  return {
    state,
    setState,
    updateField,
    updateTable,
    updateProductionStatus,
    updateMetadata,
    recalculateProgreso, // Exportamos por si se necesita forzar un recalculo externo
  };
};
