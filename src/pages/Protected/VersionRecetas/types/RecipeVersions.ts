import type {SeccionResponseDTO} from '@/pages/common/DetalleProduccion/types/Productions.ts';

export interface VersionRecetaFilterRequestDTO {
    codigoVersionReceta?: string | null; // Made optional and nullable
    codigoReceta?: string | null; // Made optional and nullable
    nombreVersionReceta?: string | null; // Made optional and nullable
}

export interface VersionRecetaResponseDTO { // Aligned with backend's VersionMetadataResponseDTO
    codigoVersionReceta: string;
    codigoRecetaPadre: string;
    nombreRecetaPadre: string;
    nombre: string;
    descripcion: string | null;
    creadaPor: string;
    fechaCreacion: string;
}

export interface VersionRecetaFullResponseDTO { // Aligned with backend's VersionMetadataResponseDTO
    codigoVersionReceta: string;
    codigoRecetaPadre: string;
    nombreRecetaPadre: string;
    nombre: string; // Changed from nombreVersion to nombre
    descripcion: string | null;
    creadaPor: string;
    fechaCreacion: string;
    secciones: SeccionResponseDTO[];
}

export interface VersionRecetaCreateDTO {
    /**
     * Código de la receta padre
     * @minLength 2
     * @maxLength 255
     */
    codigoRecetaPadre: string;

    /**
     * Código de la versión de la receta
     * @minLength 2
     * @maxLength 255
     */
    codigoVersionReceta: string;

    /**
     * Nombre de la versión
     * @minLength 2
     * @maxLength 255
     */
    nombre: string;

    /**
     * Descripción opcional de la versión
     * @minLength 2
     * @maxLength 255
     */
    descripcion?: string;

    /**
     * Usuario creador
     * @minLength 2
     * @maxLength 50
     */
    usernameCreador: string;
}
