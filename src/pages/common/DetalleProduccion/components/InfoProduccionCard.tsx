import React, {useEffect, useState} from 'react';
import {Button, Card, Descriptions, Input, Space, Tag} from 'antd';
import {CheckCircleOutlined, CloseCircleOutlined} from '@ant-design/icons';
import type {
    EstructuraProduccionDTO,
    ProduccionMetadataModifyRequestDTO,
    ProduccionProtectedResponseDTO,
    ProduccionPublicMetadataDTO,
} from '../types/Productions';
import {useElapsedTime} from '../../../../hooks/useElapsedTime';
import '../DetalleProduccionPage.css';

type ProduccionInfo = ProduccionPublicMetadataDTO | ProduccionProtectedResponseDTO;

interface ProductionHeaderProps {
    produccion: ProduccionInfo;
    versionReceta: EstructuraProduccionDTO;
    isEditable?: boolean;
    onCambioEstado?: (nuevoEstado: 'FINALIZADA' | 'CANCELADA') => void;
    onMetadataChange?: (data: ProduccionMetadataModifyRequestDTO) => void;
}

export const InfoProduccionCard: React.FC<ProductionHeaderProps> = ({
                                                                        produccion,
                                                                        versionReceta,
                                                                        isEditable,
                                                                        onCambioEstado,
                                                                        onMetadataChange
                                                                    }) => {
    const elapsedTime = useElapsedTime(produccion.fechaInicio, produccion.fechaFin);
    const [lote, setLote] = useState(produccion.lote);
    const [encargado, setEncargado] = useState((produccion as ProduccionProtectedResponseDTO).encargado);
    const [observaciones, setObservaciones] = useState((produccion as ProduccionProtectedResponseDTO).observaciones);

    useEffect(() => {
        setLote(produccion.lote);
        setEncargado((produccion as ProduccionProtectedResponseDTO).encargado);
        setObservaciones((produccion as ProduccionProtectedResponseDTO).observaciones);
    }, [produccion]);

    const handleBlur = () => {
        if (onMetadataChange) {
            onMetadataChange({lote, encargado, observaciones});
        }
    };

    const formatDate = (dateString: string | null) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleString('es-AR', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getStatusTag = (estado: string) => {
        switch (estado) {
            case 'EN_PROCESO':
                return <Tag color="blue">En Proceso</Tag>;
            case 'FINALIZADA':
                return <Tag color="green">Finalizada</Tag>;
            case 'CANCELADA':
                return <Tag color="red">Cancelada</Tag>;
            default:
                return <Tag>{estado}</Tag>;
        }
    };

    const metadata = versionReceta.metadata;
    const isProtected = (produccion as ProduccionProtectedResponseDTO).encargado !== undefined;
    const enProceso = produccion.estado === 'EN_PROCESO';

    const cardTitle = (
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
            Información de la Producción
            {isProtected && enProceso && onCambioEstado && (
                <Space>
                    <Button icon={<CheckCircleOutlined/>} type="primary" onClick={() => {
                        onCambioEstado('FINALIZADA');
                    }}>
                        Finalizar
                    </Button>
                    <Button icon={<CloseCircleOutlined/>} danger onClick={() => {
                        onCambioEstado('CANCELADA');
                    }}>
                        Cancelar
                    </Button>
                </Space>
            )}
        </div>
    );

    const spanOneThirdOrOneHalf = {xxl: 1, xl: 1, lg: 1, md: 1, sm: 1, xs: 1};
    const spanTwoThirdsOrOneHalf = {xxl: 2, xl: 1, lg: 1, md: 1, sm: 1, xs: 1};
    const spanFullRow = {xxl: 3, xl: 2, lg: 2, md: 2, sm: 1, xs: 1};

    return (
        <Card className="production-info-card" title={cardTitle}>
            <Descriptions bordered column={{xxl: 3, xl: 2, lg: 2, md: 2, sm: 1, xs: 1}}>
                <Descriptions.Item
                    label="Código Producción" {...spanOneThirdOrOneHalf}>{produccion.codigoProduccion}</Descriptions.Item>
                <Descriptions.Item label="Lote" {...spanOneThirdOrOneHalf}>
                    {isEditable ? (
                        <Input value={lote || ''} onChange={e => setLote(e.target.value)} onBlur={handleBlur}/>
                    ) : (
                        produccion.lote || 'N/A'
                    )}
                </Descriptions.Item>
                <Descriptions.Item
                    label="Estado" {...spanOneThirdOrOneHalf}>{getStatusTag(produccion.estado)}</Descriptions.Item>

                <Descriptions.Item label="Encargado" {...spanOneThirdOrOneHalf}>
                    {isEditable && isProtected ? (
                        <Input value={encargado || ''} onChange={e => setEncargado(e.target.value)}
                               onBlur={handleBlur}/>
                    ) : (
                        isProtected ? ((produccion as ProduccionProtectedResponseDTO).encargado || 'No asignado') : 'N/A'
                    )}
                </Descriptions.Item>
                <Descriptions.Item
                    label="Fecha de Inicio" {...spanOneThirdOrOneHalf}>{formatDate(produccion.fechaInicio)}</Descriptions.Item>
                <Descriptions.Item label="Fecha de Finalización" {...spanOneThirdOrOneHalf}>
                    {produccion.estado !== 'EN_PROCESO' ? formatDate(produccion.fechaFin) : 'N/A'}
                </Descriptions.Item>

                <Descriptions.Item label={enProceso ? 'Tiempo en Ejecución' : 'Duración Total'} {...spanFullRow}>
                    <span className="elapsed-time">{elapsedTime}</span>
                </Descriptions.Item>

                <Descriptions.Item
                    label="Código Versión" {...spanOneThirdOrOneHalf}>{metadata.codigoVersionReceta}</Descriptions.Item>
                <Descriptions.Item
                    label="Nombre Versión" {...spanTwoThirdsOrOneHalf}>{metadata.nombre}</Descriptions.Item>

                <Descriptions.Item label="Receta Padre" {...spanFullRow}>
                    {metadata.nombreRecetaPadre} ({metadata.codigoRecetaPadre})
                </Descriptions.Item>

                <Descriptions.Item label="Observaciones" {...spanFullRow}>
                    {isEditable && isProtected ? (
                        <Input.TextArea value={observaciones || ''} onChange={e => setObservaciones(e.target.value)}
                                        onBlur={handleBlur} autoSize={{minRows: 2, maxRows: 6}}/>
                    ) : (
                        isProtected ? ((produccion as ProduccionProtectedResponseDTO).observaciones || 'N/A') : 'N/A'
                    )}
                </Descriptions.Item>
            </Descriptions>
        </Card>
    );
};
