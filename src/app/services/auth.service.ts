import { Injectable } from '@angular/core';
import { Firestore, doc, getDoc, setDoc, Timestamp } from '@angular/fire/firestore';
import { Auth, UserCredential, signInWithEmailAndPassword, signOut, onAuthStateChanged, updateProfile, createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from '@angular/fire/auth';
import { BehaviorSubject } from 'rxjs';
import { Usuario } from '../models/Usuario.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private userSubject = new BehaviorSubject<Usuario | null>(null);
  user$ = this.userSubject.asObservable();

  constructor(
    private auth: Auth, 
    private firestore: Firestore,
  ) {
    onAuthStateChanged(this.auth, async (user) => {
      if (user) {
        console.log("Usuario autenticado tras recarga:", user.uid);
        const userData = await this.getUserData(user.uid);
        this.userSubject.next(userData);
      } else {
        console.warn("No hay usuario autenticado.");
        this.userSubject.next(null);
      }
    });
  }

  // Método para iniciar sesión con email y contraseña
  async login(email: string, password: string): Promise<UserCredential> {
    const credential = await signInWithEmailAndPassword(this.auth, email, password);
    this.updateUserState(credential.user.uid);
    return credential;
  }

  // Cerrar sesión
  async logout(): Promise<void> {
    await signOut(this.auth);
    this.userSubject.next(null);
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

      // Actualizar el estado global del usuario
      this.updateUserState(user.uid);

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
          : null // Conversión segura de Timestamp
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
    this.userSubject.next(userData);
  }
}