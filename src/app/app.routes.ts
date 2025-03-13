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
import { PerfilComponent } from './perfil/perfil.component';
import { AuthGuard } from './guards/auth.guard';
import { DashboardComponent } from './dashboard/dashboard.component';




export const routes: Routes = [

  // Rutas para el login y registro
  { path: 'login', component: LoginComponent }, // Ruta para el login
  { path: 'register', component: RegisterComponent }, // Ruta para el registro

  //Ruta para el dashboard (protegida)
  { path: 'dashboard' , component: DashboardComponent, canActivate: [AuthGuard]},

  // Rutas protegidas (requieren autenticación)
  { path: 'proyectos', component: ProyectosListaComponent, canActivate: [AuthGuard] }, // Ruta para listar proyectos
  { path: 'proyectos/nuevo', component: ProyectosNuevoComponent, canActivate: [AuthGuard] }, // Ruta para crear un nuevo proyecto
  { path: 'proyectos/editar/:id', component: ProyectosEditarComponent, canActivate: [AuthGuard] }, // Ruta para editar un proyecto existente

  { path: 'facturas/:idProyecto', component: FacturasListaComponent, canActivate: [AuthGuard] }, // Ruta para listar facturas
  { path: 'facturas/detalle/:idFactura', component: FacturasDetalleComponent, canActivate: [AuthGuard] }, // Ruta para ver el detalle de una factura

  // Rutas para las tecnologías
  { path: 'tecnologias', component: TecnologiasListaComponent, canActivate: [AuthGuard] }, // Ruta para listar tecnologías
  { path: 'tecnologias/nuevo', component: TecnologiasNuevoComponent, canActivate: [AuthGuard] }, // Ruta para crear una nueva tecnología
  { path: 'tecnologias/editar/:id', component: TecnologiasEditarComponent, canActivate: [AuthGuard] }, // Ruta para editar una tecnología existente

  { path: 'perfil', component: PerfilComponent, canActivate: [AuthGuard] }, // Ruta para ver el perfil del usuario
  
  // Redirigir la raíz a /proyectos
  { path: '', redirectTo: 'proyectos', pathMatch: 'full' },
  
  // Redirigir cualquier ruta desconocida a /proyectos
  { path: '**', redirectTo: 'proyectos' }
];