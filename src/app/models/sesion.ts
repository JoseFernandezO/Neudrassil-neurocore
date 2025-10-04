export interface Sesion {
  id: string;
  pacienteId: string;
  terapeutaId: string;
  terapiaId: string;
  fechaInicio: Date;
  fechaFin?: Date;
  duracion: number;
  completada: boolean;
  progreso: number; // porcentaje 0-100
  notas?: string;
  calificacion?: number; // 1-5 estrellas
  estado: 'pendiente' | 'en_progreso' | 'completada' | 'cancelada';
}

export interface ProgresoUsuario {
  usuarioId: string;
  totalSesiones: number;
  sesionesCompletadas: number;
  porcentajeGeneral: number;
  terapiasEnCurso: string[];
  terapiasCompletadas: string[];
  ultimaActividad: Date;
  racha: number; // días consecutivos
}

export interface EstadisticasSesion {
  totalTiempo: number;
  promedioCalificacion: number;
  sesionesEstaSemana: number;
  mejorRacha: number;
  categoriaMasUsada: string;
  horasAcumuladas: number;
}
