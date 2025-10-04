export interface Usuario {
  id: string;
  nombre: string;
  email: string;
  tipo: 'terapeuta' | 'paciente';
  fechaRegistro: Date;
  activo: boolean;
  avatar?: string;
  especialidad?: string; // Solo para terapeutas
  telefono?: string;
  biografia?: string;
}
