import { apiClient } from '../utils/ApiClient';
import type {
  ProductionResponse,
  ProductionsResponse,
  ProductionFilterRequestDTO,
} from '../types/Productions.ts';

class ProductionService {
  async getProductions(filters: ProductionFilterRequestDTO = {}): Promise<ProductionsResponse> {
    return apiClient.get<ProductionsResponse>('/producciones', filters);
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
