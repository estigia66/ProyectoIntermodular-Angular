import { Injectable, inject } from '@angular/core';
import { Firestore, collection, addDoc, collectionData, deleteDoc, doc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TecnologiaService {
  private firestore = inject(Firestore);
  private coleccionTecnologias = 'tecnologias'; // Nombre de la colección en Firestore

  // Obtener todas las tecnologías
  obtenerTecnologias(): Observable<any[]> {
    const tecnologiasRef = collection(this.firestore, this.coleccionTecnologias);
    return collectionData(tecnologiasRef, { idField: 'id' });
  }

  // Agregar una nueva tecnología
  agregarTecnologia(tecnologia: any): Promise<any> {
    const tecnologiasRef = collection(this.firestore, this.coleccionTecnologias);
    return addDoc(tecnologiasRef, tecnologia);
  }

  // Eliminar una tecnología
  eliminarTecnologia(id: string): Promise<void> {
    const tecnologiaDocRef = doc(this.firestore, `${this.coleccionTecnologias}/${id}`);
    return deleteDoc(tecnologiaDocRef);
  }
}