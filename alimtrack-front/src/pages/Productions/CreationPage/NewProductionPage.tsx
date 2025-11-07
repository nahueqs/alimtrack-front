import React, { useState } from 'react';
import type { ProduccionCreateRequestDTO } from '../../../types/Productions.ts';
import { NuevaProduccionForm } from './NuevaProduccionForm.tsx';
import { message } from 'antd';
import { useAuth } from '../../Login/auth/authProvider.tsx';
import { useProduccionService } from '../../../services/useProduccionService.ts';

export const NewProductionPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { createProduction } = useProduccionService();

  const handleSubmit = async (data: ProduccionCreateRequestDTO) => {
    setLoading(true);
    try {
      const result = await createProduction(data);

      message.success('Producción creada exitosamente');
      console.log('Producción creada:', result);

      // Aquí podrías redirigir o limpiar el formulario
      // Ejemplo: navigate('/producciones');
    } catch (error) {
      console.error('Error al crear la producción:', error);
      message.error(error instanceof Error ? error.message : 'Error al crear la producción');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div
        style={{
          padding: '24px',
          textAlign: 'center',
          color: '#ff4d4f',
          fontSize: '16px',
        }}
      >
        No hay usuario logueado. Por favor, inicia sesión.
      </div>
    );
  }

  return (
    <div style={{ padding: '24px' }}>
      <NuevaProduccionForm onSubmit={handleSubmit} loading={loading} currentUser={user.username} />
    </div>
  );
};
