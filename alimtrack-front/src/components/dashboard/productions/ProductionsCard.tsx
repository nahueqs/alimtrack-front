// components/dashboard/productions/ProductionsCard.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardCard } from '../DashboardCard';

interface ProductionsCardProps {
  /** Function to handle navigation */
  onNavigate: (path: string, state?: any) => void;
}

export const ProductionsCard: React.FC<ProductionsCardProps> = ({ onNavigate }) => {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleViewProductions = () => {
    onNavigate('/productions');
  };

  const handleVerActivas = () => {
    onNavigate('/producciones', { filter: 'EN_PROCESO' });
  };

  return (
    <DashboardCard
      title="Producciones"
      description="Gestiona las producciones activas y crea nuevas órdenes de producción."
      error={error}
      onRetry={handleViewProductions}
    >
      <button
        className="dashboard-card__btn dashboard-card__btn--primary"
        onClick={handleViewProductions}
        loading={loading}
      >
        Ver todas las producciones
      </button>

      <button
        className="dashboard-card__btn dashboard-card__btn--primary"
        onClick={handleVerActivas}
        loading={loading}
      >
        Ver producciones activas
      </button>
    </DashboardCard>
  );
};
