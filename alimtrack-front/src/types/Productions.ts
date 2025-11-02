export interface ProductionResponse {
  codigoProduccion: string;
  codigoVersion: string;
  encargado: string;
  lote: string;
  estado: string;
  fechaInicio: string;
  fechaFin?: string;
  observaciones?: string;
}

export interface ProductionsResponse {
  producciones: ProductionResponse[];
}

export interface ProductionFilterRequestDTO {
  codigoVersionReceta?: string;
  lote?: string;
  encargado?: string;
  fechaInicio?: string;
  fechaFin?: string;
  estado?: 'EN_PROCESO' | 'FINALIZADA';
}
