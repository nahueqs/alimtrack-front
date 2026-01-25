import React, { useEffect, useState } from 'react';
import { useProductionService } from '@/services/production/useProductionService.ts';
import { AppHeader } from '@/components/AppHeader/AppHeader.tsx';
import { CustomTable } from '@/components/ui/CustomTable/CustomTable.tsx';
import { getProductionColumns } from './ProduccionesColumns.tsx';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui';
import { PlusOutlined } from '@ant-design/icons';
import { ProduccionFilters } from './ProduccionFilters.tsx';
import type {
  ProduccionFilterRequestDTO,
  ProduccionProtectedResponseDTO,
} from '@/types/production';
import './ProduccionesPage.css';
import { useIsMobile } from '@/hooks/useIsMobile.ts';

interface ProductionsResultPageProps {
  initialFilters?: ProduccionFilterRequestDTO;
}

const ProductionsResultPage: React.FC<ProductionsResultPageProps> = ({ initialFilters = {} }) => {
  const { producciones, loading, error, getProducciones } = useProductionService();
  const navigate = useNavigate();
  const [filters, setFilters] = useState<ProduccionFilterRequestDTO>(initialFilters);
  const isMobile = useIsMobile();

  useEffect(() => {
    getProducciones(filters);
  }, [getProducciones, filters]);

  const handleView = (record: ProduccionProtectedResponseDTO) => {
    navigate(`/producciones/ver/${record.codigoProduccion}`);
  };

  const handleEdit = (record: ProduccionProtectedResponseDTO) => {
    // Implementar navegación a edición si existe
    console.log('Editar', record);
  };

  const handleDelete = (id: string) => {
    // Implementar lógica de borrado
    console.log('Eliminar', id);
  };

  const handleFilterChange = (newFilters: ProduccionFilterRequestDTO) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  const columns = getProductionColumns({
    onView: handleView,
    onEdit: handleEdit,
    onDelete: handleDelete,
    isMobile,
  });

  return (
    <div className="dashboard">
      <AppHeader title="AlimTrack" />
      <main className="dashboard__main container">
        <div className="productions-list__header">
          <h1 className="productions-list__title">Listado de Producciones</h1>
          <Button icon={<PlusOutlined />} onClick={() => navigate('/producciones/nueva')}>
            Nueva Producción
          </Button>
        </div>

        <ProduccionFilters onFilterChange={handleFilterChange} initialFilters={initialFilters} />

        <div className="productions-list__content">
          <CustomTable
            columns={columns}
            dataSource={producciones}
            loading={loading}
            rowKey="codigoProduccion"
            locale={{
              emptyText: error
                ? 'Error al cargar las producciones'
                : 'No se encontraron producciones',
            }}
          />
        </div>
      </main>
    </div>
  );
};

export default ProductionsResultPage;
