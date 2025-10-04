import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Terapia } from '../models/terapia';

@Injectable({
  providedIn: 'root'
})
export class Terapias {
  private terapiasSubject = new BehaviorSubject<Terapia[]>([]);
  public terapias$ = this.terapiasSubject.asObservable();

  private terapiasMock: Terapia[] = [
    {
      id: '1',
      nombre: 'Ejercicios de Memoria Visual',
      descripcion: 'Actividades para mejorar la memoria visual y espacial mediante patrones y secuencias.',
      duracion: 15,
      categoria: 'memoria',
      nivelDificultad: 'principiante',
      activa: true,
      objetivos: ['Mejorar memoria a corto plazo', 'Fortalecer atención visual', 'Desarrollar concentración'],
      instrucciones: 'Observa la secuencia de colores y repítela en el mismo orden.',
      materiales: ['Tarjetas de colores', 'Pantalla táctil']
    },
    {
      id: '2',
      nombre: 'Coordinación Motora Fina',
      descripcion: 'Ejercicios para mejorar la precisión y control de movimientos pequeños.',
      duracion: 20,
      categoria: 'motora',
      nivelDificultad: 'intermedio',
      activa: true,
      objetivos: ['Mejorar coordinación mano-ojo', 'Fortalecer músculos de la mano', 'Aumentar precisión'],
      instrucciones: 'Sigue las líneas punteadas con el dedo sin salirte del trazo.',
      materiales: ['Tablet', 'Stylus']
    },
    {
      id: '3',
      nombre: 'Reconocimiento de Patrones',
      descripcion: 'Terapia cognitiva para mejorar el reconocimiento y análisis de patrones.',
      duracion: 25,
      categoria: 'cognitiva',
      nivelDificultad: 'avanzado',
      activa: true,
      objetivos: ['Mejorar análisis visual', 'Desarrollar pensamiento lógico', 'Fortalecer memoria de trabajo'],
      instrucciones: 'Identifica el patrón que continúa la secuencia mostrada.',
      materiales: ['Figuras geométricas', 'Tarjetas de patrones']
    },
    {
      id: '4',
      nombre: 'Terapia del Habla - Pronunciación',
      descripcion: 'Ejercicios específicos para mejorar la pronunciación y articulación.',
      duracion: 30,
      categoria: 'lenguaje',
      nivelDificultad: 'intermedio',
      activa: true,
      objetivos: ['Mejorar articulación', 'Fortalecer músculos orofaciales', 'Aumentar claridad del habla'],
      instrucciones: 'Repite las palabras y frases siguiendo las indicaciones del terapeuta.',
      materiales: ['Espejo', 'Grabadora de voz', 'Tarjetas con palabras']
    },
    {
      id: '5',
      nombre: 'Estimulación Sensorial Táctil',
      descripcion: 'Actividades para mejorar la percepción táctil y la discriminación sensorial.',
      duracion: 18,
      categoria: 'sensorial',
      nivelDificultad: 'principiante',
      activa: true,
      objetivos: ['Mejorar discriminación táctil', 'Aumentar conciencia sensorial', 'Reducir hipersensibilidad'],
      instrucciones: 'Identifica diferentes texturas con los ojos cerrados.',
      materiales: ['Caja de texturas', 'Objetos con diferentes superficies']
    },
    {
      id: '6',
      nombre: 'Equilibrio y Coordinación',
      descripcion: 'Ejercicios para mejorar el equilibrio, la postura y la coordinación corporal.',
      duracion: 35,
      categoria: 'motora',
      nivelDificultad: 'avanzado',
      activa: true,
      objetivos: ['Mejorar equilibrio estático y dinámico', 'Fortalecer músculos centrales', 'Aumentar coordinación'],
      instrucciones: 'Realiza los ejercicios de equilibrio siguiendo las secuencias mostradas.',
      materiales: ['Colchoneta', 'Pelotas de equilibrio', 'Conos']
    },
    {
      id: '7',
      nombre: 'Atención y Concentración',
      descripcion: 'Actividades cognitivas para mejorar la capacidad de atención sostenida.',
      duracion: 22,
      categoria: 'cognitiva',
      nivelDificultad: 'intermedio',
      activa: true,
      objetivos: ['Aumentar tiempo de atención', 'Mejorar concentración', 'Reducir distractibilidad'],
      instrucciones: 'Completa las tareas sin distraerte, siguiendo las instrucciones paso a paso.',
      materiales: ['Computadora', 'Auriculares', 'Cronómetro']
    },
    {
      id: '8',
      nombre: 'Memoria Auditiva',
      descripcion: 'Ejercicios para fortalecer la memoria auditiva y la comprensión oral.',
      duracion: 20,
      categoria: 'memoria',
      nivelDificultad: 'intermedio',
      activa: true,
      objetivos: ['Mejorar memoria auditiva', 'Fortalecer comprensión oral', 'Aumentar retención de información'],
      instrucciones: 'Escucha la secuencia de sonidos y repítela en el mismo orden.',
      materiales: ['Auriculares', 'Reproductor de audio', 'Instrumentos musicales']
    }
  ];

  constructor() {
    this.terapiasSubject.next(this.terapiasMock);
  }

  getTerapias(): Observable<Terapia[]> {
    return of(this.terapiasMock).pipe(delay(500));
  }

  getTerapiaById(id: string): Observable<Terapia | undefined> {
    const terapia = this.terapiasMock.find(t => t.id === id);
    return of(terapia).pipe(delay(300));
  }

  getTerapiasByCategoria(categoria: string): Observable<Terapia[]> {
    const terapias = this.terapiasMock.filter(t => t.categoria === categoria);
    return of(terapias).pipe(delay(400));
  }

  getTerapiasByDificultad(dificultad: string): Observable<Terapia[]> {
    const terapias = this.terapiasMock.filter(t => t.nivelDificultad === dificultad);
    return of(terapias).pipe(delay(400));
  }

  searchTerapias(query: string): Observable<Terapia[]> {
    const terapias = this.terapiasMock.filter(t =>
      t.nombre.toLowerCase().includes(query.toLowerCase()) ||
      t.descripcion.toLowerCase().includes(query.toLowerCase()) ||
      t.categoria.toLowerCase().includes(query.toLowerCase())
    );
    return of(terapias).pipe(delay(300));
  }

  // Método para terapeutas para crear/editar terapias
  saveTerapia(terapia: Terapia): Observable<Terapia> {
    return new Observable(observer => {
      setTimeout(() => {
        const index = this.terapiasMock.findIndex(t => t.id === terapia.id);
        if (index !== -1) {
          this.terapiasMock[index] = terapia;
        } else {
          this.terapiasMock.push(terapia);
        }
        this.terapiasSubject.next([...this.terapiasMock]);
        observer.next(terapia);
        observer.complete();
      }, 800);
    });
  }
}
