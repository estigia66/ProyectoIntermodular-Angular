import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { environment } from '../environments/environment';
import { importProvidersFrom } from '@angular/core'; // Import necesario para módulos adicionales
import { ReactiveFormsModule } from '@angular/forms'; // Para formularios reactivos
import { CommonModule } from '@angular/common'; // Para directivas como *ngIf o @if

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideFirestore(() => getFirestore()),
    importProvidersFrom(ReactiveFormsModule), // Importa ReactiveFormsModule
    importProvidersFrom(CommonModule) // Importa CommonModule
  ]
};