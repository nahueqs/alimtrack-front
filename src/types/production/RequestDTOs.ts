import { ProductionState } from '@/constants/ProductionStates';

export interface RespuestaCampoRequestDTO {
  idCampo: number;
  valorTexto?: string | null;
  valorNumerico?: number | null;
  valorFecha?: string | null;
  valorBooleano?: boolean | null;
  emailCreador: string;
}

export interface RespuestaCeldaTablaRequestDTO {
  // Campos opcionales para validación en backend (aunque se pasan por path variable)
  idTabla?: number;
  idFila?: number;
  idColumna?: number;
  valorTexto?: string | null;
  valorNumerico?: number | null;
  valorFecha?: string | null;
  valorBooleano?: boolean | null;
  emailCreador: string;
}

export interface ProduccionCambioEstadoRequestDTO {
  valor: ProductionState;
  emailCreador: string;
}

export interface ProduccionFilterRequestDTO {
  codigoVersionReceta?: string | null;
  lote?: string | null;
  encargado?: string | null;
  fechaInicio?: string | null;
  fechaFin?: string | null;
  estado?: ProductionState | null;
  codigoProduccion?: string | null;
}

export interface ProduccionCreateRequestDTO {
  codigoVersionReceta: string;
  codigoProduccion: string;
  emailCreador: string;
  lote: string;
  encargado: string;
  observaciones?: string;
}

export interface ProduccionMetadataModifyRequestDTO {
  lote?: string | null;
  encargado?: string | null;
  observaciones?: string | null;
}
