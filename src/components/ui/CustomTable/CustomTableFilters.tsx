import React from 'react';
import {Button, Form, Row, Space} from 'antd';
import {ClearOutlined, SearchOutlined} from '@ant-design/icons';

interface CustomTableFiltersProps {
    children: React.ReactNode;
    onSearch: (values: any) => void;
    onReset: () => void;
    loading: boolean;
    form: any;
}

export const CustomTableFilters: React.FC<CustomTableFiltersProps> = ({
                                                                          children,
                                                                          onSearch,
                                                                          onReset,
                                                                          loading,
                                                                          form,
                                                                      }) => {
    return (
        <Form form={form} onFinish={onSearch} layout="vertical">
            <Row gutter={24}>{children}</Row>
            <Space style={{width: '100%', justifyContent: 'flex-end', marginTop: '16px'}}>
                <Button icon={<ClearOutlined/>} onClick={onReset} disabled={loading}>
                    Limpiar
                </Button>
                <Button type="primary" htmlType="submit" icon={<SearchOutlined/>} loading={loading}>
                    Buscar
                </Button>
            </Space>
        </Form>
    );
};
