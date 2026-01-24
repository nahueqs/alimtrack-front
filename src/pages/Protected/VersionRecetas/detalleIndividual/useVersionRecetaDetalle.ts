import { useEffect, useState } from 'react';
import { versionRecetaService } from '../../../../services/recetas/VersionRecetaService.ts';
import type { VersionRecetaMetadataResponseDTO } from '@/pages/common/DetalleProduccion/types/Productions.ts';

export const useVersionRecetaDetalle = (id: string | undefined) => {
  const [recipe, setRecipe] = useState<VersionRecetaMetadataResponseDTO | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecipe = async () => {
      if (!id) {
        setError('ID de receta no proporcionado');
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const data = await versionRecetaService.getByCodigoVersion(id);
        setRecipe(data);
      } catch (err: any) {
        setError(err.message || 'Error al cargar la receta');
        setRecipe(null); // Asegurarse de que no haya datos de recetas anteriores
      } finally {
        setLoading(false);
      }
    };

    fetchRecipe();
  }, [id]);

  return { recipe, loading, error };
};
