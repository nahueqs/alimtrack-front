// hooks/useDataTable.ts
import { useCallback, useRef, useState } from 'react';
import type { TablePaginationConfig } from 'antd';

export interface UseDataTableProps<T> {
  initialFilters?: any;
  fetchFunction: (filters: any) => Promise<{ data: T[]; total?: number }>;
}

export const useDataTable = <T>({ initialFilters = {}, fetchFunction }: UseDataTableProps<T>) => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<T[]>([]);
  const [pagination, setPagination] = useState<TablePaginationConfig>({
    current: 1,
    pageSize: 10,
    total: 0,
    showSizeChanger: true,
    pageSizeOptions: ['10', '20', '50', '100'],
  });

  const filtersRef = useRef(initialFilters);

  const fetchData = useCallback(
    async (newFilters?: any, paginationConfig?: TablePaginationConfig) => {
      setLoading(true);
      try {
        if (newFilters) {
          filtersRef.current = newFilters;
        }

        const mergedFilters = {
          ...filtersRef.current,
          page: paginationConfig?.current || pagination.current,
          pageSize: paginationConfig?.pageSize || pagination.pageSize,
        };

        const result = await fetchFunction(mergedFilters);

        setData(result.data);
        setPagination(prev => ({
          ...prev,
          ...paginationConfig,
          total: result.total || result.data.length,
        }));
      } catch (error) {
        console.error('Error fetching data:', error);
        setData([]);
      } finally {
        setLoading(false);
      }
    },
    [fetchFunction, pagination.current, pagination.pageSize]
  );

  const handleSearch = useCallback(
    async (values: any) => {
      await fetchData(values, { current: 1 });
    },
    [fetchData]
  );

  const handleReset = useCallback(() => {
    fetchData(initialFilters, { current: 1 });
  }, [fetchData, initialFilters]);

  const handleTableChange = useCallback(
    (newPagination: TablePaginationConfig) => {
      fetchData(undefined, newPagination);
    },
    [fetchData]
  );

  return {
    loading,
    data,
    pagination,
    setPagination,
    fetchData,
    handleSearch,
    handleReset,
    handleTableChange,
  };
};
