import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Alert, Select, Space, Spin, Typography } from 'antd';
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
      <div
        style={{
          padding: '0 24px',
          marginTop: '16px',
          display: 'flex',
          justifyContent: 'flex-end',
          maxWidth: '1200px',
          margin: '16px auto 0',
          flexWrap: 'wrap', // Permite que los elementos bajen si no hay espacio
        }}
      >
        <Space wrap style={{ justifyContent: 'flex-end', width: '100%' }}>
          <BellOutlined style={{ color: '#8c8c8c' }} />
          <Text type="secondary" style={{ fontSize: '14px' }}>
            Avisos:
          </Text>
          <Select
            value={notificationLevel}
            onChange={setNotificationLevel}
            style={{ width: 180 }}
            size="small"
            placement="bottomRight" // Fuerza que el menú se abra hacia abajo y alineado a la derecha
            getPopupContainer={(triggerNode) => triggerNode.parentNode} // Renderiza el menú dentro del contenedor padre para evitar problemas de z-index o overflow
            options={[
              { value: 'ALL', label: 'Todos los cambios' },
              { value: 'STATE_ONLY', label: 'Solo estado' },
              { value: 'NONE', label: 'Silenciar' },
            ]}
          />
        </Space>
      </div>
      <div style={{ marginTop: '-24px' }} className="public-readonly">
        {/* Ajuste negativo para compensar el padding del componente hijo si es necesario, o simplemente dejar que fluya */}
        <DetalleProduccionPage
          estructura={estructura}
          respuestas={respuestas}
          isEditable={false}
          HeaderComponent={() => null} // Pasamos null porque ya renderizamos el Header arriba
        />
      </div>
    </>
  );
};

export default DetalleProduccionPublicPage;
