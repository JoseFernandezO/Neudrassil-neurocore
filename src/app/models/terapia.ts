export interface Terapia {
  id: string;
  nombre: string;
  descripcion: string;
  duracion: number; // en minutos
  categoria: 'cognitiva' | 'motora' | 'sensorial' | 'lenguaje' | 'memoria';
  nivelDificultad: 'principiante' | 'intermedio' | 'avanzado';
  imagenUrl?: string;
  activa: boolean;
  objetivos: string[];
  instrucciones: string;
  materiales?: string[];
}

export interface CategoriasTerapias {
  [key: string]: {
    nombre: string;
    descripcion: string;
    icono: string;
    color: string;
  }
}

export const CATEGORIAS_MOCK: CategoriasTerapias = {
  cognitiva: {
    nombre: 'Cognitiva',
    descripcion: 'Ejercicios para mejorar funciones mentales',
    icono: '🧠',
    color: '#667eea'
  },
  motora: {
    nombre: 'Motora',
    descripcion: 'Mejora coordinación y movimiento',
    icono: '🤸‍♂️',
    color: '#f093fb'
  },
  sensorial: {
    nombre: 'Sensorial',
    descripcion: 'Estimulación de los sentidos',
    icono: '👁️',
    color: '#4facfe'
  },
  lenguaje: {
    nombre: 'Lenguaje',
    descripcion: 'Comunicación y expresión verbal',
    icono: '🗣️',
    color: '#43e97b'
  },
  memoria: {
    nombre: 'Memoria',
    descripcion: 'Fortalecimiento de la memoria',
    icono: '💭',
    color: '#fa709a'
  }
};
