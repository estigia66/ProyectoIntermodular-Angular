import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FacturaService } from './../services/factura.service';

@Component({
  selector: 'app-facturas-lista',
  imports: [CommonModule],
  templateUrl: './facturas-lista.component.html',
  styleUrls: ['./facturas-lista.component.css']
})
export class FacturasListaComponent implements OnInit {
  facturas: any[] = [];
  idProyecto!: string;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private facturaService: FacturaService
  ) {}

  ngOnInit() {
    this.idProyecto = this.route.snapshot.paramMap.get('idProyecto')!;
    console.log('ID del Proyecto:', this.idProyecto);
    this.obtenerFacturas();
  }

  obtenerFacturas() {
    this.facturaService.obtenerFacturasPorProyecto(this.idProyecto).subscribe(facturas => {
      console.log('Facturas obtenidas:', facturas);
      this.facturas = facturas;
    });
  }

  verDetalleFactura(idFactura: string) {
    this.router.navigate(['/facturas/detalle', idFactura]);
  }

  eliminarFactura(idFactura: string) {
    if (confirm('¿Estás seguro de que deseas eliminar esta factura?')) {
      this.facturaService.eliminarFactura(idFactura)
        .then(() => {
          console.log('Factura eliminada correctamente.');
          this.obtenerFacturas(); // Vuelve a cargar la lista después de eliminar
        })
        .catch(error => console.error('Error al eliminar la factura:', error));
    }
  }
}