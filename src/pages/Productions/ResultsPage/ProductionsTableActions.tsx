import React from 'react';
import { DeleteOutlined, EditOutlined, EyeOutlined } from '@ant-design/icons';
import { type TableAction, TableActions } from '../../../components/ui/Table/TableActions';
import type { ProduccionResponseDTO } from '../../../types/Productions.ts';

interface ProductionsTableActionsProps {
  record: ProduccionResponseDTO;
  onView?: (record: ProduccionResponseDTO) => void;
  onEdit?: (record: ProduccionResponseDTO) => void;
  onDelete?: (id: string) => void;
}

export const ProductionsTableActions: React.FC<ProductionsTableActionsProps> = ({
  record,
  onView,
  onEdit,
  onDelete,
}) => {
  const actions: TableAction[] = [
    {
      key: 'view',
      label: 'Ver',
      icon: <EyeOutlined />,
      onClick: () => onView?.(record),
    },
    {
      key: 'edit',
      label: 'Editar',
      icon: <EditOutlined />,
      onClick: () => onEdit?.(record),
    },
    {
      key: 'delete',
      label: 'Eliminar',
      icon: <DeleteOutlined />,
      danger: true,
      onClick: () => onDelete?.(record.codigoProduccion),
    },
  ];

  return <TableActions record={record} actions={actions} responsive={true} />;
};
