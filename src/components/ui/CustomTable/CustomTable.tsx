import React, {useState} from 'react';
import type {TableProps} from 'antd';
import {Card, Table, Typography} from 'antd';
import {CustomTableHeaderActions} from './CustomTableHeaderActions.tsx';
import {CustomTableFilters} from './CustomTableFilters.tsx'; // Import CustomTableFilters
import './CustomTable.css';

const {Title} = Typography;

interface DataTableProps<T extends object> extends Omit<TableProps<T>, 'title'> {
    title?: string;
    onAdd?: () => void;
    onExport?: () => void;
    exportButton?: boolean;
    exportButtonText?: string;
    hideFilters?: boolean;

    // New props for integrated filters
    filterForm?: any;
    onFilterSearch?: (values: any) => void;
    onFilterReset?: () => void;
    filterLoading?: boolean;
    filterContent?: React.ReactNode; // The actual form fields for the filters
}

export const CustomTable = <T extends object>({
                                                  title,
                                                  onAdd,
                                                  onExport,
                                                  exportButton,
                                                  exportButtonText,
                                                  hideFilters = false,
                                                  filterForm,
                                                  onFilterSearch,
                                                  onFilterReset,
                                                  filterLoading = false,
                                                  filterContent,
                                                  ...tableProps
                                              }: DataTableProps<T>) => {
    const [filtersVisible, setFiltersVisible] = useState(!hideFilters);

    const toggleFilters = () => {
        setFiltersVisible(!filtersVisible);
    };

    return (
        <Card className="data-table-card">
            {title && (
                <div className="data-table-header">
                    <Title level={4} className="data-table-title">
                        {title}
                    </Title>
                    <CustomTableHeaderActions
                        onAdd={onAdd}
                        onExport={onExport}
                        exportButton={exportButton}
                        exportButtonText={exportButtonText}
                        onToggleFilters={toggleFilters}
                        filtersVisible={filtersVisible}
                        hideFilters={hideFilters}
                    />
                </div>
            )}

            {filterContent && filterForm && onFilterSearch && onFilterReset && (
                <div className={`data-table-filters-container ${filtersVisible ? 'visible' : ''}`}>
                    <CustomTableFilters
                        form={filterForm}
                        onSearch={onFilterSearch}
                        onReset={onFilterReset}
                        loading={filterLoading}
                    >
                        {filterContent}
                    </CustomTableFilters>
                </div>
            )}

            <div className="data-table-content">
                <Table {...tableProps} size="small"/>
            </div>
        </Card>
    );
};
