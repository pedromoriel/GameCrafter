import { Injectable } from '@angular/core';
import { Auth, authState, signInWithEmailAndPassword, signOut, createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from '@angular/fire/auth';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private _authState$: Observable<any> | null = null;

  constructor(private auth: Auth) {}

  get authState$(): Observable<any> {
    if (!this._authState$) {
      this._authState$ = authState(this.auth);
    }
    return this._authState$;
  }

  /**
   * Inicia sesión con correo y contraseña
   */
  signInWithEmail(email: string, password: string) {
    return signInWithEmailAndPassword(this.auth, email, password);
  }

  /**
   * Registra un nuevo usuario con correo y contraseña
   */
  signUpWithEmail(email: string, password: string) {
    return createUserWithEmailAndPassword(this.auth, email, password);
  }

  /**
   * Inicia sesión con Google
   */
  signInWithGoogle() {
    const provider = new GoogleAuthProvider();
    return signInWithPopup(this.auth, provider);
  }

  /**
   * Cierra sesión
   */
  signOut() {
    return signOut(this.auth);
  }

  /**
   * Obtiene el UID del usuario autenticado
   */
  getCurrentUserId(): string | null {
    return this.auth.currentUser?.uid || null;
  }

  /**
   * Obtiene los datos del usuario autenticado
   */
  getCurrentUser() {
    return this.auth.currentUser;
  }
}
