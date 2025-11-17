import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../Dashboard/DashboardHeader.tsx';
import ProductionsResultPage from './ResultsPage/ProductionsResultsPage.tsx';
import './ProductionsPage.css';
import type { ProduccionFilterRequestDTO } from '../../types/Productions.ts';
import { Button } from '../../components/ui';
import { ArrowLeftIcon } from 'lucide-react';

interface ProductionsListPageProps {
  initialFilters?: ProduccionFilterRequestDTO;
  showHeader?: boolean;
  hideSearch?: boolean;
}

export const ProductionsPage: React.FC<ProductionsListPageProps> = ({
  initialFilters = {},
  showHeader = true,
  hideSearch = false,
}) => {
  const navigate = useNavigate();

  const handleBackToDashboard = () => {
    navigate('/dashboard');
  };

  return (
    <div className="dashboard">
      <Header title="AlimTrack" badge="Lista de Producciones" />
      <main className="dashboard__main container">
        <div className="productions-list__header">
          <Button icon={<ArrowLeftIcon />} onClick={handleBackToDashboard} variant={'secondary'}>
            Volver al Dashboard
          </Button>
        </div>
        <div className="productions-table-container">
          <ProductionsResultPage
            initialFilters={initialFilters}
            showHeader={showHeader}
            hideSearch={hideSearch}
          />
        </div>
      </main>
    </div>
  );
};
