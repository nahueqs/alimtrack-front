import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {Col, DatePicker, Form, Input, message, Select} from 'antd';
import type {TablePaginationConfig} from 'antd/es/table';
import type {
    ProduccionFilterRequestDTO,
    ProduccionProtectedResponseDTO
} from '@/pages/common/DetalleProduccion/types/Productions';
import {useProduccionService} from '@/services/producciones/useProduccionService.ts';
import {CustomTable} from '@/components/ui/CustomTable';
import {getProductionColumns} from './ProduccionesColumns.tsx';
import {getProductionColumnsActivas} from './ProduccionesColumnsActivas.tsx';
import {useNavigate} from 'react-router-dom';
import {AppHeader} from '@/components/AppHeader/AppHeader.tsx';
import {Button} from '@/components/ui';
import {ArrowLeftIcon} from 'lucide-react';
import {useIsMobile} from '@/hooks/useIsMobile.ts';
import './ProduccionesPage.css';

const {RangePicker} = DatePicker;
const {Option} = Select;

interface ProduccionTableProps {
    initialFilters?: ProduccionFilterRequestDTO;
    showHeader?: boolean;
    hideFilters?: boolean;
    onAdd?: () => void;
    onExport?: (filters: ProduccionFilterRequestDTO) => void;
}

const defaultFilters: ProduccionFilterRequestDTO = {}; // Removed sort from defaultFilters

