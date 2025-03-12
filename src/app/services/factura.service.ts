import { Injectable } from '@angular/core';
import { Firestore, collection, query, where, docData, doc, deleteDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { collectionData } from 'rxfire/firestore';

@Injectable({
  providedIn: 'root'
})
export class FacturaService {
  private collectionName = 'facturasEmitidas';

  constructor(private firestore: Firestore) {}

  // Obtener facturas por ID de proyecto
  obtenerFacturasPorProyecto(proyectoId: string): Observable<any[]> {
    const facturasRef = collection(this.firestore, this.collectionName);
    const q = query(facturasRef, where('proyectoId', '==', proyectoId));

    return collectionData(q, { idField: 'id' });
  }

  // Eliminar una factura por su ID
  async eliminarFactura(idFactura: string): Promise<void> {
    const facturaRef = doc(this.firestore, `${this.collectionName}/${idFactura}`);
    return deleteDoc(facturaRef);
  }

  // Obtener una factura por su ID
  obtenerFacturaPorId(idFactura: string): Observable<any> {
    const facturaRef = doc(this.firestore, `facturasEmitidas/${idFactura}`);
    return docData(facturaRef, { idField: 'id' });
  }

}