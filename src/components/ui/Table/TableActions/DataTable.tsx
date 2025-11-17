// components/data/DataTable.tsx
import React from 'react';
import { Card, Table } from 'antd';
import type { TablePaginationConfig } from 'antd/es/table';
import type { FilterValue, SorterResult } from 'antd/es/table/interface';
import './DataTable.css';

export interface DataTableProps<T> {
  // Datos y columnas
  data: T[];
  columns: any[];
  loading: boolean;

  // Configuración de tabla
  rowKey: string;
  showHeader?: boolean;
  title?: string;
  scroll?: { x?: number | string; y?: number | string };

  // Paginación
  pagination?: TablePaginationConfig | false;

  // Búsqueda y filtros
  searchComponent?: React.ReactNode;
  hideSearch?: boolean;

  // Callbacks
  onTableChange?: (
    pagination: TablePaginationConfig,
    filters: Record<string, FilterValue | null>,
    sorter: SorterResult<T> | SorterResult<T>[]
  ) => void;

  // Estilos
  className?: string;
  style?: React.CSSProperties;
}

export const DataTable = <T extends object>({
  data,
  columns,
  loading,
  rowKey,
  showHeader = true,
  title,
  scroll = { x: 'max-content' },
  pagination = {
    pageSize: 10,
    showSizeChanger: true,
    showTotal: total => `Total: ${total} registros`,
  },
  searchComponent,
  hideSearch = false,
  onTableChange,
  className = '',
  style,
}: DataTableProps<T>) => {
  const handleTableChange = (
    pagination: TablePaginationConfig,
    filters: Record<string, FilterValue | null>,
    sorter: SorterResult<T> | SorterResult<T>[]
  ) => {
    onTableChange?.(pagination, filters, sorter);
  };

  return (
    <Card
      className={`data-table-card ${className}`}
      title={showHeader ? title : null}
      style={{ margin: showHeader ? '16px' : 0, ...style }}
    >
      {!hideSearch && searchComponent}

      <div className="data-table-container">
        <Table
          dataSource={data}
          columns={columns}
          rowKey={rowKey}
          loading={loading}
          pagination={pagination}
          scroll={scroll}
          onChange={handleTableChange}
          locale={{
            emptyText: loading ? 'Cargando...' : 'No hay datos disponibles',
          }}
        />
      </div>
    </Card>
  );
};
