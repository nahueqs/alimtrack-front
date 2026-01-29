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
import { message, Modal } from 'antd';

interface ProductionsResultPageProps {
  initialFilters?: ProduccionFilterRequestDTO;
}

const ProductionsResultPage: React.FC<ProductionsResultPageProps> = ({ initialFilters = {} }) => {
  const { producciones, loading, error, getProducciones, deleteProduction } = useProductionService();
  const navigate = useNavigate();
  const [filters, setFilters] = useState<ProduccionFilterRequestDTO>(initialFilters);
  const isMobile = useIsMobile();

  useEffect(() => {
    getProducciones(filters);
  }, [getProducciones, filters]);

  const handleView = (record: ProduccionProtectedResponseDTO) => {
    window.open(`/public/producciones/ver/${record.codigoProduccion}`, '_blank');
  };

  const handleEdit = (record: ProduccionProtectedResponseDTO) => {
    window.open(`/producciones/ver/${record.codigoProduccion}`, '_blank');
  };

  const handleDelete = (codigoProduccion: string) => {
    Modal.confirm({
      title: '¿Estás seguro de eliminar esta producción?',
      content: `Se eliminará la producción con código: ${codigoProduccion}. Esta acción no se puede deshacer.`,
      okText: 'Sí, eliminar',
      okType: 'danger',
      cancelText: 'Cancelar',
      onOk: async () => {
        try {
          await deleteProduction(codigoProduccion);
          message.success(`Producción ${codigoProduccion} eliminada exitosamente`);
          // No es necesario llamar a getProducciones() porque deleteProduction ya actualiza el estado local
        } catch (err: any) {
          console.error('Error al eliminar producción:', err);
          message.error(err.message || 'Error al eliminar la producción');
        }
      },
    });
  };

  const handleFilterChange = (newFilters: ProduccionFilterRequestDTO) => {
    setFilters(newFilters);
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
