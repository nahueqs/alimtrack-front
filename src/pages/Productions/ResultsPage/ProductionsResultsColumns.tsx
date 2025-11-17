import type { ColumnsType } from 'antd/es/table';
import { type ProduccionResponseDTO } from '../../../types/Productions.ts';
import dayjs from 'dayjs';
import { ProductionsTableActions } from './ProductionsTableActions.tsx';

interface ProductionsColumnsProps {
  onView?: (record: ProduccionResponseDTO) => void;
  onEdit?: (record: ProduccionResponseDTO) => void;
  onDelete?: (id: string) => void;
}

export const getProductionColumns = ({
  onView,
  onEdit,
  onDelete,
}: ProductionsColumnsProps): ColumnsType<ProduccionResponseDTO> => [
  {
    title: 'Código Producción',
    dataIndex: 'codigoProduccion',
    key: 'codigoProduccion',
    sorter: (a: ProduccionResponseDTO, b: ProduccionResponseDTO) =>
      a.codigoProduccion.localeCompare(b.codigoProduccion),
    responsive: ['xs', 'sm', 'md', 'lg', 'xl'],
  },
  {
    title: 'Lote',
    dataIndex: 'lote',
    key: 'lote',
    sorter: (a: ProduccionResponseDTO, b: ProduccionResponseDTO) => a.lote.localeCompare(b.lote),
    responsive: ['xs', 'sm', 'md', 'lg', 'xl'],
  },
  {
    title: 'Versión Receta',
    dataIndex: 'codigoVersion',
    key: 'codigoVersion',
    sorter: (a: ProduccionResponseDTO, b: ProduccionResponseDTO) =>
      a.codigoVersion.localeCompare(b.codigoVersion),
    responsive: ['xs', 'sm', 'md', 'lg', 'xl'],
  },
  {
    title: 'Encargado',
    dataIndex: 'encargado',
    key: 'encargado',
    sorter: (a: ProduccionResponseDTO, b: ProduccionResponseDTO) =>
      a.encargado.localeCompare(b.encargado),
    responsive: ['xs', 'sm', 'md', 'lg', 'xl'],
  },
  {
    title: 'Fecha Inicio',
    dataIndex: 'fechaInicio',
    key: 'fechaInicio',
    sorter: (a: ProduccionResponseDTO, b: ProduccionResponseDTO) =>
      new Date(a.fechaInicio).getTime() - new Date(b.fechaInicio).getTime(),
    render: (date: string) => dayjs(date).format('DD/MM/YYYY HH:mm'),
    responsive: ['xs', 'sm', 'md', 'lg', 'xl'],
  },
  {
    title: 'Fecha Fin',
    dataIndex: 'fechaFin',
    key: 'fechaFin',
    sorter: (a: ProduccionResponseDTO, b: ProduccionResponseDTO) => {
      if (!a.fechaFin && !b.fechaFin) return 0;
      if (!a.fechaFin) return -1;
      if (!b.fechaFin) return 1;
      return new Date(a.fechaFin).getTime() - new Date(b.fechaFin).getTime();
    },
    render: (date: string) => (date ? dayjs(date).format('DD/MM/YYYY HH:mm') : '-'),
    responsive: ['xs', 'sm', 'md', 'lg', 'xl'],
  },
  {
    title: 'Estado',
    dataIndex: 'estado',
    key: 'estado',
    sorter: (a: ProduccionResponseDTO, b: ProduccionResponseDTO) =>
      a.estado.localeCompare(b.estado),
    render: (estado: string) => (
      <span className={`status-badge status-${estado.toLowerCase()}`}>
        {estado === 'FINALIZADA' ? 'Finalizada' : 'En Proceso'}
      </span>
    ),
    responsive: ['xs', 'sm', 'md', 'lg', 'xl'],
  },
  {
    title: 'Acciones',
    key: 'actions',
    fixed: 'right',
    width: 150,
    responsive: ['xs', 'sm', 'md', 'lg', 'xl'],
    render: (_: unknown, record: ProduccionResponseDTO) => (
      <ProductionsTableActions
        record={record}
        onView={onView}
        onEdit={onEdit}
        onDelete={onDelete}
      />
    ),
  },
];

// Exportación por defecto para compatibilidad
export const productionColumns = getProductionColumns({});
