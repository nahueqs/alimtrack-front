import { useCallback, useMemo, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { message, Modal } from 'antd';
import { debounce } from 'lodash';
import { useAuth } from '@/services/auth/authProvider/authProvider';
import type { EstructuraProduccionDTO, EstadoActualProduccionResponseDTO, SeccionResponseDTO, CampoSimpleResponseDTO, GrupoCamposResponseDTO, TablaResponseDTO } from '@/pages/common/DetalleProduccion/types/Productions';

interface UseProductionActionsProps {
    isSaving: boolean;
    guardarRespuestaCampo: (codigoProduccion: string, idCampo: number, data: any) => Promise<void>;
    guardarRespuestaCeldaTabla: (codigoProduccion: string, idTabla: number, idFila: number, idColumna: number, data: any) => Promise<void>;
    cambiarEstadoProduccion: (codigoProduccion: string, data: any) => Promise<void>;
    estadoActual: EstadoActualProduccionResponseDTO | null;
    estructura: EstructuraProduccionDTO | null;
}

interface UseProductionActionsReturn {
    isSaving: boolean;
    debouncedCampoChange: (idCampo: number, valor: string) => void;
    debouncedTablaChange: (idTabla: number, idFila: number, idColumna: number, valor: string) => void;
    handleCambioEstado: (nuevoEstado: 'FINALIZADA' | 'CANCELADA') => void;
}

export const useProductionActions = ({
    isSaving,
    guardarRespuestaCampo,
    guardarRespuestaCeldaTabla,
    cambiarEstadoProduccion,
    estructura, // Keep structure for potential future use or if needed elsewhere
}: UseProductionActionsProps): UseProductionActionsReturn => {
    const { codigoProduccion } = useParams<{ codigoProduccion: string }>();
    const navigate = useNavigate();
    const { user } = useAuth();

    // Removed getChangedItemDetails as it's no longer needed for message.success
    // const getChangedItemDetails = useCallback((id: number, type: 'campo' | 'tabla') => { ... }, [estructura]);


    const _handleCampoChange = useCallback(async (idCampo: number, valor: string) => {
        if (!codigoProduccion || !user?.email) return;
        try {
            await guardarRespuestaCampo(codigoProduccion, idCampo, { valor, emailCreador: user.email });
            // Reverted to simple message
            message.success('Cambio guardado', 0.5);
        } catch (e) {
            message.error('Error al guardar el cambio');
        }
    }, [codigoProduccion, user?.email, guardarRespuestaCampo]);

    const _handleTablaChange = useCallback(async (idTabla: number, idFila: number, idColumna: number, valor: string) => {
        if (!codigoProduccion || !user?.email) return;
        try {
            await guardarRespuestaCeldaTabla(codigoProduccion, idTabla, idFila, idColumna, {
                valor,
                emailCreador: user.email
            });
            // Reverted to simple message
            message.success('Cambio guardado', 0.5);
        } catch (e) {
            message.error('Error al guardar el cambio');
        }
    }, [codigoProduccion, user?.email, guardarRespuestaCeldaTabla]);

    const handleCambioEstado = useCallback((nuevoEstado: 'FINALIZADA' | 'CANCELADA') => {
        if (!codigoProduccion) {
            return;
        }
        if (!user?.email) {
            return;
        }

        Modal.confirm({
            title: `¿Confirmar ${nuevoEstado === 'FINALIZADA' ? 'finalización' : 'cancelación'} de producción?`,
            content: `Está a punto de ${nuevoEstado === 'FINALIZADA' ? 'finalizar' : 'cancelar'} la producción ${codigoProduccion}. Esta acción no se puede deshacer.`,
            okText: nuevoEstado === 'FINALIZADA' ? 'Finalizar' : 'Cancelar',
            cancelText: 'Volver',
            onOk: async () => {
                try {
                    await cambiarEstadoProduccion(codigoProduccion, { valor: nuevoEstado, emailCreador: user.email });
                    // Reverted to simple message
                    message.success(`Producción ${nuevoEstado === 'FINALIZADA' ? 'finalizada' : 'cancelada'} correctamente.`, 0.5);
                    navigate('/producciones');
                } catch (e) {
                    message.error(`Error al ${nuevoEstado === 'FINALIZADA' ? 'finalizar' : 'cancelar'} la producción.`);
                }
            },
        });
    }, [codigoProduccion, user?.email, cambiarEstadoProduccion, navigate]);

    const debouncedCampoChange = useMemo(() => debounce(_handleCampoChange, 1000), [_handleCampoChange]);
    const debouncedTablaChange = useMemo(() => debounce(_handleTablaChange, 1000), [_handleTablaChange]);

    useEffect(() => {
        return () => {
            debouncedCampoChange.cancel();
            debouncedTablaChange.cancel();
        };
    }, [debouncedCampoChange, debouncedTablaChange]);

    return {
        isSaving,
        debouncedCampoChange,
        debouncedTablaChange,
        handleCambioEstado,
    };
};
