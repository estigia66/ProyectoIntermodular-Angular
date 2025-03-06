import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Observable, of } from 'rxjs';
import { map, take, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): Observable<boolean> {
    return this.authService.user$.pipe(
      switchMap(user => {
        if (user === undefined) {
          return of(false); // Evita que Angular redirija antes de que Firebase cargue el usuario
        }
        return of(!!user);
      }),
      take(1),
      map(user => {
        if (user) {
          return true; // Usuario autenticado, permite acceso
        } else {
          console.warn('Usuario no autenticado, redirigiendo al login');
          this.router.navigate(['/login']); // 🔄 Redirigir solo si Firebase confirma que no hay sesión
          return false;
        }
      })
    );
  }
}