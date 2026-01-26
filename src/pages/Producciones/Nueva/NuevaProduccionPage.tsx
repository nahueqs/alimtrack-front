import React, { useEffect, useState } from 'react';
import type { ProduccionCreateRequestDTO } from '@/types/production';
import { NuevaProduccionForm } from './NuevaProduccionForm.tsx';
import { message, Spin } from 'antd';
import { useAuth } from '@/context/auth/AuthProvider.tsx';
import { useProductionService } from '@/services/production/useProductionService.ts';
import { useVersionRecetaService } from '@/services/recetas/useVersionRecetaService.ts';
import { AppHeader } from '@/components/AppHeader/AppHeader.tsx';
import { useNavigate } from 'react-router-dom';
import { ArrowLeftIcon } from 'lucide-react';
import { Button } from '@/components/ui';

export const NuevaProduccionPage: React.FC = () => {
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const { user } = useAuth();
  const { createProduction } = useProductionService();
  const navigate = useNavigate();

  const {
    loading: loadingVersions,
    versiones: recipeVersions, // Changed from 'versions' to 'versiones'
    error: versionsError, // Changed from 'hasError' to 'error'
    getAllVersiones: refetchVersions, // Changed from 'refetch' to 'getAllVersiones'
  } = useVersionRecetaService();

  // Derive hasVersionsError from versionsError
  const hasVersionsError = !!versionsError;

  // Fetch versions on component mount
  useEffect(() => {
    refetchVersions();
  }, [refetchVersions]);

  const handleSubmit = async (data: ProduccionCreateRequestDTO) => {
    setLoadingSubmit(true);
    try {
      // Añadimos el usernameCreador aquí
      const dataWithCreator: ProduccionCreateRequestDTO = {
        ...data,
        emailCreador: user?.email || 'desconocido', // Changed to usernameCreador
      };

      if (import.meta.env.DEV) {
        console.log('[NuevaProduccionPage] Datos a enviar:', dataWithCreator);
      }

      const newProduction = await createProduction(dataWithCreator); // Corrected the argument
      message.success('Producción creada exitosamente');
      if (import.meta.env.DEV) {
        console.log('Producción creada:', newProduction);
      }
      navigate(`/producciones/ver/${newProduction.codigoProduccion}`);
    } catch (error) {
      // El error ya es manejado y mostrado por apiClient.
      // El catch se mantiene para prevenir que la navegación ocurra si hay un error.
      if (import.meta.env.DEV) {
        console.error('Error al crear la producción:', error);
      }
    } finally {
      setLoadingSubmit(false);
    }
  };

  const handleBack = () => {
    navigate('/producciones');
  };

  if (!user) {
    return (
      <div style={{ padding: '24px', textAlign: 'center', color: '#ff4d4f', fontSize: '16px' }}>
        No hay usuario logueado. Por favor, inicia sesión.
      </div>
    );
  }

  return (
    <div className="dashboard">
      <AppHeader title="AlimTrack" />
      <main className="dashboard__main container">
        <div className="productions-list__header">
          <Button icon={<ArrowLeftIcon />} onClick={handleBack} variant={'secondary'}>
            Volver a Producciones
          </Button>
        </div>
        {loadingVersions ? (
          <div style={{ textAlign: 'center', padding: '50px' }}>
            <Spin size="large" tip="Cargando versiones de recetas..." />
          </div>
        ) : (
          <NuevaProduccionForm
            onSubmit={handleSubmit}
            loading={loadingSubmit}
            currentUser={user.nombre}
            recipeVersions={recipeVersions}
            hasVersionsError={hasVersionsError}
            refetchVersions={refetchVersions}
          />
        )}
      </main>
    </div>
  );
};
