import React from 'react';
import { Button, Result, Spin } from 'antd';
import { useNavigate } from 'react-router-dom';
import type {
  EstadoActualProduccionResponseDTO,
  EstructuraProduccionDTO,
  RespuestasProduccionPublicDTO,
} from '@/types/production';

interface ProductionStatusDisplayProps {
  loading: boolean;
  error: boolean | string | null; // Allow string for error messages
  estructura: EstructuraProduccionDTO | null;
  // Permitimos ambos tipos de respuestas (público y protegido)
  estadoActual: EstadoActualProduccionResponseDTO | RespuestasProduccionPublicDTO | null;
  children: React.ReactNode;
  redirectPath?: string; // Path to redirect on error/not found
  redirectLabel?: string; // Label for the redirect button
}

export const ProductionStatusDisplay: React.FC<ProductionStatusDisplayProps> = ({
  loading,
  error,
  estructura,
  estadoActual,
  children,
  redirectPath = '/dashboard',
  redirectLabel = 'Volver al Inicio',
}) => {
  const navigate = useNavigate();

  if (loading) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
        }}
      >
        <Spin size="large" tip="Cargando datos..." />
      </div>
    );
  }

  if (error) {
    const errorMessage = typeof error === 'string' ? error : 'No se pudieron cargar los datos de la producción.';
    const isNotFound = errorMessage.includes('404') || errorMessage.toLowerCase().includes('no encontrado');
    
    return (
      <div style={{ padding: '50px', display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Result
          status={isNotFound ? '404' : '500'}
          title={isNotFound ? 'Producción no encontrada' : 'Error de Carga'}
          subTitle={isNotFound ? 'La producción que buscas no existe o ha sido eliminada.' : errorMessage}
          extra={
            <Button type="primary" onClick={() => navigate(redirectPath)}>
              {redirectLabel}
            </Button>
          }
        />
      </div>
    );
  }

  if (!estructura || !estadoActual) {
    return (
      <div style={{ padding: '50px', display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Result
          status="warning"
          title="Sin datos"
          subTitle="No hay datos de estructura o respuestas disponibles para mostrar."
          extra={
            <Button type="primary" onClick={() => navigate(redirectPath)}>
              {redirectLabel}
            </Button>
          }
        />
      </div>
    );
  }

  return <>{children}</>;
};
