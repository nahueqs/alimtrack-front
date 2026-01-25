export enum ProductionState {
  EN_PROCESO = 'EN_PROCESO',
  FINALIZADA = 'FINALIZADA',
  CANCELADA = 'CANCELADA',
}

export const PRODUCTION_STATE_LABELS: Record<ProductionState, string> = {
  [ProductionState.EN_PROCESO]: 'En Proceso',
  [ProductionState.FINALIZADA]: 'Finalizada',
  [ProductionState.CANCELADA]: 'Cancelada',
};

export const PRODUCTION_STATE_COLORS: Record<ProductionState, string> = {
  [ProductionState.EN_PROCESO]: 'blue',
  [ProductionState.FINALIZADA]: 'green',
  [ProductionState.CANCELADA]: 'red',
};
