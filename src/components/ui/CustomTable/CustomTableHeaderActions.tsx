import React from 'react';
import {Button, Tooltip} from 'antd'; // Removed Space import
import {FileExcelOutlined, FilterOutlined, PlusOutlined} from '@ant-design/icons';
import './CustomTableHeaderActions.css';

interface DataTableHeaderActionsProps {
    onAdd?: () => void;
    onExport?: () => void;
    exportButton?: boolean;
    exportButtonText?: string;
    onToggleFilters: () => void;
    filtersVisible: boolean;
    hideFilters?: boolean;
}

export const CustomTableHeaderActions: React.FC<DataTableHeaderActionsProps> = ({
                                                                                    onAdd,
                                                                                    onExport,
                                                                                    exportButton,
                                                                                    exportButtonText = 'Exportar',
                                                                                    onToggleFilters,
                                                                                    filtersVisible,
                                                                                    hideFilters,
                                                                                }) => {
    return (
        <div className="datatable-header-actions"> {/* Changed from Space to div */}
            {!hideFilters && (
                <Tooltip title={filtersVisible ? 'Ocultar Filtros' : 'Mostrar Filtros'}>
                    <Button
                        icon={<FilterOutlined/>}
                        onClick={onToggleFilters}
                        type={filtersVisible ? 'primary' : 'default'}
                    />
                </Tooltip>
            )}
            {exportButton && onExport && (
                <Button icon={<FileExcelOutlined/>} onClick={onExport} className="responsive-button">
                    <span className="responsive-button-text">{exportButtonText}</span>
                </Button>
            )}
            {onAdd && (
                <Button type="primary" icon={<PlusOutlined/>} onClick={onAdd} className="responsive-button">
                    <span className="responsive-button-text">Añadir Nuevo</span>
                </Button>
            )}
        </div>
    );
};
