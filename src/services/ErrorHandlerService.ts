// File: `src/services/ErrorHandlerService.ts`

export type ServiceError = {
  message: string;
  code?: string;
  status?: number;
  context?: string;
  timestamp: Date;
  originalError?: any;
};

export type ServiceResult<T> = {
  data: T;
  error?: ServiceError;
  success: boolean;
};

export type ErrorContext = {
  operation: string;
  module?: string;
  metadata?: Record<string, any>;
};

class ErrorHandlerService {
  private static instance: ErrorHandlerService;
  private isDevelopment: boolean;

  private constructor() {
    this.isDevelopment = this.detectDevelopmentEnvironment();
  }

  public static getInstance(): ErrorHandlerService {
    if (!ErrorHandlerService.instance) {
      ErrorHandlerService.instance = new ErrorHandlerService();
    }
    return ErrorHandlerService.instance;
  }

  /**
   * Maneja errores de servicios de forma consistente
   */
  public handleError(error: any, context: string | ErrorContext): ServiceError {
    const errorContext = typeof context === 'string' ? { operation: context } : context;

    const serviceError: ServiceError = {
      message: this.extractErrorMessage(error, errorContext.operation),
      code: this.extractErrorCode(error),
      status: this.extractStatusCode(error),
      context: errorContext.operation,
      timestamp: new Date(),
      originalError: this.isDevelopment ? error : undefined,
    };

    this.logError(serviceError, errorContext);
    this.reportToMonitoring(serviceError, errorContext);

    return serviceError;
  }

  /**
   * Crea un resultado exitoso
   */
  public createSuccessResult<T>(data: T): ServiceResult<T> {
    return {
      data,
      success: true,
    };
  }

  /**
   * Crea un resultado fallido
   */
  public createErrorResult<T>(error: ServiceError, fallbackData: T): ServiceResult<T> {
    return {
      data: fallbackData,
      error,
      success: false,
    };
  }

  /**
   * Ejecuta una operación con manejo de errores automático
   */
  public async executeService<T>(
    operation: () => Promise<T>,
    context: string | ErrorContext,
    fallbackData: T
  ): Promise<ServiceResult<T>> {
    try {
      const data = await operation();
      return this.createSuccessResult(data);
    } catch (error) {
      const serviceError = this.handleError(error, context);
      return this.createErrorResult(serviceError, fallbackData);
    }
  }

  /**
   * Valida parámetros requeridos
   */
  public validateRequiredParam(param: any, paramName: string): void {
    if (param === undefined || param === null || param === '') {
      throw new Error(`Parámetro requerido faltante: ${paramName}`);
    }
  }

  /**
   * Valida múltiples parámetros
   */
  public validateRequiredParams(params: Record<string, any>): void {
    Object.entries(params).forEach(([paramName, paramValue]) => {
      this.validateRequiredParam(paramValue, paramName);
    });
  }

  /**
   * Utilidades para verificar tipos de errores
   */
  public isNotFoundError(error: ServiceError): boolean {
    return error.status === 404;
  }

  public isAuthError(error: ServiceError): boolean {
    return error.status === 401 || error.status === 403;
  }

  public isServerError(error: ServiceError): boolean {
    return error.status !== undefined && error.status >= 500;
  }

  public isNetworkError(error: ServiceError): boolean {
    return (
      error.message.includes('Network Error') ||
      error.message.includes('timeout') ||
      error.message.includes('red')
    );
  }

  public isValidationError(error: ServiceError): boolean {
    return error.status === 422 || error.message.includes('validación');
  }

  /**
   * Obtener mensaje amigable para el usuario
   */
  public getUserFriendlyMessage(error: ServiceError): string {
    if (this.isNetworkError(error)) {
      return 'Error de conexión. Verifique su internet e intente nuevamente.';
    }

    if (this.isAuthError(error)) {
      return 'No tiene permisos para realizar esta acción.';
    }

    if (this.isNotFoundError(error)) {
      return 'El recurso solicitado no fue encontrado.';
    }

    if (this.isServerError(error)) {
      return 'Error interno del servidor. Por favor, intente más tarde.';
    }

    if (this.isValidationError(error)) {
      return 'Los datos proporcionados no son válidos.';
    }

    // Mensaje genérico
    return error.message || 'Ha ocurrido un error inesperado.';
  }

