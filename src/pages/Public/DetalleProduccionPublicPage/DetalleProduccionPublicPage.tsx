import React, { useEffect, useState, useCallback } from 'react'; // Added useCallback
import { useParams } from 'react-router-dom';
import { Spin, Alert } from 'antd';
import { DetalleProduccionPage } from '@/pages/common/DetalleProduccion/DetalleProduccionPage';
import { usePublicService } from '@/services/public/usePublicService';
import { PublicHeader } from "@/components/layout/PublicHeader/PublicHeader.tsx";
import { notificationService } from '@/services/notificationService';
import type { EstructuraProduccionDTO, SeccionResponseDTO, CampoSimpleResponseDTO, GrupoCamposResponseDTO, TablaResponseDTO } from '@/pages/common/DetalleProduccion/types/Productions'; // Import types

const DetalleProduccionPublicPage: React.FC = () => {
    const { codigoProduccion } = useParams<{ codigoProduccion: string }>();
    const {
        loading,
        error,
        estructura,
        respuestas,
        getEstructuraProduccion,
        getUltimasRespuestasProduccion,
        updateFieldResponse,
        updateTableCellResponse,
        updateProductionState,
        updateProductionMetadata,
    } = usePublicService();
    const [isConnected, setIsConnected] = useState(false);

    // Effect for managing WebSocket connection lifecycle
    useEffect(() => {
        notificationService.connect(() => {
            setIsConnected(true);
            console.log("[DetalleProduccionPublicPage] WebSocket connected successfully.");
        });

        return () => {
            notificationService.disconnect();
            setIsConnected(false);
            console.log("[DetalleProduccionPublicPage] WebSocket disconnected on cleanup.");
        };
    }, []);

    // Effect for requesting notification permission
    useEffect(() => {
        if (!("Notification" in window)) {
            // console.warn("This browser does not support desktop notification."); // Removed log
        } else if (Notification.permission !== "granted" && Notification.permission !== "denied") {
            Notification.requestPermission().then(permission => {
                if (permission === "granted") {
                    // console.log("[DetalleProduccionPublicPage] Notification permission granted."); // Removed log
                } else {
                    // console.log("[DetalleProduccionPublicPage] Notification permission denied."); // Removed log
                }
            });
        }
    }, []);

    // Effect for initial data fetching (runs once on mount or codigoProduccion change)
    useEffect(() => {
        if (codigoProduccion) {
            Promise.all([
                getEstructuraProduccion(codigoProduccion),
                getUltimasRespuestasProduccion(codigoProduccion),
            ]);
        }
    }, [codigoProduccion, getEstructuraProduccion, getUltimasRespuestasProduccion]);

    // Helper function to find item details for notifications
    const getChangedItemDetails = useCallback((id: number, type: 'campo' | 'tabla') => {
        if (!estructura) return { sectionTitle: undefined, itemTitle: undefined, itemType: undefined, groupTitle: undefined };

        for (const seccion of estructura.estructura) {
            if (type === 'campo') {
                const campoDirecto = seccion.camposSimples.find(campo => campo.id === id);
                if (campoDirecto) {
                    return { sectionTitle: seccion.titulo, itemTitle: campoDirecto.nombre, itemType: 'Campo Simple', groupTitle: undefined };
                }

                for (const grupo of seccion.gruposCampos || []) {
                    const campoEnGrupo = grupo.campos.find(campo => campo.id === id);
                    if (campoEnGrupo) {
                        return { sectionTitle: seccion.titulo, itemTitle: campoEnGrupo.nombre, itemType: 'Campo Agrupado', groupTitle: grupo.subtitulo };
                    }
                }
            }

            if (type === 'tabla') {
                const tabla = seccion.tablas.find(t => t.id === id);
                if (tabla) {
                    return { sectionTitle: seccion.titulo, itemTitle: tabla.nombre, itemType: 'Tabla', groupTitle: undefined };
                }
            }
        }
        return { sectionTitle: undefined, itemTitle: undefined, itemType: undefined, groupTitle: undefined };
    }, [estructura]);


    // Effect for WebSocket subscription (runs when codigoProduccion, isConnected, or respuestas.produccion.estado changes)
    useEffect(() => {
        let unsubscribe: (() => void) | undefined;

        if (codigoProduccion && isConnected) {
            const isFinalState = respuestas?.produccion.estado === 'FINALIZADA' || respuestas?.produccion.estado === 'CANCELADA';

            if (!isFinalState) {
                unsubscribe = notificationService.subscribeToAutoSave(codigoProduccion, (message: any) => {
                    console.log(`[DetalleProduccionPublicPage] AutoSave update received for ${codigoProduccion}:`, message);

                    const showDesktopNotification = (title: string, body: string) => {
                        if (Notification.permission === "granted") {
                            new Notification(title, { body });
                        }
                    };

                    switch (message.type) {
                        case 'FIELD_UPDATED': {
                            updateFieldResponse(message.payload);
                            const { sectionTitle, itemTitle, itemType, groupTitle } = getChangedItemDetails(message.payload.idCampo, 'campo');
                            let notificationBody = `Cambio en un campo de la producción ${codigoProduccion}.`; // Default fallback

                            if ((itemType === 'Campo Simple' || itemType === 'Campo Agrupado') && sectionTitle && itemTitle) {
                                notificationBody = `Cambio en campo "${itemTitle}" de sección "${sectionTitle}".`;
                            } else if (itemTitle) { // Fallback if itemType is not perfectly matched but itemTitle is known
                                notificationBody = `Cambio en campo "${itemTitle}" de la producción ${codigoProduccion}.`;
                            } else if (sectionTitle) { // Fallback if only section is known
                                notificationBody = `Cambio en un campo de la sección "${sectionTitle}".`;
                            }
                            showDesktopNotification(
                                `Producción ${codigoProduccion} Actualizada`,
                                notificationBody
                            );
                            break;
                        }
                        case 'TABLE_CELL_UPDATED': {
                            updateTableCellResponse(message.payload);
                            const { sectionTitle, itemTitle, itemType } = getChangedItemDetails(message.payload.idTabla, 'tabla');
                            let notificationBody = `Cambio en una celda de tabla de la producción ${codigoProduccion}.`; // Default fallback

                            if (itemType === 'Tabla' && sectionTitle && itemTitle) {
                                notificationBody = `Cambio en tabla "${itemTitle}" de sección "${sectionTitle}".`;
                            } else if (itemTitle) { // Fallback if itemType is not perfectly matched but itemTitle is known
                                notificationBody = `Cambio en tabla "${itemTitle}" de la producción ${codigoProduccion}.`;
                            } else if (sectionTitle) { // Fallback if only section is known
                                notificationBody = `Cambio en una celda de tabla de la sección "${sectionTitle}".`;
                            }
                            showDesktopNotification(
                                `Producción ${codigoProduccion} Actualizada`,
                                notificationBody
                            );
                            break;
                        }
                        case 'STATE_CHANGED':
                            updateProductionState(message.payload);
                            showDesktopNotification(
                                `Producción ${codigoProduccion} - Estado Actualizado`,
                                `El estado ha cambiado a: ${message.payload.estado}`
                            );
                            break;
                        case 'PRODUCTION_METADATA_UPDATED':
                            updateProductionMetadata(message.payload);
                            showDesktopNotification(
                                `Producción ${codigoProduccion} - Metadatos Actualizados`,
                                `Se han actualizado los metadatos de la producción.`
                            );
                            break;
                        default:
                            console.warn(`[DetalleProduccionPublicPage] Unknown update type '${message.type}'. Re-fetching all data.`);
                            Promise.all([
                                getEstructuraProduccion(codigoProduccion),
                                getUltimasRespuestasProduccion(codigoProduccion),
                            ]);
                            break;
                    }
                });
            } else if (isFinalState) {
                console.log(`[DetalleProduccionPublicPage] Production ${codigoProduccion} is in a final state (${respuestas?.produccion.estado}). Not subscribing to updates.`);
            }
        }

        // Cleanup subscription on component unmount or if dependencies change
        return () => {
            if (unsubscribe) {
                unsubscribe();
            }
        };
    }, [
        codigoProduccion,
        isConnected,
        respuestas?.produccion.estado,
        getEstructuraProduccion,
        getUltimasRespuestasProduccion,
        updateFieldResponse,
        updateTableCellResponse,
        updateProductionState,
        updateProductionMetadata,
        getChangedItemDetails, // Add helper to dependencies
        estructura, // Add estructura to dependencies for helper
    ]);

    if (loading) {
        return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}><Spin size="large" /></div>;
    }

    if (error) {
        return <Alert message="Error" description={error} type="error" showIcon />;
    }

    if (!estructura || !respuestas) {
        return <Alert message="No se encontraron datos para esta producción." type="warning" showIcon />;
    }

    return (
        <DetalleProduccionPage
            estructura={estructura}
            respuestas={respuestas}
            isEditable={false}
            HeaderComponent={PublicHeader}
        />
    );
};

export default DetalleProduccionPublicPage;
