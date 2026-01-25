import { createContext, useContext } from 'react';
import type { RespuestaTablaDTO } from '@/types/production';
import type { TipoDatoCampo } from '@/pages/Protected/VersionRecetas/types/TipoDatoCampo';

interface RespuestasContextType {
  respuestasCampos: Record<number, string>;
  respuestasTablas: RespuestaTablaDTO[];
  onCampoChange: (idCampo: number, valor: string, tipoDato: TipoDatoCampo) => void;
  onTablaChange: (
    idTabla: number,
    idFila: number,
    idColumna: number,
    valor: string,
    tipoDato: TipoDatoCampo
  ) => void;
}

export const RespuestasContext = createContext<RespuestasContextType | undefined>(undefined);

export const useRespuestas = () => {
  const context = useContext(RespuestasContext);
  if (!context) {
    throw new Error('useRespuestas debe ser usado dentro de un RespuestasContext.Provider');
  }
  return context;
};
