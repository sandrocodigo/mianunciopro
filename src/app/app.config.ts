import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getFunctions, provideFunctions } from '@angular/fire/functions';
import { getStorage, provideStorage } from '@angular/fire/storage';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideFirebaseApp(() => initializeApp({
      projectId: "mianunciopro",
      appId: "1:455837642969:web:7be156d4da78009d56cec8",
      storageBucket: "mianunciopro.firebasestorage.app",
      apiKey: "AIzaSyDcKo8AoTyuyqumN5hIpf_cbIHYXM5YXlE",
      authDomain: "mianunciopro.firebaseapp.com",
      messagingSenderId: "455837642969",
      measurementId: "G-1K6MXKXR39",
      // projectNumber: "455837642969",
      // version: "2"
    })), provideAuth(() => getAuth()), provideFirestore(() => getFirestore()), provideFunctions(() => getFunctions()), provideStorage(() => getStorage())
  ]
};
