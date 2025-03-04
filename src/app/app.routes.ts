import { Routes } from '@angular/router';
import { ProyectosListaComponent } from './proyectos-lista/proyectos-lista.component';
import { ProyectosNuevoComponent } from './proyectos-nuevo/proyectos-nuevo.component';
import { ProyectosEditarComponent } from './proyectos-editar/proyectos-editar.component';
import { TecnologiasListaComponent } from './tecnologias-lista/tecnologias-lista.component';
import { TecnologiasNuevoComponent } from './tecnologias-nuevo/tecnologias-nuevo.component';
import { TecnologiasEditarComponent } from './tecnologias-editar/tecnologias-editar.component';
import { FacturasListaComponent } from './facturas-lista/facturas-lista.component';
import { FacturasDetalleComponent } from './facturas-detalle/facturas-detalle.component';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/registro/registro.component';

export const routes: Routes = [
  { path: '', redirectTo: 'lista', pathMatch: 'full' }, // Redirige '/' a '/lista'
  { path: 'lista', component: ProyectosListaComponent }, // Ruta para listar proyectos
  { path: 'nuevo', component: ProyectosNuevoComponent }, // Ruta para crear un nuevo proyecto
  { path: 'editar/:id', component: ProyectosEditarComponent }, // Ruta para editar un proyecto existente

  { path: 'facturas/:idProyecto', component: FacturasListaComponent }, // Ruta para listar facturas
  { path: 'facturas/detalle/:idFactura', component: FacturasDetalleComponent }, // Ruta para ver el detalle de una factura

  // Rutas para las tecnologías
  { path: 'tecnologias', component: TecnologiasListaComponent }, // Ruta para listar tecnologías
  { path: 'tecnologias/nuevo', component: TecnologiasNuevoComponent }, // Ruta para crear una nueva tecnología
  { path: 'tecnologias/editar/:id', component: TecnologiasEditarComponent }, // Ruta para editar una tecnología existente

  // Rutas para el login y registro
  { path: 'login', component: LoginComponent }, // Ruta para el login
  { path: 'register', component: RegisterComponent } // Ruta para el registro
];