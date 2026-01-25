import React from 'react';
import { Button, Col, Form, Input, Row, Select } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import type { ProduccionFilterRequestDTO } from '@/types/production';
import { PRODUCTION_STATE_LABELS, ProductionState } from '@/constants/ProductionStates';

const { Option } = Select;

interface ProduccionFiltersProps {
  onFilterChange: (filters: ProduccionFilterRequestDTO) => void;
  initialFilters?: ProduccionFilterRequestDTO;
}

export const ProduccionFilters: React.FC<ProduccionFiltersProps> = ({
  onFilterChange,
  initialFilters = {},
}) => {
  const [form] = Form.useForm();

  const handleFinish = (values: any) => {
    onFilterChange(values);
  };

  const handleReset = () => {
    form.resetFields();
    onFilterChange({});
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleFinish}
      initialValues={initialFilters}
      style={{ marginBottom: '24px', background: '#fff', padding: '24px', borderRadius: '8px' }}
    >
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} md={6}>
          <Form.Item name="codigoProduccion" label="Código Producción">
            <Input placeholder="Buscar por código" />
          </Form.Item>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Form.Item name="lote" label="Lote">
            <Input placeholder="Buscar por lote" />
          </Form.Item>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Form.Item name="estado" label="Estado">
            <Select placeholder="Todos" allowClear>
              {Object.values(ProductionState).map((state) => (
                <Option key={state} value={state}>
                  {PRODUCTION_STATE_LABELS[state]}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Form.Item label=" " style={{ marginBottom: 0 }}>
            <div style={{ display: 'flex', gap: '8px' }}>
              <Button type="primary" htmlType="submit" icon={<SearchOutlined />}>
                Buscar
              </Button>
              <Button onClick={handleReset}>Limpiar</Button>
            </div>
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
};
