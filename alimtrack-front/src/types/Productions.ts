import type { TipoDatoCampo } from './TipoDatoCampo.ts';

export interface ProduccionResponseDTO {
  codigoProduccion: string;
  codigoVersion: string;
  encargado: string;
  lote: string;
  estado: string;
  fechaInicio: string;
  fechaFin?: string;
  observaciones?: string;
}

export interface ProduccionResponseDTO {
  producciones: ProduccionResponseDTO[];
}

export interface ProduccionFilterRequestDTO {
  codigoVersionReceta?: string;
  lote?: string;
  encargado?: string;
  fechaInicio?: string;
  fechaFin?: string;
  estado?: 'EN_PROCESO' | 'FINALIZADA';
}

export interface ProduccionCreateRequestDTO {
  codigoVersionReceta: string;
  codigoProduccion: string;
  usernameCreador: string;
  lote: string;
  encargado: string;
  observaciones?: string;
}

export interface CampoSimpleResponseDTO {
  id: number;
  idSeccion: number;
  idGrupoCampos: number | null;
  nombre: string;
  tipoDato: TipoDatoCampo;
  orden: number;
}

export interface FilaTablaResponseDTO {
  id: string;
  idTabla: string;
  nombre: string;
  orden: number;
}

export interface GrupoCamposResponseDTO {
  id: number;
  idSeccion: number;
  nombre: string;
  subtitulo: string;
  orden: number;
  campos: CampoSimpleResponseDTO[];
}

export interface TablaResponseDTO {
  idTabla: number;
  idSeccion: number;
  nombre: string;
  descripcion: string | null;
  orden: number;
  columnas?: ColumnaTablaResponseDTO[];
  filas?: FilaTablaResponseDTO[];
}

export interface ColumnaTablaResponseDTO {
  id: string;
  idTabla: string;
  nombre: string;
  orden: number;
  tipoDato: TipoDatoCampo;
}

export interface SeccionResponseDTO {
  idSeccion: number;
  codigoVersion: string;
  usernameCreador: string;
  titulo: string;
  orden: number;
  camposSimples: CampoSimpleResponseDTO[];
  gruposCampos: GrupoCamposResponseDTO[];
  tablas: TablaResponseDTO[];
}
