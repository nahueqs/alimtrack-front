// components/dashboard/productions/ProductionsCard.tsx
import React from 'react';
import { DashboardCard } from './Card/DashboardCard.tsx';
import { Button } from '../../components/ui';

interface ProductionsCardProps {
  /** Function to handle navigation */
  onNavigate: (path: string, state?: any) => void;
  className?: string;
}

export const ProductionsCard: React.FC<ProductionsCardProps> = ({ onNavigate }) => {
  const handleNewProduction = () => {
    onNavigate('/producciones/nueva', { filter: {} });
  };

  const handleViewProductions = () => {
    onNavigate('/producciones', { filter: {} });
  };

  const handleVerActivas = () => {
    onNavigate('/producciones', { filter: 'EN_PROCESO' });
  };

  return (
    <DashboardCard
      title="Producciones"
      description="Gestiona las producciones activas y crea nuevas órdenes de producción."
    >
      <Button onClick={handleNewProduction}>Iniciar producción</Button>

      <Button variant={'secondary'} onClick={handleVerActivas}>
        Ver producciones activas
      </Button>

      <Button variant={'secondary'} onClick={handleViewProductions}>
        Ver todas las producciones
      </Button>
    </DashboardCard>
  );
};
