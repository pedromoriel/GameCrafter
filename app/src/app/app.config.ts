import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient, withInterceptors, HTTP_INTERCEPTORS } from '@angular/common/http';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getStorage, provideStorage } from '@angular/fire/storage';
import { LoadingInterceptor } from './core/interceptors/loading.interceptor';

import { routes } from './app.routes';

const firebaseConfig = {
  apiKey: 'AIzaSyAIvI0HKOL3T3iBWL9IV1LVNnTHWZCQGds',
  authDomain: 'studio-288744042-8e887.firebaseapp.com',
  projectId: 'studio-288744042-8e887',
  storageBucket: 'studio-288744042-8e887.firebasestorage.app',
  messagingSenderId: '83187815356',
  appId: '1:83187815356:web:ee775493fc83001c16d1b9'
};

// INSTRUCTIONS: Replace the above values with your actual Firebase credentials from:
// https://console.firebase.google.com -> Project Settings -> SDK setup and configuration
//
// Example of what it should look like:
// const firebaseConfig = {
//   apiKey: "AIza...",
//   authDomain: "myproject.firebaseapp.com",
//   projectId: "gamecrafter-app",
//   storageBucket: "gamecrafter-app.appspot.com",
//   messagingSenderId: "123456789",
//   appId: "1:123456789:web:abcd..."
// };

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideAnimations(),
    provideRouter(routes),
    provideHttpClient(),
    { provide: HTTP_INTERCEPTORS, useClass: LoadingInterceptor, multi: true },
    provideFirebaseApp(() => initializeApp(firebaseConfig)),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    provideStorage(() => getStorage())
  ]
};

