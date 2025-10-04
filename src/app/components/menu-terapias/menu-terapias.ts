import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Terapias } from '../../services/terapias';
import { Auth } from '../../services/auth';
import { Terapia, CATEGORIAS_MOCK } from '../../models/terapia';
import { Usuario } from '../../models/usuario';

@Component({
  selector: 'app-menu-terapias',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="terapias-container">
      <!-- Header -->
      <div class="header-section">
        <div class="header-content">
          <div class="header-text">
            <h1 class="page-title">🧠 Catálogo de Terapias</h1>
            <p class="page-subtitle">
              Descubre y practica terapias neurológicas personalizadas para tu rehabilitación
            </p>
          </div>
          <div *ngIf="currentUser?.tipo === 'terapeuta'" class="header-actions">
            <button class="btn-create" (click)="openCreateTerapia()">
              <span class="btn-icon">➕</span>
              Crear Terapia
            </button>
          </div>
        </div>
      </div>

      <!-- Filtros y búsqueda -->
      <div class="filters-section">
        <div class="search-container">
          <div class="search-box">
            <input
              type="text"
              [(ngModel)]="searchTerm"
              (input)="onSearch()"
              placeholder="Buscar terapias..."
              class="search-input">
            <button class="search-btn">🔍</button>
          </div>
        </div>

        <div class="filters-container">
          <div class="filter-group">
            <label>Categoría:</label>
            <select [(ngModel)]="selectedCategory" (change)="onFilterChange()" class="filter-select">
              <option value="">Todas las categorías</option>
              <option *ngFor="let cat of categorias | keyvalue" [value]="cat.key">
                {{ cat.value.nombre }}
              </option>
            </select>
          </div>

          <div class="filter-group">
            <label>Dificultad:</label>
            <select [(ngModel)]="selectedDifficulty" (change)="onFilterChange()" class="filter-select">
              <option value="">Todos los niveles</option>
              <option value="principiante">Principiante</option>
              <option value="intermedio">Intermedio</option>
              <option value="avanzado">Avanzado</option>
            </select>
          </div>

          <div class="filter-group">
            <label>Duración:</label>
            <select [(ngModel)]="selectedDuration" (change)="onFilterChange()" class="filter-select">
              <option value="">Cualquier duración</option>
              <option value="short">Corta (< 20 min)</option>
              <option value="medium">Media (20-40 min)</option>
              <option value="long">Larga (> 40 min)</option>
            </select>
          </div>

          <button class="btn-clear-filters" (click)="clearFilters()">
            Limpiar filtros
          </button>
        </div>
      </div>

      <!-- Categorías destacadas -->
      <div class="categories-section" *ngIf="!searchTerm && !selectedCategory">
        <h2 class="section-title">🎯 Categorías Principales</h2>
        <div class="categories-grid">
          <div
            *ngFor="let cat of categorias | keyvalue"
            class="category-card"
            (click)="selectCategory(cat.key)"
            [style.background]="getCategoryGradient(cat.value.color)">
            <div class="category-icon">{{ cat.value.icono }}</div>
            <h3 class="category-name">{{ cat.value.nombre }}</h3>
            <p class="category-description">{{ cat.value.descripcion }}</p>
            <div class="category-count">
              {{ getTerapiasCountByCategory(cat.key) }} terapias
            </div>
          </div>
        </div>
      </div>

      <!-- Lista de terapias -->
      <div class="terapias-section">
        <div class="section-header">
          <h2 class="section-title">
            {{ getResultsTitle() }}
          </h2>
          <div class="view-toggle">
            <button
              class="toggle-btn"
              [class.active]="viewMode === 'grid'"
              (click)="viewMode = 'grid'">
              📊 Cuadrícula
            </button>
            <button
              class="toggle-btn"
              [class.active]="viewMode === 'list'"
              (click)="viewMode = 'list'">
              📋 Lista
            </button>
          </div>
        </div>

        <!-- Vista en cuadrícula -->
        <div *ngIf="viewMode === 'grid'" class="terapias-grid">
          <div *ngFor="let terapia of filteredTerapias" class="terapia-card">
            <div class="card-header">
              <div class="terapia-category-badge" [style.background]="getCategoryColor(terapia.categoria)">
                {{ getCategoryIcon(terapia.categoria) }} {{ getCategoryName(terapia.categoria) }}
              </div>
              <div class="terapia-difficulty" [class]="'difficulty-' + terapia.nivelDificultad">
                {{ getDifficultyLabel(terapia.nivelDificultad) }}
              </div>
            </div>

            <div class="card-content">
              <h3 class="terapia-title">{{ terapia.nombre }}</h3>
              <p class="terapia-description">{{ terapia.descripcion }}</p>

              <div class="terapia-details">
                <div class="detail-item">
                  <span class="detail-icon">⏱️</span>
                  <span>{{ terapia.duracion }} min</span>
                </div>
                <div class="detail-item">
                  <span class="detail-icon">🎯</span>
                  <span>{{ terapia.objetivos.length }} objetivos</span>
                </div>
                <div class="detail-item" *ngIf="terapia.materiales && terapia.materiales.length > 0">
                  <span class="detail-icon">🧰</span>
                  <span>{{ terapia.materiales.length }} materiales</span>
                </div>
              </div>

              <div class="terapia-objectives">
                <h4>Objetivos principales:</h4>
                <ul>
                  <li *ngFor="let objetivo of terapia.objetivos.slice(0, 2)">
                    {{ objetivo }}
                  </li>
                  <li *ngIf="terapia.objetivos.length > 2" class="more-objectives">
                    +{{ terapia.objetivos.length - 2 }} más...
                  </li>
                </ul>
              </div>
            </div>

            <div class="card-actions">
              <button class="btn-secondary" (click)="viewTerapiaDetails(terapia)">
                Ver Detalles
              </button>
              <button class="btn-primary" (click)="startTerapia(terapia)">
                <span class="btn-icon">▶️</span>
                {{ currentUser?.tipo === 'paciente' ? 'Comenzar' : 'Asignar' }}
              </button>
            </div>
          </div>
        </div>

        <!-- Vista en lista -->
        <div *ngIf="viewMode === 'list'" class="terapias-list">
          <div *ngFor="let terapia of filteredTerapias" class="terapia-list-item">
            <div class="list-item-main">
              <div class="terapia-icon-container">
                <div class="terapia-icon" [style.background]="getCategoryColor(terapia.categoria)">
                  {{ getCategoryIcon(terapia.categoria) }}
                </div>
              </div>

              <div class="terapia-info">
                <div class="terapia-header">
                  <h3 class="terapia-title">{{ terapia.nombre }}</h3>
                  <div class="terapia-meta">
                    <span class="category-tag">{{ getCategoryName(terapia.categoria) }}</span>
                    <span class="duration-tag">{{ terapia.duracion }} min</span>
                    <span class="difficulty-tag" [class]="'difficulty-' + terapia.nivelDificultad">
                      {{ getDifficultyLabel(terapia.nivelDificultad) }}
                    </span>
                  </div>
                </div>
                <p class="terapia-description">{{ terapia.descripcion }}</p>
                <div class="terapia-quick-info">
                  <span>🎯 {{ terapia.objetivos.length }} objetivos</span>
                  <span *ngIf="terapia.materiales">🧰 {{ terapia.materiales.length }} materiales</span>
                </div>
              </div>
            </div>

            <div class="list-item-actions">
              <button class="btn-outline" (click)="viewTerapiaDetails(terapia)">
                Detalles
              </button>
              <button class="btn-primary" (click)="startTerapia(terapia)">
                {{ currentUser?.tipo === 'paciente' ? 'Comenzar' : 'Asignar' }}
              </button>
            </div>
          </div>
        </div>

        <!-- Estado vacío -->
        <div *ngIf="filteredTerapias.length === 0" class="empty-state">
          <div class="empty-icon">🔍</div>
          <h3>No se encontraron terapias</h3>
          <p>Intenta ajustar los filtros o buscar con otros términos.</p>
          <button class="btn-primary" (click)="clearFilters()">Limpiar filtros</button>
        </div>
      </div>

      <!-- Modal de detalles (placeholder) -->
      <div *ngIf="selectedTerapia" class="modal-overlay" (click)="closeModal()">
        <div class="modal-content" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <h2>{{ selectedTerapia.nombre }}</h2>
            <button class="modal-close" (click)="closeModal()">✕</button>
          </div>
          <div class="modal-body">
            <div class="terapia-full-details">
              <div class="detail-section">
                <h3>📋 Descripción</h3>
                <p>{{ selectedTerapia.descripcion }}</p>
              </div>

              <div class="detail-section">
                <h3>🎯 Objetivos</h3>
                <ul>
                  <li *ngFor="let objetivo of selectedTerapia.objetivos">{{ objetivo }}</li>
                </ul>
              </div>

              <div class="detail-section">
                <h3>📝 Instrucciones</h3>
                <p>{{ selectedTerapia.instrucciones }}</p>
              </div>

              <div class="detail-section" *ngIf="selectedTerapia.materiales && selectedTerapia.materiales.length > 0">
                <h3>🧰 Materiales necesarios</h3>
                <ul>
                  <li *ngFor="let material of selectedTerapia.materiales">{{ material }}</li>
                </ul>
              </div>

              <div class="terapia-specs">
                <div class="spec-item">
                  <strong>Duración:</strong> {{ selectedTerapia.duracion }} minutos
                </div>
                <div class="spec-item">
                  <strong>Categoría:</strong> {{ getCategoryName(selectedTerapia.categoria) }}
                </div>
                <div class="spec-item">
                  <strong>Dificultad:</strong> {{ getDifficultyLabel(selectedTerapia.nivelDificultad) }}
                </div>
              </div>
            </div>
          </div>
          <div class="modal-actions">
            <button class="btn-secondary" (click)="closeModal()">Cerrar</button>
            <button class="btn-primary" (click)="startTerapia(selectedTerapia!)">
              <span class="btn-icon">▶️</span>
              {{ currentUser?.tipo === 'paciente' ? 'Comenzar Terapia' : 'Asignar a Paciente' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .terapias-container {
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
      top: -100px;
      right: -100px;
      width: 300px;
      height: 300px;
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

    .btn-create {
      background: rgba(255,255,255,0.2);
      color: white;
      border: 2px solid rgba(255,255,255,0.3);
      padding: 12px 20px;
      border-radius: 12px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      gap: 8px;
      backdrop-filter: blur(10px);
    }

    .btn-create:hover {
      background: rgba(255,255,255,0.3);
      transform: translateY(-2px);
    }

    .filters-section {
      background: white;
      border-radius: 16px;
      padding: 25px;
      margin-bottom: 30px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.08);
      border: 1px solid rgba(0,0,0,0.05);
    }

    .search-container {
      margin-bottom: 20px;
    }

    .search-box {
      display: flex;
      max-width: 400px;
      position: relative;
    }

    .search-input {
      flex: 1;
      padding: 12px 16px;
      border: 2px solid #e1e5e9;
      border-radius: 12px 0 0 12px;
      font-size: 16px;
      transition: border-color 0.3s ease;
    }

    .search-input:focus {
      outline: none;
      border-color: #667eea;
    }

    .search-btn {
      padding: 12px 16px;
      background: #667eea;
      color: white;
      border: 2px solid #667eea;
      border-radius: 0 12px 12px 0;
      cursor: pointer;
      font-size: 16px;
      transition: all 0.3s ease;
    }

    .search-btn:hover {
      background: #5a67d8;
    }

    .filters-container {
      display: flex;
      gap: 20px;
      align-items: end;
      flex-wrap: wrap;
    }

    .filter-group {
      display: flex;
      flex-direction: column;
      gap: 5px;
    }

    .filter-group label {
      font-size: 12px;
      font-weight: 600;
      color: #666;
      text-transform: uppercase;
    }

    .filter-select {
      padding: 8px 12px;
      border: 2px solid #e1e5e9;
      border-radius: 8px;
      font-size: 14px;
      min-width: 150px;
      transition: border-color 0.3s ease;
    }

    .filter-select:focus {
      outline: none;
      border-color: #667eea;
    }

    .btn-clear-filters {
      background: #f8f9fa;
      color: #666;
      border: 1px solid #e9ecef;
      padding: 8px 16px;
      border-radius: 8px;
      cursor: pointer;
      font-size: 14px;
      transition: all 0.2s ease;
    }

    .btn-clear-filters:hover {
      background: #e9ecef;
    }

    .categories-section {
      margin-bottom: 40px;
    }

    .section-title {
      font-size: 24px;
      font-weight: 600;
      color: #333;
      margin-bottom: 20px;
    }

    .categories-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 20px;
    }

    .category-card {
      padding: 25px;
      border-radius: 16px;
      color: white;
      cursor: pointer;
      transition: all 0.3s ease;
      position: relative;
      overflow: hidden;
    }

    .category-card::before {
      content: '';
      position: absolute;
      top: 0;
      right: 0;
      width: 100px;
      height: 100px;
      background: rgba(255,255,255,0.1);
      border-radius: 50%;
      transform: translate(30%, -30%);
    }

    .category-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 10px 30px rgba(0,0,0,0.2);
    }

    .category-icon {
      font-size: 36px;
      margin-bottom: 15px;
    }

    .category-name {
      font-size: 20px;
      font-weight: bold;
      margin-bottom: 8px;
    }

    .category-description {
      font-size: 14px;
      opacity: 0.9;
      margin-bottom: 15px;
      line-height: 1.4;
    }

    .category-count {
      font-size: 12px;
      background: rgba(255,255,255,0.2);
      padding: 4px 8px;
      border-radius: 6px;
      display: inline-block;
    }

    .terapias-section {
      background: white;
      border-radius: 16px;
      padding: 30px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.08);
      border: 1px solid rgba(0,0,0,0.05);
    }

    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 25px;
    }

    .view-toggle {
      display: flex;
      gap: 8px;
      background: #f8f9fa;
      border-radius: 8px;
      padding: 4px;
    }

    .toggle-btn {
      padding: 8px 12px;
      background: transparent;
      border: none;
      border-radius: 6px;
      font-size: 12px;
      cursor: pointer;
      transition: all 0.2s ease;
      color: #666;
    }

    .toggle-btn.active {
      background: white;
      color: #667eea;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .terapias-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
      gap: 20px;
    }

    .terapia-card {
      border: 1px solid #e9ecef;
      border-radius: 16px;
      overflow: hidden;
      transition: all 0.3s ease;
      background: white;
    }

    .terapia-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 25px rgba(0,0,0,0.1);
      border-color: #667eea;
    }

    .card-header {
      padding: 15px;
      background: #f8f9fa;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .terapia-category-badge {
      background: #667eea;
      color: white;
      padding: 4px 8px;
      border-radius: 6px;
      font-size: 11px;
      font-weight: 600;
      display: flex;
      align-items: center;
      gap: 4px;
    }

    .terapia-difficulty {
      padding: 2px 6px;
      border-radius: 4px;
      font-size: 10px;
      font-weight: 600;
      text-transform: uppercase;
    }

    .difficulty-principiante {
      background: #d4edda;
      color: #155724;
    }

    .difficulty-intermedio {
      background: #fff3cd;
      color: #856404;
    }

    .difficulty-avanzado {
      background: #f8d7da;
      color: #721c24;
    }

    .card-content {
      padding: 20px;
    }

    .terapia-title {
      font-size: 18px;
      font-weight: 600;
      color: #333;
      margin-bottom: 8px;
      line-height: 1.3;
    }

    .terapia-description {
      color: #666;
      font-size: 14px;
      line-height: 1.4;
      margin-bottom: 15px;
    }

    .terapia-details {
      display: flex;
      gap: 15px;
      margin-bottom: 15px;
      flex-wrap: wrap;
    }

    .detail-item {
      display: flex;
      align-items: center;
      gap: 4px;
      font-size: 12px;
      color: #666;
    }

    .detail-icon {
      font-size: 14px;
    }

    .terapia-objectives h4 {
      font-size: 14px;
      font-weight: 600;
      color: #333;
      margin-bottom: 8px;
    }

    .terapia-objectives ul {
      list-style: none;
      padding: 0;
      margin: 0;
    }

    .terapia-objectives li {
      font-size: 12px;
      color: #666;
      margin-bottom: 4px;
      padding-left: 12px;
      position: relative;
    }

    .terapia-objectives li::before {
      content: '•';
      position: absolute;
      left: 0;
      color: #667eea;
    }

    .more-objectives {
      font-style: italic;
      color: #999 !important;
    }

    .card-actions {
      padding: 15px 20px;
      border-top: 1px solid #f0f0f0;
      display: flex;
      gap: 10px;
    }

    .terapias-list {
      display: flex;
      flex-direction: column;
      gap: 15px;
    }

    .terapia-list-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 20px;
      border: 1px solid #e9ecef;
      border-radius: 12px;
      transition: all 0.2s ease;
      background: white;
    }

    .terapia-list-item:hover {
      border-color: #667eea;
      transform: translateX(4px);
      box-shadow: 0 4px 12px rgba(0,0,0,0.08);
    }

    .list-item-main {
      display: flex;
      align-items: center;
      gap: 15px;
      flex: 1;
    }

    .terapia-icon-container {
      flex-shrink: 0;
    }

    .terapia-icon {
      width: 50px;
      height: 50px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 20px;
      color: white;
    }

    .terapia-info {
      flex: 1;
    }

    .terapia-header {
      display: flex;
      justify-content: space-between;
      align-items: start;
      margin-bottom: 8px;
    }

    .terapia-meta {
      display: flex;
      gap: 8px;
      align-items: center;
    }

    .category-tag, .duration-tag, .difficulty-tag {
      padding: 2px 6px;
      border-radius: 4px;
      font-size: 10px;
      font-weight: 600;
    }

    .category-tag {
      background: #e9ecef;
      color: #666;
    }

    .duration-tag {
      background: #667eea;
      color: white;
    }

    .terapia-quick-info {
      display: flex;
      gap: 15px;
      margin-top: 8px;
    }

    .terapia-quick-info span {
      font-size: 12px;
      color: #666;
    }

    .list-item-actions {
      display: flex;
      gap: 10px;
      flex-shrink: 0;
    }

    .empty-state {
      text-align: center;
      padding: 60px 20px;
      color: #666;
    }

    .empty-icon {
      font-size: 64px;
      margin-bottom: 20px;
      opacity: 0.5;
    }

    .empty-state h3 {
      font-size: 20px;
      margin-bottom: 8px;
      color: #333;
    }

    .empty-state p {
      margin-bottom: 20px;
    }

    /* Botones */
    .btn-primary, .btn-secondary, .btn-outline {
      border: none;
      border-radius: 8px;
      padding: 8px 16px;
      font-size: 14px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s ease;
      text-decoration: none;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      justify-content: center;
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

    .btn-outline {
      background: transparent;
      color: #667eea;
      border: 1px solid #667eea;
    }

    .btn-outline:hover {
      background: #667eea;
      color: white;
    }

    .btn-icon {
      font-size: 12px;
    }

    /* Modal */
    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0,0,0,0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
      padding: 20px;
    }

    .modal-content {
      background: white;
      border-radius: 16px;
      width: 100%;
      max-width: 600px;
      max-height: 90vh;
      overflow-y: auto;
      box-shadow: 0 20px 40px rgba(0,0,0,0.2);
    }

    .modal-header {
      padding: 20px;
      border-bottom: 1px solid #e9ecef;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .modal-header h2 {
      font-size: 20px;
      font-weight: 600;
      color: #333;
      margin: 0;
    }

    .modal-close {
      background: none;
      border: none;
      font-size: 20px;
      cursor: pointer;
      color: #666;
      width: 32px;
      height: 32px;
      border-radius: 50%;
      transition: all 0.2s ease;
    }

    .modal-close:hover {
      background: #f8f9fa;
    }

    .modal-body {
      padding: 20px;
    }

    .terapia-full-details {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .detail-section h3 {
      font-size: 16px;
      font-weight: 600;
      color: #333;
      margin-bottom: 10px;
    }

    .detail-section p {
      color: #666;
      line-height: 1.6;
      margin: 0;
    }

    .detail-section ul {
      list-style: none;
      padding: 0;
      margin: 0;
    }

    .detail-section li {
      color: #666;
      margin-bottom: 8px;
      padding-left: 20px;
      position: relative;
    }

    .detail-section li::before {
      content: '✓';
      position: absolute;
      left: 0;
      color: #43e97b;
      font-weight: bold;
    }

    .terapia-specs {
      background: #f8f9fa;
      padding: 15px;
      border-radius: 8px;
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .spec-item {
      font-size: 14px;
      color: #666;
    }

    .spec-item strong {
      color: #333;
    }

    .modal-actions {
      padding: 20px;
      border-top: 1px solid #e9ecef;
      display: flex;
      gap: 10px;
      justify-content: flex-end;
    }

    @media (max-width: 768px) {
      .terapias-container {
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

      .filters-container {
        flex-direction: column;
      }

      .filter-group, .filter-select {
        width: 100%;
      }

      .categories-grid {
        grid-template-columns: 1fr;
      }

      .terapias-grid {
        grid-template-columns: 1fr;
      }

      .section-header {
        flex-direction: column;
        gap: 15px;
        align-items: start;
      }

      .list-item-main {
        flex-direction: column;
        align-items: start;
      }

      .list-item-actions {
        width: 100%;
        flex-direction: column;
      }

      .list-item-actions button {
        width: 100%;
      }
    }
  `]
})
export class MenuTerapiasComponent implements OnInit {
  currentUser: Usuario | null = null;
  terapias: Terapia[] = [];
  filteredTerapias: Terapia[] = [];
  categorias = CATEGORIAS_MOCK;
  selectedTerapia: Terapia | null = null;

  // Filtros
  searchTerm: string = '';
  selectedCategory: string = '';
  selectedDifficulty: string = '';
  selectedDuration: string = '';

  // Vista
  viewMode: 'grid' | 'list' = 'grid';

  constructor(
    private terapiasService: Terapias,
    private authService: Auth
  ) {}

  ngOnInit(): void {
    this.authService.currentUser.subscribe(user => {
      this.currentUser = user;
    });

    this.loadTerapias();
  }

  loadTerapias(): void {
    this.terapiasService.getTerapias().subscribe(terapias => {
      this.terapias = terapias;
      this.filteredTerapias = terapias;
    });
  }

  onSearch(): void {
    this.applyFilters();
  }

  onFilterChange(): void {
    this.applyFilters();
  }

  applyFilters(): void {
    let filtered = [...this.terapias];

    // Filtro de búsqueda
    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(t =>
        t.nombre.toLowerCase().includes(term) ||
        t.descripcion.toLowerCase().includes(term) ||
        t.categoria.toLowerCase().includes(term)
      );
    }

    // Filtro de categoría
    if (this.selectedCategory) {
      filtered = filtered.filter(t => t.categoria === this.selectedCategory);
    }

    // Filtro de dificultad
    if (this.selectedDifficulty) {
      filtered = filtered.filter(t => t.nivelDificultad === this.selectedDifficulty);
    }

    // Filtro de duración
    if (this.selectedDuration) {
      switch (this.selectedDuration) {
        case 'short':
          filtered = filtered.filter(t => t.duracion < 20);
          break;
        case 'medium':
          filtered = filtered.filter(t => t.duracion >= 20 && t.duracion <= 40);
          break;
        case 'long':
          filtered = filtered.filter(t => t.duracion > 40);
          break;
      }
    }

    this.filteredTerapias = filtered;
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.selectedCategory = '';
    this.selectedDifficulty = '';
    this.selectedDuration = '';
    this.filteredTerapias = [...this.terapias];
  }

  selectCategory(category: string): void {
    this.selectedCategory = category;
    this.applyFilters();
  }

  getCategoryGradient(color: string): string {
    return `linear-gradient(135deg, ${color}, ${this.darkenColor(color, 20)})`;
  }

  darkenColor(color: string, percent: number): string {
    // Función simple para oscurecer un color
    const num = parseInt(color.replace('#', ''), 16);
    const amt = Math.round(2.55 * percent);
    const R = (num >> 16) - amt;
    const G = (num >> 8 & 0x00FF) - amt;
    const B = (num & 0x0000FF) - amt;
    return '#' + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
      (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
      (B < 255 ? B < 1 ? 0 : B : 255))
      .toString(16).slice(1);
  }

  getCategoryColor(categoria: string): string {
    return this.categorias[categoria]?.color || '#667eea';
  }

  getCategoryIcon(categoria: string): string {
    return this.categorias[categoria]?.icono || '🎯';
  }

  getCategoryName(categoria: string): string {
    return this.categorias[categoria]?.nombre || categoria;
  }

  getDifficultyLabel(dificultad: string): string {
    const labels: { [key: string]: string } = {
      'principiante': 'Principiante',
      'intermedio': 'Intermedio',
      'avanzado': 'Avanzado'
    };
    return labels[dificultad] || dificultad;
  }

  getTerapiasCountByCategory(category: string): number {
    return this.terapias.filter(t => t.categoria === category).length;
  }

  getResultsTitle(): string {
    if (this.searchTerm) {
      return `Resultados para "${this.searchTerm}" (${this.filteredTerapias.length})`;
    }
    if (this.selectedCategory) {
      return `${this.getCategoryName(this.selectedCategory)} (${this.filteredTerapias.length})`;
    }
    return `Todas las Terapias (${this.filteredTerapias.length})`;
  }

  viewTerapiaDetails(terapia: Terapia): void {
    this.selectedTerapia = terapia;
  }

  closeModal(): void {
    this.selectedTerapia = null;
  }

  startTerapia(terapia: Terapia): void {
    console.log('Iniciando terapia:', terapia.nombre);
    // Aquí implementarías la lógica para iniciar la terapia
    // Por ejemplo: this.router.navigate(['/sesion', terapia.id]);
    alert(`${this.currentUser?.tipo === 'paciente' ? 'Iniciando' : 'Asignando'} terapia: ${terapia.nombre}`);
    this.closeModal();
  }

  openCreateTerapia(): void {
    console.log('Abriendo formulario para crear nueva terapia');
    // Aquí abrirías un modal o navegarías a un formulario
    alert('Funcionalidad de crear terapia en desarrollo');
  }
}
