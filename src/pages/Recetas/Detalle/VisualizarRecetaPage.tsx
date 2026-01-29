import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, Spin, Typography } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { versionRecetaService } from '@/services/recetas/VersionRecetaService';
import { EstructuraProduccion } from '@/pages/common/DetalleProduccion/components/EstructuraProduccion';
import { RespuestasContext } from '@/pages/common/DetalleProduccion/context/RespuestasContext';
import { AppHeader } from '@/components/AppHeader/AppHeader';
import type { EstructuraProduccionDTO } from '@/types/production';
import { usePageTitle } from '@/hooks/usePageTitle.ts';

const { Title, Text } = Typography;

export const VisualizarRecetaPage: React.FC = () => {
  const { codigoVersion } = useParams<{ codigoVersion: string }>();
  usePageTitle(codigoVersion ? `Receta ${codigoVersion}` : 'Detalle de Receta');
  const navigate = useNavigate();
  const [estructura, setEstructura] = useState<EstructuraProduccionDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEstructura = async () => {
      if (!codigoVersion) return;
      try {
        setLoading(true);
        const data = await versionRecetaService.getEstructuraCompleta(codigoVersion);
        setEstructura(data);
      } catch (err: any) {
        setError(err.message || 'Error al cargar la estructura de la receta');
      } finally {
        setLoading(false);
      }
    };

    fetchEstructura();
  }, [codigoVersion]);

  const contextValue = useMemo(
    () => ({
      respuestasCampos: {},
      respuestasTablas: [],
      onCampoChange: () => {},
      onTablaChange: () => {},
    }),
    []
  );

  const handleBack = () => {
    navigate(-1);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spin size="large" />
      </div>
    );
  }

  if (error || !estructura) {
    return (
      <div className="p-8 text-center">
        <Text type="danger">{error || 'No se encontró la receta'}</Text>
        <br />
        <Button onClick={handleBack} className="mt-4">
          Volver
        </Button>
      </div>
    );
  }

  return (
    <>
      <AppHeader />
      <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ marginBottom: '24px' }}>
          <Button
            type="text"
            icon={<ArrowLeftOutlined />}
            onClick={handleBack}
            style={{ marginBottom: '16px' }}
          >
            Volver
          </Button>
          <Title level={2}>{estructura.metadata.nombre}</Title>
          <Text type="secondary">Versión: {estructura.metadata.codigoVersionReceta}</Text>
          {estructura.metadata.descripcion && (
            <div style={{ marginTop: '8px' }}>
              <Text>{estructura.metadata.descripcion}</Text>
            </div>
          )}
        </div>

        <RespuestasContext.Provider value={contextValue}>
          <EstructuraProduccion
            estructura={estructura.estructura}
            isEditable={false}
            showProgress={false}
          />
        </RespuestasContext.Provider>
      </div>
    </>
  );
};

export default VisualizarRecetaPage;
