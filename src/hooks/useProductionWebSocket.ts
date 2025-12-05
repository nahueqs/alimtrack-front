import {useEffect, useState, useCallback} from 'react';
import {notificationService} from '@/services/notificaciones/notificationService.ts';
import type {
    EstadoActualProduccionResponseDTO,
    EstructuraProduccionDTO,
    FieldUpdatePayload,
    TableCellUpdatePayload,
    ProductionStateUpdatePayload,
    ProductionMetadataUpdatedPayload,
} from '@/pages/common/DetalleProduccion/types/Productions';

interface UseProductionWebSocketProps {
    codigoProduccion: string | undefined;
    estadoActual: EstadoActualProduccionResponseDTO | null;
    estructura: EstructuraProduccionDTO | null;
    getUltimasRespuestas: (codigo: string) => Promise<void>;
    updateFieldResponse: (update: FieldUpdatePayload) => void;
    updateTableCellResponse: (update: TableCellUpdatePayload) => void;
    updateProductionState: (update: ProductionStateUpdatePayload) => void;
    updateProductionMetadata: (update: ProductionMetadataUpdatedPayload) => void;
}

export const useProductionWebSocket = ({
                                           codigoProduccion,
                                           estadoActual,
                                           estructura,
                                           getUltimasRespuestas,
                                           updateFieldResponse,
                                           updateTableCellResponse,
                                           updateProductionState,
                                           updateProductionMetadata,
                                       }: UseProductionWebSocketProps) => {
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        notificationService.connect(() => {
            setIsConnected(true);
        });

        return () => {
            notificationService.disconnect();
            setIsConnected(false);
        };
    }, []);

    useEffect(() => {
        if (!("Notification" in window)) {
        } else if (Notification.permission !== "granted" && Notification.permission !== "denied") {
            Notification.requestPermission();
        }
    }, []);

    const getChangedItemDetails = useCallback((id: number, type: 'campo' | 'tabla') => {
        if (!estructura) return {
            sectionTitle: undefined,
            itemTitle: undefined,
            itemType: undefined,
            groupTitle: undefined
        };

        for (const seccion of estructura.estructura) {
            if (type === 'campo') {
                const campoDirecto = seccion.camposSimples.find(campo => campo.id === id);
                if (campoDirecto) {
                    return {
                        sectionTitle: seccion.titulo,
                        itemTitle: campoDirecto.nombre,
                        itemType: 'Campo Simple',
                        groupTitle: undefined
                    };
                }

                for (const grupo of seccion.gruposCampos || []) {
                    const campoEnGrupo = grupo.campos.find(campo => campo.id === id);
                    if (campoEnGrupo) {
                        return {
                            sectionTitle: seccion.titulo,
                            itemTitle: campoEnGrupo.nombre,
                            itemType: 'Campo Agrupado',
                            groupTitle: grupo.subtitulo
                        };
                    }
                }
            }

            if (type === 'tabla') {
                const tabla = seccion.tablas.find(t => t.id === id);
                if (tabla) {
                    return {
                        sectionTitle: seccion.titulo,
                        itemTitle: tabla.nombre,
                        itemType: 'Tabla',
                        groupTitle: undefined
                    };
                }
            }
        }
        return {sectionTitle: undefined, itemTitle: undefined, itemType: undefined, groupTitle: undefined};
    }, [estructura]);

    useEffect(() => {
        let unsubscribe: (() => void) | undefined;

        if (codigoProduccion && isConnected) {
            const isFinalState = estadoActual?.produccion.estado === 'FINALIZADA' || estadoActual?.produccion.estado === 'CANCELADA';

            if (!isFinalState) {
                unsubscribe = notificationService.subscribeToAutoSave(codigoProduccion, (message: any) => {
                    const showDesktopNotification = (title: string, body: string) => {
                        if (Notification.permission === "granted") {
                            new Notification(title, {body});
                        }
                    };

                    switch (message.type) {
                        case 'FIELD_UPDATED': {
                            updateFieldResponse(message.payload);
                            const {sectionTitle, itemTitle} = getChangedItemDetails(message.payload.idCampo, 'campo');
                            const body = itemTitle && sectionTitle
                                ? `Cambio en campo "${itemTitle}" de sección "${sectionTitle}".`
                                : `Cambio en un campo de la producción ${codigoProduccion}.`;
                            showDesktopNotification(`Producción ${codigoProduccion} Actualizada`, body);
                            break;
                        }
                        case 'TABLE_CELL_UPDATED': {
                            updateTableCellResponse(message.payload);
                            const {sectionTitle, itemTitle} = getChangedItemDetails(message.payload.idTabla, 'tabla');
                            const body = itemTitle && sectionTitle
                                ? `Cambio en tabla "${itemTitle}" de sección "${sectionTitle}".`
                                : `Cambio en una celda de tabla de la producción ${codigoProduccion}.`;
                            showDesktopNotification(`Producción ${codigoProduccion} Actualizada`, body);
                            break;
                        }
                        case 'STATE_CHANGED':
                            updateProductionState(message.payload);
                            showDesktopNotification(`Producción ${codigoProduccion} - Estado Actualizado`, `El estado ha cambiado a: ${message.payload.estado}`);
                            break;
                        case 'PRODUCTION_METADATA_UPDATED':
                            updateProductionMetadata(message.payload);
                            showDesktopNotification(`Producción ${codigoProduccion} - Metadatos Actualizados`, `Se han actualizado los metadatos de la producción.`);
                            break;
                        default:
                            console.warn(`[useProductionWebSocket] Unknown update type '${message.type}'. Re-fetching all data.`);
                            getUltimasRespuestas(codigoProduccion);
                            break;
                    }
                });
            }
        }

        return () => {
            if (unsubscribe) {
                unsubscribe();
            }
        };
    }, [
        codigoProduccion,
        isConnected,
        estadoActual?.produccion.estado,
        getUltimasRespuestas,
        updateFieldResponse,
        updateTableCellResponse,
        updateProductionState,
        updateProductionMetadata,
        getChangedItemDetails,
    ]);

    return {isConnected};
};
