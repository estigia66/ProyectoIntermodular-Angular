import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Observable } from 'rxjs';
import { map, filter, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): Observable<boolean> {
    return this.authService.user$.pipe(
      filter(user => user !== undefined), // Espera hasta que Firebase termine la verificación
      take(1), // Solo toma el primer valor emitido
      map(user => {
        if (user) {
          return true; // Permite el acceso si hay usuario autenticado
        } else {
          this.router.navigate(['/login']);
          return false;
        }
      })
    );
  }
}