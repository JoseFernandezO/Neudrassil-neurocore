import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Auth } from '../../services/auth';
import { UsuarioService } from '../../services/usuario';
import { Terapias } from '../../services/terapias';
import { Usuario } from '../../models/usuario';
import { ProgresoUsuario, EstadisticasSesion, Sesion } from '../../models/sesion';
import { Terapia } from '../../models/terapia';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-progreso-sesion',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="progreso-container">
      <!-- Header con resumen general -->
      <div class="header-section">
        <div class="header-content">
          <div class="header-text">
            <h1 class="page-title">📈 Mi Progreso</h1>
            <p class="page-subtitle">
              Visualiza tu evolución y estadísticas detalladas de tus sesiones de terapia
            </p>
          </div>
          <div class="overall-progress">
            <div class="progress-circle-large">
              <svg viewBox="0 0 120 120" class="progress-svg">
                <circle cx="60" cy="60" r="54" class="progress-bg"></circle>
                <circle
                  cx="60"
                  cy="60"
                  r="54"
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
        </div>
      </div>

      <!-- Métricas principales -->
      <div class="metrics-grid">
        <div class="metric-card">
          <div class="metric-icon">🎯</div>
          <div class="metric-content">
            <span class="metric-value">{{ progreso?.sesionesCompletadas || 0 }}</span>
            <span class="metric-label">Sesiones Completadas</span>
            <span class="metric-sublabel">de {{ progreso?.totalSesiones || 0 }} totales</span>
          </div>
        </div>

        <div class="metric-card">
          <div class="metric-icon">🔥</div>
          <div class="metric-content">
            <span class="metric-value">{{ progreso?.racha || 0 }}</span>
            <span class="metric-label">Días de Racha</span>
            <span class="metric-sublabel">¡Sigue así!</span>
          </div>
        </div>

        <div class="metric-card">
          <div class="metric-icon">⏱️</div>
          <div class="metric-content">
            <span class="metric-value">{{ estadisticas?.horasAcumuladas || 0 }}h</span>
            <span class="metric-label">Horas de Práctica</span>
            <span class="metric-sublabel">Tiempo total invertido</span>
          </div>
        </div>

        <div class="metric-card">
          <div class="metric-icon">⭐</div>
          <div class="metric-content">
            <span class="metric-value">{{ estadisticas?.promedioCalificacion || 0 }}</span>
            <span class="metric-label">Calificación Promedio</span>
            <span class="metric-sublabel">De 5 estrellas</span>
          </div>
        </div>
      </div>

      <!-- Gráficos y estadísticas -->
      <div class="charts-section">
        <!-- Progreso semanal -->
        <div class="chart-card">
          <div class="card-header">
            <h3>📊 Progreso Semanal</h3>
            <select class="time-filter" [(ngModel)]="selectedPeriod" (change)="updateChartData()">
              <option value="week">Última semana</option>
              <option value="month">Último mes</option>
              <option value="year">Último año</option>
            </select>
          </div>
          <div class="card-content">
            <div class="weekly-chart">
              <div *ngFor="let day of weeklyData" class="chart-bar-container">
                <div class="chart-bar">
                  <div
                    class="bar-fill"
                    [style.height.%]="day.percentage"
                    [title]="day.label + ': ' + day.value + ' sesiones'">
                  </div>
                </div>
                <span class="bar-label">{{ day.label }}</span>
              </div>
            </div>
            <div class="chart-legend">
              <div class="legend-item">
                <span class="legend-dot"></span>
                <span>{{ estadisticas?.sesionesEstaSemana || 0 }} sesiones esta semana</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Distribución por categoría -->
        <div class="chart-card">
          <div class="card-header">
            <h3>🎯 Distribución por Categoría</h3>
          </div>
          <div class="card-content">
            <div class="category-distribution">
              <div *ngFor="let cat of categoryData" class="category-item">
                <div class="category-info">
                  <span class="category-icon">{{ cat.icon }}</span>
                  <span class="category-name">{{ cat.name }}</span>
                </div>
                <div class="category-bar-container">
                  <div class="category-bar">
                    <div
                      class="category-bar-fill"
                      [style.width.%]="cat.percentage"
                      [style.background]="cat.color">
                    </div>
                  </div>
                  <span class="category-percentage">{{ cat.percentage }}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Terapias en progreso -->
      <div class="terapias-progress-section">
        <div class="section-header">
          <h2 class="section-title">🎯 Terapias en Progreso</h2>
          <button class="btn-secondary" routerLink="/terapias">Ver todas</button>
        </div>

        <div class="terapias-progress-grid">
          <div *ngFor="let terapia of terapiasEnProgreso" class="terapia-progress-card">
            <div class="terapia-header">
              <div class="terapia-icon-badge" [style.background]="getTerapiaColor(terapia.categoria)">
                {{ getTerapiaIcon(terapia.categoria) }}
              </div>
              <div class="terapia-info">
                <h4>{{ terapia.nombre }}</h4>
                <p>{{ terapia.categoria }}</p>
              </div>
            </div>

            <div class="terapia-progress">
              <div class="progress-info">
                <span class="progress-text">Progreso</span>
                <span class="progress-value">{{ getTerapiaProgreso(terapia.id) }}%</span>
              </div>
              <div class="progress-bar-wrapper">
                <div class="progress-bar">
                  <div
                    class="progress-bar-fill"
                    [style.width.%]="getTerapiaProgreso(terapia.id)"
                    [style.background]="getTerapiaColor(terapia.categoria)">
                  </div>
                </div>
              </div>
            </div>

            <div class="terapia-stats">
              <div class="stat-mini">
                <span class="stat-icon">✅</span>
                <span>{{ getTerapiaSesionesCompletadas(terapia.id) }} completadas</span>
              </div>
              <div class="stat-mini">
                <span class="stat-icon">⏱️</span>
                <span>{{ terapia.duracion }} min</span>
              </div>
            </div>

            <button class="btn-continue" (click)="continueTerapia(terapia)">
              Continuar →
            </button>
          </div>
        </div>
      </div>

      <!-- Historial de sesiones -->
      <div class="historial-section">
        <div class="section-header">
          <h2 class="section-title">📅 Historial de Sesiones</h2>
          <div class="historial-filters">
            <button
              *ngFor="let filter of historialFilters"
              class="filter-btn"
              [class.active]="selectedHistorialFilter === filter.value"
              (click)="selectHistorialFilter(filter.value)">
              {{ filter.label }}
            </button>
          </div>
        </div>

        <div class="historial-list">
          <div *ngFor="let sesion of filteredSesiones" class="sesion-item">
            <div class="sesion-date">
              <div class="date-icon">📅</div>
              <div class="date-info">
                <span class="date-day">{{ formatDate(sesion.fechaInicio) }}</span>
                <span class="date-time">{{ formatTime(sesion.fechaInicio) }}</span>
              </div>
            </div>

            <div class="sesion-details">
              <h4>{{ getSesionTerapiaNombre(sesion) }}</h4>
              <div class="sesion-meta">
                <span class="meta-item">⏱️ {{ sesion.duracion }} min</span>
                <span class="meta-item">🎯 {{ sesion.progreso }}% progreso</span>
                <span *ngIf="sesion.calificacion" class="meta-item">
                  ⭐ {{ sesion.calificacion }}/5
                </span>
              </div>
              <p *ngIf="sesion.notas" class="sesion-notas">{{ sesion.notas }}</p>
            </div>

            <div class="sesion-status">
              <span [class]="'status-badge status-' + sesion.estado">
                {{ getEstadoLabel(sesion.estado) }}
              </span>
            </div>
          </div>

          <div *ngIf="filteredSesiones.length === 0" class="empty-state">
            <div class="empty-icon">📭</div>
            <p>No hay sesiones en este periodo</p>
          </div>
        </div>
      </div>

    </div>
  `,
  styles: [`
    .progreso-container {
      padding: 20px;
      max-width: 1400px;
      margin: 0 auto;
      min-height: calc(100vh - 70px);
    }

    .header-section {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border-radius: 20px;
      padding: 30px;
      margin-bottom: 30px;
      color: white;
      position: relative;
      overflow: hidden;
    }

    .header-section::before {
      content: '';
      position: absolute;
      top: -50px;
      right: -50px;
      width: 250px;
      height: 250px;
      background: rgba(255,255,255,0.1);
      border-radius: 50%;
    }

    .header-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
      position: relative;
      z-index: 1;
    }

    .page-title {
      font-size: 32px;
      font-weight: bold;
      margin-bottom: 8px;
      color: white;
    }

    .page-subtitle {
      font-size: 16px;
      opacity: 0.9;
      margin: 0;
      max-width: 600px;
    }

    .overall-progress {
      position: relative;
    }

    .progress-circle-large {
      position: relative;
      width: 140px;
      height: 140px;
    }

    .progress-svg {
      width: 100%;
      height: 100%;
      transform: rotate(-90deg);
    }

    .progress-bg {
      fill: none;
      stroke: rgba(255,255,255,0.2);
      stroke-width: 10;
    }

    .progress-fill {
      fill: none;
      stroke: white;
      stroke-width: 10;
      stroke-linecap: round;
      stroke-dasharray: 339;
      transition: stroke-dashoffset 0.5s ease;
    }

    .progress-text {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      text-align: center;
    }

    .progress-percentage {
      font-size: 32px;
      font-weight: bold;
      color: white;
      display: block;
      line-height: 1;
    }

    .progress-label {
      font-size: 14px;
      color: white;
      opacity: 0.9;
      margin-top: 4px;
      display: block;
    }

    .metrics-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 20px;
      margin-bottom: 30px;
    }

    .metric-card {
      background: white;
      border-radius: 16px;
      padding: 25px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.08);
      border: 1px solid rgba(0,0,0,0.05);
      display: flex;
      align-items: center;
      gap: 20px;
      transition: all 0.3s ease;
    }

    .metric-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 30px rgba(0,0,0,0.12);
    }

    .metric-icon {
      font-size: 36px;
      width: 60px;
      height: 60px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #f8f9fa, #e9ecef);
      border-radius: 12px;
    }

    .metric-content {
      display: flex;
      flex-direction: column;
    }

    .metric-value {
      font-size: 32px;
      font-weight: bold;
      color: #667eea;
      line-height: 1;
    }

    .metric-label {
      font-size: 14px;
      font-weight: 600;
      color: #333;
      margin-top: 4px;
    }

    .metric-sublabel {
      font-size: 12px;
      color: #666;
      margin-top: 2px;
    }

    .charts-section {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
      gap: 20px;
      margin-bottom: 30px;
    }

    .chart-card {
      background: white;
      border-radius: 16px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.08);
      border: 1px solid rgba(0,0,0,0.05);
      overflow: hidden;
    }

    .card-header {
      padding: 20px;
      border-bottom: 1px solid #e9ecef;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .card-header h3 {
      font-size: 18px;
      font-weight: 600;
      color: #333;
      margin: 0;
    }

    .time-filter {
      padding: 6px 12px;
      border: 1px solid #e9ecef;
      border-radius: 8px;
      font-size: 12px;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .time-filter:focus {
      outline: none;
      border-color: #667eea;
    }

    .card-content {
      padding: 20px;
    }

    .weekly-chart {
      display: flex;
      align-items: flex-end;
      justify-content: space-between;
      height: 200px;
      gap: 10px;
      margin-bottom: 20px;
    }

    .chart-bar-container {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8px;
    }

    .chart-bar {
      width: 100%;
      height: 180px;
      background: #f8f9fa;
      border-radius: 8px 8px 0 0;
      display: flex;
      align-items: flex-end;
      overflow: hidden;
    }

    .bar-fill {
      width: 100%;
      background: linear-gradient(135deg, #667eea, #764ba2);
      border-radius: 8px 8px 0 0;
      transition: height 0.3s ease;
      cursor: pointer;
      min-height: 4px;
    }

    .bar-fill:hover {
      opacity: 0.8;
    }

    .bar-label {
      font-size: 11px;
      color: #666;
      font-weight: 500;
    }

    .chart-legend {
      padding-top: 15px;
      border-top: 1px solid #e9ecef;
    }

    .legend-item {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 13px;
      color: #666;
    }

    .legend-dot {
      width: 8px;
      height: 8px;
      background: linear-gradient(135deg, #667eea, #764ba2);
      border-radius: 50%;
    }

    .category-distribution {
      display: flex;
      flex-direction: column;
      gap: 15px;
    }

    .category-item {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .category-info {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 14px;
      font-weight: 500;
      color: #333;
    }

    .category-icon {
      font-size: 18px;
    }

    .category-bar-container {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .category-bar {
      flex: 1;
      height: 8px;
      background: #f0f0f0;
      border-radius: 4px;
      overflow: hidden;
    }

    .category-bar-fill {
      height: 100%;
      border-radius: 4px;
      transition: width 0.3s ease;
    }

    .category-percentage {
      font-size: 12px;
      font-weight: 600;
      color: #333;
      min-width: 40px;
      text-align: right;
    }

    .terapias-progress-section, .historial-section, .logros-section {
      background: white;
      border-radius: 16px;
      padding: 30px;
      margin-bottom: 30px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.08);
      border: 1px solid rgba(0,0,0,0.05);
    }

    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 25px;
    }

    .section-title {
      font-size: 24px;
      font-weight: 600;
      color: #333;
      margin: 0;
    }

    .terapias-progress-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 20px;
    }

    .terapia-progress-card {
      border: 1px solid #e9ecef;
      border-radius: 12px;
      padding: 20px;
      transition: all 0.3s ease;
      background: white;
    }

    .terapia-progress-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(0,0,0,0.1);
      border-color: #667eea;
    }

    .terapia-header {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 15px;
    }

    .terapia-icon-badge {
      width: 40px;
      height: 40px;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 20px;
      color: white;
    }

    .terapia-info h4 {
      font-size: 16px;
      font-weight: 600;
      color: #333;
      margin: 0 0 4px 0;
    }

    .terapia-info p {
      font-size: 12px;
      color: #666;
      margin: 0;
      text-transform: capitalize;
    }

    .terapia-progress {
      margin-bottom: 15px;
    }

    .progress-info {
      display: flex;
      justify-content: space-between;
      margin-bottom: 8px;
    }

    .progress-text {
      font-size: 12px;
      color: #666;
      font-weight: 500;
    }

    .progress-value {
      font-size: 14px;
      font-weight: bold;
      color: #667eea;
    }

    .progress-bar-wrapper {
      width: 100%;
    }

    .progress-bar {
      height: 8px;
      background: #f0f0f0;
      border-radius: 4px;
      overflow: hidden;
    }

    .progress-bar-fill {
      height: 100%;
      border-radius: 4px;
      transition: width 0.5s ease;
    }

    .terapia-stats {
      display: flex;
      gap: 15px;
      margin-bottom: 15px;
    }

    .stat-mini {
      display: flex;
      align-items: center;
      gap: 4px;
      font-size: 12px;
      color: #666;
    }

    .stat-icon {
      font-size: 14px;
    }

    .btn-continue {
      width: 100%;
      background: linear-gradient(135deg, #667eea, #764ba2);
      color: white;
      border: none;
      padding: 10px;
      border-radius: 8px;
      font-size: 14px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .btn-continue:hover {
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
    }

    .historial-filters {
      display: flex;
      gap: 8px;
      background: #f8f9fa;
      padding: 4px;
      border-radius: 8px;
    }

    .filter-btn {
      padding: 6px 12px;
      background: transparent;
      border: none;
      border-radius: 6px;
      font-size: 12px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s ease;
      color: #666;
    }

    .filter-btn.active {
      background: white;
      color: #667eea;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .historial-list {
      display: flex;
      flex-direction: column;
      gap: 15px;
    }

    .sesion-item {
      display: flex;
      align-items: center;
      gap: 20px;
      padding: 20px;
      border: 1px solid #e9ecef;
      border-radius: 12px;
      transition: all 0.2s ease;
      background: white;
    }

    .sesion-item:hover {
      border-color: #667eea;
      transform: translateX(4px);
      box-shadow: 0 4px 12px rgba(0,0,0,0.08);
    }

    .sesion-date {
      display: flex;
      align-items: center;
      gap: 12px;
      min-width: 150px;
    }

    .date-icon {
      font-size: 24px;
    }

    .date-info {
      display: flex;
      flex-direction: column;
    }

    .date-day {
      font-size: 14px;
      font-weight: 600;
      color: #333;
    }

    .date-time {
      font-size: 12px;
      color: #666;
    }

    .sesion-details {
      flex: 1;
    }

    .sesion-details h4 {
      font-size: 16px;
      font-weight: 600;
      color: #333;
      margin: 0 0 8px 0;
    }

    .sesion-meta {
      display: flex;
      gap: 15px;
      margin-bottom: 8px;
    }

    .meta-item {
      font-size: 12px;
      color: #666;
    }

    .sesion-notas {
      font-size: 13px;
      color: #666;
      font-style: italic;
      margin: 8px 0 0 0;
      padding: 8px;
      background: #f8f9fa;
      border-radius: 6px;
    }

    .sesion-status {
      min-width: 100px;
      text-align: right;
    }

    .status-badge {
      padding: 6px 12px;
      border-radius: 6px;
      font-size: 11px;
      font-weight: 600;
      text-transform: uppercase;
    }

    .status-pendiente {
      background: #fff3cd;
      color: #856404;
    }

    .status-en_progreso {
      background: #cfe2ff;
      color: #084298;
    }

    .status-completada {
      background: #d1e7dd;
      color: #0f5132;
    }

    .status-cancelada {
      background: #f8d7da;
      color: #842029;
    }

    .logros-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: 20px;
    }

    .logro-card {
      padding: 20px;
      border: 2px solid #e9ecef;
      border-radius: 12px;
      text-align: center;
      transition: all 0.3s ease;
      background: white;
    }

    .logro-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 20px rgba(0,0,0,0.1);
      border-color: #667eea;
    }

    .logro-card.locked {
      opacity: 0.5;
      border-style: dashed;
    }

    .logro-icon {
      font-size: 48px;
      margin-bottom: 12px;
    }

    .logro-title {
      font-size: 16px;
      font-weight: 600;
      color: #333;
      margin: 0 0 8px 0;
    }

    .logro-description {
      font-size: 13px;
      color: #666;
      line-height: 1.4;
      margin: 0 0 12px 0;
    }

    .logro-date {
      font-size: 11px;
      color: #999;
      font-style: italic;
    }

    .logro-progress {
      display: flex;
      flex-direction: column;
      gap: 6px;
      margin-top: 12px;
    }

    .mini-progress-bar {
      height: 6px;
      background: #f0f0f0;
      border-radius: 3px;
      overflow: hidden;
    }

    .mini-progress-fill {
      height: 100%;
      background: #667eea;
      border-radius: 3px;
      transition: width 0.3s ease;
    }

    .empty-state {
      text-align: center;
      padding: 40px;
      color: #666;
    }

    .empty-icon {
      font-size: 48px;
      margin-bottom: 12px;
      opacity: 0.5;
    }

    .btn-secondary {
      background: #f8f9fa;
      color: #667eea;
      border: 1px solid #e9ecef;
      padding: 8px 16px;
      border-radius: 8px;
      font-size: 14px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s ease;
      text-decoration: none;
      display: inline-block;
    }

    .btn-secondary:hover {
      background: #e9ecef;
    }

    @media (max-width: 768px) {
      .progreso-container {
        padding: 15px;
      }

      .header-content {
        flex-direction: column;
        gap: 20px;
        text-align: center;
      }

      .page-title {
        font-size: 24px;
      }

      .metrics-grid {
        grid-template-columns: 1fr;
      }

      .charts-section {
        grid-template-columns: 1fr;
      }

      .terapias-progress-grid {
        grid-template-columns: 1fr;
      }

      .sesion-item {
        flex-direction: column;
        align-items: start;
      }

      .sesion-date {
        min-width: auto;
      }

      .sesion-status {
        width: 100%;
        text-align: left;
      }

      .section-header {
        flex-direction: column;
        gap: 15px;
        align-items: start;
      }

      .logros-grid {
        grid-template-columns: 1fr;
      }

      .progress-circle-large {
        width: 100px;
        height: 100px;
      }

      .progress-percentage {
        font-size: 24px;
      }
    }
  `]
})
export class ProgresoSesionComponent implements OnInit {
  currentUser: Usuario | null = null;
  progreso: ProgresoUsuario | null = null;
  estadisticas: EstadisticasSesion | null = null;
  sesiones: Sesion[] = [];
  filteredSesiones: Sesion[] = [];
  terapiasEnProgreso: Terapia[] = [];

  selectedPeriod: string = 'week';
  selectedHistorialFilter: string = 'all';

  weeklyData = [
    { label: 'Lun', value: 3, percentage: 75 },
    { label: 'Mar', value: 2, percentage: 50 },
    { label: 'Mié', value: 4, percentage: 100 },
    { label: 'Jue', value: 1, percentage: 25 },
    { label: 'Vie', value: 3, percentage: 75 },
    { label: 'Sáb', value: 2, percentage: 50 },
    { label: 'Dom', value: 1, percentage: 25 }
  ];

  categoryData = [
    { name: 'Cognitiva', icon: '🧠', percentage: 35, color: '#667eea' },
    { name: 'Memoria', icon: '💭', percentage: 25, color: '#fa709a' },
    { name: 'Motora', icon: '🤸‍♂️', percentage: 20, color: '#f093fb' },
    { name: 'Lenguaje', icon: '🗣️', percentage: 15, color: '#43e97b' },
    { name: 'Sensorial', icon: '👁️', percentage: 5, color: '#4facfe' }
  ];

  historialFilters = [
    { label: 'Todas', value: 'all' },
    { label: 'Completadas', value: 'completada' },
    { label: 'En Progreso', value: 'en_progreso' },
    { label: 'Pendientes', value: 'pendiente' }
  ];

  logros = [
    {
      id: '1',
      icon: '🎯',
      name: 'Primera Sesión',
      description: 'Completaste tu primera sesión de terapia',
      locked: false,
      unlockedDate: new Date('2024-09-01'),
      progress: 100
    },
    {
      id: '2',
      icon: '🔥',
      name: 'Racha de 7 días',
      description: 'Completaste sesiones 7 días consecutivos',
      locked: false,
      unlockedDate: new Date('2024-09-15'),
      progress: 100
    },
    {
      id: '3',
      icon: '⭐',
      name: 'Perfeccionista',
      description: 'Obtén 5 estrellas en 10 sesiones',
      locked: false,
      unlockedDate: new Date('2024-09-20'),
      progress: 100
    },
    {
      id: '4',
      icon: '💪',
      name: 'Maratonista',
      description: 'Completa 50 sesiones en total',
      locked: true,
      progress: 68
    },
    {
      id: '5',
      icon: '🎓',
      name: 'Maestro',
      description: 'Domina todas las categorías de terapia',
      locked: true,
      progress: 45
    },
    {
      id: '6',
      icon: '🏆',
      name: 'Leyenda',
      description: 'Alcanza 30 días de racha',
      locked: true,
      progress: 23
    }
  ];

  constructor(
    private authService: Auth,
    private usuarioService: UsuarioService,
    private terapiasService: Terapias,
  ) {}

  ngOnInit(): void {
    this.authService.currentUser.subscribe(user => {
      this.currentUser = user;
      if (user) {
        this.loadData();
      }
    });
  }

  loadData(): void {
    if (!this.currentUser) return;

    // Cargar progreso general
    this.usuarioService.getProgresoUsuario(this.currentUser.id).subscribe(progreso => {
      this.progreso = progreso;
    });

    // Cargar estadísticas
    this.usuarioService.getEstadisticasSesion(this.currentUser.id).subscribe(stats => {
      this.estadisticas = stats;
    });

    // Cargar sesiones
    if (this.currentUser.tipo === 'paciente') {
      this.usuarioService.getSesionesPaciente(this.currentUser.id).subscribe(sesiones => {
        this.sesiones = sesiones.sort((a, b) =>
          new Date(b.fechaInicio).getTime() - new Date(a.fechaInicio).getTime()
        );
        this.filteredSesiones = this.sesiones;
      });
    }

    // Cargar terapias en progreso
    this.terapiasService.getTerapias().subscribe(terapias => {
      this.terapiasEnProgreso = terapias.filter(t => t.activa).slice(0, 3);
    });
  }

  getProgressOffset(): number {
    const percentage = this.progreso?.porcentajeGeneral || 0;
    const circumference = 2 * Math.PI * 54;
    return circumference - (percentage / 100) * circumference;
  }

  updateChartData(): void {
    // Aquí actualizarías los datos del gráfico según el periodo seleccionado
    console.log('Actualizando gráfico para periodo:', this.selectedPeriod);
  }

  selectHistorialFilter(filter: string): void {
    this.selectedHistorialFilter = filter;

    if (filter === 'all') {
      this.filteredSesiones = this.sesiones;
    } else {
      this.filteredSesiones = this.sesiones.filter(s => s.estado === filter);
    }
  }

  getTerapiaColor(categoria: string): string {
    const colores: { [key: string]: string } = {
      'cognitiva': '#667eea',
      'memoria': '#fa709a',
      'motora': '#f093fb',
      'lenguaje': '#43e97b',
      'sensorial': '#4facfe'
    };
    return colores[categoria] || '#667eea';
  }

  getTerapiaIcon(categoria: string): string {
    const iconos: { [key: string]: string } = {
      'cognitiva': '🧠',
      'memoria': '💭',
      'motora': '🤸‍♂️',
      'lenguaje': '🗣️',
      'sensorial': '👁️'
    };
    return iconos[categoria] || '🎯';
  }

  getTerapiaProgreso(terapiaId: string): number {
    // Mock data - en implementación real calcular progreso real
    const progresos: { [key: string]: number } = {
      '1': 75,
      '2': 45,
      '3': 90
    };
    return progresos[terapiaId] || 50;
  }

  getTerapiaSesionesCompletadas(terapiaId: string): number {
    return this.sesiones.filter(s =>
      s.terapiaId === terapiaId && s.completada
    ).length;
  }

  continueTerapia(terapia: Terapia): void {
    console.log('Continuando terapia:', terapia.nombre);
    // Implementar navegación a la terapia
  }

  getSesionTerapiaNombre(sesion: Sesion): string {
    const terapia = this.terapiasEnProgreso.find(t => t.id === sesion.terapiaId);
    return terapia?.nombre || 'Terapia';
  }

  getEstadoLabel(estado: string): string {
    const labels: { [key: string]: string } = {
      'pendiente': 'Pendiente',
      'en_progreso': 'En Progreso',
      'completada': 'Completada',
      'cancelada': 'Cancelada'
    };
    return labels[estado] || estado;
  }

  formatDate(date: Date | string): string {
    const d = new Date(date);
    return d.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  }

  formatTime(date: Date | string): string {
    const d = new Date(date);
    return d.toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}
