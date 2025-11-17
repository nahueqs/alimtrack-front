import React, { useCallback, useEffect, useState } from 'react';
import { DatePicker, Form, Input, message, Select } from 'antd';
import type { TablePaginationConfig } from 'antd/es/table';
import type { FilterValue, SorterResult } from 'antd/es/table/interface';
import type {
  ProduccionFilterRequestDTO,
  ProduccionResponseDTO,
} from '../../../types/Productions.ts';
import { productionService } from '../../../services/ProduccionService.ts';
import { DataTable, DataTableFilters } from '../../../components/ui/Table/TableActions';
import { getProductionColumns } from './ProductionsResultsColumns.tsx';

const { RangePicker } = DatePicker;
const { Option } = Select;

interface ProduccionTableProps {
  initialFilters?: ProduccionFilterRequestDTO;
  showHeader?: boolean;
  hideSearch?: boolean;
  onView?: (record: ProduccionResponseDTO) => void;
  onEdit?: (record: ProduccionResponseDTO) => void;
  onDelete?: (id: string) => void;
}

const ProductionsResultPage: React.FC<ProduccionTableProps> = ({
  initialFilters = {},
  showHeader = true,
  hideSearch = false,
  onView,
  onEdit,
  onDelete,
}) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [producciones, setProducciones] = useState<ProduccionResponseDTO[]>([]);
  const [pagination, setPagination] = useState<TablePaginationConfig>({
    current: 1,
    pageSize: 10,
    total: 0,
    showSizeChanger: true,
    pageSizeOptions: ['10', '20', '50', '100'],
    showTotal: (total, range) => `${range[0]}-${range[1]} de ${total} producciones`,
  });

  // Generar columnas con las acciones
  const columns = getProductionColumns({
    onView,
    onEdit,
    onDelete,
  });

  const fetchProducciones = useCallback(async (filters: ProduccionFilterRequestDTO = {}) => {
    setLoading(true);
    try {
      const data = await productionService.getProductions(filters);
      setProducciones(data.producciones || []);
      setPagination(prev => ({
        ...prev,
        total: data.total || data.producciones?.length || 0,
      }));
    } catch (error) {
      console.error('Error al cargar las producciones:', error);
      message.error('Error al cargar las producciones');
      setProducciones([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch data on mount and when initial filters change
  useEffect(() => {
    const hasInitial = initialFilters && Object.keys(initialFilters).length > 0;
    fetchProducciones(hasInitial ? initialFilters : {});
  }, [initialFilters, fetchProducciones]);

  const handleSearch = async (values: any) => {
    // If the user provided a production code, query by code directly
    const code = values?.codigoProduccion?.trim?.();
    if (code) {
      setLoading(true);
      try {
        const data = await productionService.getProduccionByCodigo(code);
        setProducciones(data.data.produccion?.producciones ?? []);
        setPagination(prev => ({
          ...prev,
          current: 1,
          total: data.data.produccion?.producciones?.length || 0,
        }));
        if (!data.producciones || data.producciones.length === 0) {
          message.info('No se encontraron producciones para ese código');
        }
      } catch (error) {
        console.error('Error al buscar por código de producción:', error);
        setProducciones([]);
        setPagination(prev => ({ ...prev, current: 1, total: 0 }));
        message.error('Error al buscar por código de producción');
      } finally {
        setLoading(false);
      }
      return;
    }

    // Otherwise, build filters and use the generic endpoint
    const filters: ProduccionFilterRequestDTO = {
      codigoVersionReceta: values.codigoVersionReceta,
      lote: values.lote,
      encargado: values.encargado,
      estado: values.estado,
      ...(values.fechaRango && {
        fechaInicio: values.fechaRango[0]?.format('YYYY-MM-DD'),
        fechaFin: values.fechaRango[1]?.format('YYYY-MM-DD'),
      }),
    };

    setPagination(prev => ({ ...prev, current: 1 }));
    fetchProducciones(filters);
  };

  const handleReset = () => {
    setPagination(prev => ({ ...prev, current: 1 }));
    fetchProducciones();
  };

  const handleTableChange = (
    newPagination: TablePaginationConfig,
    _filters: Record<string, FilterValue | null>,
    _sorter: SorterResult<ProduccionResponseDTO> | SorterResult<ProduccionResponseDTO>[]
  ) => {
    setPagination(newPagination);
    // Aquí puedes agregar lógica adicional para recargar datos con nueva paginación si es necesario
  };

  const searchComponent = (
    <DataTableFilters
      onSearch={handleSearch}
      onReset={handleReset}
      loading={loading}
      initialValues={initialFilters}
    >
      <Form.Item name="codigoProduccion" label="Código de producción">
        <Input placeholder="Ej: PROD-001" />
      </Form.Item>

      <Form.Item name="codigoVersionReceta" label="Versión Receta">
        <Input placeholder="Ej: REC-V1-2024" />
      </Form.Item>

      <Form.Item name="lote" label="N° Lote">
        <Input placeholder="Ej: LOTE-2024-001" />
      </Form.Item>

      <Form.Item name="encargado" label="Encargado">
        <Input placeholder="Nombre del encargado" />
      </Form.Item>

      <Form.Item name="estado" label="Estado">
        <Select placeholder="Seleccione estado" allowClear>
          <Option value="EN_PROCESO">En Proceso</Option>
          <Option value="FINALIZADA">Finalizada</Option>
        </Select>
      </Form.Item>

      <Form.Item name="fechaRango" label="Rango de Fechas">
        <RangePicker style={{ width: '100%' }} format="DD/MM/YYYY" />
      </Form.Item>
    </DataTableFilters>
  );

  return (
    <DataTable<ProduccionResponseDTO>
      data={producciones}
      columns={columns}
      loading={loading}
      rowKey="codigoProduccion"
      title={showHeader ? 'Listado de Producciones' : undefined}
      pagination={pagination}
      onTableChange={handleTableChange}
      searchComponent={searchComponent}
      hideSearch={hideSearch}
      scroll={{ x: 'max-content' }}
      className="production-data-table"
    />
  );
};

export default ProductionsResultPage;
