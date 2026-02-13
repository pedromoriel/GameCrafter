import { Injectable, NgZone } from '@angular/core';
import { Firestore, collection, doc, setDoc, getDoc, updateDoc } from '@angular/fire/firestore';
import { Observable, from, map } from 'rxjs';

export enum UserRole {
  FREE = 'free',
  PREMIUM = 'premium',
  PRO = 'pro'
}

export interface UserProfile {
  uid?: string;
  email: string;
  displayName: string;
  photoURL?: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
  offlineCodingEnabled: boolean;
  totalCodesCount: number;
  completedLevels: string[];
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private firestore: Firestore, private ngZone: NgZone) {}

  private getUsersCollection() {
    return collection(this.firestore, 'users');
  }

  /**
   * Crear un nuevo perfil de usuario
   */
  createUserProfile(uid: string, email: string, displayName: string, photoURL?: string): Observable<void> {
    const userProfile: UserProfile = {
      uid,
      email,
      displayName,
      photoURL: photoURL && photoURL.length > 0 ? photoURL : undefined,
      role: UserRole.FREE,
      createdAt: new Date(),
      updatedAt: new Date(),
      offlineCodingEnabled: false,
      totalCodesCount: 0,
      completedLevels: []
    };
    return this.ngZone.run(() =>
      from(setDoc(doc(this.getUsersCollection(), uid), userProfile))
    );
  }

  /**
   * Obtener perfil de usuario por UID
   */
  getUserProfile(uid: string): Observable<UserProfile | null> {
    return this.ngZone.run(() =>
      from(getDoc(doc(this.getUsersCollection(), uid))).pipe(
        map((docSnap) => {
          if (docSnap.exists()) {
            const data = docSnap.data() as UserProfile;
            return data;
          }
          return null;
        })
      )
    );
  }

  /**
   * Actualizar perfil de usuario
   */
  updateUserProfile(uid: string, updates: Partial<UserProfile>): Observable<void> {
    return this.ngZone.run(() =>
      from(updateDoc(doc(this.getUsersCollection(), uid), { ...updates, updatedAt: new Date() }))
    );
  }

  /**
   * Verificar si el usuario es Premium o PRO
   */
  isPremiumOrPro(role: UserRole): boolean {
    return role === UserRole.PREMIUM || role === UserRole.PRO;
  }

  /**
   * Verificar si el usuario existe en Firestore
   */
  userExists(uid: string): Promise<boolean> {
    return this.ngZone.run(() =>
      getDoc(doc(this.getUsersCollection(), uid)).then(docSnap => docSnap.exists())
    );
  }

  /**
   * Verificar si el usuario es PRO
   */
  isPro(role: UserRole): boolean {
    return role === UserRole.PRO;
  }
}

