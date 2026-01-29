import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { DetalleProduccionPage } from '@/pages/common/DetalleProduccion/DetalleProduccionPage';
import { AppHeader } from '@/components/AppHeader/AppHeader.tsx';
import { useProductionData } from '@/hooks/useProductionData';
import { useProductionWebSocket, type NotificationLevel } from '@/hooks/useProductionWebSocket';
import { useProductionActions } from '@/hooks/useProductionActions';
import { ProductionStatusDisplay } from '@/components/ProductionStatusDisplay';
import { SavingIndicator } from '@/components/SavingIndicator';
import { ProductionState } from '@/constants/ProductionStates';
import { BellOutlined } from '@ant-design/icons';
import { Select, Space, Typography } from 'antd';
import { usePageTitle } from '@/hooks/usePageTitle.ts';

const { Text } = Typography;

const DetalleProduccionProtectedPage: React.FC = () => {
  const { codigoProduccion } = useParams<{ codigoProduccion: string }>();
  
  // Usamos el código de producción para el título, o un mensaje genérico si no está disponible
  usePageTitle(codigoProduccion ? `Producción ${codigoProduccion}` : 'Detalle de Producción');

  const [notificationLevel, setNotificationLevel] = useState<NotificationLevel>('ALL');

  const {
    loading: loadingData,
    error: errorData,
    estadoActual,
    estructura,
    getUltimasRespuestas,
    isSaving,
    guardarRespuestaCampo,
    guardarRespuestaCeldaTabla,
    cambiarEstadoProduccion,
    guardarMetadata,
    updateFieldResponse,
    updateTableCellResponse,
    updateProductionState,
    updateProductionMetadata,
  } = useProductionData(codigoProduccion);

  useProductionWebSocket({
    codigoProduccion,
    estadoActual,
    estructura,
    getUltimasRespuestas,
    updateFieldResponse,
    updateTableCellResponse,
    updateProductionState,
    updateProductionMetadata,
    notificationLevel,
  });

  const {
    debouncedCampoChange,
    debouncedTablaChange,
    debouncedMetadataChange,
    handleCambioEstado,
  } = useProductionActions({
    isSaving,
    guardarRespuestaCampo,
    guardarRespuestaCeldaTabla,
    cambiarEstadoProduccion,
    guardarMetadata,
    estadoActual,
    estructura,
    updateFieldResponse,
    updateTableCellResponse,
  });

  const isProductionEditable = estadoActual?.produccion.estado === ProductionState.EN_PROCESO;

  return (
    <ProductionStatusDisplay
      loading={loadingData}
      error={errorData ? 'Error al cargar la producción' : null}
      estructura={estructura}
      estadoActual={estadoActual}
      redirectPath="/producciones"
      redirectLabel="Volver al Listado"
    >
      <SavingIndicator isSaving={isSaving} />
      
      {/* Selector de notificaciones */}
      <div
        style={{
          padding: '0 24px',
          marginTop: '16px',
          display: 'flex',
          justifyContent: 'flex-end',
          maxWidth: '1200px',
          margin: '16px auto 0',
        }}
      >
        <Space>
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
      </div>

      <div style={{ marginTop: '-24px' }}>
        <DetalleProduccionPage
          estructura={estructura!}
          respuestas={estadoActual!}
          isEditable={isProductionEditable}
          onCampoChange={debouncedCampoChange}
          onTablaChange={debouncedTablaChange}
          onMetadataChange={debouncedMetadataChange}
          onCambioEstado={handleCambioEstado}
          HeaderComponent={AppHeader}
        />
      </div>
    </ProductionStatusDisplay>
  );
};

export default DetalleProduccionProtectedPage;
