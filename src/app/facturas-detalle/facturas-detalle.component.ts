import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FacturaService } from '../services/factura.service';

@Component({
  selector: 'app-facturas-detalle',
  imports: [CommonModule, RouterModule],
  templateUrl: './facturas-detalle.component.html',
  styleUrls: ['./facturas-detalle.component.css']
})
export class FacturasDetalleComponent implements OnInit {
  factura: any = null; // Variable para almacenar la factura

  constructor(
    private route: ActivatedRoute,
    private facturaService: FacturaService
  ) {}

  ngOnInit(): void {
    // Obtener el ID de la factura desde la URL
    const idFactura = this.route.snapshot.paramMap.get('idFactura');
    if (idFactura) {
      this.cargarFactura(idFactura);
    }
  }

  cargarFactura(idFactura: string) {
    this.facturaService.obtenerFacturaPorId(idFactura).subscribe((factura) => {
      this.factura = factura;
    });
  }
}