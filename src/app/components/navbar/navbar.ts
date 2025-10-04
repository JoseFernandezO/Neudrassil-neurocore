import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { Auth } from '../../services/auth';
import { Usuario } from '../../models/usuario';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <nav class="navbar" *ngIf="isAuthenticated">
      <div class="nav-container">
        <div class="nav-brand" [routerLink]="getHomeRoute()">
          <div class="brand-logo">🧠</div>
          <div class="brand-text">
            <h2 class="brand-title">Neudrassil</h2>
            <span class="brand-subtitle">Neurocore</span>
          </div>
        </div>

        <div class="nav-menu" [class.active]="mobileMenuOpen">
          <a
            [routerLink]="getHomeRoute()"
            routerLinkActive="active"
            [routerLinkActiveOptions]="{exact: true}"
            class="nav-item"
            (click)="closeMobileMenu()">
            <i class="icon">🏠</i>
            <span>Inicio</span>
          </a>

          <a
            routerLink="/terapias"
            routerLinkActive="active"
            class="nav-item"
            (click)="closeMobileMenu()">
            <i class="icon">🧠</i>
            <span>Terapias</span>
          </a>

          <a
            routerLink="/progreso"
            routerLinkActive="active"
            class="nav-item"
            (click)="closeMobileMenu()">
            <i class="icon">📈</i>
            <span>Progreso</span>
          </a>

          <!-- Items específicos para terapeuta -->
          <div *ngIf="currentUser?.tipo === 'terapeuta'" class="nav-divider"></div>
          <a
            *ngIf="currentUser?.tipo === 'terapeuta'"
            href="#"
            class="nav-item nav-item-special">
            <i class="icon">👥</i>
            <span>Pacientes</span>
          </a>
        </div>

        <div class="nav-user">
          <div class="user-info" (click)="toggleUserMenu()">
            <div class="user-avatar">
              {{ getUserInitials() }}
            </div>
            <div class="user-details">
              <span class="user-name">{{ currentUser?.nombre }}</span>
              <span class="user-type">{{ getUserTypeLabel() }}</span>
            </div>
            <i class="dropdown-arrow">{{ userMenuOpen ? '🔼' : '🔽' }}</i>
          </div>

          <!-- Dropdown del usuario -->
          <div class="user-dropdown" [class.active]="userMenuOpen">
            <div class="dropdown-item" (click)="viewProfile()">
              <i class="icon">👤</i>
              <span>Mi Perfil</span>
            </div>
            <div class="dropdown-item" (click)="openSettings()">
              <i class="icon">⚙️</i>
              <span>Configuración</span>
            </div>
            <div class="dropdown-divider"></div>
            <div class="dropdown-item logout" (click)="logout()">
              <i class="icon">🚪</i>
              <span>Cerrar Sesión</span>
            </div>
          </div>
        </div>

        <!-- Botón del menú móvil -->
        <button class="mobile-menu-btn" (click)="toggleMobileMenu()">
          <span [class.active]="mobileMenuOpen"></span>
          <span [class.active]="mobileMenuOpen"></span>
          <span [class.active]="mobileMenuOpen"></span>
        </button>
      </div>

      <!-- Overlay para cerrar menús en móvil -->
      <div
        class="mobile-overlay"
        [class.active]="mobileMenuOpen || userMenuOpen"
        (click)="closeAllMenus()">
      </div>
    </nav>
  `,
  styles: [`
    .navbar {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 0;
      box-shadow: 0 4px 20px rgba(0,0,0,0.15);
      position: sticky;
      top: 0;
      z-index: 1000;
      border-bottom: 1px solid rgba(255,255,255,0.1);
    }

    .nav-container {
      max-width: 1200px;
      margin: 0 auto;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 20px;
      height: 70px;
      position: relative;
    }

    .nav-brand {
      display: flex;
      align-items: center;
      gap: 12px;
      cursor: pointer;
      transition: all 0.3s ease;
      padding: 8px;
      border-radius: 12px;
    }

    .nav-brand:hover {
      background: rgba(255,255,255,0.1);
    }

    .brand-logo {
      font-size: 32px;
      animation: pulse 2s ease-in-out infinite alternate;
    }

    @keyframes pulse {
      0% { transform: scale(1); }
      100% { transform: scale(1.1); }
    }

    .brand-text {
      display: flex;
      flex-direction: column;
      line-height: 1.2;
    }

    .brand-title {
      font-size: 20px;
      font-weight: bold;
      margin: 0;
      color: white;
    }

    .brand-subtitle {
      font-size: 12px;
      opacity: 0.8;
      font-weight: 500;
    }

    .nav-menu {
      display: flex;
      gap: 8px;
      align-items: center;
    }

    .nav-divider {
      width: 1px;
      height: 24px;
      background: rgba(255,255,255,0.3);
      margin: 0 8px;
    }

    .nav-item {
      display: flex;
      align-items: center;
      gap: 8px;
      color: white;
      text-decoration: none;
      padding: 10px 16px;
      border-radius: 10px;
      transition: all 0.3s ease;
      font-weight: 500;
      font-size: 14px;
      position: relative;
      overflow: hidden;
    }

    .nav-item::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent);
      transition: left 0.5s;
    }

    .nav-item:hover::before {
      left: 100%;
    }

    .nav-item:hover, .nav-item.active {
      background: rgba(255,255,255,0.2);
      color: white;
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    }

    .nav-item-special {
      background: rgba(255,255,255,0.15);
      border: 1px solid rgba(255,255,255,0.2);
    }

    .nav-item-special:hover {
      background: rgba(255,255,255,0.25);
    }

    .nav-user {
      position: relative;
    }

    .user-info {
      display: flex;
      align-items: center;
      gap: 12px;
      cursor: pointer;
      padding: 8px 12px;
      border-radius: 12px;
      transition: all 0.3s ease;
    }

    .user-info:hover {
      background: rgba(255,255,255,0.15);
    }

    .user-avatar {
      width: 40px;
      height: 40px;
      background: rgba(255,255,255,0.2);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: bold;
      font-size: 14px;
      border: 2px solid rgba(255,255,255,0.3);
    }

    .user-details {
      text-align: left;
    }

    .user-name {
      display: block;
      font-weight: bold;
      font-size: 14px;
      line-height: 1.2;
    }

    .user-type {
      display: block;
      font-size: 12px;
      opacity: 0.8;
      text-transform: capitalize;
      line-height: 1.2;
    }

    .dropdown-arrow {
      font-size: 12px;
      transition: transform 0.3s ease;
    }

    .user-dropdown {
      position: absolute;
      top: calc(100% + 8px);
      right: 0;
      background: white;
      border-radius: 12px;
      box-shadow: 0 8px 30px rgba(0,0,0,0.15);
      min-width: 200px;
      opacity: 0;
      visibility: hidden;
      transform: translateY(-10px);
      transition: all 0.3s ease;
      border: 1px solid rgba(0,0,0,0.1);
      overflow: hidden;
    }

    .user-dropdown.active {
      opacity: 1;
      visibility: visible;
      transform: translateY(0);
    }

    .dropdown-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px 16px;
      color: #333;
      cursor: pointer;
      transition: all 0.2s ease;
      font-size: 14px;
    }

    .dropdown-item:hover {
      background: #f8f9fa;
      color: #667eea;
    }

    .dropdown-item.logout {
      color: #dc3545;
      border-top: 1px solid #eee;
    }

    .dropdown-item.logout:hover {
      background: rgba(220, 53, 69, 0.1);
      color: #dc3545;
    }

    .dropdown-divider {
      height: 1px;
      background: #eee;
      margin: 4px 0;
    }

    .mobile-menu-btn {
      display: none;
      flex-direction: column;
      background: none;
      border: none;
      cursor: pointer;
      padding: 8px;
      gap: 4px;
    }

    .mobile-menu-btn span {
      width: 24px;
      height: 3px;
      background: white;
      border-radius: 2px;
      transition: all 0.3s ease;
      transform-origin: center;
    }

    .mobile-menu-btn span.active:nth-child(1) {
      transform: rotate(45deg) translate(6px, 6px);
    }

    .mobile-menu-btn span.active:nth-child(2) {
      opacity: 0;
    }

    .mobile-menu-btn span.active:nth-child(3) {
      transform: rotate(-45deg) translate(6px, -6px);
    }

    .mobile-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0,0,0,0.3);
      opacity: 0;
      visibility: hidden;
      transition: all 0.3s ease;
      z-index: -1;
    }

    .mobile-overlay.active {
      opacity: 1;
      visibility: visible;
    }

    .icon {
      font-size: 16px;
    }

    @media (max-width: 768px) {
      .nav-container {
        padding: 0 15px;
        height: 60px;
      }

      .brand-logo {
        font-size: 24px;
      }

      .brand-title {
        font-size: 16px;
      }

      .brand-subtitle {
        font-size: 10px;
      }

      .mobile-menu-btn {
        display: flex;
      }

      .nav-menu {
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        flex-direction: column;
        padding: 20px;
        gap: 8px;
        transform: translateY(-100%);
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
        border-top: 1px solid rgba(255,255,255,0.1);
      }

      .nav-menu.active {
        transform: translateY(0);
        opacity: 1;
        visibility: visible;
      }

      .nav-item {
        width: 100%;
        padding: 12px 16px;
        justify-content: flex-start;
      }

      .nav-divider {
        width: 100%;
        height: 1px;
        margin: 8px 0;
      }

      .user-details {
        display: none;
      }

      .user-dropdown {
        right: 15px;
      }

      .dropdown-arrow {
        display: none;
      }
    }

    @media (max-width: 480px) {
      .nav-container {
        padding: 0 10px;
      }

      .brand-text {
        display: none;
      }

      .user-dropdown {
        right: 10px;
        min-width: 180px;
      }
    }
  `]
})
export class Navbar implements OnInit {
  currentUser: Usuario | null = null;
  isAuthenticated = false;
  mobileMenuOpen = false;
  userMenuOpen = false;

  constructor(
    private authService: Auth,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.authService.currentUser.subscribe(user => {
      this.currentUser = user;
      this.isAuthenticated = user !== null;
    });
  }

  getHomeRoute(): string {
    return this.currentUser?.tipo === 'terapeuta' ? '/home-terapeuta' : '/home-paciente';
  }

  getUserTypeLabel(): string {
    return this.currentUser?.tipo === 'terapeuta' ? 'Terapeuta' : 'Paciente';
  }

  getUserInitials(): string {
    if (!this.currentUser?.nombre) return '?';
    const names = this.currentUser.nombre.split(' ');
    if (names.length >= 2) {
      return (names[0][0] + names[1][0]).toUpperCase();
    }
    return names[0][0].toUpperCase();
  }

  toggleMobileMenu(): void {
    this.mobileMenuOpen = !this.mobileMenuOpen;
    this.userMenuOpen = false;
  }

  toggleUserMenu(): void {
    this.userMenuOpen = !this.userMenuOpen;
    this.mobileMenuOpen = false;
  }

  closeMobileMenu(): void {
    this.mobileMenuOpen = false;
  }

  closeAllMenus(): void {
    this.mobileMenuOpen = false;
    this.userMenuOpen = false;
  }

  viewProfile(): void {
    this.closeAllMenus();
    // Navegar al perfil del usuario
    console.log('Ver perfil');
  }

  openSettings(): void {
    this.closeAllMenus();
    // Abrir configuración
    console.log('Abrir configuración');
  }

  logout(): void {
    this.closeAllMenus();
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
