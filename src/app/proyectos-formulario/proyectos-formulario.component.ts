import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProyectoService } from '../services/proyecto.service';
import { ReactiveFormsModule } from '@angular/forms'; // Importa ReactiveFormsModule
import { CommonModule } from '@angular/common'; // Importa CommonModule para *ngIf y otras directivas

@Component({
  selector: 'app-proyectos-formulario',
  standalone: true, // Indica que este componente es independiente
  imports: [ReactiveFormsModule, CommonModule], // Importa los módulos necesarios
  templateUrl: './proyectos-formulario.component.html',
  styleUrls: ['./proyectos-formulario.component.css']
})
export class ProyectosFormularioComponent implements OnInit {
  formularioProyecto!: FormGroup;
  idProyecto!: string | null;

  constructor(
    private fb: FormBuilder,
    private proyectoService: ProyectoService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Inicializa el formulario reactivo
    this.formularioProyecto = this.fb.group({
      nombre: ['', Validators.required],
      tecnologias: ['', Validators.required]
    });

    // Verifica si estamos editando un proyecto (si hay un ID en la URL)
    this.idProyecto = this.route.snapshot.paramMap.get('id');
    if (this.idProyecto) {
      this.cargarDatosProyecto(this.idProyecto);
    }
  }

  cargarDatosProyecto(id: string): void {
    this.proyectoService.obtenerProyectoPorId(id).subscribe(proyecto => {
      if (proyecto) {
        this.formularioProyecto.patchValue(proyecto); // Rellena el formulario con los datos del proyecto
      }
    });
  }

  guardarProyecto(): void {
    if (this.formularioProyecto.valid) {
      const datos = this.formularioProyecto.value;

      if (this.idProyecto) {
        // Actualizar proyecto existente
        this.proyectoService.actualizarProyecto(this.idProyecto, datos).then(() => {
          alert('Proyecto actualizado con éxito');
          this.router.navigate(['/lista']); // Navega de vuelta a la lista de proyectos
        }).catch(error => {
          console.error('Error al actualizar el proyecto:', error);
        });
      } else {
        // Crear nuevo proyecto
        this.proyectoService.agregarProyecto(datos).then(() => {
          alert('Proyecto creado con éxito');
          this.router.navigate(['/lista']); // Navega de vuelta a la lista de proyectos
        }).catch(error => {
          console.error('Error al crear el proyecto:', error);
        });
      }
    } else {
      alert('Por favor, completa todos los campos requeridos.');
    }
  }
}