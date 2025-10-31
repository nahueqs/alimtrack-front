export interface Production {
    codigoProduccion: string;
    codigoVersion: string;
    encargado: string;
    lote: string;
    estado: string;
    fechaInicio: string;
    fechaFin?: string;
}

export interface ProductionsResponse {
    producciones: Production[];
    total: number;
    pagina: number; // Página actual (0-based para Spring)
    totalPaginas: number;
    size: number;
}

// Para los filtros del backend
export interface ProductionFilterRequestDTO {
    codigoVersionReceta?: string;
    lote?: string;
    encargado?: string;
    fechaInicio?: string; // LocalDate como "YYYY-MM-DD"
    fechaFin?: string;    // LocalDate como "YYYY-MM-DD"
    estado?: string;
    page?: number;        // Para Spring (0-based)
    size?: number;
    sort?: string;
}