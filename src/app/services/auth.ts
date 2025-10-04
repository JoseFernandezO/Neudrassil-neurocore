import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Usuario } from '../models/usuario';

@Injectable({
  providedIn: 'root'
})
export class Auth {
  private currentUserSubject = new BehaviorSubject<Usuario | null>(null);
  public currentUser = this.currentUserSubject.asObservable();

  constructor() {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      this.currentUserSubject.next(JSON.parse(savedUser));
    }
  }

  login(credentials: any): Observable<any> {
    return new Observable(observer => {
      setTimeout(() => {
        // Usuarios de prueba
        const testUsers: Usuario[] = [
          {
            id: '1',
            nombre: 'Dr. Ana García',
            email: 'ana.garcia@neudrassil.com',
            tipo: 'terapeuta',
            fechaRegistro: new Date('2024-01-15'),
            activo: true,
            especialidad: 'Neuropsicología',
            telefono: '+1-555-0123'
          },
          {
            id: '2',
            nombre: 'Juan Pérez',
            email: 'juan.perez@email.com',
            tipo: 'paciente',
            fechaRegistro: new Date('2024-02-20'),
            activo: true,
            telefono: '+1-555-0124'
          },
          {
            id: '3',
            nombre: 'Dra. María López',
            email: 'maria.lopez@neudrassil.com',
            tipo: 'terapeuta',
            fechaRegistro: new Date('2024-01-10'),
            activo: true,
            especialidad: 'Terapia Ocupacional',
            telefono: '+1-555-0125'
          },
          {
            id: '4',
            nombre: 'Carlos González',
            email: 'carlos.gonzalez@email.com',
            tipo: 'paciente',
            fechaRegistro: new Date('2024-03-05'),
            activo: true,
            telefono: '+1-555-0126'
          }
        ];

        // Buscar usuario que coincida con email y tipo
        const user = testUsers.find(u =>
          u.email === credentials.email &&
          u.tipo === credentials.userType
        );

        if (user) {
          // Guardar usuario en localStorage
          localStorage.setItem('currentUser', JSON.stringify(user));
          this.currentUserSubject.next(user);

          observer.next({ success: true, user });
          observer.complete();
        } else {
          observer.error({ message: 'Credenciales inválidas' });
        }
      }, 1000); // Simular delay de red
    });
  }

  logout(): void {
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }

  getCurrentUser(): Usuario | null {
    return this.currentUserSubject.value;
  }

  isAuthenticated(): boolean {
    return this.currentUserSubject.value !== null;
  }

  getUserType(): 'terapeuta' | 'paciente' | null {
    const user = this.getCurrentUser();
    return user ? user.tipo : null;
  }

  // Método para actualizar datos del usuario
  updateUser(userData: Partial<Usuario>): Observable<Usuario> {
    return new Observable(observer => {
      const currentUser = this.getCurrentUser();
      if (currentUser) {
        const updatedUser = { ...currentUser, ...userData };
        localStorage.setItem('currentUser', JSON.stringify(updatedUser));
        this.currentUserSubject.next(updatedUser);
        observer.next(updatedUser);
        observer.complete();
      } else {
        observer.error({ message: 'No hay usuario logueado' });
      }
    });
  }
}
