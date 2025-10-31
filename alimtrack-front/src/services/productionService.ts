import { apiClient } from '../utils/ApiClient';
import type { Production, ProductionsResponse, ProductionFilterRequestDTO } from '../types/Productions.ts';

class ProductionService {
    async getProductions(filters: ProductionFilterRequestDTO = {}): Promise<ProductionsResponse> {
        // Asegurar que page empiece en 0 para Spring
        const springFilters = {
            ...filters,
            page: filters.page !== undefined ? filters.page - 1 : 0
        };

        return apiClient.get<ProductionsResponse>('/producciones', springFilters);
    }

    async getProductionByCodigo(codigoProduccion: string): Promise<Production> {
        return apiClient.get<Production>(`/producciones/${codigoProduccion}`);
    }

    async createProduction(productionData: any): Promise<Production> {
        return apiClient.post<Production>('/producciones', productionData);
    }

    async updateProduction(codigoProduccion: string, productionData: any): Promise<Production> {
        return apiClient.put<Production>(`/producciones/${codigoProduccion}`, productionData);
    }

    async deleteProduction(codigoProduccion: string): Promise<void> {
        return apiClient.delete<void>(`/producciones/${codigoProduccion}`);
    }

}

export const productionService = new ProductionService();