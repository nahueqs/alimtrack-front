import React from 'react';
import { Spin, Alert } from 'antd';
import type { EstructuraProduccionDTO, EstadoActualProduccionResponseDTO } from '@/pages/common/DetalleProduccion/types/Productions';

interface ProductionStatusDisplayProps {
    loading: boolean;
    error: boolean;
    estructura: EstructuraProduccionDTO | null;
    estadoActual: EstadoActualProduccionResponseDTO | null;
    children: React.ReactNode; // To render the main content when ready
}

export const ProductionStatusDisplay: React.FC<ProductionStatusDisplayProps> = ({
    loading,
    error,
    estructura,
    estadoActual,
    children,
}) => {
    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <Spin size="large" tip="Cargando datos..." />
            </div>
        );
    }

    if (error) {
        return (
            <Alert
                message="Error de Carga"
                description="No se pudieron cargar los datos de la producción."
                type="error"
                showIcon
            />
        );
    }

    if (!estructura || !estadoActual) {
        return (
            <Alert
                message="Sin datos"
                description="No hay datos de estructura o respuestas disponibles para mostrar."
                type="warning"
                showIcon
            />
        );
    }

    return <>{children}</>;
};
