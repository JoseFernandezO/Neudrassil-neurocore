import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Sesion, ProgresoUsuario, EstadisticasSesion } from '../models/sesion';
import { Auth } from './auth';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private sesionesSubject = new BehaviorSubject<Sesion[]>([]);
  public sesiones$ = this.sesionesSubject.asObservable();

  private sesionesMock: Sesion[] = [
    {
      id: 's1',
      pacienteId: '2',
      terapeutaId: '1',
      terapiaId: '1',
      fechaInicio: new Date('2024-09-20T10:00:00'),
      fechaFin: new Date('2024-09-20T10:15:00'),
      duracion: 15,
      completada: true,
      progreso: 85,
      estado: 'completada',
      calificacion: 4,
      notas: 'Excelente progreso en memoria visual'
    },
    {
      id: 's2',
      pacienteId: '2',
      terapeutaId: '1',
      terapiaId: '2',
      fechaInicio: new Date('2024-09-21T14:30:00'),
      fechaFin: new Date('2024-09-21T14:50:00'),
      duracion: 20,
      completada: true,
      progreso: 70,
      estado: 'completada',
      calificacion: 3,
      notas: 'Necesita más práctica en coordinación fina'
    },
    {
      id: 's3',
      pacienteId: '2',
      terapeutaId: '1',
      terapiaId: '3',
      fechaInicio: new Date('2024-09-22T09:00:00'),
      duracion: 25,
      completada: false,
      progreso: 45,
      estado: 'en_progreso',
      notas: 'Sesión en progreso'
    },
    {
      id: 's4',
      pacienteId: '4',
      terapeutaId: '3',
      terapiaId: '4',
      fechaInicio: new Date('2024-09-19T16:00:00'),
      fechaFin: new Date('2024-09-19T16:30:00'),
      duracion: 30,
      completada: true,
      progreso: 90,
      estado: 'completada',
      calificacion: 5,
      notas: 'Excelente pronunciación'
    },
    {
      id: 's5',
      pacienteId: '2',
      terapeutaId: '1',
      terapiaId: '5',
      fechaInicio: new Date('2024-09-23T11:00:00'),
      duracion: 18,
      completada: false,
      progreso: 0,
      estado: 'pendiente',
      notas: 'Programada para hoy'
    }
  ];

  constructor(private authService: Auth) {
    this.sesionesSubject.next(this.sesionesMock);
  }

  getSesionesPaciente(pacienteId: string): Observable<Sesion[]> {
    const sesiones = this.sesionesMock.filter(s => s.pacienteId === pacienteId);
    return of(sesiones).pipe(delay(400));
  }

  getSesionesTerapeuta(terapeutaId: string): Observable<Sesion[]> {
    const sesiones = this.sesionesMock.filter(s => s.terapeutaId === terapeutaId);
    return of(sesiones).pipe(delay(400));
  }

  getProgresoUsuario(usuarioId: string): Observable<ProgresoUsuario> {
    const sesiones = this.sesionesMock.filter(s =>
      s.pacienteId === usuarioId || s.terapeutaId === usuarioId
    );

    const sesionesCompletadas = sesiones.filter(s => s.completada).length;
    const totalSesiones = sesiones.length;
    const porcentajeGeneral = totalSesiones > 0 ? (sesionesCompletadas / totalSesiones) * 100 : 0;

    const terapiasEnCurso = [...new Set(
      sesiones.filter(s => !s.completada && s.estado !== 'cancelada').map(s => s.terapiaId)
    )];

    const terapiasCompletadas = [...new Set(
      sesiones.filter(s => s.completada).map(s => s.terapiaId)
    )];

    const progreso: ProgresoUsuario = {
      usuarioId,
      totalSesiones,
      sesionesCompletadas,
      porcentajeGeneral: Math.round(porcentajeGeneral),
      terapiasEnCurso,
      terapiasCompletadas,
      ultimaActividad: new Date(),
      racha: 5 // Mock data
    };

    return of(progreso).pipe(delay(500));
  }

  getEstadisticasSesion(usuarioId: string): Observable<EstadisticasSesion> {
    const sesiones = this.sesionesMock.filter(s =>
      s.pacienteId === usuarioId || s.terapeutaId === usuarioId
    );

    const sesionesCompletadas = sesiones.filter(s => s.completada);
    const totalTiempo = sesionesCompletadas.reduce((total, s) => total + s.duracion, 0);
    const promedioCalificacion = sesionesCompletadas.length > 0
      ? sesionesCompletadas.reduce((total, s) => total + (s.calificacion || 0), 0) / sesionesCompletadas.length
      : 0;

    const ahora = new Date();
    const inicioSemana = new Date(ahora.setDate(ahora.getDate() - ahora.getDay()));
    const sesionesEstaSemana = sesiones.filter(s => new Date(s.fechaInicio) >= inicioSemana).length;

    const estadisticas: EstadisticasSesion = {
      totalTiempo,
      promedioCalificacion: Math.round(promedioCalificacion * 10) / 10,
      sesionesEstaSemana,
      mejorRacha: 7, // Mock data
      categoriaMasUsada: 'cognitiva', // Mock data
      horasAcumuladas: Math.round(totalTiempo / 60 * 10) / 10
    };

    return of(estadisticas).pipe(delay(400));
  }

  crearSesion(sesion: Omit<Sesion, 'id'>): Observable<Sesion> {
    return new Observable(observer => {
      setTimeout(() => {
        const nuevaSesion: Sesion = {
          ...sesion,
          id: 's' + (this.sesionesMock.length + 1)
        };
        this.sesionesMock.push(nuevaSesion);
        this.sesionesSubject.next([...this.sesionesMock]);
        observer.next(nuevaSesion);
        observer.complete();
      }, 600);
    });
  }

  actualizarSesion(id: string, actualizaciones: Partial<Sesion>): Observable<Sesion> {
    return new Observable(observer => {
      setTimeout(() => {
        const index = this.sesionesMock.findIndex(s => s.id === id);
        if (index !== -1) {
          this.sesionesMock[index] = { ...this.sesionesMock[index], ...actualizaciones };
          this.sesionesSubject.next([...this.sesionesMock]);
          observer.next(this.sesionesMock[index]);
          observer.complete();
        } else {
          observer.error({ message: 'Sesión no encontrada' });
        }
      }, 500);
    });
  }
}
