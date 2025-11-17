import { Button, DatePicker, Form, Input, Space } from 'antd';
import React from 'react';
import { SearchOutlined } from '@ant-design/icons';

import type { VersionRecetaFilterRequestDTO } from '../../../types/RecipeVersions.ts';

const { RangePicker } = DatePicker;

interface TableHeaderProps {
  onSearch: (values: any) => void;
  onReset: () => void;
  loading?: boolean;
  initialValues?: VersionRecetaFilterRequestDTO;
}

const RecipeVersionsTableFilters: React.FC<TableHeaderProps> = ({
  onSearch,
  onReset,
  loading = false,
  initialValues = {},
}) => {
  const [form] = Form.useForm();

  // Apply initial values to form
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
    <div className="table-header">
      <Form
        form={form}
        onFinish={onSearch}
        layout="inline"
        className="recipeVersions-table-form"
        style={{
          backgroundColor: 'var(--background-color)',
          color: 'var(--text-color)',
          marginBottom: 24,
        }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
            gap: '16px',
            width: '100%',
          }}
        >
          <Form.Item name="codigoReceta" label="Código de receta">
            <Input placeholder="Ej: REC-001" />
          </Form.Item>

          <Form.Item name="codigoVersionReceta" label="Código versión Receta">
            <Input placeholder="Ej: REC-V1-2024" />
          </Form.Item>

          <Form.Item name="fechaRango" label="Rango de fecha de creación">
            <RangePicker style={{ width: '100%' }} format="DD/MM/YYYY" />
          </Form.Item>

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

export default RecipeVersionsTableFilters;
