import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TecnologiaService } from '../services/tecnologia.service';

@Component({
  selector: 'app-tecnologias-nuevo',
  imports: [CommonModule, FormsModule],
  templateUrl: './tecnologias-nuevo.component.html',
  styleUrls: ['./tecnologias-nuevo.component.css']
})
export class TecnologiasNuevoComponent {
  tecnologia = { nombre: '', descripcion: '', imagenUrl: '' };
  imagenPreview: string | null = null;
  nombreArchivoImagen: string = '';

  constructor(private tecnologiaService: TecnologiaService) {}

  cargarImagen(event: any) {
    const file = event.target.files[0];
    if (file) {
      // Vista previa de la imagen
      const reader = new FileReader();
      reader.onload = (e) => {
        this.imagenPreview = e.target?.result as string;
      };
      reader.readAsDataURL(file);

      // Guardar solo el nombre del archivo para usarlo en la ruta de `assets`
      this.nombreArchivoImagen = file.name;
      this.tecnologia.imagenUrl = `assets/imagenes/${file.name}`;
    }
  }

  agregarTecnologia() {
    if (!this.tecnologia.nombre || !this.tecnologia.descripcion || !this.tecnologia.imagenUrl) {
      alert('Todos los campos son obligatorios, incluida la imagen.');
      return;
    }

    this.tecnologiaService.agregarTecnologia(this.tecnologia)
      .then(() => {
        alert('Tecnología añadida correctamente. Recuerda mover la imagen a "assets/imagenes/".');
      })
      .catch(error => {
        console.error('Error al añadir tecnología:', error);
        alert('Ocurrió un error al añadir la tecnología.');
      });
  }
}