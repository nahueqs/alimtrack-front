// src/hooks/useRecipeVersionsSimple.ts
import { useCallback, useEffect, useState } from 'react';
import versionRecetaService from './VersionRecetaService.ts';
import type {
  VersionRecetaFilterRequestDTO,
  VersionRecetaResponseDTO,
} from '../types/RecipeVersions.ts';
import ErrorHandlerService from './ErrorHandlerService.ts';

const errorHandler = ErrorHandlerService.getInstance();

interface UseRecipeVersionsReturn {
  loading: boolean;
  versions: VersionRecetaResponseDTO[];
  error: string | null;
  getVersiones: (filters?: VersionRecetaFilterRequestDTO) => Promise<void>;
  refetch: () => Promise<void>;
  hasError: boolean;
  isEmpty: boolean;
}

export const useVersionRecetaService = (
  initialFilters: VersionRecetaFilterRequestDTO = {
    codigoVersionReceta: null,
    codigoReceta: null,
    nombreVersionReceta: null,
  }
): UseRecipeVersionsReturn => {
  const [state, setState] = useState<{
    loading: boolean;
    versions: VersionRecetaResponseDTO[];
    error: string | null;
  }>({
    loading: true,
    versions: [],
    error: null,
  });

  const getVersiones = useCallback(
    async (filters: VersionRecetaFilterRequestDTO = {}) => {
      setState(prev => ({ ...prev, loading: true, error: null }));

      // Combinar filters con initialFilters (los filters tienen prioridad)
      const activeFilters: VersionRecetaFilterRequestDTO = {
        ...initialFilters,
        ...filters,
      };

      try {
        let result;

        // Lógica de fetching basada en los filtros
        if (activeFilters.codigoVersionReceta) {
          result = await versionRecetaService.getVersionByCode(activeFilters.codigoVersionReceta);
          setState(prev => ({
            ...prev,
            versions: result.data ? [result.data] : [],
            error: result.error?.message || null,
          }));
        } else if (activeFilters.codigoReceta) {
          result = await versionRecetaService.getVersionsByRecipe(activeFilters.codigoReceta);
          setState(prev => ({
            ...prev,
            versions: result.data || [],
            error: result.error?.message || null,
          }));
        } else {
          result = await versionRecetaService.getAllVersions();
          setState(prev => ({
            ...prev,
            versions: result.data || [],
            error: result.error?.message || null,
          }));
        }

        // Log para debugging en desarrollo
        if (result.error && process.env.NODE_ENV === 'development') {
          console.warn('Error en servicio:', result.error);
        }
      } catch (err) {
        const serviceError = errorHandler.handleError(err, 'useRecipeVersionsSimple');
        setState(prev => ({
          ...prev,
          error: serviceError.message,
          versions: [],
        }));
      } finally {
        setState(prev => ({ ...prev, loading: false }));
      }
    },
    [initialFilters]
  ); // Dependencia de initialFilters

  // Refetch con los mismos filters
  const refetch = useCallback(async () => {
    await getVersiones(initialFilters);
  }, [getVersiones, initialFilters]);

  // Efecto para carga inicial
  useEffect(() => {
    getVersiones(initialFilters);
  }, []);

  // Propiedades computadas
  const hasError = state.error !== null;
  const isEmpty = !state.loading && state.versions.length === 0 && !hasError;

  return {
    loading: state.loading,
    versions: state.versions,
    error: state.error,
    getVersiones: getVersiones,
    refetch,
    hasError,
    isEmpty,
  };
};
