// components/data/DataTableFilters.tsx
import React from 'react';
import { Button, Form, Space } from 'antd';
import { SearchOutlined } from '@ant-design/icons';

export interface DataTableFiltersProps {
  onSearch: (values: any) => void;
  onReset: () => void;
  loading?: boolean;
  initialValues?: any;
  children: React.ReactNode;
  layout?: 'inline' | 'vertical';
}

export const DataTableFilters: React.FC<DataTableFiltersProps> = ({
  onSearch,
  onReset,
  loading = false,
  initialValues = {},
  children,
  layout = 'inline',
}) => {
  const [form] = Form.useForm();

  React.useEffect(() => {
    if (Object.keys(initialValues).length > 0) {
      form.setFieldsValue(initialValues);
    }
  }, [initialValues, form]);

  const handleReset = () => {
    form.resetFields();
    onReset();
  };

  return (
    <div className="table-filters">
      <Form form={form} onFinish={onSearch} layout={layout} className="data-table-form">
        <div
          style={{
            display: layout === 'inline' ? 'grid' : 'block',
            gridTemplateColumns:
              layout === 'inline' ? 'repeat(auto-fill, minmax(200px, 1fr))' : 'none',
            gap: '16px',
            width: '100%',
          }}
        >
          {children}

          <Form.Item label=" " colon={false}>
            <Space>
              <Button
                type="primary"
                htmlType="submit"
                icon={<SearchOutlined />}
                loading={loading}
                className="search-button"
              >
                Buscar
              </Button>
              <Button onClick={handleReset} disabled={loading} className="reset-button">
                Limpiar
              </Button>
            </Space>
          </Form.Item>
        </div>
      </Form>
    </div>
  );
};
