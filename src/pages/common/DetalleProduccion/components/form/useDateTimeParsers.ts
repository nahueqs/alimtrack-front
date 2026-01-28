import { useCallback } from 'react';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { TipoDatoCampo } from '@/pages/Recetas/types/TipoDatoCampo';

dayjs.extend(customParseFormat);

export const useDateTimeParsers = (tipoDato: TipoDatoCampo) => {
  const parseDate = useCallback((val: string) => {
    if (!val) return null;
    // Intentar parsear formato DD/MM/YYYY (formato visual)
    let d = dayjs(val, 'DD/MM/YYYY', true);
    if (d.isValid()) return d;
    
    // Intentar parsear formato ISO YYYY-MM-DD (formato backend)
    d = dayjs(val); 
    if (d.isValid()) return d;
    
    return null;
  }, []);

  const parseTime = useCallback((val: string) => {
    if (!val) return null;
    // Parseo estricto con el formato esperado
    const d = dayjs(val, 'HH:mm:ss', true);
    return d.isValid() ? d : null;
  }, []);

  const formatForBackend = useCallback((val: string): string => {
    if (!val) return '';

    if (tipoDato === TipoDatoCampo.FECHA) {
      const d = dayjs(val, 'DD/MM/YYYY');
      if (d.isValid()) {
        return d.format('YYYY-MM-DDTHH:mm:ss');
      }
    }
    // Para HORA, ya viene en formato HH:mm:ss del componente, no necesita cambio
    // Para otros tipos, se devuelve tal cual
    return val;
  }, [tipoDato]);

  return { parseDate, parseTime, formatForBackend };
};
