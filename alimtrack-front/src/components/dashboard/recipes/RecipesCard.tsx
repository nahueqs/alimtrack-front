// components/dashboard/cards/RecipesCard.tsx
import React from 'react';
import { DashboardCard } from '../DashboardCard.tsx';

interface RecipesCardProps {
  onNavigate: (path: string) => void;
}

export const RecetasCard: React.FC<RecipesCardProps> = ({ onNavigate }) => {
  return (
    <DashboardCard
      title="Recetas"
      description="Administra las recetas y sus versiones. Crea nuevas recetas o modifica las existentes."
      variant="elevated"
      hoverEffect={true}
    >
      <button
        className="dashboard-card__btn dashboard-card__btn--primary"
        onClick={() => onNavigate('/recetas/nueva')}
      >
        Crear Receta
      </button>
      <button className="dashboard-card__btn" onClick={() => onNavigate('/recetas')}>
        Ver Listado
      </button>
    </DashboardCard>
  );
};
