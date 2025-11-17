import React from 'react';
import { DeleteOutlined, EditOutlined, EyeOutlined } from '@ant-design/icons';
import { type TableAction, TableActions } from '../../../components/ui/Table/TableActions';
import type { VersionRecetaResponseDTO } from '../../../types/RecipeVersions.ts';

interface RecipeVersionsResultActionsProps {
  onView: (record: VersionRecetaResponseDTO) => void;
  onEdit: (record: VersionRecetaResponseDTO) => void;
  onDelete: (id: string) => void;
  record: VersionRecetaResponseDTO;
}

export const RecipeVersionsResultActions: React.FC<RecipeVersionsResultActionsProps> = ({
  onView,
  onEdit,
  onDelete,
  record,
}) => {
  const actions: TableAction[] = [
    {
      key: 'view',
      label: 'Ver',
      icon: <EyeOutlined />,
      onClick: () => onView(record),
    },
    {
      key: 'edit',
      label: 'Editar',
      icon: <EditOutlined />,
      onClick: () => onEdit(record),
    },
    {
      key: 'delete',
      label: 'Eliminar',
      icon: <DeleteOutlined />,
      danger: true,
      onClick: () => onDelete(record.codigoVersionReceta),
    },
  ];

  return <TableActions record={record} actions={actions} responsive={true} />;
};

export default RecipeVersionsResultActions;
