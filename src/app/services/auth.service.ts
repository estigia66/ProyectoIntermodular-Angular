import { Injectable, inject, NgZone } from '@angular/core';
import { Firestore, doc, getDoc, setDoc, Timestamp } from '@angular/fire/firestore';
import { Auth, authState, UserCredential, signInWithEmailAndPassword, signOut, updateProfile, createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from '@angular/fire/auth';
import { BehaviorSubject } from 'rxjs';
import { Usuario } from '../models/Usuario.model';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private userSubject = new BehaviorSubject<Usuario | null>(null);
  user$ = this.userSubject.asObservable();

  private auth = inject(Auth);
  private firestore = inject(Firestore);
  private router = inject(Router);
  private ngZone = inject(NgZone); // Inyectamos NgZone para solucionar el error

  constructor() {
    // Usar authState en lugar de AngularFireAuth y ejecutar en la zona de Angular
    authState(this.auth).subscribe(async (user) => {
      this.ngZone.run(async () => { // Se ejecuta dentro de Angular
        if (user) {
          console.log("Usuario autenticado tras recarga:", user.uid);
          const userData = await this.getUserData(user.uid);
          this.userSubject.next(userData);
        } else {
          console.warn("No hay usuario autenticado.");
          this.userSubject.next(null);
        }
      });
    });
  }

  // Método para iniciar sesión con email y contraseña con NgZone para redirección
  async login(email: string, password: string): Promise<UserCredential> {
    const credential = await signInWithEmailAndPassword(this.auth, email, password);
    this.updateUserState(credential.user.uid);

    // Forzar la redirección dentro de la zona de Angular
    this.ngZone.run(() => {
      this.router.navigate(['/']); // Redirige correctamente
    });

    return credential;
  }

  // Cerrar sesión dentro de la zona de Angular
  async logout(): Promise<void> {
    await signOut(this.auth);
    this.ngZone.run(() => {
      this.userSubject.next(null);
      this.router.navigate(['/login']); // Opcional, redirigir al login después de logout
    });
  }

  // Registro con email, contraseña y datos adicionales
  async register(nombre: string, apellidos: string, fechaNacimiento: string, email: string, password: string): Promise<any> {
    try {
      const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);
      const user = userCredential.user;
      const userRef = doc(this.firestore, `usuarios/${user.uid}`);

      await setDoc(userRef, {
        uid: user.uid,
        nombre,
        apellidos,
        fechaNacimiento: Timestamp.fromDate(new Date(fechaNacimiento)),
        email,
        rol: 'usuario'
      });

      await updateProfile(user, { displayName: nombre });

      this.updateUserState(user.uid);

      // Redirigir correctamente después de registrarse
      this.ngZone.run(() => {
        this.router.navigate(['/']);
      });

      return user;
    } catch (error) {
      console.error("Error en el registro:", error);
      throw error;
    }
  }

  // Inicio de sesión con Google
  async loginWithGoogle() {
    try {
      const provider = new GoogleAuthProvider();
      const credential = await signInWithPopup(this.auth, provider);
      const user = credential.user;

      console.log("Usuario autenticado con Google:", user);

      if (user) {
        await this.checkAndSaveUser(user);
        this.updateUserState(user.uid);

        // Redirigir correctamente después de login con Google
        this.ngZone.run(() => {
          this.router.navigate(['/proyectos']);
        });
      }
    } catch (error) {
      console.error('Error en login con Google:', error);
    }
  }

  // Método para verificar si el usuario ya está en Firestore o guardarlo
  private async checkAndSaveUser(user: any) {
    const userRef = doc(this.firestore, `usuarios/${user.uid}`);
    const userSnapshot = await getDoc(userRef);

    if (!userSnapshot.exists()) {
      console.log("Nuevo usuario, guardando en Firestore.");
      await setDoc(userRef, {
        uid: user.uid,
        nombre: user.displayName || '',
        email: user.email || '',
        rol: "usuario"
      });
    }
  }

  // Método para obtener datos del usuario
  async getUserData(uid: string): Promise<Usuario | null> {
    try {
      const userRef = doc(this.firestore, `usuarios/${uid}`);
      const userSnapshot = await getDoc(userRef);

      if (userSnapshot.exists()) {
        const userData = userSnapshot.data();

        console.log("Datos obtenidos de Firestore:", userData);

        return {
          uid: userData["uid"],
          nombre: userData["nombre"] || '',
          apellidos: userData["apellidos"] || '',
          email: userData["email"] || '',
          rol: userData["rol"] || '',
          fechaNacimiento: userData["fechaNacimiento"]
            ? (userData["fechaNacimiento"] as Timestamp).toDate()
            : null
        };
      } else {
        console.warn("No se encontraron datos para el usuario con UID:", uid);
        return null;
      }
    } catch (error) {
      console.error("Error al obtener datos del usuario:", error);
      return null;
    }
  }

  // Método para actualizar el estado global del usuario
  private async updateUserState(uid: string) {
    const userData = await this.getUserData(uid);
    this.ngZone.run(() => { // Se ejecuta dentro de Angular
      this.userSubject.next(userData);
    });
  }
}