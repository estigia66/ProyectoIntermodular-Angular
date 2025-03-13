import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ProyectoService } from '../services/proyecto.service';
import { TecnologiaService } from '../services/tecnologia.service';

@Component({
  selector: 'app-proyectos-editar',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './proyectos-editar.component.html',
  styleUrl: './proyectos-editar.component.css'
})
export class ProyectosEditarComponent implements OnInit {
  formularioProyecto !: FormGroup;
  idProyecto!: string | null;
  estados = ['pendiente', 'en progreso', 'completado', 'cancelado'];
  tecnologiasDisponibles: any[] = [];

  constructor(
    private fb: FormBuilder,
    private proyectoService: ProyectoService,
    private router: Router,
    private route: ActivatedRoute,
    private tecnologiaService: TecnologiaService
  ) {}

  ngOnInit(): void {

    // Obtener el ID del proyecto desde la URL
    this.idProyecto = this.route.snapshot.paramMap.get('id');
    
    // Inicializar el formulario vacío
    this.formularioProyecto = this.fb.group({
      nombre: ['', Validators.required],
      descripcion: ['', Validators.required],
      estado: ['', Validators.required],
      fechaInicio: ['', Validators.required],
      fechaFin: [''],
      tecnologias: [[], Validators.required]
    });
    
    // Cargar tecnologías disponibles
    this.tecnologiaService.obtenerTecnologias().subscribe(tecnologias => {
      this.tecnologiasDisponibles = tecnologias;
    });

    // Si tenemos un ID, cargar los datos del proyecto desde Firebase
    if (this.idProyecto) {

      this.proyectoService.obtenerProyectoPorId(this.idProyecto).subscribe({
        next: (proyecto) => {
          if (proyecto) {
            this.formularioProyecto.patchValue({
              nombre: proyecto.nombre,
              descripcion: proyecto.descripcion,
              estado: proyecto.estado.toLowerCase(),
              fechaInicio: new Date(proyecto.fechaInicio).toISOString().split('T')[0],
              fechaFin: proyecto.fechaFin ? new Date(proyecto.fechaFin).toISOString().split('T')[0] : '',
              tecnologias: proyecto.tecnologias ? [...proyecto.tecnologias] : []
            });
          } else {
            alert('No se encontró el proyecto.');
            this.router.navigate(['/lista']);
          }
        },
        error: (error) => {
          console.error('Error al obtener el proyecto:', error);
          alert('Hubo un error al cargar los datos del proyecto.');
        }
      });
    }
  }

  actualizarProyecto(): void {
    if (this.formularioProyecto.valid && this.idProyecto) {
      const datos = this.formularioProyecto.value;
      datos.fechaInicio = new Date(datos.fechaInicio);
      if (datos.fechaFin) {
        datos.fechaFin = new Date(datos.fechaFin);
      } else {
        delete datos.fechaFin;
      }
      
      if (Array.isArray(datos.tecnologias)) {
        datos.tecnologias = datos.tecnologias.map((t: any) => t.toString().trim());
      } else {
        datos.tecnologias = [];
      }

      this.proyectoService.actualizarProyecto(this.idProyecto, datos).then(() => {
        alert('Proyecto actualizado con éxito');
        this.router.navigate(['/lista']);
      }).catch(error => {
        console.error('Error al actualizar el proyecto:', error);
        alert('Hubo un problema al actualizar el proyecto.');
      });
    } else {
      alert('Por favor, completa todos los campos requeridos.');
    }
  }

  cancelarEdicion(): void {
    this.router.navigate(['/lista']); // Redirige a la lista de proyectos
  }

  onCheckboxChange(event: any) {
    const tecnologiasSeleccionadas = this.formularioProyecto.get('tecnologias')?.value || [];
  
    if (event.target.checked) {
      if (!tecnologiasSeleccionadas.includes(event.target.value)) {
        tecnologiasSeleccionadas.push(event.target.value);
      }
    } else {
      const index = tecnologiasSeleccionadas.indexOf(event.target.value);
      if (index > -1) {
        tecnologiasSeleccionadas.splice(index, 1);
      }
    }
  
    this.formularioProyecto.get('tecnologias')?.setValue(tecnologiasSeleccionadas);
  }
}
