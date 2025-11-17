// File: `src/hooks/useProduccionService.ts`
import { useCallback, useState } from 'react';
import { productionService } from './ProduccionService.ts';
import type { ProduccionFilterRequestDTO, ProduccionResponseDTO } from '../types/Productions';
import type { ServiceResult } from './ErrorHandlerService.ts';

interface UseProductionReturn {
  loading: boolean;
  productionData: ProduccionResponseDTO;
  error: string | null;
  fetchProductions: (filters?: ProduccionFilterRequestDTO) => Promise<void>;
  fetchProductionByCode: (codigoProduccion: string) => Promise<void>;
  createProduction: (data: any) => Promise<ServiceResult<ProduccionResponseDTO>>;
  updateProduction: (codigo: string, data: any) => Promise<ServiceResult<ProduccionResponseDTO>>;
  deleteProduction: (codigo: string) => Promise<ServiceResult<void>>;
  hasError: boolean;
  isEmpty: boolean;
}

export const useProduccionService = (): UseProductionReturn => {
  const [state, setState] = useState<{
    loading: boolean;
    productionData: ProduccionResponseDTO;
    error: string | null;
  }>({
    loading: false,
    productionData: { producciones: [] },
    error: null,
  });

  const fetchProductions = useCallback(async (filters: ProduccionFilterRequestDTO = {}) => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const result = await productionService.getProducciones(filters);

      setState({
        loading: false,
        productionData: result.data,
        error: result.error?.message || null,
      });
    } catch (err) {
      setState({
        loading: false,
        productionData: { producciones: [] },
        error: 'Error inesperado al cargar producciones',
      });
    }
  }, []);

  const fetchProductionByCode = useCallback(async (codigoProduccion: string) => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const result = await productionService.getProduccionByCodigo(codigoProduccion);

      setState({
        loading: false,
        productionData: result.data,
        error: result.error?.message || null,
      });
    } catch (err) {
      setState({
        loading: false,
        productionData: { producciones: [] },
        error: 'Error inesperado al cargar la producción',
      });
    }
  }, []);

  const createProduction = useCallback(async (data: any) => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const result = await productionService.createProduction(data);

      setState(prev => ({
        ...prev,
        loading: false,
        error: result.error?.message || null,
      }));

      return result;
    } catch (err) {
      const errorResult: ServiceResult<ProduccionResponseDTO> = {
        data: { producciones: [] },
        error: { message: 'Error inesperado al crear producción', timestamp: new Date() },
        success: false,
      };

      setState(prev => ({
        ...prev,
        loading: false,
        error: 'Error inesperado al crear producción',
      }));

      return errorResult;
    }
  }, []);

  const updateProduction = useCallback(async (codigo: string, data: any) => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const result = await productionService.updateProduction(codigo, data);

      setState(prev => ({
        ...prev,
        loading: false,
        error: result.error?.message || null,
      }));

      return result;
    } catch (err) {
      const errorResult: ServiceResult<ProduccionResponseDTO> = {
        data: { producciones: [] },
        error: { message: 'Error inesperado al actualizar producción', timestamp: new Date() },
        success: false,
      };

      setState(prev => ({
        ...prev,
        loading: false,
        error: 'Error inesperado al actualizar producción',
      }));

      return errorResult;
    }
  }, []);

  const deleteProduction = useCallback(async (codigo: string) => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const result = await productionService.deleteProduction(codigo);

      setState(prev => ({
        ...prev,
        loading: false,
        error: result.error?.message || null,
      }));

      return result;
    } catch (err) {
      const errorResult: ServiceResult<void> = {
        data: undefined,
        error: { message: 'Error inesperado al eliminar producción', timestamp: new Date() },
        success: false,
      };

      setState(prev => ({
        ...prev,
        loading: false,
        error: 'Error inesperado al eliminar producción',
      }));

      return errorResult;
    }
  }, []);

  const hasError = state.error !== null;
  const isEmpty = !state.loading && state.productionData.producciones.length === 0 && !hasError;

  return {
    loading: state.loading,
    productionData: state.productionData,
    error: state.error,
    fetchProductions,
    fetchProductionByCode,
    createProduction,
    updateProduction,
    deleteProduction,
    hasError,
    isEmpty,
  };
};
