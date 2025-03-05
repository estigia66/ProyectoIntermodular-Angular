import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';
import { Usuario } from '../models/Usuario.model';
import { Timestamp } from 'firebase/firestore';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit {
  usuario: Usuario | null = null;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.user$.subscribe((usuario) => {
      if (usuario) {
        console.log("Usuario actualizado en perfil:", usuario);
        this.usuario = usuario;
      } else {
        console.warn("Usuario no encontrado en perfil");
      }
    });
  }
}