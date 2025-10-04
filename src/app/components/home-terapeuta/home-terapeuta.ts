import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Auth } from '../../services/auth';
import { Terapias } from '../../services/terapias';
import { UsuarioService } from '../../services/usuario';
import { Usuario } from '../../models/usuario';
import { Terapia } from '../../models/terapia';
import { Sesion } from '../../models/sesion';

@Component({
  selector: 'app-home-terapeuta',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="home-container">
      <!-- Header de bienvenida -->
      <div class="welcome-section">
        <div class="welcome-content">
          <div class="welcome-text">
            <h1 class="welcome-title">
              ¡Bienvenido de vuelta, {{ getCurrentUserFirstName() }}! 👨‍⚕️
            </h1>
            <p class="welcome-subtitle">
              Desde aquí puedes gestionar tus pacientes, terapias y revisar el progreso general.
            </p>
          </div>
          <div class="welcome-stats">
            <div class="stat-card">
              <div class="stat-icon">👥</div>
              <div class="stat-info">
                <span class="stat-number">{{ estadisticas.pacientesActivos }}</span>
                <span class="stat-label">Pacientes Activos</span>
              </div>
            </div>
            <div class="stat-card">
              <div class="stat-icon">📅</div>
              <div class="stat-info">
                <span class="stat-number">{{ estadisticas.sesionesHoy }}</span>
                <span class="stat-label">Sesiones Hoy</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Dashboard principal -->
      <div class="dashboard-grid">
        <!-- Sesiones programadas -->
        <div class="dashboard-card">
          <div class="card-header">
            <h3>📅 Sesiones Programadas</h3>
            <button class="btn-secondary">Ver todas</button>
          </div>
          <div class="card-content">
            <div *ngIf="sesionesHoy.length === 0" class="empty-state">
              <div class="empty-icon">🗓️</div>
              <p>No hay sesiones programadas para hoy</p>
              <button class="btn-primary">Programar Sesión</button>
            </div>
            <div *ngIf="sesionesHoy.length > 0" class="sesiones-list">
              <div *ngFor="let sesion of sesionesHoy" class="sesion-item">
                <div class="sesion-time">
                  {{ getSesionTime(sesion) }}
                </div>
                <div class="sesion-info">
                  <h4>{{ getSesionTerapia(sesion)?.nombre }}</h4>
                  <p>{{ getSesionPaciente(sesion)?.nombre }}</p>
                </div>
                <div class="sesion-status">
                  <span [class]="'status-' + sesion.estado">
                    {{ getEstadoLabel(sesion.estado) }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Pacientes recientes -->
        <div class="dashboard-card">
          <div class="card-header">
            <h3>👥 Pacientes Recientes</h3>
            <button class="btn-secondary" routerLink="/pacientes">Ver todos</button>
          </div>
          <div class="card-content">
            <div class="pacientes-list">
              <div *ngFor="let paciente of pacientesRecientes" class="paciente-item">
                <div class="paciente-avatar">
                  {{ getPacienteInitials(paciente) }}
                </div>
                <div class="paciente-info">
                  <h4>{{ paciente.nombre }}</h4>
                  <p>Última sesión: {{ getUltimaSesion(paciente) }}</p>
                </div>
                <div class="paciente-progreso">
                  <div class="progress-circle">
                    <div class="progress-value">{{ getPacienteProgreso(paciente) }}%</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Terapias más utilizadas -->
        <div class="dashboard-card">
          <div class="card-header">
            <h3>🧠 Terapias Populares</h3>
            <button class="btn-secondary" routerLink="/terapias">Ver más</button>
          </div>
          <div class="card-content">
            <div class="terapias-populares">
              <div *ngFor="let terapia of terapiasPopulares" class="terapia-popular">
                <div class="terapia-icon">{{ getTerapiaIcon(terapia.categoria) }}</div>
                <div class="terapia-info">
                  <h4>{{ terapia.nombre }}</h4>
                  <p>{{ terapia.categoria }} • {{ terapia.duracion }} min</p>
                </div>
                <div class="terapia-usage">
                  <span class="usage-count">{{ getTerapiaUsage(terapia.id) }}</span>
                  <span class="usage-label">usos</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Acciones rápidas -->
        <div class="dashboard-card">
          <div class="card-header">
            <h3>⚡ Acciones Rápidas</h3>
          </div>
          <div class="card-content">
            <div class="quick-actions">
              <button class="quick-action-btn">
                <div class="action-icon">📋</div>
                <span>Nueva Evaluación</span>
              </button>
              <button class="quick-action-btn" routerLink="/terapias">
                <div class="action-icon">🎯</div>
                <span>Crear Terapia</span>
              </button>
              <button class="quick-action-btn">
                <div class="action-icon">📊</div>
                <span>Generar Reporte</span>
              </button>
              <button class="quick-action-btn" routerLink="/progreso">
                <div class="action-icon">📈</div>
                <span>Ver Estadísticas</span>
              </button>
            </div>
          </div>
        </div>

        <!-- Alertas y notificaciones -->
        <div class="dashboard-card" *ngIf="alertas.length > 0">
          <div class="card-header">
            <h3>🔔 Alertas</h3>
            <button class="btn-link">Marcar como leídas</button>
          </div>
          <div class="card-content">
            <div class="alertas-list">
              <div *ngFor="let alerta of alertas" [class]="'alerta-item alerta-' + alerta.tipo">
                <div class="alerta-icon">{{ getAlertaIcon(alerta.tipo) }}</div>
                <div class="alerta-content">
                  <h4>{{ alerta.titulo }}</h4>
                  <p>{{ alerta.mensaje }}</p>
                  <small>{{ alerta.fecha | date:'short' }}</small>
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
      top: 0;
      right: 0;
      width: 200px;
      height: 200px;
      background: rgba(255,255,255,0.1);
      border-radius: 50%;
      transform: translate(50%, -50%);
    }

    .welcome-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
      position: relative;
      z-index: 1;
    }

    .welcome-title {
      font-size: 28px;
      font-weight: bold;
      margin-bottom: 8px;
      color: white;
    }

    .welcome-subtitle {
      font-size: 16px;
      opacity: 0.9;
      margin: 0;
      max-width: 500px;
    }

    .welcome-stats {
      display: flex;
      gap: 20px;
    }

    .stat-card {
      background: rgba(255,255,255,0.15);
      border-radius: 16px;
      padding: 20px;
      display: flex;
      align-items: center;
      gap: 15px;
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255,255,255,0.2);
      min-width: 140px;
    }

    .stat-icon {
      font-size: 24px;
    }

    .stat-info {
      display: flex;
      flex-direction: column;
    }

    .stat-number {
      font-size: 24px;
      font-weight: bold;
      line-height: 1;
    }

    .stat-label {
      font-size: 12px;
      opacity: 0.8;
      margin-top: 4px;
    }

    .dashboard-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
      gap: 20px;
    }

    .dashboard-card {
      background: white;
      border-radius: 16px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.08);
      border: 1px solid rgba(0,0,0,0.05);
      overflow: hidden;
      transition: all 0.3s ease;
    }

    .dashboard-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 30px rgba(0,0,0,0.12);
    }

    .card-header {
      padding: 20px 20px 0 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
    }

    .card-header h3 {
      font-size: 18px;
      font-weight: 600;
      color: #333;
      margin: 0;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .card-content {
      padding: 0 20px 20px 20px;
    }

    .btn-primary, .btn-secondary, .btn-link {
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

    .btn-link {
      background: none;
      color: #667eea;
      padding: 4px 8px;
    }

    .btn-link:hover {
      text-decoration: underline;
    }

    /* Estilos para listas */
    .sesiones-list, .pacientes-list, .terapias-populares, .alertas-list {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .sesion-item, .paciente-item, .terapia-popular, .alerta-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px;
      background: #f8f9fa;
      border-radius: 12px;
      transition: all 0.2s ease;
    }

    .sesion-item:hover, .paciente-item:hover, .terapia-popular:hover {
      background: #e9ecef;
      transform: translateX(4px);
    }

    .sesion-time {
      font-weight: bold;
      font-size: 14px;
      color: #667eea;
      min-width: 60px;
    }

    .sesion-info, .paciente-info, .terapia-info, .alerta-content {
      flex: 1;
    }

    .sesion-info h4, .paciente-info h4, .terapia-info h4, .alerta-content h4 {
      font-size: 14px;
      font-weight: 600;
      margin: 0 0 4px 0;
      color: #333;
    }

    .sesion-info p, .paciente-info p, .terapia-info p, .alerta-content p {
      font-size: 12px;
      color: #666;
      margin: 0;
    }

    .sesion-status {
      min-width: 80px;
      text-align: right;
    }

    .status-pendiente {
      background: #fff3cd;
      color: #856404;
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 11px;
      font-weight: 500;
    }

    .status-en_progreso {
      background: #d4edda;
      color: #155724;
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 11px;
      font-weight: 500;
    }

    .status-completada {
      background: #d1ecf1;
      color: #0c5460;
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 11px;
      font-weight: 500;
    }

    .paciente-avatar {
      width: 40px;
      height: 40px;
      background: linear-gradient(135deg, #667eea, #764ba2);
      color: white;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: bold;
      font-size: 14px;
    }

    .progress-circle {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      background: conic-gradient(#667eea 0deg, #667eea calc(3.6deg), #e9ecef calc( 3.6deg), #e9ecef 360deg);
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
    }

    .progress-circle::before {
      content: '';
      width: 28px;
      height: 28px;
      background: white;
      border-radius: 50%;
      position: absolute;
    }

    .progress-value {
      font-size: 10px;
      font-weight: bold;
      color: #333;
      z-index: 1;
    }

    .terapia-icon, .alerta-icon {
      font-size: 20px;
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #f8f9fa;
      border-radius: 10px;
    }

    .terapia-usage {
      text-align: right;
    }

    .usage-count {
      font-size: 18px;
      font-weight: bold;
      color: #667eea;
      display: block;
    }

    .usage-label {
      font-size: 11px;
      color: #666;
    }

    .quick-actions {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 12px;
    }

    .quick-action-btn {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8px;
      padding: 20px;
      background: #f8f9fa;
      border: 1px solid #e9ecef;
      border-radius: 12px;
      cursor: pointer;
      transition: all 0.2s ease;
      text-decoration: none;
      color: #333;
    }

    .quick-action-btn:hover {
      background: #e9ecef;
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    }

    .action-icon {
      font-size: 24px;
      width: 48px;
      height: 48px;
      background: white;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }

    .empty-state {
      text-align: center;
      padding: 40px 20px;
      color: #666;
    }

    .empty-icon {
      font-size: 48px;
      margin-bottom: 16px;
      opacity: 0.5;
    }

    .alerta-item {
      border-left: 4px solid #17a2b8;
    }

    .alerta-item.alerta-warning {
      border-left-color: #ffc107;
    }

    .alerta-item.alerta-error {
      border-left-color: #dc3545;
    }

    .alerta-content small {
      color: #999;
      font-size: 11px;
    }

    @media (max-width: 768px) {
      .home-container {
        padding: 15px;
      }

      .welcome-content {
        flex-direction: column;
        gap: 20px;
        text-align: center;
      }

      .welcome-stats {
        justify-content: center;
      }

      .stat-card {
        min-width: 120px;
        padding: 15px;
      }

      .dashboard-grid {
        grid-template-columns: 1fr;
      }

      .quick-actions {
        grid-template-columns: 1fr;
      }

      .welcome-title {
        font-size: 24px;
      }
    }
  `]
})
export class HomeTerapeutaComponent implements OnInit {
  currentUser: Usuario | null = null;
  sesionesHoy: Sesion[] = [];
  pacientesRecientes: Usuario[] = [];
  terapiasPopulares: Terapia[] = [];
  alertas: any[] = [];
  estadisticas = {
    pacientesActivos: 8,
    sesionesHoy: 5
  };

  constructor(
    private authService: Auth,
    private terapiasService: Terapias,
    private usuarioService: UsuarioService
  ) {}

  getCurrentUserFirstName(): string {
    return this.currentUser?.nombre?.split(' ')[0] || 'Doctor';
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
    // Cargar datos del dashboard
    this.loadSesionesHoy();
    this.loadPacientesRecientes();
    this.loadTerapiasPopulares();
    this.loadAlertas();
  }

  loadSesionesHoy(): void {
    if (this.currentUser) {
      this.usuarioService.getSesionesTerapeuta(this.currentUser.id).subscribe(sesiones => {
        const hoy = new Date();
        this.sesionesHoy = sesiones.filter(sesion => {
          const fechaSesion = new Date(sesion.fechaInicio);
          return fechaSesion.toDateString() === hoy.toDateString();
        });
      });
    }
  }

  loadPacientesRecientes(): void {
    // Datos mock de pacientes recientes
    this.pacientesRecientes = [
      {
        id: '2',
        nombre: 'Juan Pérez',
        email: 'juan.perez@email.com',
        tipo: 'paciente',
        fechaRegistro: new Date('2024-02-20'),
        activo: true
      },
      {
        id: '4',
        nombre: 'Carlos González',
        email: 'carlos.gonzalez@email.com',
        tipo: 'paciente',
        fechaRegistro: new Date('2024-03-05'),
        activo: true
      },
      {
        id: '5',
        nombre: 'María Rodríguez',
        email: 'maria.rodriguez@email.com',
        tipo: 'paciente',
        fechaRegistro: new Date('2024-03-15'),
        activo: true
      }
    ];
  }

  loadTerapiasPopulares(): void {
    this.terapiasService.getTerapias().subscribe(terapias => {
      this.terapiasPopulares = terapias.slice(0, 4); // Tomar las primeras 4
    });
  }

  loadAlertas(): void {
    this.alertas = [
      {
        id: '1',
        tipo: 'info',
        titulo: 'Sesión próxima',
        mensaje: 'Juan Pérez tiene una sesión en 30 minutos',
        fecha: new Date()
      },
      {
        id: '2',
        tipo: 'warning',
        titulo: 'Evaluación pendiente',
        mensaje: 'Carlos González necesita una evaluación de progreso',
        fecha: new Date(Date.now() - 60 * 60 * 1000) // Hace 1 hora
      }
    ];
  }

  getSesionTime(sesion: Sesion): string {
    return new Date(sesion.fechaInicio).toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  getSesionTerapia(sesion: Sesion): Terapia | undefined {
    return this.terapiasPopulares.find(t => t.id === sesion.terapiaId);
  }

  getSesionPaciente(sesion: Sesion): Usuario | undefined {
    return this.pacientesRecientes.find(p => p.id === sesion.pacienteId);
  }

  getEstadoLabel(estado: string): string {
    const labels: { [key: string]: string } = {
      'pendiente': 'Pendiente',
      'en_progreso': 'En Curso',
      'completada': 'Completada',
      'cancelada': 'Cancelada'
    };
    return labels[estado] || estado;
  }

  getPacienteInitials(paciente: Usuario): string {
    const names = paciente.nombre.split(' ');
    if (names.length >= 2) {
      return (names[0][0] + names[1][0]).toUpperCase();
    }
    return names[0][0].toUpperCase();
  }

  getUltimaSesion(paciente: Usuario): string {
    // Mock data - en la implementación real buscarías en las sesiones
    const fechas = ['Ayer', 'Hace 2 días', 'Hace 3 días', 'Hace 1 semana'];
    return fechas[Math.floor(Math.random() * fechas.length)];
  }

  getPacienteProgreso(paciente: Usuario): number {
    // Mock data - en la implementación real calcularías el progreso real
    const progresos = [75, 82, 68, 91, 55];
    return progresos[Math.floor(Math.random() * progresos.length)];
  }

  getTerapiaIcon(categoria: string): string {
    const iconos: { [key: string]: string } = {
      'cognitiva': '🧠',
      'motora': '🤸‍♂️',
      'sensorial': '👁️',
      'lenguaje': '🗣️',
      'memoria': '💭'
    };
    return iconos[categoria] || '🎯';
  }

  getTerapiaUsage(terapiaId: string): number {
    // Mock data - en la implementación real contarías el uso real
    const usos = [15, 23, 8, 31, 12];
    return usos[Math.floor(Math.random() * usos.length)];
  }

  getAlertaIcon(tipo: string): string {
    const iconos: { [key: string]: string } = {
      'info': 'ℹ️',
      'warning': '⚠️',
      'error': '❌',
      'success': '✅'
    };
    return iconos[tipo] || 'ℹ️';
  }
}