const ProductionsResultPage: React.FC<ProduccionTableProps> = ({
                                                                   initialFilters = defaultFilters,
                                                                   showHeader = true,
                                                                   hideFilters = false,
                                                                   onAdd,
                                                                   onExport,
                                                               }) => {
    const navigate = useNavigate();
    const {producciones: fetchedProducciones, loading, getProducciones, getProduccionByCodigo} = useProduccionService();
    const [pagination, setPagination] = useState<TablePaginationConfig>({current: 1, pageSize: 10, total: 0});
    const [form] = Form.useForm();
    const isMobile = useIsMobile();

    const handleView = useCallback((record: ProduccionProtectedResponseDTO) => navigate(`/producciones/ver/${record.codigoProduccion}`), [navigate]);
    const handleEdit = useCallback((record: ProduccionProtectedResponseDTO) => navigate(`/producciones/editar/${record.codigoProduccion}`), [navigate]);
    const handleDelete = useCallback((id: string) => {
        if (import.meta.env.DEV) console.log('Delete record with id:', id);
        message.info('Funcionalidad de eliminación pendiente.');
    }, []);

    const sortedProducciones = useMemo(() => {
        if (!fetchedProducciones) return [];
        return [...fetchedProducciones].sort((a, b) => {
            // Handle nulls: nulls come last for descending order
            if (!a.fechaFin && !b.fechaFin) return 0;
            if (!a.fechaFin) return 1; // b has a date, a doesn't, so a comes after b
            if (!b.fechaFin) return -1; // a has a date, b doesn't, so a comes before b

            // Compare dates in descending order
            return new Date(b.fechaFin).getTime() - new Date(a.fechaFin).getTime();
        });
    }, [fetchedProducciones]);

    const columns = useMemo(() => {
        if (initialFilters.estado === 'EN_PROCESO') {
            return getProductionColumnsActivas({
                onView: handleView,
                onEdit: handleEdit,
                onDelete: handleDelete,
                isMobile
            });
        }
        return getProductionColumns({onView: handleView, onEdit: handleEdit, onDelete: handleDelete, isMobile});
    }, [initialFilters.estado, handleView, handleEdit, handleDelete, isMobile]);

    const stableInitialFilters = useMemo(() => JSON.stringify(initialFilters), [initialFilters]);

    useEffect(() => {
        const filters = JSON.parse(stableInitialFilters);
        getProducciones(filters);
        form.setFieldsValue(filters);
    }, [getProducciones, stableInitialFilters, form]);

    useEffect(() => {
        setPagination(prev => ({...prev, total: sortedProducciones.length})); // Use sortedProducciones length
    }, [sortedProducciones]);

    const handleSearch = (formValues: any) => {
        const code = formValues.codigoProduccion?.trim();

        if (code) {
            getProduccionByCodigo(code);
        } else {
            const filters: ProduccionFilterRequestDTO = {
                codigoVersionReceta: formValues.codigoVersionReceta?.trim(),
                lote: formValues.lote?.trim(),
                encargado: formValues.encargado?.trim(),
                estado: formValues.estado,
                ...(formValues.fechaRango && {
                    fechaInicio: formValues.fechaRango[0]?.format('YYYY-MM-DD'),
                    fechaFin: formValues.fechaRango[1]?.format('YYYY-MM-DD'),
                }),
            };

            Object.keys(filters).forEach(key => {
                if (filters[key as keyof ProduccionFilterRequestDTO] === undefined || filters[key as keyof ProduccionFilterRequestDTO] === '') {
                    delete filters[key as keyof ProduccionFilterRequestDTO];
                }
            });
            getProducciones(filters);
        }
        setPagination(prev => ({...prev, current: 1}));
    };

    const handleReset = () => {
        form.resetFields();
        getProducciones(defaultFilters);
        setPagination(prev => ({...prev, current: 1}));
    };

    const handleExportClick = () => {
        if (onExport) {
            onExport(form.getFieldsValue());
        }
    };

    const codigoProduccionValue = Form.useWatch('codigoProduccion', form);
    const isCodeSearch = !!codigoProduccionValue;

    const filterContent = (
        <>
            <Col xs={24} sm={12} md={8} lg={6}>
                <Form.Item name="codigoProduccion" label="Código de producción">
                    <Input placeholder="Ej: PROD-001" allowClear/>
                </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8} lg={6}>
                <Form.Item name="codigoVersionReceta" label="Versión Receta">
                    <Input placeholder="Ej: REC-V1-2024" disabled={isCodeSearch}/>
                </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8} lg={6}>
                <Form.Item name="lote" label="N° Lote">
                    <Input placeholder="Ej: LOTE-2024-001" disabled={isCodeSearch}/>
                </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8} lg={6}>
                <Form.Item name="encargado" label="Encargado">
                    <Input placeholder="Nombre del encargado" disabled={isCodeSearch}/>
                </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8} lg={6}>
                <Form.Item name="estado" label="Estado">
                    <Select placeholder="Seleccione estado" allowClear disabled={isCodeSearch}>
                        <Option value="EN_PROCESO">En Proceso</Option>
                        <Option value="FINALIZADA">Finalizada</Option>
                    </Select>
                </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8} lg={6}>
                <Form.Item name="fechaRango" label="Rango de Fechas">
                    <RangePicker style={{width: '100%'}} format="DD/MM/YYYY" disabled={isCodeSearch}/>
                </Form.Item>
            </Col>
        </>
    );

    const handleBackToDashboard = () => {
        navigate('/dashboard');
    };

    return (
        <div className="productions-page">
            <AppHeader title="AlimTrack"/>
            <div className="productions-page__content container">
                <div className="productions-page__header">
                    <Button icon={<ArrowLeftIcon/>} onClick={handleBackToDashboard} variant={'secondary'}>
                        Volver al Dashboard
                    </Button>
                </div>
                <div className="productions-page__body">
                    <CustomTable<ProduccionProtectedResponseDTO>
                        title={showHeader ? 'Listado de Producciones' : undefined}
                        onAdd={onAdd}
                        onExport={onExport ? handleExportClick : undefined}
                        exportButton={!!onExport}

                        filterForm={form}
                        onFilterSearch={handleSearch}
                        onFilterReset={handleReset}
                        filterLoading={loading}
                        filterContent={filterContent}
                        hideFilters={hideFilters}

                        dataSource={sortedProducciones} // Use sorted data
                        columns={columns}
                        loading={loading}
                        rowKey="codigoProduccion"
                        pagination={pagination}
                        onChange={setPagination}
                        scroll={{x: 'max-content'}}
                        className="productions-page__table"
                    />
                </div>
            </div>
        </div>
    );
};

export default ProductionsResultPage;
