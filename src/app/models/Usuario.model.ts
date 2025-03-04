import { Timestamp } from "firebase/firestore"; 

export interface Usuario {

    uid: string;
    nombre: string;
    apellidos: string;
    email: string;
    fechaNacimiento: Timestamp; 
    rol: 'admin' | 'usuario';
  }