export interface Usuario {

    uid: string;
    nombre: string;
    apellidos: string;
    email: string;
    fechaNacimiento: Date | null;
    rol: 'admin' | 'usuario';
  }