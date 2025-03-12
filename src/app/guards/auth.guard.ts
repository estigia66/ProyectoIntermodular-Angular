import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Observable, of } from 'rxjs';
import { map, take, switchMap, filter, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): Observable<boolean> {
    return this.authService.user$.pipe(
      switchMap(user => {
        if (user) {
          return of(true); // Usuario autenticado, permite acceso
        } else {
          console.warn('Esperando a que se cargue la sesión...');
          return this.authService.user$.pipe(
            filter(u => u !== null), // Espera a que el usuario no sea null
            take(1),
            map(() => true)
          );
        }
      }),
      catchError(() => {
        this.router.navigate(['/login']);
        return of(false);
      })
    );
  }
}