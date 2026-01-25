import { useCallback, useState } from 'react';
import { versionRecetaService } from './VersionRecetaService';
import type {
  EstructuraProduccionDTO,
  VersionRecetaMetadataResponseDTO,
} from '@/types/production';

interface UseVersionRecetaReturn {
  loading: boolean;
  error: string | null;
  versiones: VersionRecetaMetadataResponseDTO[];
  version: VersionRecetaMetadataResponseDTO | null;
  estructura: EstructuraProduccionDTO | null;
  getAllVersiones: () => Promise<void>;
  getByCodigoVersion: (codigoVersion: string) => Promise<void>;
  getEstructuraCompleta: (codigoVersion: string) => Promise<void>;
}

export const useVersionRecetaService = (): UseVersionRecetaReturn => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [versiones, setVersiones] = useState<VersionRecetaMetadataResponseDTO[]>([]);
  const [version, setVersion] = useState<VersionRecetaMetadataResponseDTO | null>(null);
  const [estructura, setEstructura] = useState<EstructuraProduccionDTO | null>(null);

  const getAllVersiones = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await versionRecetaService.getAllVersiones();
      setVersiones(response);
    } catch (err: any) {
      setError(err.message || 'Error al obtener las versiones de recetas.');
      setVersiones([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const getByCodigoVersion = useCallback(async (codigoVersion: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await versionRecetaService.getByCodigoVersion(codigoVersion);
      setVersion(response);
    } catch (err: any) {
      setError(err.message || `Error al obtener la versión ${codigoVersion}.`);
      setVersion(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const getEstructuraCompleta = useCallback(async (codigoVersion: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await versionRecetaService.getEstructuraCompleta(codigoVersion);
      setEstructura(response);
    } catch (err: any) {
      setError(err.message || 'Error al obtener la estructura de la receta.');
      setEstructura(null);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    versiones,
    version,
    estructura,
    getAllVersiones,
    getByCodigoVersion,
    getEstructuraCompleta,
  };
};
