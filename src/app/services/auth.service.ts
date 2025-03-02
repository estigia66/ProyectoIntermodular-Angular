import { Injectable, inject } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import { Auth, User, UserCredential, signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';
import { Observable, BehaviorSubject } from 'rxjs';
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private auth: Auth;
  private userSubject = new BehaviorSubject<User | null>(null);
  user$: Observable<User | null> = this.userSubject.asObservable();

  constructor() {
    const firebaseApp = initializeApp(environment.firebase);
    this.auth = getAuth(firebaseApp);

    // Detectar cambios en la autenticación
    onAuthStateChanged(this.auth, (user) => {
      this.userSubject.next(user);
    });
  }

  // 🔹 Login con email y contraseña
  login(email: string, password: string): Promise<UserCredential> {
    return signInWithEmailAndPassword(this.auth, email, password);
  }

  // 🔹 Logout
  logout(): Promise<void> {
    return signOut(this.auth);
  }

  // 🔹 Obtener usuario actual
  getUsuarioActual(): User | null {
    return this.auth.currentUser;
  }
}