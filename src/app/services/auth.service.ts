import { Injectable, inject } from '@angular/core';
import { Firestore, doc, setDoc, Timestamp } from '@angular/fire/firestore';
import { Auth, User, UserCredential, signInWithEmailAndPassword, signOut, onAuthStateChanged, updateProfile, createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from '@angular/fire/auth';
import { Observable, BehaviorSubject } from 'rxjs';
import { environment } from '../../environments/environment'; 

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private auth: Auth = inject(Auth); 
  private firestore: Firestore = inject(Firestore);
  private userSubject = new BehaviorSubject<User | null>(null);
  user$: Observable<User | null> = this.userSubject.asObservable();

  constructor() {
    // Detectar cambios en la autenticación
    onAuthStateChanged(this.auth, (user) => {
      this.userSubject.next(user);
    });
    // Exponer el servicio en la consola
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
  getUsuarioActual(): User | null {
    return this.auth.currentUser;
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
        email
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
        }, { merge: true }); // No sobreescribe si ya existe
      }
      
      return userCredential;
    } catch (error) {
      console.error("Error en el login con Google:", error);
      throw error;
    }
  }

}