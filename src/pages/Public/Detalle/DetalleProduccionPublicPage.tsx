import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Col, Row, Select, Space, Typography } from 'antd';
import { BellOutlined } from '@ant-design/icons';
import { DetalleProduccionPage } from '@/pages/common/DetalleProduccion/DetalleProduccionPage';
import { usePublicService } from '@/services/public/usePublicService';
import { PublicHeader } from '@/components/layout/PublicHeader/PublicHeader.tsx';
import { useProductionWebSocket, type NotificationLevel } from '@/hooks/useProductionWebSocket';
import { ProductionStatusDisplay } from '@/components/ProductionStatusDisplay';

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

  return (
    <>
      <PublicHeader />
      <ProductionStatusDisplay
        loading={loading && !respuestas}
        error={error}
        estructura={estructura}
        estadoActual={respuestas}
        redirectPath="/public/producciones"
        redirectLabel="Volver al Listado Público"
      >
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
              estructura={estructura!}
              respuestas={respuestas!}
              isEditable={false}
              HeaderComponent={() => null}
            />
          </div>
        </div>
      </ProductionStatusDisplay>
    </>
  );
};

export default DetalleProduccionPublicPage;
