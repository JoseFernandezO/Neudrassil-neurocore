import { Routes } from '@angular/router';
import { Login } from './components/login/login';
import { HomeTerapeutaComponent } from './components/home-terapeuta/home-terapeuta';
import { HomePacienteComponent } from './components/home-paciente/home-paciente';
import { MenuTerapiasComponent } from './components/menu-terapias/menu-terapias';
import { ProgresoSesionComponent } from './components/progreso-sesion/progreso-sesion';
import { AuthGuard } from './guards/auth-guard';
import { RoleGuard } from './guards/role-guard';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: Login },
  {
    path: 'home-terapeuta',
    component: HomeTerapeutaComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { expectedRole: 'terapeuta' }
  },
  {
    path: 'home-paciente',
    component: HomePacienteComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { expectedRole: 'paciente' }
  },
  {
    path: 'terapias',
    component: MenuTerapiasComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'progreso',
    component: ProgresoSesionComponent,
    canActivate: [AuthGuard]
  },
  { path: '**', redirectTo: '/login' }
];
