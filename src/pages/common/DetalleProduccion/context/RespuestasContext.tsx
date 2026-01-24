import {createContext, useContext} from 'react';
import type {RespuestaTablaDTO} from '../types/Productions';
import {TipoDatoCampo} from '@/pages/Protected/VersionRecetas/types/TipoDatoCampo';

// Definimos la forma de nuestro contexto
interface IRespuestasContext {
    respuestasCampos: Record<number, string>;
    respuestasTablas: RespuestaTablaDTO[];
    // Ahora devuelven Promise<void> para permitir manejo de errores en el componente hijo
    onCampoChange: (idCampo: number, valor: string, tipoDato: TipoDatoCampo) => Promise<void>;
    onTablaChange: (idTabla: number, idFila: number, idColumna: number, valor: string, tipoDato: TipoDatoCampo) => Promise<void>;
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
