import { useEffect, useState } from 'react';
import { notificationService } from '@/services/notificationService';
import type { EstadoActualProduccionResponseDTO } from '@/pages/common/DetalleProduccion/types/Productions';

interface FieldUpdatePayload {
    idCampo: number;
    valor: string;
    timestamp: string;
}

interface TableCellUpdatePayload {
    idTabla: number;
    idFila: number;
    idColumna: number;
    valor: string;
    timestamp: string;
}

interface ProductionStateUpdatePayload {
    estado: 'EN_PROCESO' | 'FINALIZADA' | 'CANCELADA';
    fechaFin?: string | null;
    timestamp: string;
}

interface ProductionMetadataUpdatePayload {
    codigoVersion?: string;
    lote?: string | null;
    encargado?: string | null;
    emailCreador?: string;
    observaciones?: string | null;
    fechaInicio?: string;
    fechaFin?: string | null;
    fechaModificacion?: string | null;
    timestamp: string;
}

interface UseProductionWebSocketProps {
    codigoProduccion: string | undefined;
    estadoActual: EstadoActualProduccionResponseDTO | null;
    getUltimasRespuestas: (codigo: string) => Promise<void>;
    updateFieldResponse: (update: FieldUpdatePayload) => void;
    updateTableCellResponse: (update: TableCellUpdatePayload) => void;
    updateProductionState: (update: ProductionStateUpdatePayload) => void;
    updateProductionMetadata: (update: ProductionMetadataUpdatePayload) => void;
}

export const useProductionWebSocket = ({
    codigoProduccion,
    estadoActual,
    getUltimasRespuestas,
    updateFieldResponse,
    updateTableCellResponse,
    updateProductionState,
    updateProductionMetadata,
}: UseProductionWebSocketProps) => {
    const [isConnected, setIsConnected] = useState(false);

    // Effect for managing WebSocket connection lifecycle
    useEffect(() => {
        // console.log("[useProductionWebSocket] WebSocket connection effect triggered."); // Removed log
        notificationService.connect(() => {
            setIsConnected(true);
            console.log("[useProductionWebSocket] WebSocket connected successfully.");
        });

        return () => {
            notificationService.disconnect();
            setIsConnected(false);
            console.log("[useProductionWebSocket] WebSocket disconnected on cleanup.");
        };
    }, []);

    // Effect for WebSocket subscription
    useEffect(() => {
        // console.log(`[useProductionWebSocket] WebSocket subscription effect triggered. codigoProduccion: ${codigoProduccion}, isConnected: ${isConnected}, current state: ${estadoActual?.produccion.estado}`); // Removed log

        let unsubscribe: (() => void) | undefined;

        if (codigoProduccion && isConnected) {
            const isFinalState = estadoActual?.produccion.estado === 'FINALIZADA' || estadoActual?.produccion.estado === 'CANCELADA';

            if (!isFinalState) {
                // console.log(`[useProductionWebSocket] Attempting to subscribe to AutoSave updates for ${codigoProduccion}.`); // Removed log
                unsubscribe = notificationService.subscribeToAutoSave(codigoProduccion, (message: any) => {
                    console.log(`[useProductionWebSocket] AutoSave update received for ${codigoProduccion}:`, message);

                    switch (message.type) {
                        case 'FIELD_UPDATED':
                            // console.log(`[useProductionWebSocket] Dispatching FIELD_UPDATED for field ${message.payload.idCampo}.`); // Removed log
                            updateFieldResponse(message.payload);
                            break;
                        case 'TABLE_CELL_UPDATED':
                            // console.log(`[useProductionWebSocket] Dispatching TABLE_CELL_UPDATED for table cell (T:${message.payload.idTabla}, F:${message.payload.idFila}, C:${message.payload.idColumna}).`); // Removed log
                            updateTableCellResponse(message.payload);
                            break;
                        case 'STATE_CHANGED':
                            // console.log(`[useProductionWebSocket] Dispatching STATE_CHANGED to new state ${message.payload.estado}.`); // Removed log
                            updateProductionState(message.payload);
                            break;
                        case 'PRODUCTION_METADATA_UPDATED':
                            // console.log(`[useProductionWebSocket] Dispatching PRODUCTION_METADATA_UPDATED.`); // Removed log
                            updateProductionMetadata(message.payload);
                            break;
                        default:
                            console.warn(`[useProductionWebSocket] Unknown update type '${message.type}'. Re-fetching all data.`);
                            getUltimasRespuestas(codigoProduccion);
                            break;
                    }
                });
            } else if (isFinalState) {
                console.log(`[useProductionWebSocket] Production ${codigoProduccion} is in a final state (${estadoActual?.produccion.estado}). Not subscribing to updates.`);
            }
        }

        // Cleanup subscription on component unmount or if dependencies change
        return () => {
            if (unsubscribe) {
                // console.log(`[useProductionWebSocket] Unsubscribing from AutoSave updates for ${codigoProduccion}.`); // Removed log
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
    ]);

    return { isConnected };
};
