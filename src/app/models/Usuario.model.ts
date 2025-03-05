export interface Usuario {

    uid: string;
    nombre: string;
    apellidos: string;
    email: string;
    fechaNacimiento: Date; 
    rol: 'admin' | 'usuario';
  }