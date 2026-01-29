import { useLayoutEffect } from 'react';

/**
 * Hook para actualizar el título de la pestaña del navegador.
 * Usa useLayoutEffect para actualizar el título lo antes posible al montar el componente.
 * @param title El título específico de la página.
 * @param suffix El sufijo de la aplicación (por defecto "AlimTrack").
 */
export const usePageTitle = (title: string, suffix: string = 'AlimTrack') => {
  useLayoutEffect(() => {
    document.title = `${title} | ${suffix}`;
  }, [title, suffix]);
};
