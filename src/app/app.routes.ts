import { Routes } from '@angular/router';
import { ProyectosFormularioComponent } from './proyectos-formulario/proyectos-formulario.component';
import { ProyectosListaComponent } from './proyectos-lista/proyectos-lista.component'; // Importa el componente de lista

export const routes: Routes = [
  { path: '', redirectTo: 'lista', pathMatch: 'full' }, // Redirige '/' a '/lista'
  { path: 'lista', component: ProyectosListaComponent }, // Ruta para listar proyectos
  { path: 'nuevo', component: ProyectosFormularioComponent }, // Ruta para crear un nuevo proyecto
  { path: 'editar/:id', component: ProyectosFormularioComponent } // Ruta para editar un proyecto existente
];