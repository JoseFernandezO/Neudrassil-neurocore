import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Auth } from '../services/auth';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {
  constructor(
    private authService: Auth,
    private router: Router
  ) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const expectedRole = route.data['expectedRole'];
    const userType = this.authService.getUserType();

    if (userType === expectedRole) {
      return true;
    } else {
      // Redirigir al home correspondiente al tipo de usuario
      if (userType === 'terapeuta') {
        this.router.navigate(['/home-terapeuta']);
      } else if (userType === 'paciente') {
        this.router.navigate(['/home-paciente']);
      } else {
        this.router.navigate(['/login']);
      }
      return false;
    }
  }
}