  /**
   * Limpiar error (útil para resetear estados)
   */
  public createCleanError(message: string, context?: string): ServiceError {
    return {
      message,
      context,
      timestamp: new Date(),
    };
  }

  /**
   * Verifica si hay un error en un ServiceResult
   */
  public hasError<T>(result: ServiceResult<T>): boolean {
    return !result.success || result.error !== undefined;
  }

  /**
   * Obtiene el mensaje de error de un ServiceResult
   */
  public getErrorMessage<T>(result: ServiceResult<T>): string | null {
    if (result.error) {
      return this.getUserFriendlyMessage(result.error);
    }
    return null;
  }

  /**
   * Detecta el entorno de desarrollo de forma segura para Vite
   */
  private detectDevelopmentEnvironment(): boolean {
    try {
      // Para Vite (import.meta.env)
      if (typeof import.meta !== 'undefined' && import.meta.env) {
        // Vite usa import.meta.env.DEV y import.meta.env.MODE
        return import.meta.env.DEV || import.meta.env.MODE === 'development';
      }

      // Por defecto, asumir producción
      return false;
    } catch (error) {
      console.warn('Error detecting development environment:', error);
      return false;
    }
  }

  /**
   * Extrae el mensaje de error de forma segura
   */
  private extractErrorMessage(error: any, context: string): string {
    // Error de API con response
    if (error?.response?.data?.message) {
      return error.response.data.message;
    }

    if (error?.response?.data?.error) {
      return error.response.data.error;
    }

    // Error de axios u otra librería HTTP
    if (error?.message) {
      return error.message;
    }

    // Error de validación
    if (error?.validationErrors) {
      return 'Error de validación en los datos';
    }

    // String simple
    if (typeof error === 'string') {
      return error;
    }

    // Error desconocido
    return `Error inesperado en ${context}`;
  }

  /**
   * Extrae el código de error
   */
  private extractErrorCode(error: any): string | undefined {
    return (
      error?.response?.data?.code || error?.code || error?.response?.data?.errorCode || undefined
    );
  }

  /**
   * Extrae el código de estado HTTP
   */
  private extractStatusCode(error: any): number | undefined {
    return error?.response?.status || error?.status || error?.statusCode || undefined;
  }

  /**
   * Log del error según el entorno
   */
  private logError(error: ServiceError, context: ErrorContext): void {
    const logMessage = `[${context.operation}] ${error.message}${error.code ? ` (Code: ${error.code})` : ''}${error.status ? ` (Status: ${error.status})` : ''}`;

    if (this.isDevelopment) {
      // Log detallado en desarrollo
      console.groupCollapsed(`🔴 Error: ${context.operation}`);
      console.error('Mensaje:', error.message);
      console.error('Código:', error.code);
      console.error('Status:', error.status);
      console.error('Timestamp:', error.timestamp.toISOString());
      console.error('Error original:', error.originalError);
      if (context.metadata) {
        console.error('Metadata:', context.metadata);
      }
      console.groupEnd();
    } else {
      // Log simple en producción
      console.error(logMessage);
    }
  }

  /**
   * Reportar errores a servicio de monitoreo
   */
  private reportToMonitoring(error: ServiceError, context: ErrorContext): void {
    // Aquí integrarías con tu servicio de monitoreo (Sentry, LogRocket, etc.)
    if (!this.isDevelopment) {
      const monitoringPayload = {
        message: error.message,
        context: context.operation,
        module: context.module,
        code: error.code,
        status: error.status,
        timestamp: error.timestamp,
        metadata: context.metadata,
        environment: 'production',
      };

      // Simular envío asíncrono
      this.sendToMonitoringService(monitoringPayload).catch(() => {
        // Silenciar errores de monitoreo
      });
    }
  }

  /**
   * Simulación de envío a servicio de monitoreo
   */
  private async sendToMonitoringService(payload: any): Promise<void> {
    // En una implementación real, aquí enviarías a Sentry, LogRocket, etc.
    if (this.isDevelopment) {
      console.log('📊 Monitoring payload:', payload);
    }
    // Ejemplo para Sentry:
    // Sentry.captureException(new Error(payload.message), { extra: payload });
  }
}

export default ErrorHandlerService;
