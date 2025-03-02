import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validator, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ProyectoService } from '../services/proyecto.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-proyectos-nuevo',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './proyectos-nuevo.component.html',
  styleUrl: './proyectos-nuevo.component.css'
})
export class ProyectosNuevoComponent implements OnInit {
  formularioProyecto!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private proyectoService: ProyectoService,
    private router: Router
  ){}

  ngOnInit(): void {
    this.formularioProyecto = this.fb.group({
      nombre: ['', Validators.required],
      descripcion: ['', Validators.required],
      estado: ['pendiente', Validators.required],
      fechaInicio: ['', Validators.required],
      fechaFin: [''],
      tecnologias: ['']
    });
  }

  agregarProyecto(){
    if (this.formularioProyecto.valid){
      const datos = this.formularioProyecto.value;
      datos.fechaInicio = new Date(datos.fechaInicio);
      if (datos.fechaFin){
        datos.fechaFin = new Date(datos.fechaFin);
      } else {
        delete datos.fechaFin; // Como no es obligatorio, si no se especifica, se elimina del objeto
      }
      datos.tecnologias = datos.tecnologias
        ? datos.tecnologias.split(',').map((tecnologia: string) => tecnologia.trim())
        : [];

      this.proyectoService.agregarProyecto(datos).then(() => {
        alert('Proyecto agregado correctamente');
        this.router.navigate(['/lista']);
      }).catch((e) => {
        console.log('Error al agregar proyecto', e);
        alert('Error al agregar proyecto');
      });
    }else{
      alert('Por favor, completa todos los campos obligatorios');
    }
  }
  
  cancelar(): void {
    this.router.navigate(['/lista']);
  }
}
