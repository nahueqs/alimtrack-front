import { useCallback } from 'react';
import { TipoDatoCampo } from '@/pages/Recetas/types/TipoDatoCampo';

export const useValidation = (tipoDato: TipoDatoCampo) => {
  const validate = useCallback((val: string): string | null => {
    if (!val) return null; // Permitir vacío (validación de requerido es externa)

    switch (tipoDato) {
      case TipoDatoCampo.ENTERO:
        // Permite negativos, pero no decimales
        if (!/^-?\d+$/.test(val)) {
          return 'Debe ser un número entero (sin decimales)';
        }
        break;
      case TipoDatoCampo.DECIMAL:
        // Permite negativos y decimales con punto
        if (!/^-?\d+(\.\d+)?$/.test(val)) {
          return 'Debe ser un número decimal válido (ej: 10.5)';
        }
        break;
      default:
        break;
    }
    return null;
  }, [tipoDato]);

  return { validate };
};
