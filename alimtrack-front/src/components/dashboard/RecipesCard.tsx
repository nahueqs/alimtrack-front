// components/dashboard/cards/RecipesCard.tsx
import React from 'react';
import { DashboardCard } from './DashboardCard';

interface RecipesCardProps {
  onNavigate: (path: string) => void;
}

export const RecetasCard: React.FC<RecipesCardProps> = ({ onNavigate }) => {
  return (
    <DashboardCard
      title="Recetas"
      description="Administra las recetas y sus versiones. Crea nuevas recetas o modifica las existentes."
    >
      <button
        className="dashboard__card-btn dashboard__card-btn--primary"
        onClick={() => onNavigate('/recetas/nueva')}
      >
        Crear Receta
      </button>
      <button
        className="dashboard__card-btn"
        onClick={() => onNavigate('/recetas')}
      >
        Ver Listado
      </button>
    </DashboardCard>
  );
};