import React, {useEffect, useMemo, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {usePublicService} from '@/services/public/usePublicService.ts';
import {Alert, Spin, Table} from 'antd';
import {getColumns} from './ListadoProduccionesColumns.tsx';
import type {ProduccionPublicMetadataDTO} from '@/pages/common/DetalleProduccion/types/Productions.ts';
import {PublicHeader} from '@/components/layout/PublicHeader/PublicHeader.tsx';
import {notificationService} from '@/services/notificationService'; // Import notificationService
import './ListadoProducciones.css';

export const ListadoProducciones: React.FC = () => {
    const {
        producciones: fetchedProducciones,
        loading,
        error,
        getProduccionesPublicas,
        updateProductionStateInList, // Destructure new function
    } = usePublicService();
    const navigate = useNavigate();
    const [isConnected, setIsConnected] = useState(false); // State to track WebSocket connection status

    // Effect for managing WebSocket connection lifecycle
    useEffect(() => {
        notificationService.connect(() => {
            setIsConnected(true);
            console.log("[ListadoProducciones] WebSocket connected successfully.");
        });

        return () => {
            notificationService.disconnect();
            setIsConnected(false);
            console.log("[ListadoProducciones] WebSocket disconnected on cleanup.");
        };
    }, []);

    useEffect(() => {
        getProduccionesPublicas(); // Initial fetch of productions
    }, [getProduccionesPublicas]);

    // Effect for subscribing to new production created events
    useEffect(() => {
        let unsubscribe: (() => void) | undefined;
        if (isConnected) {
            unsubscribe = notificationService.subscribeToProductionCreated((message: any) => {
                console.log("[ListadoProducciones] New production created message received:", message);
                // Assuming the message.payload contains the new ProduccionPublicMetadataDTO
                // For now, we'll re-fetch all productions to ensure consistency
                getProduccionesPublicas();
            });
        }

        return () => {
            if (unsubscribe) {
                unsubscribe();
            }
        };
    }, [isConnected, getProduccionesPublicas]);

    // Effect for subscribing to global production state changes
    useEffect(() => {
        let unsubscribe: (() => void) | undefined;
        if (isConnected) {
            unsubscribe = notificationService.subscribeToProductionStateChanges((message: any) => {
                console.log("[ListadoProducciones] Global production state change message received:", message);
                // Assuming message.payload is ProductionStateUpdatePayload
                // and message.codigoProduccion is the code of the affected production
                updateProductionStateInList(message.codigoProduccion, message.payload);
            });
        }

        return () => {
            if (unsubscribe) {
                unsubscribe();
            }
        };
    }, [isConnected, updateProductionStateInList]);


    const sortedProducciones = useMemo(() => {
        if (!fetchedProducciones) return [];
        return [...fetchedProducciones].sort((a, b) => {
            // Handle nulls: nulls come last for descending order
            if (!a.fechaFin && !b.fechaFin) return 0;
            if (!a.fechaFin) return 1; // b has a date, a doesn't, so a comes after b
            if (!b.fechaFin) return -1; // a has a date, b doesn't, so a comes before b

            // Compare dates in descending order
            return new Date(b.fechaFin).getTime() - new Date(a.fechaFin).getTime();
        });
    }, [fetchedProducciones]);

    const handleView = (record: ProduccionPublicMetadataDTO) => {
        navigate(`/public/producciones/ver/${record.codigoProduccion}`);
    };

    const columns = getColumns({onView: handleView});

    const renderContent = () => {
        if (loading) {
            return (
                <div className="public-dashboard__feedback">
                    <Spin size="large" tip="Cargando producciones..."/>
                </div>
            );
        }

        if (error) {
            return (
                <div className="public-dashboard__feedback">
                    <Alert message="Error" description={error} type="error" showIcon/>
                </div>
            );
        }

        return (
            <div className="production-table-container">
                <Table
                    columns={columns}
                    dataSource={sortedProducciones} // Use sorted data
                    rowKey="codigoProduccion"
                    loading={loading}
                    scroll={{x: 'max-content'}}
                />
            </div>
        );
    };

    return (
        <div className="public-dashboard-page">
            <PublicHeader/>
            <main className="public-dashboard-main container">
                {renderContent()}
            </main>
        </div>
    );
};
