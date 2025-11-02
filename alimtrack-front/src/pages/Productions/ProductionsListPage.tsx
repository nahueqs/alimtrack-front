import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../../components/dashboard/header/DashboardHeader.tsx';
import { ArrowLeftIcon } from '../../components/ui/Icons.tsx';
import ProduccionTable from '../../components/dashboard/productions/ProduccionTable.tsx';
import './ProductionsListPage.css';

export const ProductionsListPage: React.FC = () => {
  const navigate = useNavigate();

  const handleBackToDashboard = () => {
    navigate('/dashboard');
  };

  return (
    <div className="dashboard">
      <Header title="AlimTrack" badge="Lista de Producciones" />
      <main className="dashboard__main container">
        <div className="productions-list__header">
          <button onClick={handleBackToDashboard} className="btn btn--icon">
            <ArrowLeftIcon />
            Volver al Dashboard
          </button>
        </div>
        <div className="productions-table-container">
          <ProduccionTable />
        </div>
      </main>
    </div>
  );
};
