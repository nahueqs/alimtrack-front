import type {TipoDatoCampo} from '@/pages/Protected/VersionRecetas/types/TipoDatoCampo.ts';

// --- DTOs de Producción (Público vs. Protegido) ---
export interface ProduccionProtectedResponseDTO {
    codigoProduccion: string;
    codigoVersion: string;
    encargado: string | null; // Aligned nullability
    emailCreador: string;
    lote: string | null; // Aligned nullability
    estado: string; // Changed from union type to string
    fechaInicio: string;
    fechaFin: string | null; // Aligned nullability
    observaciones: string | null; // Aligned nullability
    fechaModificacion: string | null; // Changed from optional to string | null
}

// Renamed from ProduccionPublicResponseDTO to ProduccionPublicMetadataDTO
// Aligned with backend's MetadataProduccionPublicaResponseDTO
export interface ProduccionPublicMetadataDTO {
    codigoProduccion: string;
    codigoVersion: string;
    lote: string | null; // Backend is String, assuming can be null
    estado: string; // Backend is String, allowing for more flexibility than union type
    fechaInicio: string;
    fechaFin: string | null; // Backend is LocalDateTime, assuming can be null
    fechaModificacion: string | null; // Changed from optional to string | null
    // Removed encargado, emailCreador, observaciones as they are not in backend's public metadata
}

// --- DTOs de Respuestas (Público vs. Protegido) ---
export interface RespuestasProduccionPublicDTO {
    produccion: ProduccionPublicMetadataDTO; // Updated to use new metadata type
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
    descripcion: string | null; // Added from backend
    // Removed creadaPor
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
    valor: string;
    emailCreador: string;
}

export interface RespuestaCeldaTablaRequestDTO {
    valor: string;
    emailCreador: string;
}

export interface ProduccionCambioEstadoRequestDTO {
    valor: 'FINALIZADA' | 'CANCELADA';
    emailCreador: string;
}


// --- Otros Tipos ---

// Aligned with backend's EstadoProduccionPublicoResponseDTO
export interface ProduccionStatusResponseDTO {
    codigoProduccion: string; // Added from backend DTO
    estado: string; // Changed from union type to string
    ultimaModificacion: string; // Renamed from fechaUltimaModificacion
}

// Aligned with backend's EstadoProduccionPublicoResponseDTO.ultimaModificacion
export interface UltimaModificacionDTO {
    ultimaModificacion: string; // Renamed from fechaModificacion
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
