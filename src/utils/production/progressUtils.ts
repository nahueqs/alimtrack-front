import type {
  EstructuraProduccionDTO,
  ProgresoProduccionResponseDTO,
  RespuestaCampoDTO,
  RespuestaTablaDTO,
} from '@/types/production';

/**
 * Recalcula el progreso de una producción basándose en la estructura y las respuestas actuales.
 * Es una función pura.
 */
export const recalculateProgreso = (
  estructura: EstructuraProduccionDTO,
  respuestasCampos: RespuestaCampoDTO[],
  respuestasTablas: RespuestaTablaDTO[]
): ProgresoProduccionResponseDTO => {
  const totalCampos = estructura.totalCampos;
  const totalCeldasTablas = estructura.totalCeldas;

  const camposRespondidos = new Set(
    respuestasCampos
      .filter(
        (rc) => rc.valor !== null && rc.valor !== undefined && String(rc.valor).trim() !== ''
      )
      .map((rc) => rc.idCampo)
  ).size;

  const celdasRespondidas = new Set(
    respuestasTablas
      .filter(
        (rt) => rt.valor !== null && rt.valor !== undefined && String(rt.valor).trim() !== ''
      )
      .map((rt) => `${rt.idTabla}-${rt.idFila}-${rt.idColumna}`)
  ).size;

  const totalElementos = totalCampos + totalCeldasTablas;
  const elementosRespondidos = camposRespondidos + celdasRespondidas;

  const porcentajeCompletado =
    totalElementos > 0 ? (elementosRespondidos * 100.0) / totalElementos : 0.0;

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
