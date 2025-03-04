import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-tecnologias-nuevo',
  imports: [CommonModule, FormsModule],
  templateUrl: './tecnologias-nuevo.component.html',
  styleUrls: ['./tecnologias-nuevo.component.css']
})

export class TecnologiasNuevoComponent {
  tecnologia = { nombre: '', descripcion: '', imagen: '' };
  imagenPreview: string | ArrayBuffer | null = null;

  cargarImagen(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result !== undefined) {
          this.imagenPreview = e.target.result;
          this.tecnologia.imagen = e.target.result as string;
        }
      };
      reader.readAsDataURL(file);
    }
  }

  agregarTecnologia() {
    console.log('Nueva tecnología añadida:', this.tecnologia);
    // Aquí se debe manejar la lógica para enviar la tecnología con la imagen al backend.
  }
}