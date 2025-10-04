import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Auth } from '../../services/auth';
import { Terapias } from '../../services/terapias';
import { UsuarioService } from '../../services/usuario';
import { Usuario } from '../../models/usuario';
import { Terapia } from '../../models/terapia';
import { Sesion, ProgresoUsuario } from '../../models/sesion';

@Component({
  selector: 'app-home-paciente',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="home-container">
      <!-- Saludo personalizado -->
      <div class="welcome-section">
        <div class="welcome-content">
          <div class="welcome-avatar">
            <div class="avatar-circle">{{ getUserInitials() }}</div>
            <div class="avatar-status">🟢</div>
          </div>
          <div class="welcome-text">
            <h1 class="welcome-title">
              ¡Hola {{ getCurrentUserFirstName() }}! 👋
            </h1>
            <p class="welcome-message">{{ getWelcomeMessage() }}</p>
            <div class="daily-goal">
              <span class="goal-icon">🎯</span>
              <span>Meta de hoy: {{ metaDiaria.completadas }}/{{ metaDiaria.total }} sesiones</span>
              <div class="goal-progress">
                <div class="goal-bar" [style.width.%]="(metaDiaria.completadas / metaDiaria.total) * 100"></div>
              </div>
            </div>
          </div>
          <div class="streak-counter">
            <div class="streak-number">{{ progreso?.racha || 0 }}</div>
            <div class="streak-label">días seguidos</div>
            <div class="streak-fire">🔥</div>
          </div>
        </div>
      </div>

      <!-- Dashboard principal -->
      <div class="dashboard-grid">
        <!-- Progreso general -->
        <div class="dashboard-card progress-card">
          <div class="card-header">
            <h3>📊 Mi Progreso</h3>
            <button class="btn-secondary" routerLink="/progreso">Ver detalle</button>
          </div>
          <div class="card-content">
            <div class="progress-overview">
              <div class="main-progress">
                <div class="progress-circle-large">
                  <svg viewBox="0 0 100 100" class="progress-svg">
                    <circle cx="50" cy="50" r="45" class="progress-bg"></circle>
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      class="progress-fill"
                      [style.stroke-dashoffset]="getProgressOffset()">
                    </circle>
                  </svg>
                  <div class="progress-text">
                    <span class="progress-percentage">{{ progreso?.porcentajeGeneral || 0 }}%</span>
                    <span class="progress-label">Completado</span>
                  </div>
                </div>
              </div>
              <div class="progress-stats">
                <div class="stat">
                  <span class="stat-number">{{ progreso?.sesionesCompletadas || 0 }}</span>
                  <span class="stat-label">Sesiones completadas</span>
                </div>
                <div class="stat">
                  <span class="stat-number">{{ progreso?.terapiasCompletadas?.length || 0 }}</span>
                  <span class="stat-label">Terapias dominadas</span>
                </div>
                <div class="stat">
                  <span class="stat-number">{{ getTiempoTotal() }}h</span>
                  <span class="stat-label">Tiempo invertido</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Próxima sesión -->
        <div class="dashboard-card">
          <div class="card-header">
            <h3>⏰ Próxima Sesión</h3>
          </div>
          <div class="card-content">
            <div *ngIf="proximaSesion" class="next-session">
              <div class="session-header">
                <div class="session-icon">{{ getTerapiaIcon(proximaSesion) }}</div>
                <div class="session-info">
                  <h4>{{ getProximaSesionNombre() }}</h4>
                  <p>{{ getProximaSesionHora() }}</p>
                </div>
              </div>
              <div class="session-details">
                <div class="detail-item">
                  <span class="detail-icon">⏱️</span>
                  <span>{{ proximaSesion?.duracion || 15 }} minutos</span>
                </div>
                <div class="detail-item">
                  <span class="detail-icon">🎯</span>
                  <span>{{ getDificultadNombre(proximaSesion) }}</span>
                </div>
              </div>
              <button class="btn-start-session" (click)="iniciarSesion()">
                <span class="btn-icon">▶️</span>
                Comenzar Sesión
              </button>
            </div>
            <div *ngIf="!proximaSesion" class="no-session">
              <div class="empty-icon">📅</div>
              <p>No tienes sesiones programadas</p>
              <button class="btn-primary" routerLink="/terapias">Explorar Terapias</button>
            </div>
          </div>
        </div>

        <!-- Terapias en curso -->
        <div class="dashboard-card">
          <div class="card-header">
            <h3>🎯 Terapias Activas</h3>
            <button class="btn-secondary" routerLink="/terapias">Ver todas</button>
          </div>
          <div class="card-content">
            <div class="terapias-activas">
              <div *ngFor="let terapia of terapiasEnCurso" class="terapia-activa">
                <div class="terapia-icon-container">
                  <div class="terapia-icon">{{ getTerapiaIconByCategory(terapia.categoria) }}</div>
                  <div class="terapia-progress-mini">{{ getTerapiaProgreso(terapia.id) }}%</div>
                </div>
                <div class="terapia-info">
                  <h4>{{ terapia.nombre }}</h4>
                  <p>{{ getUltimaSesionTerapia(terapia.id) }}</p>
                  <div class="terapia-progress-bar">
                    <div class="progress-bar-fill" [style.width.%]="getTerapiaProgreso(terapia.id)"></div>
                  </div>
                </div>
                <button class="btn-continue" (click)="continuarTerapia(terapia)">
                  Continuar
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Logros recientes -->
        <div class="dashboard-card">
          <div class="card-header">
            <h3>🏆 Logros Recientes</h3>
          </div>
          <div class="card-content">
            <div class="achievements">
              <div *ngFor="let logro of logrosRecientes" class="achievement">
                <div class="achievement-icon">{{ logro.icono }}</div>
                <div class="achievement-info">
                  <h4>{{ logro.nombre }}</h4>
                  <p>{{ logro.descripcion }}</p>
                  <small>{{ logro.fecha | date:'short' }}</small>
                </div>
                <div *ngIf="logro.nuevo" class="achievement-badge">¡Nuevo!</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Recomendaciones -->
        <div class="dashboard-card">
          <div class="card-header">
            <h3>💡 Recomendado para ti</h3>
          </div>
          <div class="card-content">
            <div class="recommendations">
              <div *ngFor="let recom of recomendaciones" class="recommendation">
                <div class="recommendation-type">{{ recom.tipo }}</div>
                <h4>{{ recom.titulo }}</h4>
                <p>{{ recom.descripcion }}</p>
                <button class="btn-try" (click)="probarRecomendacion(recom)">
                  Probar ahora
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Estadísticas rápidas -->
        <div class="dashboard-card stats-card">
          <div class="card-header">
            <h3>📈 Esta Semana</h3>
          </div>
          <div class="card-content">
            <div class="weekly-stats">
              <div class="stat-item">
                <div class="stat-icon">⏰</div>
                <div class="stat-content">
                  <span class="stat-value">{{ estadisticasSemana.tiempoTotal }}m</span>
                  <span class="stat-name">Tiempo total</span>
                </div>
              </div>
              <div class="stat-item">
                <div class="stat-icon">✅</div>
                <div class="stat-content">
                  <span class="stat-value">{{ estadisticasSemana.sesionesCompletadas }}</span>
                  <span class="stat-name">Sesiones</span>
                </div>
              </div>
              <div class="stat-item">
                <div class="stat-icon">🎯</div>
                <div class="stat-content">
                  <span class="stat-value">{{ estadisticasSemana.precision }}%</span>
                  <span class="stat-name">Precisión</span>
                </div>
              </div>
              <div class="stat-item">
                <div class="stat-icon">⭐</div>
                <div class="stat-content">
                  <span class="stat-value">{{ estadisticasSemana.promedioCalificacion }}</span>
                  <span class="stat-name">Calificación</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .home-container {
      padding: 20px;
      max-width: 1400px;
      margin: 0 auto;
      min-height: calc(100vh - 70px);
    }

    .welcome-section {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border-radius: 20px;
      padding: 30px;
      margin-bottom: 30px;
      color: white;
      position: relative;
      overflow: hidden;
    }

    .welcome-section::before {
      content: '';
      position: absolute;
      top: -50px;
      right: -50px;
      width: 200px;
      height: 200px;
      background: rgba(255,255,255,0.1);
      border-radius: 50%;
    }

    .welcome-content {
      display: flex;
      align-items: center;
      gap: 25px;
      position: relative;
      z-index: 1;
    }

    .welcome-avatar {
      position: relative;
    }

    .avatar-circle {
      width: 80px;
      height: 80px;
      background: rgba(255,255,255,0.2);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 28px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .btn-try:hover {
      background: #5a67d8;
    }

    .stats-card {
      grid-column: span 1;
    }

    .weekly-stats {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 15px;
    }

    .stat-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 15px;
      background: #f8f9fa;
      border-radius: 12px;
    }

    .stat-icon {
      font-size: 20px;
      width: 40px;
      height: 40px;
      background: white;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }

    .stat-content {
      display: flex;
      flex-direction: column;
    }

    .stat-value {
      font-size: 18px;
      font-weight: bold;
      color: #333;
    }

    .stat-name {
      font-size: 11px;
      color: #666;
      text-transform: uppercase;
    }

    .btn-primary, .btn-secondary {
      border: none;
      border-radius: 8px;
      padding: 8px 16px;
      font-size: 14px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s ease;
      text-decoration: none;
      display: inline-block;
    }

    .btn-primary {
      background: linear-gradient(135deg, #667eea, #764ba2);
      color: white;
    }

    .btn-primary:hover {
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
    }

    .btn-secondary {
      background: #f8f9fa;
      color: #667eea;
      border: 1px solid #e9ecef;
    }

    .btn-secondary:hover {
      background: #e9ecef;
    }

    @media (max-width: 768px) {
      .home-container {
        padding: 15px;
      }

      .welcome-content {
        flex-direction: column;
        text-align: center;
        gap: 20px;
      }

      .welcome-title {
        font-size: 24px;
      }

      .dashboard-grid {
        grid-template-columns: 1fr;
      }

      .progress-card {
        grid-column: span 1;
      }

      .progress-overview {
        flex-direction: column;
        gap: 20px;
      }

      .weekly-stats {
        grid-template-columns: 1fr;
      }

      .avatar-circle {
        width: 60px;
        height: 60px;
        font-size: 20px;
      }

      .streak-counter {
        padding: 15px;
      }

      .streak-number {
        font-size: 28px;
      }
    }
  `]
})
export class HomePacienteComponent implements OnInit {
  currentUser: Usuario | null = null;
  progreso: ProgresoUsuario | null = null;
  proximaSesion: any = null;
  terapiasEnCurso: Terapia[] = [];
  logrosRecientes: any[] = [];
  recomendaciones: any[] = [];
  metaDiaria = { completadas: 2, total: 3 };
  estadisticasSemana = {
    tiempoTotal: 120,
    sesionesCompletadas: 8,
    precision: 87,
    promedioCalificacion: 4.2
  };

  constructor(
    private authService: Auth,
    private terapiasService: Terapias,
    private usuarioService: UsuarioService
  ) {}


  getCurrentUserFirstName(): string {
    return this.currentUser?.nombre?.split(' ')[0] || 'Usuario';
  }

  ngOnInit(): void {
    this.authService.currentUser.subscribe(user => {
      this.currentUser = user;
      if (user) {
        this.loadDashboardData();
      }
    });
  }

  loadDashboardData(): void {
    if (this.currentUser) {
      // Cargar progreso del usuario
      this.usuarioService.getProgresoUsuario(this.currentUser.id).subscribe(progreso => {
        this.progreso = progreso;
      });

      // Cargar terapias en curso
      this.terapiasService.getTerapias().subscribe(terapias => {
        this.terapiasEnCurso = terapias.filter(t => t.activa).slice(0, 3);
      });

      this.loadProximaSesion();
      this.loadLogros();
      this.loadRecomendaciones();
    }
  }

  loadProximaSesion(): void {
    // Mock data - próxima sesión programada
    this.proximaSesion = {
      id: 'next1',
      terapiaId: '1',
      nombre: 'Ejercicios de Memoria Visual',
      categoria: 'memoria',
      duracion: 15,
      nivelDificultad: 'principiante',
      fechaInicio: new Date(Date.now() + 30 * 60 * 1000), // En 30 minutos
      estado: 'pendiente'
    };
  }

  loadLogros(): void {
    this.logrosRecientes = [
      {
        id: '1',
        icono: '🎯',
        nombre: 'Primera Sesión',
        descripcion: 'Completaste tu primera sesión de terapia',
        fecha: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        nuevo: false
      },
      {
        id: '2',
        icono: '🔥',
        nombre: 'Racha de 5 días',
        descripcion: 'Has completado sesiones 5 días consecutivos',
        fecha: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        nuevo: true
      },
      {
        id: '3',
        icono: '⭐',
        nombre: 'Puntuación Perfecta',
        descripcion: 'Obtuviste 5 estrellas en una sesión',
        fecha: new Date(),
        nuevo: true
      }
    ];
  }

  loadRecomendaciones(): void {
    this.recomendaciones = [
      {
        id: '1',
        tipo: 'TERAPIA',
        titulo: 'Coordinación Motora Fina',
        descripcion: 'Basado en tu progreso, esta terapia podría ayudarte a mejorar la precisión de tus movimientos.',
        terapiaId: '2'
      },
      {
        id: '2',
        tipo: 'EJERCICIO',
        titulo: 'Ejercicios de Respiración',
        descripcion: 'Combina tus sesiones con ejercicios de relajación para mejores resultados.',
        terapiaId: null
      }
    ];
  }

  getUserInitials(): string {
    if (!this.currentUser?.nombre) return '👤';
    const names = this.currentUser.nombre.split(' ');
    if (names.length >= 2) {
      return (names[0][0] + names[1][0]).toUpperCase();
    }
    return names[0][0].toUpperCase();
  }

  getWelcomeMessage(): string {
    const hora = new Date().getHours();
    const nombre = this.currentUser?.nombre?.split(' ')[0] || '';

    if (hora < 12) {
      return `¡Buenos días! Es un excelente momento para comenzar tus terapias.`;
    } else if (hora < 18) {
      return `¡Buenas tardes! ¿Listo para continuar con tu progreso?`;
    } else {
      return `¡Buenas noches! Termina el día con una sesión relajante.`;
    }
  }

  getProgressOffset(): number {
    const percentage = this.progreso?.porcentajeGeneral || 0;
    const circumference = 2 * Math.PI * 45; // Radio 45
    return circumference - (percentage / 100) * circumference;
  }

  getTiempoTotal(): number {
    // Mock calculation - en implementación real sumar duración de todas las sesiones
    return Math.round((this.progreso?.sesionesCompletadas || 0) * 20 / 60 * 10) / 10;
  }

  getTerapiaIcon(sesion: any): string {
    const iconos: { [key: string]: string } = {
      'memoria': '💭',
      'cognitiva': '🧠',
      'motora': '🤸‍♂️',
      'sensorial': '👁️',
      'lenguaje': '🗣️'
    };
    return iconos[sesion?.categoria] || '🎯';
  }

  getTerapiaIconByCategory(categoria: string): string {
    const iconos: { [key: string]: string } = {
      'memoria': '💭',
      'cognitiva': '🧠',
      'motora': '🤸‍♂️',
      'sensorial': '👁️',
      'lenguaje': '🗣️'
    };
    return iconos[categoria] || '🎯';
  }

  getProximaSesionNombre(): string {
    return this.proximaSesion?.nombre || 'Sesión de Terapia';
  }

  getProximaSesionHora(): string {
    if (!this.proximaSesion?.fechaInicio) return '';
    const fecha = new Date(this.proximaSesion.fechaInicio);
    const ahora = new Date();
    const diffMinutos = Math.floor((fecha.getTime() - ahora.getTime()) / (1000 * 60));

    if (diffMinutos < 60) {
      return `En ${diffMinutos} minutos`;
    } else {
      return fecha.toLocaleTimeString('es-ES', {
        hour: '2-digit',
        minute: '2-digit'
      });
    }
  }

  getDificultadNombre(sesion: any): string {
    const nombres: { [key: string]: string } = {
      'principiante': 'Principiante',
      'intermedio': 'Intermedio',
      'avanzado': 'Avanzado'
    };
    return nombres[sesion?.nivelDificultad] || 'Principiante';
  }

  getTerapiaProgreso(terapiaId: string): number {
    // Mock data - en implementación real buscar el progreso real de la terapia
    const progresos: { [key: string]: number } = {
      '1': 75,
      '2': 45,
      '3': 90,
      '4': 60,
      '5': 30
    };
    return progresos[terapiaId] || 50;
  }

  getUltimaSesionTerapia(terapiaId: string): string {
    // Mock data - en implementación real buscar la última sesión
    const fechas = ['Ayer', 'Hace 2 días', 'Hace 3 días'];
    return fechas[Math.floor(Math.random() * fechas.length)];
  }

  iniciarSesion(): void {
    if (this.proximaSesion) {
      console.log('Iniciando sesión:', this.proximaSesion.nombre);
      // Aquí navegarías a la pantalla de la sesión
      // this.router.navigate(['/sesion', this.proximaSesion.id]);
    }
  }

  continuarTerapia(terapia: Terapia): void {
    console.log('Continuando terapia:', terapia.nombre);
    // Aquí navegarías a la terapia específica
    // this.router.navigate(['/terapia', terapia.id]);
  }

  probarRecomendacion(recomendacion: any): void {
    console.log('Probando recomendación:', recomendacion.titulo);
    if (recomendacion.terapiaId) {
      // Navegar a la terapia recomendada
      // this.router.navigate(['/terapia', recomendacion.terapiaId]);
    }
  }
}
