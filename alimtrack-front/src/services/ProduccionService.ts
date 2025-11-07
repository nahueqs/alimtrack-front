// File: `src/services/ProduccionService.ts`
import { apiClient } from './ApiClient';
import type { ProduccionFilterRequestDTO, ProduccionResponseDTO } from '../types/Productions';
import ErrorHandlerService, { type ServiceResult } from './ErrorHandlerService';

const errorHandler = ErrorHandlerService.getInstance();

// Definir tipos para las respuestas
interface ProduccionListResponse {
  producciones: ProduccionResponseDTO[];
  total?: number;
  pagination?: any;
}

interface SingleProduccionResponse {
  produccion: ProduccionResponseDTO | null;
}

class ProduccionService {
  /**
   * Obtener múltiples producciones con filtros
   */
  async getProducciones(
    filters: ProduccionFilterRequestDTO = {}
  ): Promise<ServiceResult<ProduccionListResponse>> {
    return errorHandler.executeService(
      async () => {
        const response = await apiClient.get<ProduccionListResponse>('/producciones', {
          params: filters,
        });

        // Normalizar respuesta a formato consistente
        return this.normalizeProductionListResponse(response);
      },
      {
        operation: 'getProducciones',
        module: 'ProduccionService',
        metadata: { filters },
      },
      { producciones: [] } // fallback data
    );
  }

  /**
   * Obtener una única producción por código
   */
  async getProduccionByCodigo(
    codigoProduccion: string
  ): Promise<ServiceResult<SingleProduccionResponse>> {
    return errorHandler.executeService(
      async () => {
        errorHandler.validateRequiredParam(codigoProduccion, 'codigoProduccion');

        const response = await apiClient.get<SingleProduccionResponse>(
          `/producciones/${encodeURIComponent(codigoProduccion)}`
        );

        // Normalizar respuesta - espera una única producción
        const normalized = this.normalizeSingleProductionResponse(response);

        // Para getProduccionByCodigo, si no hay producción, es un error
        if (!normalized.produccion) {
          throw new Error(`Producción con código ${codigoProduccion} no encontrada`);
        }

        return normalized;
      },
      {
        operation: 'getProduccionByCodigo',
        module: 'ProduccionService',
        metadata: { codigoProduccion },
      },
      { produccion: null } // fallback data
    );
  }

  /**
   * Crear una nueva producción
   */
  async createProduction(productionData: any): Promise<ServiceResult<SingleProduccionResponse>> {
    return errorHandler.executeService(
      async () => {
        errorHandler.validateRequiredParam(productionData, 'productionData');

        const codigoProduccion = productionData.codigoProduccion;

        const response = await apiClient.post<SingleProduccionResponse>(
          `/producciones/${encodeURIComponent(codigoProduccion)}`, // Con código en URL
          productionData
        );
        //  `/producciones/${encodeURIComponent(codigoProduccion)}`
        return this.normalizeSingleProductionResponse(response);
      },
      {
        operation: 'createProduction',
        module: 'ProduccionService',
        metadata: { productionData: this.sanitizeProductionData(productionData) },
      },
      { produccion: null } // fallback data
    );
  }

  /**
   * Actualizar una producción existente
   */
  async updateProduction(
    codigoProduccion: string,
    productionData: any
  ): Promise<ServiceResult<SingleProduccionResponse>> {
    return errorHandler.executeService(
      async () => {
        errorHandler.validateRequiredParam(codigoProduccion, 'codigoProduccion');
        errorHandler.validateRequiredParam(productionData, 'productionData');

        const response = await apiClient.put<any>(
          `/producciones/${codigoProduccion}`,
          productionData
        );

        return this.normalizeSingleProductionResponse(response);
      },
      {
        operation: 'updateProduction',
        module: 'ProduccionService',
        metadata: {
          codigoProduccion,
          productionData: this.sanitizeProductionData(productionData),
        },
      },
      { produccion: null } // fallback data
    );
  }

  /**
   * Eliminar una producción
   */
  async deleteProduction(codigoProduccion: string): Promise<ServiceResult<void>> {
    return errorHandler.executeService(
      async () => {
        errorHandler.validateRequiredParam(codigoProduccion, 'codigoProduccion');

        await apiClient.delete<void>(`/producciones/${codigoProduccion}`);

        // No retornamos datos en delete, solo confirmación de éxito
      },
      {
        operation: 'deleteProduction',
        module: 'ProduccionService',
        metadata: { codigoProduccion },
      },
      undefined // fallback data para void
    );
  }

  /**
   * Normaliza la respuesta para lista de producciones
   */
  private normalizeProductionListResponse(response: any): ProduccionListResponse {
    // Si la respuesta ya está en el formato esperado con array de producciones
    if (response && 'producciones' in response && Array.isArray(response.producciones)) {
      return {
        producciones: response.producciones,
        total: response.total,
        pagination: response.pagination,
      };
    }

    // Si es un array directo (sin wrapper)
    else if (Array.isArray(response)) {
      return { producciones: response };
    }

    // Si es una única producción pero estamos en lista, la envolvemos en array
    else if (response && typeof response === 'object' && 'codigoProduccion' in response) {
      return { producciones: [response] };
    }

    // Si es una única producción dentro de data
    else if (response?.data && typeof response.data === 'object') {
      if (Array.isArray(response.data)) {
        return { producciones: response.data };
      } else if ('codigoProduccion' in response.data) {
        return { producciones: [response.data] };
      }
    }

    // Respuesta vacía por defecto
    return { producciones: [] };
  }

  /**
   * Normaliza la respuesta para una única producción
   */
  private normalizeSingleProductionResponse(response: any): SingleProduccionResponse {
    // Si la respuesta es directamente la producción
    if (response && typeof response === 'object' && 'codigoProduccion' in response) {
      return { produccion: response };
    }

    // Si la producción está dentro de data
    else if (
      response?.data &&
      typeof response.data === 'object' &&
      'codigoProduccion' in response.data
    ) {
      return { produccion: response.data };
    }

    // Si viene en formato de lista pero queremos solo una
    else if (
      response &&
      'producciones' in response &&
      Array.isArray(response.producciones) &&
      response.producciones.length > 0
    ) {
      return { produccion: response.producciones[0] };
    }

    // No se encontró producción
    return { produccion: null };
  }

  /**
   * Sanitiza datos de producción para logging (elimina datos sensibles)
   */
  private sanitizeProductionData(productionData: any): any {
    if (!productionData || typeof productionData !== 'object') {
      return productionData;
    }

    const sanitized = { ...productionData };

    // Eliminar campos potencialmente sensibles para logs
    const sensitiveFields = ['password', 'token', 'secret', 'authorization', 'creditCard'];
    sensitiveFields.forEach(field => {
      if (field in sanitized) {
        sanitized[field] = '***REDACTED***';
      }
    });

    return sanitized;
  }
}

export const productionService = new ProduccionService();
