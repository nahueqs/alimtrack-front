import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PublicHeader } from '@/components/layout/PublicHeader/PublicHeader.tsx';
import { CustomTable } from '@/components/ui/CustomTable/CustomTable.tsx';
import { getPublicProductionColumns } from './ListadoProduccionesColumns.tsx';
import type { ProduccionPublicMetadataDTO } from '@/types/production';
import { usePublicService } from '@/services/public/usePublicService.ts';
import { useIsMobile } from '@/hooks/useIsMobile.ts';
import './ListadoProducciones.css';

export const ListadoProducciones: React.FC = () => {
  const { producciones, loading, error, getProduccionesPublicas } = usePublicService();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    getProduccionesPublicas();
  }, [getProduccionesPublicas]);

  const handleView = (record: ProduccionPublicMetadataDTO) => {
    navigate(`/public/producciones/ver/${record.codigoProduccion}`);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const filteredProducciones = producciones.filter(
    (p) =>
      p.codigoProduccion.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.lote && p.lote.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const columns = getPublicProductionColumns({
    onView: handleView,
    isMobile,
  });

  return (
    <div className="public-layout">
      <PublicHeader />
      <main className="public-main container">
        <div className="public-list-header">
          <h1 className="public-list-title">Producciones Públicas</h1>
          <p className="public-list-subtitle">
            Consulta el estado y avance de las producciones en curso.
          </p>
        </div>

        <div className="public-search-container">
          <input
            type="text"
            className="public-search-input"
            placeholder="Buscar por código o lote..."
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>

        <div className="public-list-content">
          <CustomTable
            columns={columns}
            dataSource={filteredProducciones}
            loading={loading}
            rowKey="codigoProduccion"
            locale={{
              emptyText: error ? 'Error al cargar las producciones' : 'No se encontraron producciones',
            }}
          />
        </div>
      </main>
    </div>
  );
};
