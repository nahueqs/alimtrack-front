import type { MenuProps } from 'antd';
import { Button, Dropdown, Tooltip } from 'antd';
import { DeleteOutlined, EditOutlined, EllipsisOutlined, EyeOutlined } from '@ant-design/icons';
import './CustomTableRowActions.css'; // Su propio CSS

interface ResponsiveTableActionsProps<T> {
  record: T;
  onView?: (record: T) => void;
  onEdit?: (record: T) => void;
  onDelete?: (id: string) => void;
  // Prop para obtener el ID del registro, ya que 'id' puede no ser universal
  getRecordId: (record: T) => string;
  isMobile?: boolean; // Add isMobile prop
}

export const CustomTableRowActions = <T extends object>({
  record,
  onView,
  onEdit,
  onDelete,
  getRecordId,
  isMobile, // Destructure isMobile
}: ResponsiveTableActionsProps<T>) => {
  const recordId = getRecordId(record);

  const handleMenuClick = (e: { key: string }) => {
    if (e.key === 'view' && onView) onView(record);
    if (e.key === 'edit' && onEdit) onEdit(record);
    if (e.key === 'delete' && onDelete) onDelete(recordId);
  };

  const items: MenuProps['items'] = [
    onView && {
      label: 'Ver',
      key: 'view',
      icon: <EyeOutlined />,
    },
    onEdit && {
      label: 'Editar',
      key: 'edit',
      icon: <EditOutlined />,
    },
    onDelete && {
      label: 'Eliminar',
      key: 'delete',
      icon: <DeleteOutlined />,
      danger: true,
    },
  ].filter(Boolean) as MenuProps['items']; // Filtramos los elementos nulos

  // @ts-ignore
  return (
    <>
      {' '}
      {/* Use a fragment as the root element */}
      {/* Acciones para escritorio */}
      {!isMobile && ( // Show desktop actions only if not mobile
        <div className="responsive-table-actions__desktop">
          {onView && (
            <Tooltip title="Ver">
              <Button icon={<EyeOutlined />} onClick={() => onView(record)} />
            </Tooltip>
          )}
          {onEdit && (
            <Tooltip title="Editar">
              <Button icon={<EditOutlined />} onClick={() => onEdit(record)} />
            </Tooltip>
          )}
          {onDelete && (
            <Tooltip title="Eliminar">
              <Button icon={<DeleteOutlined />} danger onClick={() => onDelete(recordId)} />
            </Tooltip>
          )}
        </div>
      )}
      {/* Acciones para móvil (menú de 3 puntos) */}
      {isMobile &&
        items &&
        items.length > 0 && ( // Show mobile actions only if mobile and items exist
          <div className="responsive-table-actions__mobile">
            <Dropdown menu={{ items, onClick: handleMenuClick }} trigger={['click']}>
              <Button icon={<EllipsisOutlined />} />
            </Dropdown>
          </div>
        )}
    </>
  );
};
