// components/dashboard/cards/ProductionsCard.tsx
import React from 'react';
import { DashboardCard } from './DashboardCard';

interface ProductionsCardProps {
    onNavigate: (path: string) => void;
}

export const ProduccionCard: React.FC<ProductionsCardProps> = ({ onNavigate }) => {
    return (
        <DashboardCard
            title="Producciones"
            description="Gestiona y monitorea las producciones en curso. Inicia nuevas producciones y realiza seguimiento."
        >
            <button
                className="dashboard__card-btn dashboard__card-btn--primary"
                onClick={() => onNavigate('/producciones/nueva')} // Navegación normal
            >
                Iniciar Producción
            </button>
            <button
                className="dashboard__card-btn"
                onClick={() => onNavigate('/producciones/activas')}
            >
                Ver Activas
            </button>
            <button
                className="dashboard__card-btn"
                onClick={() => onNavigate('/producciones/finalizadas')}
            >
                Ver Finalizadas
            </button>
        </DashboardCard>
    );
};