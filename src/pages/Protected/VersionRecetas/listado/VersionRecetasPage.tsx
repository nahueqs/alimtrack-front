import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {AppHeader} from '@/components/AppHeader/AppHeader.tsx';
import {Button} from '@/components/ui';
import {ArrowLeftIcon} from 'lucide-react';
import {CustomTable} from '@/components/ui/CustomTable';
import {getColumns} from './ListadoVersionRecetaColumnas.tsx';
import type {
    VersionRecetaMetadataResponseDTO, // Keep import from common types
} from '@/pages/common/DetalleProduccion/types/Productions.ts';
import type {
    VersionRecetaFilterRequestDTO, // Import from specific types
} from '@/pages/Protected/VersionRecetas/types/RecipeVersions.ts';
import {useVersionRecetaService} from '@/services/recetas/useVersionRecetaService.ts';
import {Col, DatePicker, Form, Input, message} from 'antd';
import type {TablePaginationConfig} from 'antd/es/table';
import {useIsMobile} from '@/hooks/useIsMobile.ts';

const {RangePicker} = DatePicker;


export const VersionRecetasPage: React.FC = () => {
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const fetchInitiated = useRef(false);
    const isMobile = useIsMobile();

    const {versiones: fetchedVersiones, loading, getAllVersiones} = useVersionRecetaService();
    const [activeFilters, setActiveFilters] = useState<VersionRecetaFilterRequestDTO>({});
    const [pagination, setPagination] = useState<TablePaginationConfig>({
        current: 1,
        pageSize: 10,
        total: 0,
    });

    useEffect(() => {
        if (!fetchInitiated.current) {
            fetchInitiated.current = true;
            getAllVersiones();
        }
    }, [getAllVersiones]);

    const sortedVersiones = useMemo(() => {
        if (!fetchedVersiones) return [];
        return [...fetchedVersiones].sort((a, b) => {
            // Compare dates in descending order
            return new Date(b.fechaCreacion).getTime() - new Date(a.fechaCreacion).getTime();
        });
    }, [fetchedVersiones]);

    useEffect(() => {
        setPagination(prev => ({...prev, total: sortedVersiones.length})); // Use sortedVersiones length
    }, [sortedVersiones]);

    const handleBackToDashboard = useCallback(() => navigate('/dashboard'), [navigate]);
    const handleView = useCallback((record: VersionRecetaMetadataResponseDTO) => navigate(`/recetas/ver/${record.codigoVersionReceta}`), [navigate]);
    const handleEdit = useCallback((record: VersionRecetaMetadataResponseDTO) => navigate(`/recetas/editar/${record.codigoVersionReceta}`), [navigate]);
    const handleDelete = useCallback((id: string) => {
        if (import.meta.env.DEV) console.log('Delete record with id:', id);
        message.info('Funcionalidad de eliminación pendiente.');
    }, []);
    const handleExport = useCallback((filters: any) => {
        if (import.meta.env.DEV) console.log('Exportar versiones con filtros:', filters);
        message.info('Funcionalidad de exportación pendiente.');
    }, []);
    const handleAdd = useCallback(() => navigate('/recetas/nueva'), [navigate]);

    const handleSearch = (values: any) => {
        const filters: VersionRecetaFilterRequestDTO = {
            codigoReceta: values.codigoReceta?.trim() || undefined,
            codigoVersionReceta: values.codigoVersionReceta?.trim() || undefined,
            ...(values.fechaRango && {
                fechaInicio: values.fechaRango[0]?.format('YYYY-MM-DD'),
                fechaFin: values.fechaRango[1]?.format('YYYY-MM-DD'),
            }),
        };
        Object.keys(filters).forEach(key => {
            if (filters[key as keyof VersionRecetaFilterRequestDTO] === undefined || filters[key as keyof VersionRecetaFilterRequestDTO] === '') {
                delete filters[key as keyof VersionRecetaFilterRequestDTO];
            }
        });
        setActiveFilters(filters);
        getAllVersiones();
        setPagination(prev => ({...prev, current: 1}));
    };

    const handleReset = () => {
        form.resetFields();
        setActiveFilters({});
        getAllVersiones();
        setPagination(prev => ({...prev, current: 1}));
    };

    const columns = getColumns({onView: handleView, onEdit: handleEdit, onDelete: handleDelete, isMobile});

    const filterContent = (
        <>
            <Col xs={24} sm={12} md={8} lg={6}>
                <Form.Item name="codigoReceta" label="Código de Receta">
                    <Input placeholder="Buscar por código de receta"/>
                </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8} lg={6}>
                <Form.Item name="codigoVersionReceta" label="Código de Versión">
                    <Input placeholder="Buscar por código de versión"/>
                </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8} lg={6}>
                <Form.Item name="fechaRango" label="Rango de Fechas">
                    <RangePicker style={{width: '100%'}}/>
                </Form.Item>
            </Col>
        </>
    );

    return (
        <div className="recipe-versions-page">
            <AppHeader title="AlimTrack"/>
            <div className="recipe-versions-page__content container">
                <div className="recipe-versions-page__header">
                    <Button icon={<ArrowLeftIcon/>} onClick={handleBackToDashboard} variant={'secondary'}>
                        Volver al Dashboard
                    </Button>
                </div>
                <div className="recipe-versions-page__body">
                    <CustomTable<VersionRecetaMetadataResponseDTO>
                        title="Versiones de Recetas"
                        onAdd={handleAdd}
                        onExport={handleExport ? () => handleExport(activeFilters) : undefined} // Conditional onExport
                        exportButton={!!handleExport} // Conditional exportButton
                        // exportButtonText="Exportar Versiones" // Removed for consistency

                        filterForm={form}
                        onFilterSearch={handleSearch}
                        onFilterReset={handleReset}
                        filterLoading={loading}
                        filterContent={filterContent}
                        dataSource={sortedVersiones} // Use sorted data

                        columns={columns}
                        loading={loading}
                        rowKey="codigoVersionReceta"
                        pagination={pagination}
                        onChange={setPagination}
                        scroll={{x: 'max-content'}}
                        className="recipe-versions-page__table"
                    />
                </div>
            </div>
        </div>
    );
};

export default VersionRecetasPage;
