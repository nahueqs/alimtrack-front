// src/hooks/useRecipeDetail.ts
import { useEffect, useState } from 'react';
import type { VersionRecetaResponseDTO } from '../types/Recipes';
import recipeVersionsService from '../services/versionRecetaService';

export const useRecipeDetail = (id: string | undefined) => {
  const [recipe, setRecipe] = useState<VersionRecetaResponseDTO | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecipe = async () => {
      if (!id) {
        setError('ID de receta no proporcionado');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const { data, error: serviceError } = await recipeVersionsService.getRecipeVersionById(id);

        if (serviceError) {
          setError(serviceError.message);
          return;
        }

        if (data) {
          setRecipe(data);
        } else {
          setError('Receta no encontrada');
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Error al cargar la receta';
        setError(errorMessage);
        console.error('Error fetching recipe:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipe();
  }, [id]);

  return { recipe, loading, error };
};
