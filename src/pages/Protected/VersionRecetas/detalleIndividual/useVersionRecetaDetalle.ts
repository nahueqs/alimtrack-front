import {useEffect, useState} from 'react';
import {versionRecetaService} from '../../../../services/recetas/VersionRecetaService.ts';
import type {VersionRecetaResponseDTO} from '../types/RecipeVersions.ts';

export const useVersionRecetaDetalle = (id: string | undefined) => {
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

            setLoading(true);
            setError(null);

            try {
                const data = await versionRecetaService.getRecipeVersionById(id);
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

    return {recipe, loading, error};
};
