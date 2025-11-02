// components/dashboard/cards/ProductionsCard.tsx
import React, { useState } from 'react';
import { DashboardCard } from '../DashboardCard';
import { productionService } from '../../../services/productionService';
import { Alert } from 'antd';
import type { ProductionFilterRequestDTO } from '../../../types/Productions';
import './ProductionsCard.css'; // We'll create this CSS file for styling.

interface ProductionsCardProps {
  onNavigate: (path: string, state?: any) => void;
}

export const ProductionsCard: React.FC<ProductionsCardProps> = ({ onNavigate }) => {
  const [error, setError] = useState<string | null>(null);
  
  const clearError = () => {
    setError(null);
  };

  const handleVerActivas = async () => {
    try {
      const filters: ProductionFilterRequestDTO = { estado: 'EN_PROCESO' };
      const response = await productionService.getProductions(filters);
      // Navigate to the active productions page with the filtered data
      onNavigate('/producciones/activas', { state: { producciones: response.producciones } });
    } catch (error) {
      setError('Error al cargar las producciones activas. Por favor, intente nuevamente.');
    }
  };

  return (
    <DashboardCard
      title="Productions"
      description="Gestiona y monitorea las producciones en curso. Inicia nuevas producciones y realiza seguimiento."
      variant="elevated"
      hoverEffect={true}
      className="productions-card"
    >
      <div className="productions-card__content">
        <div className="productions-buttons">
          <button
            className="dashboard-card__btn dashboard-card__btn--primary"
            onClick={() => onNavigate('/producciones/nueva')}
          >
            Iniciar Producción
          </button>
          <button className="dashboard-card__btn" onClick={handleVerActivas}>
            Ver Activas
          </button>
          <button
            className="dashboard-card__btn"
            onClick={() => onNavigate('/producciones/finalizadas')}
          >
            Ver Finalizads
          </button>
        </div>
        
        {/* Error Display Section - Inside the card */}
        {error && (
          <div className="error-section">
            <Alert
              message={
                <span className="error-message">
                  <span>Error:</span>
                  <span className="error-text">{error}</span>
                </span>
              }
              type="error"
              showIcon={false}
              closable
              onClose={clearError}
              className="error-alert"
            />
          </div>
        )}
      </div>
    </DashboardCard>
  );
};
