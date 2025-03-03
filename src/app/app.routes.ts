import { Routes } from '@angular/router';
import { ProyectosListaComponent } from './proyectos-lista/proyectos-lista.component';
import { ProyectosNuevoComponent } from './proyectos-nuevo/proyectos-nuevo.component';
import { ProyectosEditarComponent } from './proyectos-editar/proyectos-editar.component';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/registro/registro.component';

export const routes: Routes = [
  { path: '', redirectTo: 'lista', pathMatch: 'full' }, // Redirige '/' a '/lista'
  { path: 'lista', component: ProyectosListaComponent }, // Ruta para listar proyectos
  { path: 'nuevo', component: ProyectosNuevoComponent }, // Ruta para crear un nuevo proyecto
  { path: 'editar/:id', component: ProyectosEditarComponent }, // Ruta para editar un proyecto existente
  { path: 'login', component: LoginComponent }, // Ruta para el login
  { path: 'register', component: RegisterComponent } // Ruta para el registro
];