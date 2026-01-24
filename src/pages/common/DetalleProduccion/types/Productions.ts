import type {TipoDatoCampo} from '@/pages/Protected/VersionRecetas/types/TipoDatoCampo.ts';

// --- DTOs de Producción (Público vs. Protegido) ---
export interface ProduccionProtectedResponseDTO {
    codigoProduccion: string;
    codigoVersion: string;
    encargado: string | null;
    emailCreador: string;
    lote: string | null;
    estado: string;
    fechaInicio: string;
    fechaFin: string | null;
    observaciones: string | null;
    fechaModificacion: string | null;
}

export interface ProduccionPublicMetadataDTO {
    codigoProduccion: string;
    codigoVersion: string;
    lote: string | null;
    estado: string;
    fechaInicio: string;
    fechaFin: string | null;
    fechaModificacion: string | null;
}

// --- DTOs de Respuestas (Público vs. Protegido) ---
export interface RespuestasProduccionPublicDTO {
    produccion: ProduccionPublicMetadataDTO;
    respuestasCampos: RespuestaCampoDTO[];
    respuestasTablas: RespuestaTablaDTO[];
    progreso: ProgresoProduccionResponseDTO;
    timestampConsulta: string;
}

export interface RespuestasProduccionProtectedDTO {
    produccion: ProduccionProtectedResponseDTO;
    respuestasCampos: RespuestaCampoDTO[];
    respuestasTablas: RespuestaTablaDTO[];
    progreso: ProgresoProduccionResponseDTO;
    timestampConsulta: string;
}

// --- DTO de Estado Completo (Solo para endpoint protegido) ---
export interface EstadoActualProduccionResponseDTO {
    produccion: ProduccionProtectedResponseDTO;
    estructura: EstructuraProduccionDTO;
    respuestasCampos: RespuestaCampoDTO[];
    respuestasTablas: RespuestaTablaDTO[];
    progreso: ProgresoProduccionResponseDTO;
    timestampConsulta: string;
}

// --- Tipos Comunes y Anidados ---
export interface RespuestaCampoDTO {
    idRespuesta: number;
    idCampo: number;
    valor: string;
    timestamp: string;
}

export interface RespuestaTablaDTO {
    idTabla: number;
    idFila: number;
    idColumna: number;
    tipoDatoColumna: string;
    nombreFila: string;
    nombreColumna: string;
    valor: string;
    timestampRespuesta: string;
}

export interface ProgresoProduccionResponseDTO {
    totalCampos: number;
    camposRespondidos: number;
    totalCeldasTablas: number;
    celdasRespondidas: number;
    totalElementos: number;
    elementosRespondidos: number;
    porcentajeCompletado: number;
}

export interface EstructuraProduccionDTO {
    metadata: VersionRecetaMetadataResponseDTO;
    estructura: SeccionResponseDTO[];
    totalCampos: number;
    totalCeldas: number;
}

export interface VersionRecetaMetadataResponseDTO {
    codigoVersionReceta: string;
    codigoRecetaPadre: string;
    nombreRecetaPadre: string;
    nombre: string;
    descripcion: string | null;
    fechaCreacion: string;
}

export interface SeccionResponseDTO {
    id: number;
    codigoVersion: string;
    titulo: string;
    orden: number;
    camposSimples: CampoSimpleResponseDTO[];
    gruposCampos: GrupoCamposResponseDTO[];
    tablas: TablaResponseDTO[];
}

export interface GrupoCamposResponseDTO {
    id: number;
    idSeccion: number;
    subtitulo: string;
    orden: number;
    campos: CampoSimpleResponseDTO[];
}

export interface CampoSimpleResponseDTO {
    id: number;
    idSeccion: number;
    idGrupo: number | null;
    nombre: string;
    tipoDato: TipoDatoCampo;
    orden: number;
}

export interface TablaResponseDTO {
    id: number;
    idSeccion: number;
    nombre: string;
    descripcion: string | null;
    orden: number;
    columnas?: ColumnaTablaResponseDTO[];
    filas?: FilaTablaResponseDTO[];
}

export interface ColumnaTablaResponseDTO {
    id: number;
    idTabla: number;
    nombre: string;
    orden: number;
    tipoDato: TipoDatoCampo;
}

export interface FilaTablaResponseDTO {
    id: number;
    idTabla: number;
    nombre: string;
    orden: number;
}

// --- DTOs de Request ---

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
    valor: 'FINALIZADA' | 'CANCELADA';
    emailCreador: string;
}


// --- Otros Tipos ---
export interface UltimaModificacionDTO {
    ultimaModificacion: string;
}

export interface ProduccionFilterRequestDTO {
    codigoVersionReceta?: string | null;
    lote?: string | null;
    encargado?: string | null;
    fechaInicio?: string | null;
    fechaFin?: string | null;
    estado?: 'EN_PROCESO' | 'FINALIZADA' | 'CANCELADA' | null;
    codigoProduccion?: string | null;
}

export interface ProduccionCreateRequestDTO {
    codigoVersionReceta: string;
    codigoProduccion: string;
    usernameCreador: string;
    lote: string;
    encargado: string;
    observaciones?: string;
}

export interface ProduccionMetadataModifyRequestDTO {
    lote?: string | null;
    encargado?: string | null;
    observaciones?: string | null;
}

// --- WebSocket Payloads ---

export interface FieldUpdatePayload {
    idCampo: number;
    valor: string;
    timestamp: string;
}

export interface TableCellUpdatePayload {
    idTabla: number;
    idFila: number;
    idColumna: number;
    valor: string;
    timestamp: string;
}

export interface ProductionStateUpdatePayload {
    estado: 'EN_PROCESO' | 'FINALIZADA' | 'CANCELADA';
    fechaFin?: string | null;
    timestamp: string;
}

export interface ProductionMetadataCreatedPayload {
    codigoVersion?: string;
    lote?: string | null;
    fechaInicio?: string;
    fechaFin?: string | null;
}

export interface ProductionMetadataUpdatedPayload {
    codigoProduccion: string;
    lote: string;
    encargado: string;
    observaciones: string;
}
