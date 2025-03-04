import { Component, OnInit } from '@angular/core';
import { ProyectoService } from '../services/proyecto.service';
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

  constructor(private proyectoService: ProyectoService, private router: Router) {}

  ngOnInit(): void {
    this.cargarProyectos();
  }

  cargarProyectos(): void {
    this.proyectoService.obtenerProyectos().subscribe(data => {
      this.proyectos = data.map(proyecto => ({
        ...proyecto,
        fechaInicio: proyecto.fechaInicio ? new Date(proyecto.fechaInicio).toLocaleDateString() : 'N/A',
        fechaFin: proyecto.fechaFin ? new Date(proyecto.fechaFin).toLocaleDateString() : 'Sin finalizar'
      }));
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