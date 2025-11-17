import type { SeccionResponseDTO } from './Productions.ts';

export interface VersionRecetaFilterRequestDTO {
  codigoVersionReceta: string | null;
  codigoReceta: string | null;
  nombreVersionReceta: string | null;
}

export interface VersionRecetaResponseDTO {
  data: VersionRecetaResponseDTO | PromiseLike<VersionRecetaResponseDTO>;
  codigoVersionReceta: string;
  codigoRecetaPadre: string;
  nombreRecetaPadre: string;
  nombreVersion: string;
  descripcion: string | null;
  creadaPor: string;
  fechaCreacion: string;
}

export interface VersionRecetaFullResponseDTO {
  codigoVersionReceta: string;
  codigoRecetaPadre: string;
  nombreRecetaPadre: string;
  nombreVersion: string;
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
