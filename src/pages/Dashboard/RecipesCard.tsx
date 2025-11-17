// components/dashboard/cards/RecipesCard.tsx
import React from 'react';
import { DashboardCard } from './Card/DashboardCard.tsx';
import { Button } from '../../components/ui';

interface RecipesCardProps {
  onNavigate: (path: string) => void;
}

export const RecetasCard: React.FC<RecipesCardProps> = ({ onNavigate }) => {
  const handleViewVersiones = () => {
    onNavigate('/recetas/versiones');
  };
  return (
    <DashboardCard
      title="Recetas"
      description="Administra las recetas y sus versiones. Crea nuevas recetas o modifica las existentes."
      variant="default"
      hoverEffect={true}
    >
      <Button> Crear Receta</Button>

      <Button variant={'secondary'} onClick={handleViewVersiones}>
        {' '}
        Ver Listado
      </Button>
    </DashboardCard>
  );
};
