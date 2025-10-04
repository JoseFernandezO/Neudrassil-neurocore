import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Auth } from '../../services/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="login-container">
      <div class="login-card">
        <div class="logo-section">
          <div class="logo">🧠</div>
          <h1 class="app-title">Neudrassil Neurocore</h1>
          <p class="app-subtitle">Plataforma de Terapias Neurológicas</p>
        </div>

        <form class="login-form" (ngSubmit)="onLogin()" #loginForm="ngForm">
          <div class="form-group">
            <label for="email">
              <i class="icon">✉️</i>
              Email
            </label>
            <input
              type="email"
              id="email"
              [(ngModel)]="credentials.email"
              name="email"
              class="form-control"
              placeholder="Ingresa tu email"
              required
              #emailInput="ngModel">
            <div *ngIf="emailInput.invalid && emailInput.touched" class="error-message">
              Email requerido
            </div>
          </div>

          <div class="form-group">
            <label for="password">
              <i class="icon">🔒</i>
              Contraseña
            </label>
            <div class="password-container">
              <input
                [type]="showPassword ? 'text' : 'password'"
                id="password"
                [(ngModel)]="credentials.password"
                name="password"
                class="form-control"
                placeholder="Ingresa tu contraseña"
                required
                #passwordInput="ngModel">
              <button
                type="button"
                class="toggle-password"
                (click)="showPassword = !showPassword">
                {{ showPassword ? '🙈' : '👁️' }}
              </button>
            </div>
            <div *ngIf="passwordInput.invalid && passwordInput.touched" class="error-message">
              Contraseña requerida
            </div>
          </div>

          <div class="form-group">
            <label for="userType">
              <i class="icon">👤</i>
              Tipo de Usuario
            </label>
            <select
              id="userType"
              [(ngModel)]="credentials.userType"
              name="userType"
              class="form-control"
              required
              #userTypeInput="ngModel">
              <option value="">Selecciona tu rol</option>
              <option value="paciente">👨‍⚕️ Paciente</option>
              <option value="terapeuta">🩺 Terapeuta</option>
            </select>
            <div *ngIf="userTypeInput.invalid && userTypeInput.touched" class="error-message">
              Selecciona un tipo de usuario
            </div>
          </div>

          <button
            type="submit"
            class="btn-login"
            [disabled]="!loginForm.form.valid || loading">
            <span *ngIf="loading" class="spinner">⏳</span>
            <span *ngIf="!loading">🚀</span>
            {{ loading ? 'Iniciando...' : 'Iniciar Sesión' }}
          </button>

          <div *ngIf="errorMessage" class="error-alert">
            ⚠️ {{ errorMessage }}
          </div>

          <div class="login-options">
            <a href="#" class="link">¿Olvidaste tu contraseña?</a>
            <a href="#" class="link">Crear cuenta nueva</a>
          </div>

          <div class="demo-section">
            <h4>🎯 Cuentas de demostración</h4>
            <div class="demo-accounts">
              <div class="demo-account">
                <strong>Terapeuta:</strong>
                <code>ana.garcia@neudrassil.com</code>
                <button
                  type="button"
                  class="btn-demo"
                  (click)="fillDemo('terapeuta')">
                  Usar
                </button>
              </div>
              <div class="demo-account">
                <strong>Paciente:</strong>
                <code>juan.perez@email.com</code>
                <button
                  type="button"
                  class="btn-demo"
                  (click)="fillDemo('paciente')">
                  Usar
                </button>
              </div>
            </div>
            <small>💡 Usa cualquier contraseña</small>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .login-container {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 20px;
      position: relative;
      overflow: hidden;
    }

    .login-container::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="50" cy="50" r="1" fill="rgba(255,255,255,0.05)"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>');
      pointer-events: none;
    }

    .login-card {
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(10px);
      border-radius: 20px;
      padding: 40px;
      width: 100%;
      max-width: 450px;
      box-shadow: 0 25px 50px rgba(0,0,0,0.15);
      border: 1px solid rgba(255,255,255,0.2);
      position: relative;
      z-index: 1;
    }

    .logo-section {
      text-align: center;
      margin-bottom: 35px;
    }

    .logo {
      font-size: 48px;
      margin-bottom: 15px;
      animation: pulse 2s infinite;
    }

    @keyframes pulse {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.1); }
    }

    .app-title {
      font-size: 28px;
      font-weight: bold;
      color: #333;
      margin-bottom: 8px;
      background: linear-gradient(135deg, #667eea, #764ba2);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .app-subtitle {
      color: #666;
      font-size: 16px;
      margin: 0;
      font-weight: 500;
    }

    .form-group {
      margin-bottom: 25px;
    }

    .form-group label {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 8px;
      font-weight: 600;
      color: #333;
      font-size: 14px;
    }

    .icon {
      font-size: 16px;
    }

    .form-control {
      width: 100%;
      padding: 14px 16px;
      border: 2px solid #e1e5e9;
      border-radius: 12px;
      font-size: 16px;
      transition: all 0.3s ease;
      box-sizing: border-box;
      background: rgba(255,255,255,0.9);
    }

    .form-control:focus {
      outline: none;
      border-color: #667eea;
      box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
      background: white;
    }

    .password-container {
      position: relative;
    }

    .toggle-password {
      position: absolute;
      right: 12px;
      top: 50%;
      transform: translateY(-50%);
      background: none;
      border: none;
      cursor: pointer;
      padding: 4px;
      border-radius: 4px;
      transition: background 0.2s;
    }

    .toggle-password:hover {
      background: rgba(0,0,0,0.05);
    }

    .btn-login {
      width: 100%;
      padding: 16px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border: none;
      border-radius: 12px;
      font-size: 16px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      position: relative;
      overflow: hidden;
    }

    .btn-login::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
      transition: left 0.5s;
    }

    .btn-login:hover::before {
      left: 100%;
    }

    .btn-login:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
    }

    .btn-login:disabled {
      opacity: 0.7;
      cursor: not-allowed;
      transform: none;
    }

    .spinner {
      animation: spin 1s linear infinite;
    }

    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }

    .login-options {
      margin-top: 25px;
      text-align: center;
    }

    .link {
      display: block;
      color: #667eea;
      text-decoration: none;
      font-size: 14px;
      margin-bottom: 8px;
      transition: color 0.3s;
      font-weight: 500;
    }

    .link:hover {
      color: #764ba2;
      text-decoration: underline;
    }

    .demo-section {
      margin-top: 30px;
      padding: 20px;
      background: linear-gradient(135deg, #f8f9fa, #e9ecef);
      border-radius: 12px;
      text-align: center;
      border: 1px solid #dee2e6;
    }

    .demo-section h4 {
      margin-bottom: 15px;
      color: #333;
      font-size: 16px;
      font-weight: 600;
    }

    .demo-accounts {
      display: flex;
      flex-direction: column;
      gap: 10px;
      margin-bottom: 15px;
    }

    .demo-account {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 8px 12px;
      background: white;
      border-radius: 8px;
      border: 1px solid #e1e5e9;
    }

    .demo-account strong {
      font-size: 12px;
      color: #555;
      min-width: 70px;
      text-align: left;
    }

    .demo-account code {
      background: #f1f3f4;
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 11px;
      color: #333;
      flex: 1;
      margin: 0 8px;
    }

    .btn-demo {
      background: #667eea;
      color: white;
      border: none;
      padding: 4px 12px;
      border-radius: 6px;
      font-size: 11px;
      cursor: pointer;
      font-weight: 500;
      transition: all 0.2s;
    }

    .btn-demo:hover {
      background: #5a67d8;
      transform: scale(1.05);
    }

    .demo-section small {
      color: #666;
      font-size: 12px;
    }

    .error-message {
      color: #dc3545;
      font-size: 12px;
      margin-top: 4px;
      display: flex;
      align-items: center;
      gap: 4px;
    }

    .error-alert {
      background: rgba(220, 53, 69, 0.1);
      color: #dc3545;
      padding: 10px;
      border-radius: 8px;
      margin-top: 15px;
      font-size: 14px;
      border: 1px solid rgba(220, 53, 69, 0.2);
    }

    @media (max-width: 480px) {
      .login-card {
        margin: 10px;
        padding: 30px 25px;
      }

      .app-title {
        font-size: 24px;
      }

      .demo-account {
        flex-direction: column;
        gap: 8px;
        text-align: center;
      }

      .demo-account strong,
      .demo-account code {
        margin: 0;
      }
    }
  `]
})
export class Login {
  credentials = {
    email: '',
    password: '',
    userType: ''
  };

  loading = false;
  showPassword = false;
  errorMessage = '';

  constructor(
    private authService: Auth,
    private router: Router
  ) {}

  fillDemo(tipo: 'terapeuta' | 'paciente'): void {
    if (tipo === 'terapeuta') {
      this.credentials.email = 'ana.garcia@neudrassil.com';
      this.credentials.userType = 'terapeuta';
    } else {
      this.credentials.email = 'juan.perez@email.com';
      this.credentials.userType = 'paciente';
    }
    this.credentials.password = 'demo123';
  }

  onLogin(): void {
    this.errorMessage = '';
    this.loading = true;

    this.authService.login(this.credentials).subscribe({
      next: (response) => {
        this.loading = false;
        // Pequeña animación antes de navegar
        setTimeout(() => {
          if (this.credentials.userType === 'terapeuta') {
            this.router.navigate(['/home-terapeuta']);
          } else {
            this.router.navigate(['/home-paciente']);
          }
        }, 500);
      },
      error: (error) => {
        this.loading = false;
        this.errorMessage = error.message || 'Error al iniciar sesión. Verifica tus credenciales.';
      }
    });
  }
}
