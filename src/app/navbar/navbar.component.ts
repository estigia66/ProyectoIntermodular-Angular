import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service'; 
import { Router, RouterLink } from '@angular/router';
import { Usuario } from '../models/Usuario.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  imports: [CommonModule, RouterLink],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})

export class NavbarComponent implements OnInit {
  esAdmin: boolean = false;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.authService.user$.subscribe((usuario) => {
      if (usuario) {
        console.log("Usuario actualizado en Navbar:", usuario);
        this.esAdmin = usuario.rol === 'admin';
      } else {
        this.esAdmin = false;
      }
    });
  }

  cerrarSesion(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}