import { Injectable } from '@angular/core';
import { Firestore, collectionData, docData, addDoc, updateDoc, deleteDoc, doc, collection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProyectoService {
  private coleccionProyectos = 'proyectos'; // Nombre de la colección en Firestore

  constructor(private firestore: Firestore) {}

  // Obtener todos los proyectos
  obtenerProyectos(): Observable<any[]> {
    const proyectosRef = collection(this.firestore, this.coleccionProyectos);
    return collectionData(proyectosRef, { idField: 'id' });
  }

  // Obtener un proyecto por ID
  obtenerProyectoPorId(id: string): Observable<any> {
    const proyectoDocRef = doc(this.firestore, `${this.coleccionProyectos}/${id}`);
    return docData(proyectoDocRef, { idField: 'id' });
  }

  // Agregar un nuevo proyecto
  agregarProyecto(proyecto: any): Promise<any> {
    const proyectosRef = collection(this.firestore, this.coleccionProyectos);
    return addDoc(proyectosRef, proyecto);
  }

  // Actualizar un proyecto existente
  actualizarProyecto(id: string, data: any): Promise<void> {
    const proyectoDocRef = doc(this.firestore, `${this.coleccionProyectos}/${id}`);
    return updateDoc(proyectoDocRef, data);
  }

  // Eliminar un proyecto
  eliminarProyecto(id: string): Promise<void> {
    const proyectoDocRef = doc(this.firestore, `${this.coleccionProyectos}/${id}`);
    return deleteDoc(proyectoDocRef);
  }
}