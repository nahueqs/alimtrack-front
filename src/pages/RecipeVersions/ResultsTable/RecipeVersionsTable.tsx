import React, { useCallback, useEffect, useState } from 'react';
import { DatePicker, Form, Input, message } from 'antd';
import versionRecetaService from '../../../services/VersionRecetaService.ts';
import { DataTable, DataTableFilters } from '../../../components/ui/Table/TableActions/';
import { getColumns } from './RecipeVersionsResultsColums.tsx';
import type {
  VersionRecetaFilterRequestDTO,
  VersionRecetaResponseDTO,
} from '../../../types/RecipeVersions.ts';

const { RangePicker } = DatePicker;

interface RecipeVersionsTableProps {
  showHeader?: boolean;
  hideSearch?: boolean;
  onView?: (record: VersionRecetaResponseDTO) => void;
  onEdit?: (record: VersionRecetaResponseDTO) => void;
  onDelete?: (id: string) => void;
  onExport?: (filters: any) => void;
}

export const RecipeVersionsTable: React.FC<RecipeVersionsTableProps> = ({
  showHeader = true,
  hideSearch = false,
  onView,
  onEdit,
  onDelete,
  onExport,
}) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [versions, setVersions] = useState<VersionRecetaResponseDTO[]>([]);
  const [currentFilters, setCurrentFilters] = useState<VersionRecetaFilterRequestDTO>({});

  // Generar columnas con las acciones
  const columns = getColumns({
    onView,
    onEdit,
    onDelete,
  });

  // Función para cargar versiones con filtros
  const fetchVersions = useCallback(async (filters: VersionRecetaFilterRequestDTO = {}) => {
    setLoading(true);
    try {
      console.log('📦 Fetching versions with filters:', filters);

      let response;

      // Elegir el método del servicio según los filtros

      if (filters.codigoVersionReceta) {
        // Buscar por código de versión específico
        console.log('🔍 Buscando por código de versión:', filters.codigoVersionReceta);
        response = await versionRecetaService.getVersionByCode(filters.codigoVersionReceta);
      } else if (filters.codigoReceta) {
        // Buscar versiones por código de receta
        console.log('🔍 Buscando versiones por receta:', filters.codigoReceta);
        response = await versionRecetaService.getVersionsByRecipe(filters.codigoReceta);
      } else {
        // Obtener todas las versiones
        console.log('🔍 Obteniendo todas las versiones');
        response = await versionRecetaService.getAllVersions();
      }

      console.log('📦 API Response completa:', response);

      // Verificar si hay error en la respuesta del servicio
      if (response.error) {
        console.error('❌ Error del servicio:', response.error);
        throw new Error(response.error.message || 'Error del servicio');
      }

      // Manejar la respuesta según la estructura del servicio
      let versionsData: VersionRecetaResponseDTO[] = [];

      // Manejar diferentes tipos de respuesta
      if (Array.isArray(response.data)) {
        // Respuesta de getAllVersions o getVersionsByRecipe
        versionsData = response.data;
      } else if (
        response.data &&
        typeof response.data === 'object' &&
        !Array.isArray(response.data)
      ) {
        // Respuesta de getVersionByCode (objeto individual)
        versionsData = [response.data];
      } else if (Array.isArray(response)) {
        // Respuesta directa como array (fallback)
        versionsData = response;
      } else {
        console.warn('Estructura de respuesta no reconocida:', response);
        versionsData = [];
      }

      console.log('📊 Datos procesados:', versionsData);

      setVersions(versionsData);

      console.log('✅ Versiones cargadas:', versionsData.length);

      // Mostrar mensaje informativo si no hay resultados
      if (versionsData.length === 0) {
        message.info('No se encontraron versiones con los criterios de búsqueda');
      }
    } catch (error) {
      console.error('❌ Error al cargar las versiones de recetas:', error);

      // Manejar diferentes tipos de errores
      let errorMessage = 'Error al cargar las versiones de recetas';

      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === 'string') {
        errorMessage = error;
      }

      // No mostrar mensaje si es un error de "recurso no encontrado" (puede ser normal)
      if (
        !errorMessage.includes('NoResourceFoundException') &&
        !errorMessage.includes('403') &&
        !errorMessage.includes('Forbidden')
      ) {
        message.error(errorMessage);
      }

      setVersions([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Cargar datos iniciales al montar el componente
  useEffect(() => {
    fetchVersions();
  }, [fetchVersions]);

  const handleSearch = async (values: any) => {
    const filters: VersionRecetaFilterRequestDTO = {
      codigoReceta: values.codigoReceta?.trim() || undefined,
      codigoVersionReceta: values.codigoVersionReceta?.trim() || undefined,
      ...(values.fechaRango &&
        values.fechaRango[0] &&
        values.fechaRango[1] && {
          fechaInicio: values.fechaRango[0]?.format('YYYY-MM-DD'),
          fechaFin: values.fechaRango[1]?.format('YYYY-MM-DD'),
        }),
    };

    // Remover propiedades undefined o vacías
    Object.keys(filters).forEach(key => {
      const value = filters[key as keyof VersionRecetaFilterRequestDTO];
      if (value === undefined || value === '') {
        delete filters[key as keyof VersionRecetaFilterRequestDTO];
      }
    });

    console.log('🔍 Aplicando filtros:', filters);
    setCurrentFilters(filters);

    // Aplicar filtros inmediatamente
    await fetchVersions(filters);
  };

  const handleReset = async () => {
    console.log('🔄 Reseteando filtros');
    const emptyFilters = {};
    setCurrentFilters(emptyFilters);

    // Recargar sin filtros
    await fetchVersions(emptyFilters);
  };

  const handleExport = (filters: any) => {
    if (onExport) {
      onExport(filters || currentFilters);
    } else {
      console.log('Exportar versiones con filtros:', filters || currentFilters);
      message.info('Funcionalidad de exportación para versiones de recetas');
    }
  };

  const handleTableChange = () => {
    // Función vacía por ahora, sin paginación
    console.log('Cambio de tabla (sin paginación)');
  };

  const searchComponent = (
    <DataTableFilters onSearch={handleSearch} onReset={handleReset} loading={loading}>
      <Form.Item name="codigoReceta" label="Código de receta">
        <Input placeholder="Ej: REC-001" allowClear />
      </Form.Item>

      <Form.Item name="codigoVersionReceta" label="Código versión Receta">
        <Input placeholder="Ej: REC-V1-2024" allowClear />
      </Form.Item>

      <Form.Item name="fechaRango" label="Rango de fecha de creación">
        <RangePicker style={{ width: '100%' }} format="DD/MM/YYYY" />
      </Form.Item>
    </DataTableFilters>
  );

  return (
    <DataTable<VersionRecetaResponseDTO>
      data={versions}
      columns={columns}
      loading={loading}
      rowKey="codigoVersionReceta"
      title={showHeader ? 'Versiones de Recetas' : undefined}
      onTableChange={handleTableChange}
      searchComponent={searchComponent}
      hideSearch={hideSearch}
      onExport={handleExport}
      exportButton={true}
      exportButtonText="Exportar Versiones"
      scroll={{ x: 'max-content' }}
      className="recipe-versions-data-table"
      locale={{ emptyText: 'No se encontraron versiones de recetas' }}
    />
  );
};

export default RecipeVersionsTable;
