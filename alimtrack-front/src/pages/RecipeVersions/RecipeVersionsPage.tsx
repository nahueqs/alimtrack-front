import React, { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../Dashboard/DashboardHeader.tsx';
import { Button } from '../../components/ui';
import { ArrowLeftIcon } from 'lucide-react';
import { RecipeVersionsTable } from './ResultsTable/RecipeVersionsTable.tsx';
import type {
  VersionRecetaFilterRequestDTO,
  VersionRecetaResponseDTO,
} from '../../types/RecipeVersions.ts';

interface RecipeVersionsPageProps {
  initialFilters?: VersionRecetaFilterRequestDTO;
  showHeader?: boolean;
  hideSearch?: boolean;
}

export const RecipeVersionsPage: React.FC<RecipeVersionsPageProps> = ({
  initialFilters = {},
  showHeader = true,
  hideSearch = false,
}) => {
  const navigate = useNavigate();

  const handleBackToDashboard = useCallback(() => {
    navigate('/dashboard');
  }, [navigate]);

  const handleView = useCallback(
    (record: VersionRecetaResponseDTO) => {
      navigate(`/recetas/ver/${record.codigoVersionReceta}`);
    },
    [navigate]
  );

  const handleEdit = useCallback(
    (record: VersionRecetaResponseDTO) => {
      navigate(`/recetas/editar/${record.codigoVersionReceta}`);
    },
    [navigate]
  );

  const handleDelete = useCallback((id: string) => {
    console.log('Delete record with id:', id);
    // TODO: Implement delete functionality
  }, []);

  const handleExport = useCallback((filters: any) => {
    console.log('Exportar versiones con filtros:', filters);
    // TODO: Implement export functionality
    // Ejemplo: exportToExcel(filters);
  }, []);

  return (
    <div className="dashboard">
      <Header title="AlimTrack" badge="Lista de Recetas" />
      <main className="dashboard__main container">
        <div className="recipes-list__header">
          <Button icon={<ArrowLeftIcon />} onClick={handleBackToDashboard} variant={'secondary'}>
            Volver al Dashboard
          </Button>
        </div>
        <div className="recipes-table-container">
          <RecipeVersionsTable
            initialFilters={initialFilters}
            showHeader={showHeader}
            hideSearch={hideSearch}
            onView={handleView}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onExport={handleExport}
          />
        </div>
      </main>
    </div>
  );
};

export default RecipeVersionsPage;
