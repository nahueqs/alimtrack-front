2; // components/ui/TableActions/TableActions.tsx
import React from 'react';
import { Button, Dropdown, Space } from 'antd';
import { MoreOutlined } from '@ant-design/icons';

export interface TableAction {
  key: string;
  label: string;
  icon?: React.ReactNode;
  danger?: boolean;
  disabled?: boolean;
  onClick: (record: any) => void;
}

export interface TableActionsProps {
  record: any;
  actions: TableAction[];
  mode?: 'dropdown' | 'inline';
}

export const TableActions: React.FC<TableActionsProps> = ({
  record,
  actions,
  mode = 'dropdown',
}) => {
  if (mode === 'inline') {
    return (
      <Space size="small">
        {actions.map(action => (
          <Button
            key={action.key}
            type={action.danger ? 'default' : 'link'}
            danger={action.danger}
            icon={action.icon}
            onClick={() => action.onClick(record)}
            disabled={action.disabled}
            size="small"
          >
            {action.label}
          </Button>
        ))}
      </Space>
    );
  }

  const menuItems = actions.map(action => ({
    key: action.key,
    label: action.label,
    icon: action.icon,
    danger: action.danger,
    disabled: action.disabled,
    onClick: () => action.onClick(record),
  }));

  return (
    <Dropdown menu={{ items: menuItems }} trigger={['click']}>
      <Button type="text" icon={<MoreOutlined />} size="small" />
    </Dropdown>
  );
};
