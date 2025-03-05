import { Injectable, inject } from '@angular/core';
import { Firestore, doc, getDoc, setDoc, Timestamp } from '@angular/fire/firestore';
import { Auth, User, UserCredential, signInWithEmailAndPassword, signOut, onAuthStateChanged, updateProfile, createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from '@angular/fire/auth';
import { Observable, BehaviorSubject } from 'rxjs';
import { Usuario } from '../models/Usuario.model';
import { environment } from '../../environments/environment'; 

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private userSubject = new BehaviorSubject<Usuario | null | undefined>(undefined);
  user$ = this.userSubject.asObservable();

  constructor(private auth: Auth, private firestore: Firestore) {
    onAuthStateChanged(this.auth, async (user) => {
      if (user) {
        console.log("Usuario autenticado tras recarga:", user.uid);
        const userData = await this.getUserData(user.uid);
        if (userData) {
          this.userSubject.next(userData);
        }
      } else {
        console.warn("No hay usuario autenticado.");
        this.userSubject.next(null);
      }
    });
    (window as any).authService = this;
  }

  // Login con email y contraseña
  login(email: string, password: string): Promise<UserCredential> {
    return signInWithEmailAndPassword(this.auth, email, password);
  }

  // Logout
  logout(): Promise<void> {
    return signOut(this.auth);
  }

  // Registro con email, contraseña y datos adicionales
  async register(nombre: string, apellidos: string, fechaNacimiento: string, email: string, password: string): Promise<any> {
    try {
      const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);
      const user = userCredential.user;

      // Guardar datos adicionales en Firestore
      const userRef = doc(this.firestore, `usuarios/${user.uid}`);
      await setDoc(userRef, {
        uid: user.uid,
        nombre,
        apellidos,
        fechaNacimiento: Timestamp.fromDate(new Date(fechaNacimiento)), // Convertimos a Timestamp
        email,
        rol: 'usuario'
      });

      // Actualizar el perfil del usuario en Firebase Auth
      await updateProfile(user, { displayName: nombre });

      return user;
    } catch (error) {
      console.error("Error en el registro:", error);
      throw error; // Propagamos el error para manejarlo en el frontend
    }
  }

  /// Método para iniciar sesión con Google
  async loginWithGoogle() {
    try {
      const provider = new GoogleAuthProvider();
      const credential = await signInWithPopup(this.auth, provider);
      const user = credential.user;
      
      console.log("Usuario autenticado con Google:", user);

      if (user) {
        await this.checkAndSaveUser(user);
        this.userSubject.next(await this.getUserData(user.uid));
      }
    } catch (error) {
      console.error('Error en login con Google:', error);
    }
  }

  private async checkAndSaveUser(user: User) {
    const userRef = doc(this.firestore, `usuarios/${user.uid}`);
    const userSnapshot = await getDoc(userRef);

    if (userSnapshot.exists()) {
      console.log("El usuario ya existe, manteniendo su rol actual.");
    } else {
      console.log("Nuevo usuario, registrando en Firestore con rol 'usuario'.");
      await setDoc(userRef, {
        uid: user.uid,
        nombre: user.displayName,
        email: user.email,
        rol: "usuario" // Solo se asigna si el usuario es nuevo
      });
    }
  }
  // Obtener datos adicionales del usuario desde Firestore
  async getUserData(uid: string): Promise<Usuario | null> {
    try {
      const userRef = doc(this.firestore, `usuarios/${uid}`);
      const userSnapshot = await getDoc(userRef);
  
      if (userSnapshot.exists()) {
        const userData = userSnapshot.data();
  
        console.log("Datos obtenidos de Firestore:", userData);
  
        // Accedemos a fechaNacimiento usando notación de corchetes
      const fechaNacimiento = userData["fechaNacimiento"];

      // Convertimos fechaNacimiento si es un Timestamp
      if (fechaNacimiento instanceof Timestamp) {
        userData["fechaNacimiento"] = fechaNacimiento.toDate();
      } else if (typeof fechaNacimiento === "string" || typeof fechaNacimiento === "number") {
        userData["fechaNacimiento"] = new Date(fechaNacimiento);
      } else {
        console.warn("El formato de fechaNacimiento es inesperado:", fechaNacimiento);
        userData["fechaNacimiento"] = null; // Para evitar problemas en la plantilla
      }
  
        return userData as Usuario;
      } else {
        console.warn("No se encontraron datos para el usuario con UID:", uid);
        return null;
      }
    } catch (error) {
      console.error("Error al obtener datos del usuario:", error);
      return null;
    }
  }
}