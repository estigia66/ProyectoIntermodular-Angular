import { Component } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { NavbarComponent } from './navbar/navbar.component';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavbarComponent, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'proyectoIntermodular';
  mostrarNavbar = true; // ✅ Variable para controlar la visibilidad del Navbar

  constructor(private router: Router) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        // ✅ Ocultar navbar en Login y Register
        this.mostrarNavbar = !(event.url === '/login' || event.url === '/register');
      }
    });
  }
}