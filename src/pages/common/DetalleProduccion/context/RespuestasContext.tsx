import {createContext, useContext} from 'react';
import type {RespuestaTablaDTO} from '../types/Productions';

// Definimos la forma de nuestro contexto
interface IRespuestasContext {
    respuestasCampos: Record<number, string>;
    respuestasTablas: RespuestaTablaDTO[];
    onCampoChange: (idCampo: number, valor: string) => void;
    onTablaChange: (idTabla: number, idFila: number, idColumna: number, valor: string) => void;
}

// Creamos el contexto con un valor por defecto (que dará un error si se usa sin un Provider)
export const RespuestasContext = createContext<IRespuestasContext | undefined>(undefined);

// Hook personalizado para usar el contexto de forma segura
export const useRespuestas = () => {
    const context = useContext(RespuestasContext);
    if (!context) {
        throw new Error('useRespuestas debe ser utilizado dentro de un RespuestasProvider');
    }
    return context;
};
