import { Component, OnInit } from '@angular/core';
import { ProyectoService } from '../services/proyecto.service';
import { AuthService } from '../services/auth.service';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';


@Component({
  selector: 'app-proyectos-lista',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './proyectos-lista.component.html',
  styleUrls: ['./proyectos-lista.component.css']
})
export class ProyectosListaComponent implements OnInit {
  proyectos: any[] = [];

  constructor(
    private proyectoService: ProyectoService,
    private authService: AuthService,
    private router: Router) {}

    ngOnInit(): void {
      this.authService.user$.subscribe(usuario => {
        if (usuario) {
          console.log('Usuario autenticado, cargando proyectos...');
          this.cargarProyectos();
        } else {
          console.log('Esperando autenticación...');
        }
      });
    }
  
    cargarProyectos(): void {
      console.log('Cargando proyectos...');
      this.proyectoService.obtenerProyectos().subscribe(data => {
        console.log('Proyectos obtenidos:', data);
        this.proyectos = data.map(proyecto => ({
          ...proyecto,
          fechaInicio: proyecto.fechaInicio ? new Date(proyecto.fechaInicio).toLocaleDateString() : 'N/A',
          fechaFin: proyecto.fechaFin ? new Date(proyecto.fechaFin).toLocaleDateString() : 'Sin finalizar'
        }));
      }, error => {
        console.error('Error obteniendo proyectos:', error);
      });
    }
  
    verFacturas(proyectoId: string) {
      this.router.navigate(['/facturas', proyectoId]);
    }
  
    eliminarProyecto(id: string): void {
      if (confirm('¿Estás seguro de que quieres eliminar este proyecto?')) {
        this.proyectoService.eliminarProyecto(id).then(() => {
          alert('Proyecto eliminado con éxito');
          this.cargarProyectos(); // Recarga la lista después de eliminar
        }).catch(error => {
          console.error('Error al eliminar el proyecto:', error);
        });
      }
    }
  }