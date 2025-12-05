import React from 'react';
import { Card, Descriptions, Tag, Button, Space } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import type {
    ProduccionPublicMetadataDTO,
    ProduccionProtectedResponseDTO,
    EstructuraProduccionDTO
} from '../types/Productions';
import { useElapsedTime } from '../../../../hooks/useElapsedTime';
import '../DetalleProduccionPage.css';

type ProduccionInfo = ProduccionPublicMetadataDTO | ProduccionProtectedResponseDTO;

interface ProductionHeaderProps {
    produccion: ProduccionInfo;
    versionReceta: EstructuraProduccionDTO;
    onCambioEstado?: (nuevoEstado: 'FINALIZADA' | 'CANCELADA') => void;
}

export const InfoProduccionCard: React.FC<ProductionHeaderProps> = ({ produccion, versionReceta, onCambioEstado }) => {
    const elapsedTime = useElapsedTime(produccion.fechaInicio, produccion.fechaFin);

    const formatDate = (dateString: string | null) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleString('es-AR', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' });
    };

    const getStatusTag = (estado: string) => {
        switch (estado) {
            case 'EN_PROCESO': return <Tag color="blue">En Proceso</Tag>;
            case 'FINALIZADA': return <Tag color="green">Finalizada</Tag>;
            case 'CANCELADA': return <Tag color="red">Cancelada</Tag>;
            default: return <Tag>{estado}</Tag>;
        }
    };

    const metadata = versionReceta.metadata;
    // Check if 'encargado' property exists to determine if it's a protected DTO
    const isProtected = (produccion as ProduccionProtectedResponseDTO).encargado !== undefined;
    const enProceso = produccion.estado === 'EN_PROCESO';

    const cardTitle = (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            Información de la Producción
            {isProtected && enProceso && onCambioEstado && (
                <Space>
                    <Button icon={<CheckCircleOutlined />} type="primary" onClick={() => {
                        onCambioEstado('FINALIZADA');
                    }}>
                        Finalizar
                    </Button>
                    <Button icon={<CloseCircleOutlined />} danger onClick={() => {
                        onCambioEstado('CANCELADA');
                    }}>
                        Cancelar
                    </Button>
                </Space>
            )}
        </div>
    );

    // Define responsive span values for items
    // For 3-column layouts (xxl), span 1 means 1/3, span 2 means 2/3, span 3 means full
    // For 2-column layouts (xl, lg, md), span 1 means 1/2, span 2 means full
    // For 1-column layouts (sm, xs), span 1 means full
    const spanOneThirdOrOneHalf = { xxl: 1, xl: 1, lg: 1, md: 1, sm: 1, xs: 1 }; // Takes 1/3 on xxl, 1/2 on xl/lg/md
    const spanTwoThirdsOrOneHalf = { xxl: 2, xl: 1, lg: 1, md: 1, sm: 1, xs: 1 }; // Takes 2/3 on xxl, 1/2 on xl/lg/md
    const spanFullRow = { xxl: 3, xl: 2, lg: 2, md: 2, sm: 1, xs: 1 }; // Takes full row on all breakpoints

    return (
        <Card className="production-info-card" title={cardTitle}>
            <Descriptions bordered column={{ xxl: 3, xl: 2, lg: 2, md: 2, sm: 1, xs: 1 }}> {/* Changed xl to 2 */}
                {/* Row 1: Código Producción, Lote, Estado */}
                <Descriptions.Item label="Código Producción" {...spanOneThirdOrOneHalf}>{produccion.codigoProduccion}</Descriptions.Item>
                <Descriptions.Item label="Lote" {...spanOneThirdOrOneHalf}>{produccion.lote || 'N/A'}</Descriptions.Item>
                <Descriptions.Item label="Estado" {...spanOneThirdOrOneHalf}>{getStatusTag(produccion.estado)}</Descriptions.Item>
                
                {/* Row 2: Encargado, Fecha de Inicio, Fecha de Finalización */}
                <Descriptions.Item label="Encargado" {...spanOneThirdOrOneHalf}>
                    {isProtected ? ((produccion as ProduccionProtectedResponseDTO).encargado || 'No asignado') : 'N/A'}
                </Descriptions.Item>
                <Descriptions.Item label="Fecha de Inicio" {...spanOneThirdOrOneHalf}>{formatDate(produccion.fechaInicio)}</Descriptions.Item>
                <Descriptions.Item label="Fecha de Finalización" {...spanOneThirdOrOneHalf}>
                    {produccion.estado !== 'EN_PROCESO' ? formatDate(produccion.fechaFin) : 'N/A'}
                </Descriptions.Item>

                {/* Row 3: Tiempo en Ejecución / Duración Total - always takes a full row */}
                <Descriptions.Item label={enProceso ? 'Tiempo en Ejecución' : 'Duración Total'} {...spanFullRow}>
                    <span className="elapsed-time">{elapsedTime}</span>
                </Descriptions.Item>

                {/* Row 4: Código Versión, Nombre Versión */}
                {/* For xl, lg, md (2 columns), these two items will each take span 1, making them 1/2 each */}
                <Descriptions.Item label="Código Versión" {...spanOneThirdOrOneHalf}>{metadata.codigoVersionReceta}</Descriptions.Item>
                <Descriptions.Item label="Nombre Versión" {...spanTwoThirdsOrOneHalf}>{metadata.nombre}</Descriptions.Item>

                {/* Row 5: Receta Padre - always takes a full row */}
                <Descriptions.Item label="Receta Padre" {...spanFullRow}>
                    {metadata.nombreRecetaPadre} ({metadata.codigoRecetaPadre})
                </Descriptions.Item>
            </Descriptions>
        </Card>
    );
};
