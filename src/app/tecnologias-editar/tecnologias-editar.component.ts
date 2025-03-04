import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Firestore, doc, getDoc, updateDoc } from '@angular/fire/firestore';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-tecnologias-editar',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './tecnologias-editar.component.html',
  styleUrls: ['./tecnologias-editar.component.css']
})
export class TecnologiasEditarComponent implements OnInit {
  tecnologiaId: string | null = null;
  tecnologia = { nombre: '', descripcion: '', imagen: '' };
  imagenPreview: string | null = null;
  nuevaImagen: File | null = null; // Para almacenar la nueva imagen

  constructor(
    private route: ActivatedRoute,
    public router: Router,
    private firestore: Firestore
  ) {}

  ngOnInit() {
    this.tecnologiaId = this.route.snapshot.paramMap.get('id');
    if (this.tecnologiaId) {
      this.cargarTecnologia();
    }
  }

  async cargarTecnologia() {
    if (!this.tecnologiaId) return;
    const docRef = doc(this.firestore, 'tecnologias', this.tecnologiaId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      this.tecnologia = docSnap.data() as any;
      this.imagenPreview = this.tecnologia.imagen; // Mostrar la imagen actual
    } else {
      console.error('No se encontró la tecnología');
    }
  }

  cargarImagen(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.nuevaImagen = file; // Guardamos la nueva imagen
      this.imagenPreview = `assets/imagenes/${file.name}`; // Vista previa con la ruta
    }
  }

  async actualizarTecnologia() {
    if (!this.tecnologiaId) return;
    
    try {
      const docRef = doc(this.firestore, 'tecnologias', this.tecnologiaId);
      await updateDoc(docRef, { 
        nombre: this.tecnologia.nombre,
        descripcion: this.tecnologia.descripcion,
        imagen: this.nuevaImagen ? `assets/imagenes/${this.nuevaImagen.name}` : this.tecnologia.imagen
      });
      
      console.log('Tecnología actualizada correctamente');
      this.router.navigate(['/tecnologias']); // Redirige a la lista de tecnologías
    } catch (error) {
      console.error('Error al actualizar la tecnología:', error);
    }
  }
}