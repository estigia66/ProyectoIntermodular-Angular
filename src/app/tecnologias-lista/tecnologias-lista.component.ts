import { Component, OnInit } from '@angular/core';
import { TecnologiaService } from '../services/tecnologia.service';

@Component({
  selector: 'app-tecnologias-lista',
  templateUrl: './tecnologias-lista.component.html',
  styleUrls: ['./tecnologias-lista.component.css']
})
export class TecnologiasListaComponent implements OnInit {
  tecnologias: any[] = [];

  constructor(private tecnologiaService: TecnologiaService) {}

  ngOnInit() {
    this.tecnologiaService.obtenerTecnologias().subscribe(tecnologias => {
      this.tecnologias = tecnologias;
    });
  }

  eliminarTecnologia(id: string) {
    this.tecnologiaService.eliminarTecnologia(id).then(() => {
      console.log('Tecnología eliminada');
    });
  }
}