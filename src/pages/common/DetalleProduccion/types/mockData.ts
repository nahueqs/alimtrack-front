import type {
  EstructuraProduccionDTO,
  RespuestasProduccionProtectedDTO,
} from '@/types/production';
import { TipoDatoCampo } from '@/pages/Recetas/types/TipoDatoCampo';
import { ProductionState } from '@/constants/ProductionStates';

// Mock de la estructura de una producción (lo que define qué campos y tablas existen)
export const mockEstructura: EstructuraProduccionDTO = {
  metadata: {
    codigoVersionReceta: 'VR-PAST-01-V2',
    codigoRecetaPadre: 'REC-PAST-01',
    nombreRecetaPadre: 'Pasteurización de Leche Entera',
    nombre: 'v2.1 - Ajuste de Tiempos',
    descripcion: 'Versión con tiempos de enfriamiento ajustados para mejorar la eficiencia.',
    fechaCreacion: '2023-10-26T10:00:00Z',
  },
  estructura: [
    {
      id: 1,
      codigoVersion: 'VR-PAST-01-V2',
      titulo: 'Recepción de Materia Prima',
      orden: 1,
      camposSimples: [
        {
          id: 101,
          idSeccion: 1,
          idGrupo: null,
          nombre: 'Proveedor',
          tipoDato: TipoDatoCampo.TEXTO,
          orden: 1,
        },
        {
          id: 102,
          idSeccion: 1,
          idGrupo: null,
          nombre: 'Temperatura de Recepción (°C)',
          tipoDato: TipoDatoCampo.ENTERO,
          orden: 2,
        },
      ],
      gruposCampos: [],
      tablas: [],
    },
    {
      id: 2,
      codigoVersion: 'VR-PAST-01-V2',
      titulo: 'Proceso de Pasteurización',
      orden: 2,
      camposSimples: [],
      gruposCampos: [
        {
          id: 201,
          idSeccion: 2,
          subtitulo: 'Parámetros del Equipo',
          orden: 1,
          campos: [
            {
              id: 211,
              idSeccion: 2,
              idGrupo: 201,
              nombre: 'ID Pasteurizador',
              tipoDato: TipoDatoCampo.TEXTO,
              orden: 1,
            },
            {
              id: 212,
              idSeccion: 2,
              idGrupo: 201,
              nombre: 'Presión de Operación (Bar)',
              tipoDato: TipoDatoCampo.ENTERO,
              orden: 2,
            },
          ],
        },
      ],
      tablas: [
        {
          id: 301,
          idSeccion: 2,
          nombre: 'Control de Tiempos y Temperaturas',
          descripcion: 'Registrar los valores en cada etapa del proceso.',
          orden: 2,
          columnas: [
            { id: 311, idTabla: 301, nombre: 'Etapa', orden: 1, tipoDato: TipoDatoCampo.TEXTO },
            { id: 312, idTabla: 301, nombre: 'Hora', orden: 2, tipoDato: TipoDatoCampo.HORA },
            {
              id: 313,
              idTabla: 301,
              nombre: 'Temperatura (°C)',
              orden: 3,
              tipoDato: TipoDatoCampo.DECIMAL,
            },
          ],
          filas: [
            { id: 321, idTabla: 301, nombre: 'Inicio Calentamiento', orden: 1 },
            { id: 322, idTabla: 301, nombre: 'Fin Calentamiento (Pico)', orden: 2 },
            { id: 323, idTabla: 301, nombre: 'Inicio Enfriamiento', orden: 3 },
            { id: 324, idTabla: 301, nombre: 'Fin Enfriamiento', orden: 4 },
          ],
        },
      ],
    },
  ],
  totalCampos: 4,
  totalCeldas: 12, // 4 filas * 3 columnas
};

// Mock de las respuestas de una producción específica (los valores que el usuario ha llenado)
export const mockRespuestas: RespuestasProduccionProtectedDTO = {
  produccion: {
    codigoProduccion: 'PROD-2024-07-21-A',
    codigoVersion: 'VR-PAST-01-V2',
    lote: 'LOTE-240721-A',
    estado: ProductionState.EN_PROCESO,
    fechaInicio: '2024-07-21T08:00:00Z',
    fechaFin: '',
    fechaModificacion: '2024-07-21T09:15:00Z',
    encargado: 'Nahuel',
    emailCreador: 'nahuel@example.com',
    observaciones: 'Sin observaciones',
  },
  respuestasCampos: [
    {
      idRespuesta: 1,
      idCampo: 101,
      valor: 'Granja La Pradera',
      timestamp: '2024-07-21T08:05:10Z',
    },
    { idRespuesta: 2, idCampo: 102, valor: '4.5', timestamp: '2024-07-21T08:05:25Z' },
    { idRespuesta: 3, idCampo: 211, valor: 'PAST-03', timestamp: '2024-07-21T08:10:00Z' },
  ],
  respuestasTablas: [
    // Fila 1 completa
    {
      idTabla: 301,
      idFila: 321,
      idColumna: 311,
      nombreFila: 'Inicio Calentamiento',
      nombreColumna: 'Etapa',
      tipoDatoColumna: TipoDatoCampo.TEXTO,
      valor: 'Calentamiento',
      timestampRespuesta: '2024-07-21T08:15:00Z',
    },
    {
      idTabla: 301,
      idFila: 321,
      idColumna: 312,
      nombreFila: 'Inicio Calentamiento',
      nombreColumna: 'Hora',
      tipoDatoColumna: TipoDatoCampo.HORA,
      valor: '08:15',
      timestampRespuesta: '2024-07-21T08:15:00Z',
    },
    {
      idTabla: 301,
      idFila: 321,
      idColumna: 313,
      nombreFila: 'Inicio Calentamiento',
      nombreColumna: 'Temperatura (°C)',
      tipoDatoColumna: TipoDatoCampo.DECIMAL,
      valor: '10',
      timestampRespuesta: '2024-07-21T08:15:00Z',
    },
    // Fila 2 parcial
    {
      idTabla: 301,
      idFila: 322,
      idColumna: 311,
      nombreFila: 'Fin Calentamiento (Pico)',
      nombreColumna: 'Etapa',
      tipoDatoColumna: TipoDatoCampo.TEXTO,
      valor: 'Pico Temp',
      timestampRespuesta: '2024-07-21T08:45:00Z',
    },
    {
      idTabla: 301,
      idFila: 322,
      idColumna: 312,
      nombreFila: 'Fin Calentamiento (Pico)',
      nombreColumna: 'Hora',
      tipoDatoColumna: TipoDatoCampo.HORA,
      valor: '08:45',
      timestampRespuesta: '2024-07-21T08:45:00Z',
    },
  ],
  progreso: {
    totalCampos: 4,
    camposRespondidos: 3,
    totalCeldasTablas: 12,
    celdasRespondidas: 5,
    totalElementos: 16,
    elementosRespondidos: 8,
    porcentajeCompletado: 50,
  },
  timestampConsulta: new Date().toISOString(),
};
