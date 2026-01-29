import { useEffect } from 'react';

/**
 * Hook para actualizar el título de la pestaña del navegador.
 * @param title El título específico de la página.
 * @param suffix El sufijo de la aplicación (por defecto "AlimTrack").
 */
export const usePageTitle = (title: string, suffix: string = 'AlimTrack') => {
  useEffect(() => {
    document.title = `${title} | ${suffix}`;
  }, [title, suffix]);
};
