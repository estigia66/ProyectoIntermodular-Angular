import { Injectable, inject } from '@angular/core';
import { Firestore, doc, getDoc, setDoc, Timestamp } from '@angular/fire/firestore';
import { Auth, User, UserCredential, signInWithEmailAndPassword, signOut, onAuthStateChanged, updateProfile, createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from '@angular/fire/auth';
import { Observable, BehaviorSubject } from 'rxjs';
import { environment } from '../../environments/environment'; 

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private userSubject = new BehaviorSubject<any | null>(null);
  user$: Observable<any | null> = this.userSubject.asObservable();

  constructor(private auth: Auth, private firestore: Firestore) {
    onAuthStateChanged(this.auth, async (user) => {
      if (user) {
        const userData = await this.getUserData(user.uid);
        this.userSubject.next(userData);
      } else {
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

  // Obtener usuario actual
  getUsuarioActual(): any | null {
    return this.userSubject.value;
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

  // Método para iniciar sesión con Google
  async loginWithGoogle(): Promise<UserCredential> {
    try {
      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(this.auth, provider);
      
      // Guardamos el usuario en Firestore si es la primera vez
      const user = userCredential.user;
      if (user) {
        const userRef = doc(this.firestore, `usuarios/${user.uid}`);
        await setDoc(userRef, {
          uid: user.uid,
          nombre: user.displayName || '',
          email: user.email,
          photoURL: user.photoURL || '',
          rol: 'usuario'
        }, { merge: true }); // No sobreescribe si ya existe
      }
      
      return userCredential;
    } catch (error) {
      console.error("Error en el login con Google:", error);
      throw error;
    }
  }
  // Obtener datos adicionales del usuario desde Firestore
  async getUserData(uid: string): Promise<any | null> {
    try {
      const userRef = doc(this.firestore, `usuarios/${uid}`);
      const userSnapshot = await getDoc(userRef);

      if (userSnapshot.exists()) {
        return { uid, ...userSnapshot.data() };
      } else {
        return null;
      }
    } catch (error) {
      console.error("Error al obtener datos del usuario:", error);
      return null;
    }
  }
}