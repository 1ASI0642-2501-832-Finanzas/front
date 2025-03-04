import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    if (this.authService.getToken()) {
      return true; // ✅ Permite el acceso si hay token
    } else {
      this.router.navigate(['/login']).then(()=>
      {
        console.error("Usuario no autenticado, redirigiendo al login.")
      }
    );
      return false;
    }
  }
}
