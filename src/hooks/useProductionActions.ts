import {useCallback, useMemo, useEffect} from 'react';
import {useParams, useNavigate} from 'react-router-dom';
import {message, Modal} from 'antd';
import {debounce} from 'lodash';
import {useAuth} from '@/services/auth/authProvider/authProvider';
import type {
    EstructuraProduccionDTO,
    EstadoActualProduccionResponseDTO,
    ProduccionMetadataModifyRequestDTO,
    ProduccionCambioEstadoRequestDTO
} from '@/pages/common/DetalleProduccion/types/Productions';

interface UseProductionActionsProps {
    isSaving: boolean;
    guardarRespuestaCampo: (codigoProduccion: string, idCampo: number, data: any) => Promise<void>;
    guardarRespuestaCeldaTabla: (codigoProduccion: string, idTabla: number, idFila: number, idColumna: number, data: any) => Promise<void>;
    cambiarEstadoProduccion: (codigoProduccion: string, data: ProduccionCambioEstadoRequestDTO) => Promise<void>;
    guardarMetadata: (codigoProduccion: string, data: ProduccionMetadataModifyRequestDTO) => Promise<void>;
    estadoActual: EstadoActualProduccionResponseDTO | null;
    estructura: EstructuraProduccionDTO | null;
}

interface UseProductionActionsReturn {
    isSaving: boolean;
    debouncedCampoChange: (idCampo: number, valor: string) => void;
    debouncedTablaChange: (idTabla: number, idFila: number, idColumna: number, valor: string) => void;
    debouncedMetadataChange: (data: ProduccionMetadataModifyRequestDTO) => void;
    handleCambioEstado: (nuevoEstado: 'FINALIZADA' | 'CANCELADA') => void;
}

export const useProductionActions = ({
                                         isSaving,
                                         guardarRespuestaCampo,
                                         guardarRespuestaCeldaTabla,
                                         cambiarEstadoProduccion,
                                         guardarMetadata,
                                     }: UseProductionActionsProps): UseProductionActionsReturn => {
    const {codigoProduccion} = useParams<{ codigoProduccion: string }>();
    const navigate = useNavigate();
    const {user} = useAuth();

    const _handleCampoChange = useCallback(async (idCampo: number, valor: string) => {
        if (!codigoProduccion || !user?.email) return;
        try {
            await guardarRespuestaCampo(codigoProduccion, idCampo, {valor, emailCreador: user.email});
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
            message.success('Cambio guardado', 0.5);
        } catch (e) {
            message.error('Error al guardar el cambio');
        }
    }, [codigoProduccion, user?.email, guardarRespuestaCeldaTabla]);

    const _handleMetadataChange = useCallback(async (data: ProduccionMetadataModifyRequestDTO) => {
        if (!codigoProduccion) return;
        try {
            await guardarMetadata(codigoProduccion, data);
            message.success('Metadatos guardados', 0.5);
        } catch (e) {
            message.error('Error al guardar los metadatos');
        }
    }, [codigoProduccion, guardarMetadata]);

    const handleCambioEstado = useCallback((nuevoEstado: 'FINALIZADA' | 'CANCELADA') => {
        if (!codigoProduccion || !user?.email) {
            return;
        }

        Modal.confirm({
            title: `¿Confirmar ${nuevoEstado === 'FINALIZADA' ? 'finalización' : 'cancelación'} de producción?`,
            content: `Está a punto de ${nuevoEstado === 'FINALIZADA' ? 'finalizar' : 'cancelar'} la producción ${codigoProduccion}. Esta acción no se puede deshacer.`,
            okText: nuevoEstado === 'FINALIZADA' ? 'Finalizar' : 'Cancelar',
            cancelText: 'Volver',
            onOk: async () => {
                try {
                    await cambiarEstadoProduccion(codigoProduccion, {valor: nuevoEstado, emailCreador: user.email!});
                    message.success(`Producción ${nuevoEstado === 'FINALIZADA' ? 'finalizada' : 'cancelada'} correctamente.`, 0.5);
                    navigate('/producciones');
                } catch (e) {
                    message.error(`Error al ${nuevoEstado === 'FINALIZADA' ? 'finalizar' : 'cancelar'} la producción.`);
                }
            },
        });
    }, [codigoProduccion, user?.email, cambiarEstadoProduccion, navigate]);

    const debouncedCampoChange = useMemo(() => debounce(_handleCampoChange, 300), [_handleCampoChange]);
    const debouncedTablaChange = useMemo(() => debounce(_handleTablaChange, 300), [_handleTablaChange]);
    const debouncedMetadataChange = useMemo(() => debounce(_handleMetadataChange, 300), [_handleMetadataChange]);

    useEffect(() => {
        return () => {
            debouncedCampoChange.cancel();
            debouncedTablaChange.cancel();
            debouncedMetadataChange.cancel();
        };
    }, [debouncedCampoChange, debouncedTablaChange, debouncedMetadataChange]);

    return {
        isSaving,
        debouncedCampoChange,
        debouncedTablaChange,
        debouncedMetadataChange,
        handleCambioEstado,
    };
};
