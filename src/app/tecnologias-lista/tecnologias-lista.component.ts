import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TecnologiaService } from '../services/tecnologia.service';

@Component({
  selector: 'app-tecnologias-lista',
  imports: [CommonModule, RouterModule],
  templateUrl: './tecnologias-lista.component.html',
  styleUrls: ['./tecnologias-lista.component.css']
})
export class TecnologiasListaComponent implements OnInit {
  tecnologias: any[] = [];

  constructor(private tecnologiaService: TecnologiaService) {}

  ngOnInit(): void {
    this.cargarTecnologias();
  }

  cargarTecnologias(): void {
    this.tecnologiaService.obtenerTecnologias().subscribe((data) => {
      this.tecnologias = data.map(tecnologia => ({
        ...tecnologia,
        imagenUrl: tecnologia.imagenUrl || 'assets/imagenes/default.jpg' // Imagen por defecto si no hay imagen
      }));
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