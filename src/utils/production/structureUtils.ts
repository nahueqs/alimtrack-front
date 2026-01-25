import type { EstructuraProduccionDTO } from '@/types/production';

export interface ItemDetails {
  sectionTitle?: string;
  itemTitle?: string;
  itemType?: 'Campo Simple' | 'Campo Agrupado' | 'Tabla';
  groupTitle?: string;
}

/**
 * Busca un campo o tabla en la estructura de la producción y devuelve sus detalles (título, sección, etc.)
 */
export const findItemInStructure = (
  estructura: EstructuraProduccionDTO | null,
  id: number,
  type: 'campo' | 'tabla'
): ItemDetails => {
  if (!estructura) {
    return {};
  }

  for (const seccion of estructura.estructura) {
    if (type === 'campo') {
      const campoDirecto = seccion.camposSimples.find((campo) => campo.id === id);
      if (campoDirecto) {
        return {
          sectionTitle: seccion.titulo,
          itemTitle: campoDirecto.nombre,
          itemType: 'Campo Simple',
        };
      }

      for (const grupo of seccion.gruposCampos || []) {
        const campoEnGrupo = grupo.campos.find((campo) => campo.id === id);
        if (campoEnGrupo) {
          return {
            sectionTitle: seccion.titulo,
            itemTitle: campoEnGrupo.nombre,
            itemType: 'Campo Agrupado',
            groupTitle: grupo.subtitulo,
          };
        }
      }
    }

    if (type === 'tabla') {
      const tabla = seccion.tablas.find((t) => t.id === id);
      if (tabla) {
        return {
          sectionTitle: seccion.titulo,
          itemTitle: tabla.nombre,
          itemType: 'Tabla',
        };
      }
    }
  }
  return {};
};
