import {useCallback, useEffect, useMemo} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import {message, Modal} from 'antd';
import {debounce} from 'lodash';
import {useAuth} from '@/services/auth/authProvider/authProvider';
import type {
    EstadoActualProduccionResponseDTO,
    EstructuraProduccionDTO,
    ProduccionCambioEstadoRequestDTO,
    ProduccionMetadataModifyRequestDTO,
    RespuestaCampoRequestDTO,
    RespuestaCeldaTablaRequestDTO
} from '@/pages/common/DetalleProduccion/types/Productions';
import {TipoDatoCampo} from '@/pages/Protected/VersionRecetas/types/TipoDatoCampo';

interface UseProductionActionsProps {
    isSaving: boolean;
    guardarRespuestaCampo: (codigoProduccion: string, idCampo: number, data: RespuestaCampoRequestDTO) => Promise<void>;
    guardarRespuestaCeldaTabla: (codigoProduccion: string, idTabla: number, idFila: number, idColumna: number, data: RespuestaCeldaTablaRequestDTO) => Promise<void>;
    cambiarEstadoProduccion: (codigoProduccion: string, data: ProduccionCambioEstadoRequestDTO) => Promise<void>;
    guardarMetadata: (codigoProduccion: string, data: ProduccionMetadataModifyRequestDTO) => Promise<void>;
    estadoActual: EstadoActualProduccionResponseDTO | null;
    estructura: EstructuraProduccionDTO | null;
}

interface UseProductionActionsReturn {
    isSaving: boolean;
    debouncedCampoChange: (idCampo: number, valor: string, tipoDato: TipoDatoCampo) => Promise<void>;
    debouncedTablaChange: (idTabla: number, idFila: number, idColumna: number, valor: string, tipoDato: TipoDatoCampo) => Promise<void>;
    debouncedMetadataChange: (data: ProduccionMetadataModifyRequestDTO) => void;
    handleCambioEstado: (nuevoEstado: 'FINALIZADA' | 'CANCELADA') => void;
}

// Helper function to build the request data object based on value and type
const buildTypedRequestData = (valor: string, tipoDato: TipoDatoCampo) => {
    const data = {
        valorTexto: null as string | null,
        valorNumerico: null as number | null,
        valorFecha: null as string | null,
        valorBooleano: null as boolean | null
    };

    // Solo asignamos valor si NO es vacío y NO es nulo/undefined
    if (valor !== '' && valor !== null && valor !== undefined) {
        switch (tipoDato) {
            case TipoDatoCampo.ENTERO:
            case TipoDatoCampo.DECIMAL:
                data.valorNumerico = Number(valor);
                break;
            case TipoDatoCampo.FECHA:
                data.valorFecha = valor.includes('T') ? valor : `${valor}T00:00:00`;
                break;
            case TipoDatoCampo.HORA:
                data.valorFecha = valor.includes('T') ? valor : `1970-01-01T${valor}`;
                break;
            case TipoDatoCampo.BOOLEANO:
                data.valorBooleano = valor === 'true';
                break;
            case TipoDatoCampo.TEXTO:
            default:
                data.valorTexto = valor;
                break;
        }
    }
    return data;
};

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

    const _handleCampoChange = useCallback(async (idCampo: number, valor: string, tipoDato: TipoDatoCampo) => {
        if (!codigoProduccion || !user?.email) return;

        const typedData = buildTypedRequestData(valor, tipoDato);

        const requestData: RespuestaCampoRequestDTO = {
            idCampo,
            emailCreador: user.email,
            ...typedData
        };

        try {
            await guardarRespuestaCampo(codigoProduccion, idCampo, requestData);
            message.success('Cambio guardado', 0.5);
        } catch (e: any) {
            const errorMsg = e.message || 'Error al guardar el cambio';
            message.error(errorMsg);
            throw e; // Relanzar para que el componente UI (DebouncedInput) se entere
        }
    }, [codigoProduccion, user?.email, guardarRespuestaCampo]);

    const _handleTablaChange = useCallback(async (idTabla: number, idFila: number, idColumna: number, valor: string, tipoDato: TipoDatoCampo) => {
        if (!codigoProduccion || !user?.email) return;

        const typedData = buildTypedRequestData(valor, tipoDato);

        const requestData: RespuestaCeldaTablaRequestDTO = {
            idTabla,
            idFila,
            idColumna,
            emailCreador: user.email,
            ...typedData
        };

        try {
            await guardarRespuestaCeldaTabla(codigoProduccion, idTabla, idFila, idColumna, requestData);
            message.success('Cambio guardado', 0.5);
        } catch (e: any) {
            const errorMsg = e.message || 'Error al guardar el cambio';
            message.error(errorMsg);
            throw e; // Relanzar para que el componente UI se entere
        }
    }, [codigoProduccion, user?.email, guardarRespuestaCeldaTabla]);

    const _handleMetadataChange = useCallback(async (data: ProduccionMetadataModifyRequestDTO) => {
        if (!codigoProduccion) return;
        try {
            await guardarMetadata(codigoProduccion, data);
            message.success('Metadatos guardados', 0.5);
        } catch (e: any) {
            const errorMsg = e.message || 'Error al guardar los metadatos';
            message.error(errorMsg);
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
                } catch (e: any) {
                    const errorMsg = e.message || `Error al ${nuevoEstado === 'FINALIZADA' ? 'finalizar' : 'cancelar'} la producción.`;
                    message.error(errorMsg);
                }
            },
        });
    }, [codigoProduccion, user?.email, cambiarEstadoProduccion, navigate]);

    // Removed debounce since we now have explicit save actions
    const debouncedCampoChange = _handleCampoChange;
    const debouncedTablaChange = _handleTablaChange;
    const debouncedMetadataChange = useMemo(() => debounce(_handleMetadataChange, 300), [_handleMetadataChange]);

    useEffect(() => {
        return () => {
            debouncedMetadataChange.cancel();
        };
    }, [debouncedMetadataChange]);

    return {
        isSaving,
        debouncedCampoChange,
        debouncedTablaChange,
        debouncedMetadataChange,
        handleCambioEstado,
    };
};
