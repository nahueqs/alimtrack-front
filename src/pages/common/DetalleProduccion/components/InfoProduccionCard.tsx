import React, { useState } from 'react';
import { Button, Card, Descriptions, Form, Input, Modal, Select, Tag, Typography } from 'antd';
import { EditOutlined, SaveOutlined } from '@ant-design/icons';
import type {
  EstructuraProduccionDTO,
  ProduccionMetadataModifyRequestDTO,
  ProduccionProtectedResponseDTO,
  ProduccionPublicMetadataDTO,
} from '@/types/production';
import {
  PRODUCTION_STATE_COLORS,
  PRODUCTION_STATE_LABELS,
  ProductionState,
} from '@/constants/ProductionStates';

const { Title, Text } = Typography;
const { Option } = Select;

interface InfoProduccionCardProps {
  produccion: ProduccionProtectedResponseDTO | ProduccionPublicMetadataDTO;
  versionReceta: EstructuraProduccionDTO;
  isEditable?: boolean;
  onCambioEstado?: (nuevoEstado: ProductionState) => void;
  onMetadataChange?: (data: ProduccionMetadataModifyRequestDTO) => void;
}

export const InfoProduccionCard: React.FC<InfoProduccionCardProps> = ({
  produccion,
  versionReceta,
  isEditable = false,
  onCambioEstado,
  onMetadataChange,
}) => {
  const [isEditing, setIsEditable] = useState(false);
  const [form] = Form.useForm();

  const handleEdit = () => {
    form.setFieldsValue({
      lote: produccion.lote,
      encargado: (produccion as any).encargado, // Cast as any because public DTO might not have it, but form handles it
      observaciones: (produccion as any).observaciones,
    });
    setIsEditable(true);
  };

  const handleSave = () => {
    form
      .validateFields()
      .then((values) => {
        if (onMetadataChange) {
          onMetadataChange(values);
        }
        setIsEditable(false);
      })
      .catch((info) => {
        console.log('Validate Failed:', info);
      });
  };

  const handleEstadoChange = (value: ProductionState) => {
    Modal.confirm({
      title: '¿Estás seguro de cambiar el estado?',
      content: `La producción pasará a estado ${PRODUCTION_STATE_LABELS[value]}.`,
      onOk: () => {
        if (onCambioEstado) {
          onCambioEstado(value);
        }
      },
    });
  };

  const renderEstadoTag = (estado: ProductionState) => {
    const color = PRODUCTION_STATE_COLORS[estado] || 'default';
    const text = PRODUCTION_STATE_LABELS[estado] || estado;
    return <Tag color={color}>{text}</Tag>;
  };

  // Check if we are in a protected context (has 'encargado' property)
  const isProtected = 'encargado' in produccion;

  return (
    <Card className="info-card">
      <div className="info-card-header">
        <Title level={4} className="info-card-title">
          Información de Producción
        </Title>
        {isEditable && !isEditing && isProtected && (
          <Button type="text" icon={<EditOutlined />} onClick={handleEdit}>
            Editar
          </Button>
        )}
        {isEditable && isEditing && isProtected && (
          <Button type="primary" icon={<SaveOutlined />} onClick={handleSave}>
            Guardar
          </Button>
        )}
      </div>

      {isEditing ? (
        <Form form={form} layout="vertical">
          <Form.Item name="lote" label="Lote">
            <Input />
          </Form.Item>
          <Form.Item name="encargado" label="Encargado">
            <Input />
          </Form.Item>
          <Form.Item name="observaciones" label="Observaciones">
            <Input.TextArea />
          </Form.Item>
        </Form>
      ) : (
        <Descriptions column={{ xxl: 2, xl: 2, lg: 2, md: 1, sm: 1, xs: 1 }} bordered size="small">
          <Descriptions.Item label="Código">{produccion.codigoProduccion}</Descriptions.Item>
          <Descriptions.Item label="Lote">
            <Text strong>{produccion.lote || '-'}</Text>
          </Descriptions.Item>
          <Descriptions.Item label="Estado">
            {isEditable && isProtected ? (
              <Select
                defaultValue={produccion.estado}
                style={{ width: 120 }}
                onChange={handleEstadoChange}
                disabled={
                  produccion.estado === ProductionState.FINALIZADA ||
                  produccion.estado === ProductionState.CANCELADA
                }
              >
                <Option value={ProductionState.EN_PROCESO}>En Proceso</Option>
                <Option value={ProductionState.FINALIZADA}>Finalizada</Option>
                <Option value={ProductionState.CANCELADA}>Cancelada</Option>
              </Select>
            ) : (
              renderEstadoTag(produccion.estado)
            )}
          </Descriptions.Item>
          <Descriptions.Item label="Versión Receta">
            {versionReceta.metadata.nombre} ({versionReceta.metadata.codigoVersionReceta})
          </Descriptions.Item>
          <Descriptions.Item label="Fecha Inicio">
            {new Date(produccion.fechaInicio).toLocaleString()}
          </Descriptions.Item>
          <Descriptions.Item label="Fecha Fin">
            {produccion.fechaFin ? new Date(produccion.fechaFin).toLocaleString() : '-'}
          </Descriptions.Item>
          {(produccion as any).encargado && (
            <Descriptions.Item label="Encargado">
              {(produccion as any).encargado}
            </Descriptions.Item>
          )}
          {(produccion as any).emailCreador && (
            <Descriptions.Item label="Creado por">
              {(produccion as any).emailCreador}
            </Descriptions.Item>
          )}
        </Descriptions>
      )}
      {!isEditing && (produccion as any).observaciones && (
        <div style={{ marginTop: 16 }}>
          <Text strong>Observaciones:</Text>
          <p>{(produccion as any).observaciones}</p>
        </div>
      )}
    </Card>
  );
};
