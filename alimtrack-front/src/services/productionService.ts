import { apiClient } from '../utils/ApiClient';
import type {
  ProductionFilterRequestDTO,
  ProductionResponse,
  ProductionsResponse,
} from '../types/Productions.ts';

class ProductionService {
  async getProductions(filters: ProductionFilterRequestDTO = {}): Promise<ProductionsResponse> {
    const response = await apiClient.get<any>('/producciones', filters);

    // If response is an array, wrap it in the expected format
    if (Array.isArray(response)) {
      return { producciones: response };
    }
    // If response already has producciones, return as is
    else if (response && response.producciones) {
      return response;
    }
    // If it's a single production, wrap it in an array
    else if (response && response.codigoProduccion) {
      return { producciones: [response] };
    }

    // Default empty response if format is unexpected
    return { producciones: [] };
  }

  async getProductionByCodigo(codigoProduccion: string): Promise<ProductionsResponse> {
    return apiClient.get<ProductionsResponse>(`/producciones/${codigoProduccion}`);
  }

  async createProduction(productionData: any): Promise<ProductionResponse> {
    return apiClient.post<ProductionResponse>('/producciones', productionData);
  }

  async updateProduction(
    codigoProduccion: string,
    productionData: any
  ): Promise<ProductionResponse> {
    return apiClient.put<ProductionResponse>(`/producciones/${codigoProduccion}`, productionData);
  }

  async deleteProduction(codigoProduccion: string): Promise<void> {
    return apiClient.delete<void>(`/producciones/${codigoProduccion}`);
  }
}

export const productionService = new ProductionService();
