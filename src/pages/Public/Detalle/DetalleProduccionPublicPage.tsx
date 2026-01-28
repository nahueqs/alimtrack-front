import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Alert, Col, Row, Select, Space, Spin, Typography } from 'antd';
import { BellOutlined } from '@ant-design/icons';
import { DetalleProduccionPage } from '@/pages/common/DetalleProduccion/DetalleProduccionPage';
import { usePublicService } from '@/services/public/usePublicService';
import { PublicHeader } from '@/components/layout/PublicHeader/PublicHeader.tsx';
import { useProductionWebSocket, type NotificationLevel } from '@/hooks/useProductionWebSocket';

const { Text } = Typography;

const DetalleProduccionPublicPage: React.FC = () => {
  const { codigoProduccion } = useParams<{ codigoProduccion: string }>();
  const [notificationLevel, setNotificationLevel] = useState<NotificationLevel>('ALL');

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

  useProductionWebSocket({
    codigoProduccion,
    estadoActual: respuestas,
    estructura,
    getUltimasRespuestas: getUltimasRespuestasProduccion,
    updateFieldResponse,
    updateTableCellResponse,
    updateProductionState,
    updateProductionMetadata,
    notificationLevel,
  });

  useEffect(() => {
    if (codigoProduccion) {
      Promise.all([
        getEstructuraProduccion(codigoProduccion),
        getUltimasRespuestasProduccion(codigoProduccion),
      ]);
    }
  }, [codigoProduccion, getEstructuraProduccion, getUltimasRespuestasProduccion]);

  if (loading && !respuestas) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
        }}
      >
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    return <Alert message="Error" description={error} type="error" showIcon />;
  }

  if (!estructura || !respuestas) {
    return (
      <Alert
        message="No se encontraron datos para esta producción."
        type="warning"
        showIcon
      />
    );
  }

  return (
    <>
      <PublicHeader />
      
      {/* Contenedor principal centrado */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
        
        {/* Fila para el selector de notificaciones */}
        <Row justify="end" style={{ marginTop: '16px', marginBottom: '8px' }}>
          <Col>
            <Space align="center">
              <BellOutlined style={{ color: '#8c8c8c' }} />
              <Text type="secondary" style={{ fontSize: '14px' }}>
                Avisos:
              </Text>
              <Select
                value={notificationLevel}
                onChange={setNotificationLevel}
                style={{ width: 180 }}
                size="small"
                placement="bottomRight"
                // Eliminamos getPopupContainer para dejar que AntD lo maneje en el body (mejor para z-index)
                // o usamos document.body explícitamente si hay problemas de overflow hidden en padres
                getPopupContainer={() => document.body} 
                options={[
                  { value: 'ALL', label: 'Todos los cambios' },
                  { value: 'STATE_ONLY', label: 'Solo estado' },
                  { value: 'NONE', label: 'Silenciar' },
                ]}
              />
            </Space>
          </Col>
        </Row>

        {/* Contenido de la producción */}
        <div className="public-readonly">
          <DetalleProduccionPage
            estructura={estructura}
            respuestas={respuestas}
            isEditable={false}
            HeaderComponent={() => null}
          />
        </div>
      </div>
    </>
  );
};

export default DetalleProduccionPublicPage;
