import { Injectable, inject } from '@angular/core';
import { Firestore, collectionData, docData, addDoc, updateDoc, deleteDoc, doc, collection, Timestamp } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ProyectoService {
  private firestore: Firestore = inject(Firestore);
  private coleccionProyectos = 'proyectos'; // Nombre de la colección en Firestore

  // Obtener todos los proyectos con conversión de fechas
  obtenerProyectos(): Observable<any[]> {
    const proyectosRef = collection(this.firestore, this.coleccionProyectos);
    return collectionData(proyectosRef, { idField: 'id' }).pipe(
      map((proyectos: any[]) => proyectos.map(proyecto => ({
        ...proyecto,
        fechaInicio: this.convertirFecha(proyecto['fechaInicio']),
        fechaFin: this.convertirFecha(proyecto['fechaFin'])
      })))
    );
  }

  // Obtener un proyecto por ID con conversión de fechas
  obtenerProyectoPorId(id: string): Observable<any> {
    const proyectoDocRef = doc(this.firestore, `${this.coleccionProyectos}/${id}`);
    return docData(proyectoDocRef, { idField: 'id' }).pipe(
      map((proyecto: any) => ({
        ...proyecto,
        fechaInicio: this.convertirFecha(proyecto['fechaInicio']),
        fechaFin: this.convertirFecha(proyecto['fechaFin'])
      }))
    );
  }

  // Método auxiliar para manejar fechas correctamente
  private convertirFecha(fecha: any): string {
    if (!fecha) return ''; // ✅ Maneja fechas nulas o indefinidas
    if (fecha.seconds) return new Date(fecha.seconds * 1000).toISOString().split('T')[0]; // ✅ Maneja Firestore Timestamp
    return fecha; // Si ya es un string (fecha en texto), lo deja sin cambios
  }

  // Agregar un nuevo proyecto con conversión a Timestamp
  agregarProyecto(proyecto: any): Promise<any> {
    const proyectosRef = collection(this.firestore, this.coleccionProyectos);
    return addDoc(proyectosRef, {
      ...proyecto,
      fechaInicio: proyecto.fechaInicio ? Timestamp.fromDate(new Date(proyecto.fechaInicio)) : null,
      fechaFin: proyecto.fechaFin ? Timestamp.fromDate(new Date(proyecto.fechaFin)) : null
    });
  }

  // Actualizar un proyecto con conversión a Timestamp
  actualizarProyecto(id: string, data: any): Promise<void> {
    const proyectoDocRef = doc(this.firestore, `${this.coleccionProyectos}/${id}`);
    return updateDoc(proyectoDocRef, {
      ...data,
      fechaInicio: data.fechaInicio ? Timestamp.fromDate(new Date(data.fechaInicio)) : null,
      fechaFin: data.fechaFin ? Timestamp.fromDate(new Date(data.fechaFin)) : null
    });
  }

  // Eliminar un proyecto
  eliminarProyecto(id: string): Promise<void> {
    const proyectoDocRef = doc(this.firestore, `${this.coleccionProyectos}/${id}`);
    return deleteDoc(proyectoDocRef);
  }
}