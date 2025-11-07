export interface RecetaResponseDTO {
  codigoReceta: string;
  descripcion: string;
  creadaPor: string;
  fechaCreacion: string;
}

export interface RecetaFilterRequestDTO {
  codigoReceta: string;
  nombreReceta: string;
}
