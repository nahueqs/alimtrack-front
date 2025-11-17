import type { ColumnsType } from 'antd/es/table';
import { RecipeVersionsResultActions } from './RecipeVersionsResultActions.tsx';
import type { VersionRecetaResponseDTO } from '../../../types/RecipeVersions.ts';

interface GetColumnsProps {
  onView: (record: VersionRecetaResponseDTO) => void;
  onEdit: (record: VersionRecetaResponseDTO) => void;
  onDelete: (id: string) => void;
}

const formatDate = (dateString?: string | null): string => {
  if (!dateString) return 'Sin fecha';
  try {
    return new Date(dateString).toLocaleString('es-AR');
  } catch (error) {
    console.error('Error formateando fecha:', error);
    return 'Fecha inválida';
  }
};

export const getColumns = ({
  onView,
  onEdit,
  onDelete,
}: GetColumnsProps): ColumnsType<VersionRecetaResponseDTO> => [
  {
    title: 'Código Receta Padre',
    dataIndex: 'codigoRecetaPadre',
    key: 'codigoRecetaPadre',
    render: (text: string | undefined) => text || '-',
    responsive: ['xs', 'sm', 'md', 'lg', 'xl'],
  },
  {
    title: 'Código Versión',
    dataIndex: 'codigoVersionReceta',
    key: 'codigoVersionReceta',
    render: (text: string | undefined) => text || '-',
    responsive: ['xs', 'sm', 'md', 'lg', 'xl'],
  },
  {
    title: 'Nombre Receta',
    dataIndex: 'nombre',
    key: 'nombre',
    render: (text: string | undefined) => text || '-',
    responsive: ['xs', 'sm', 'md', 'lg', 'xl'],
  },
  {
    title: 'Descripción',
    dataIndex: 'descripcion',
    key: 'descripcion',
    render: (text: string | undefined) => text || '-',
    responsive: ['xs', 'sm', 'md', 'lg', 'xl'],
  },
  {
    title: 'Creado por',
    dataIndex: 'creadaPor',
    key: 'creadaPor',
    render: (text: string | undefined) => text || '-',
    responsive: ['xs', 'sm', 'md', 'lg', 'xl'],
  },
  {
    title: 'Fecha de Creación',
    dataIndex: 'fechaCreacion',
    key: 'fechaCreacion',
    render: (date: string | undefined) => formatDate(date),
    responsive: ['xs', 'sm', 'md', 'lg', 'xl'],
  },
  {
    title: 'Acciones',
    key: 'actions',
    fixed: 'right',
    width: 150,
    responsive: ['xs', 'sm', 'md', 'lg', 'xl'],
    render: (_: unknown, record: VersionRecetaResponseDTO) => (
      <RecipeVersionsResultActions
        record={record}
        onView={onView}
        onEdit={onEdit}
        onDelete={onDelete}
      />
    ),
  },
];
