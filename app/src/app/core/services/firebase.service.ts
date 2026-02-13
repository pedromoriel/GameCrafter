import { Injectable, NgZone } from '@angular/core';
import { Firestore, collection, addDoc, getDocs, query, where, updateDoc, doc, deleteDoc } from '@angular/fire/firestore';
import { Storage, ref, uploadBytes, getBytes, listAll, deleteObject } from '@angular/fire/storage';
import { Observable, from } from 'rxjs';
import { Auth } from '@angular/fire/auth';

export interface GameCode {
  id?: string;
  name: string;
  code: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
  description?: string;
}

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  constructor(
    private firestore: Firestore,
    private storage: Storage,
    private auth: Auth,
    private ngZone: NgZone
  ) {}

  /**
   * Subir archivo a Firebase Storage
   */
  uploadFile(path: string, file: File): Observable<any> {
    const storageRef = ref(this.storage, path);
    return from(uploadBytes(storageRef, file));
  }

  /**
   * Guardar código de juego en Firestore
   */
  saveGameCode(gameCode: GameCode): Promise<string> {
    const gamesRef = collection(this.firestore, 'games');
    return this.ngZone.run(() =>
      addDoc(gamesRef, {
        ...gameCode,
        createdAt: new Date(),
        updatedAt: new Date()
      }).then(docRef => docRef.id)
    );
  }

  /**
   * Actualizar código de juego existente
   */
  updateGameCode(gameCodeId: string, gameCode: Partial<GameCode>): Promise<void> {
    const gameRef = doc(this.firestore, 'games', gameCodeId);
    return this.ngZone.run(() =>
      updateDoc(gameRef, {
        ...gameCode,
        updatedAt: new Date()
      })
    );
  }

  /**
   * Obtener todos los códigos del usuario actual
   */
  getUserGameCodes(userId: string): Observable<GameCode[]> {
    return this.ngZone.run(() =>
      from(
        getDocs(query(collection(this.firestore, 'games'), where('userId', '==', userId)))
          .then(snapshot => snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as GameCode)))
      )
    );
  }

  /**
   * Contar los juegos guardados del usuario
   */
  countUserGameCodes(userId: string): Promise<number> {
    return this.ngZone.run(() =>
      getDocs(query(collection(this.firestore, 'games'), where('userId', '==', userId)))
        .then(snapshot => snapshot.docs.length)
    );
  }

  /**
   * Obtener un código específico por ID
   */
  getGameCodeById(gameCodeId: string): Promise<GameCode | null> {
    const gameRef = doc(this.firestore, 'games', gameCodeId);
    return this.ngZone.run(() =>
      new Promise((resolve) => {
        // This is a placeholder - in real implementation would use getDoc
        resolve(null);
      })
    );
  }

  /**
   * Eliminar un código de juego
   */
  deleteGameCode(gameCodeId: string): Promise<void> {
    const gameRef = doc(this.firestore, 'games', gameCodeId);
    return this.ngZone.run(() => deleteDoc(gameRef));
  }

  /**
   * Descargar archivo desde Firebase Storage
   */
  downloadFile(path: string): Observable<ArrayBuffer> {
    const storageRef = ref(this.storage, path);
    return from(getBytes(storageRef));
  }

  /**
   * Listar archivos en un directorio de Storage
   */
  listFiles(path: string): Observable<any> {
    const storageRef = ref(this.storage, path);
    return from(listAll(storageRef));
  }

  /**
   * Eliminar archivo de Storage
   */
  deleteFile(path: string): Observable<void> {
    const storageRef = ref(this.storage, path);
    return from(deleteObject(storageRef));
  }

  /**
   * Obtener instancia de Firestore para operaciones avanzadas
   */
  getFirestoreInstance(): Firestore {
    return this.firestore;
  }

  /**
   * Obtener instancia de Storage para operaciones avanzadas
   */
  getStorageInstance(): Storage {
    return this.storage;
  }
}
