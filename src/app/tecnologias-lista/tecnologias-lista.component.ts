import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TecnologiaService } from '../services/tecnologia.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-tecnologias-lista',
  imports: [CommonModule, RouterModule],
  templateUrl: './tecnologias-lista.component.html',
  styleUrls: ['./tecnologias-lista.component.css']
})
export class TecnologiasListaComponent implements OnInit {
  tecnologias: any[] = [];

  constructor(
    private tecnologiaService: TecnologiaService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.authService.user$.subscribe(usuario => {
      if (usuario) {
        console.log('Usuario autenticado, cargando tecnologías...');
        this.cargarTecnologias();
      } else {
        console.log('Esperando autenticación...');
      }
    });
  }

  cargarTecnologias(): void {
    console.log('Cargando tecnologías...');
    this.tecnologiaService.obtenerTecnologias().subscribe(data => {
      console.log('Tecnologías cargadas:', data);
      this.tecnologias = data.sort((a, b) => a.nombre.localeCompare(b.nombre));
    }, error => {
      console.error('Error obteniendo tecnologías:', error);
    });
  }

  eliminarTecnologia(id: string): void {
    if (confirm('¿Seguro que deseas eliminar esta tecnología?')) {
      this.tecnologiaService.eliminarTecnologia(id).then(() => {
        alert('Tecnología eliminada correctamente.');
        this.cargarTecnologias();
      }).catch(error => console.error('Error eliminando tecnología:', error));
    }
  }
}