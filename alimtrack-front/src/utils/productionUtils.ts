// Función para obtener la clase CSS del badge según el estado
export const getEstadoBadgeClass = (estado: string): string => {
    const estadoLower = estado.toLowerCase();

    switch (estadoLower) {
        case 'completado':
        case 'finalizada':
            return 'production-badge--completed';
        case 'en proceso':
        case 'en_proceso':
            return 'production-badge--in-progress';
        case 'pendiente':
            return 'production-badge--pending';
        case 'cancelado':
        case 'cancelada':
            return 'production-badge--cancelled';
        default:
            return 'production-badge--default';
    }
};

// Función para obtener el texto legible del estado
export const getEstadoDisplayText = (estado: string): string => {
    const estadoLower = estado.toLowerCase();

    switch (estadoLower) {
        case 'en_proceso':
            return 'En Proceso';
        case 'finalizada':
            return 'Finalizada';
        case 'completado':
            return 'Completado';
        case 'cancelada':
            return 'Cancelada';
        default:
            return estado.charAt(0).toUpperCase() + estado.slice(1).toLowerCase();
    }
};

// Lista de estados disponibles (puede venir del backend)
export const ESTADOS_PRODUCCION = {
    EN_PROCESO: 'EN_PROCESO',
    FINALIZADA: 'FINALIZADA',
    PENDIENTE: 'PENDIENTE',
    CANCELADA: 'CANCELADA'
} as const;

// Tipo para los estados
export type EstadoProduccion = typeof ESTADOS_PRODUCCION[keyof typeof ESTADOS_PRODUCCION];