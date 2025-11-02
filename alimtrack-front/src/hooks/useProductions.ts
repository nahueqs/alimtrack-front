import { useState, useEffect } from 'react';
import type {
  ProductionResponse,
  ProductionsResponse,
  ProductionFilterRequestDTO,
} from '../types/Productions';
import { productionService } from '../services/productionService';

interface UseProductionsReturn {
  productions: ProductionResponse[];
  loading: boolean;
  error: string | null;
  totalPaginas: number;
  totalRegistros: number;
  refreshProductions: (filters?: ProductionFilterRequestDTO) => Promise<void>;
}

export const useProductions = (
  initialFilters: ProductionFilterRequestDTO = {}
): UseProductionsReturn => {
  const [productions, setProductions] = useState<ProductionResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const [totalRegistros, setTotalRegistros] = useState(0);
  const [filters, setFilters] = useState<ProductionFilterRequestDTO>(initialFilters);

  const refreshProductions = async (newFilters?: ProductionFilterRequestDTO) => {
    if (newFilters) {
      setFilters(newFilters);
    }

    setLoading(true);
    setError(null);

    try {
      const currentFilters = newFilters || filters;
      const response: ProductionsResponse = await productionService.getProductions(currentFilters);

      setProductions(response.producciones);
      setTotalPaginas(response.totalPaginas);
      setTotalRegistros(response.total);
    } catch (err: any) {
      setError(err.message || 'Error al cargar las producciones');
      console.error('Error cargando producciones:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshProductions();
  }, []); // Solo se ejecuta una vez al montar

  return {
    productions,
    loading,
    error,
    totalPaginas,
    totalRegistros,
    refreshProductions,
  };
};
