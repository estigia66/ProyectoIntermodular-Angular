import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ProyectoService } from '../services/proyecto.service';
import { CommonModule } from '@angular/common';
import { TecnologiaService } from '../services/tecnologia.service';

@Component({
  selector: 'app-proyectos-nuevo',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './proyectos-nuevo.component.html',
  styleUrl: './proyectos-nuevo.component.css'
})
export class ProyectosNuevoComponent implements OnInit {
  formularioProyecto!: FormGroup;
  tecnologiasDisponibles: any[] = [];

  constructor(
    private fb: FormBuilder,
    private proyectoService: ProyectoService,
    private tecnologiaService: TecnologiaService,
    private router: Router
  ){}

  ngOnInit(): void {
    this.formularioProyecto = this.fb.group({
      nombre: ['', Validators.required],
      descripcion: ['', Validators.required],
      estado: ['pendiente', Validators.required],
      fechaInicio: ['', Validators.required],
      fechaFin: [''],
      tecnologias: [[]]
    });

    // Cargar tecnologías desde Firestore
    this.tecnologiaService.obtenerTecnologias().subscribe(tecnologias => {
      this.tecnologiasDisponibles = tecnologias;
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

      datos.tecnologias = this.formularioProyecto.get('tecnologias')?.value || [];

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

  onCheckboxChange(event: any) {
    const tecnologiasSeleccionadas = this.formularioProyecto.get('tecnologias')?.value || [];
  
    if (event.target.checked) {
      tecnologiasSeleccionadas.push(event.target.value);
    } else {
      const index = tecnologiasSeleccionadas.indexOf(event.target.value);
      if (index > -1) {
        tecnologiasSeleccionadas.splice(index, 1);
      }
    }
  
    this.formularioProyecto.get('tecnologias')?.setValue(tecnologiasSeleccionadas);
  }
  
  cancelar(): void {
    this.router.navigate(['/lista']);
  }
}
