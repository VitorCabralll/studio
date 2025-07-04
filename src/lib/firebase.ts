/**
 * Firebase Services - Clean and Simple
 * Provides Firebase services with lazy initialization
 */

import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, Auth, connectAuthEmulator } from 'firebase/auth';
import { getFirestore, Firestore, enableNetwork, connectFirestoreEmulator } from 'firebase/firestore';
import { getStorage, FirebaseStorage } from 'firebase/storage';
import { getAnalytics, Analytics } from 'firebase/analytics';
import { getFirebaseConfig } from './firebase-config';

// Lazy-initialized services
let firebaseApp: FirebaseApp | null = null;
let auth: Auth | null = null;
let db: Firestore | null = null;
let storage: FirebaseStorage | null = null;
let analytics: Analytics | null = null;

/**
 * Initialize Firebase app
 */
function initializeFirebaseApp(): FirebaseApp {
  if (firebaseApp) return firebaseApp;
  
  const existingApps = getApps();
  if (existingApps.length > 0) {
    firebaseApp = existingApps[0];
    return firebaseApp;
  }

  const config = getFirebaseConfig();
  firebaseApp = initializeApp(config);
  return firebaseApp;
}

/**
 * Get Firebase Auth instance
 */
export function getFirebaseAuth(): Auth {
  if (!auth) {
    const app = initializeFirebaseApp();
    auth = getAuth(app);
    
    // Connect to emulator in development - apenas se explicitamente habilitado
    if (typeof window !== 'undefined' && 
        process.env.NEXT_PUBLIC_USE_FIREBASE_EMULATORS === 'true' && 
        process.env.NODE_ENV === 'development') {
      const authEmulatorHost = process.env.NEXT_PUBLIC_FIREBASE_AUTH_EMULATOR_HOST;
      if (authEmulatorHost && !auth.emulatorConfig) {
        try {
          connectAuthEmulator(auth, `http://${authEmulatorHost}`, { disableWarnings: true });
          console.log('🧪 Firebase Auth conectado ao emulador:', authEmulatorHost);
        } catch (error) {
          console.warn('Falha ao conectar Auth emulator:', error);
        }
      }
    }
  }
  return auth;
}

/**
 * Get Firestore instance
 */
export function getFirebaseDb(): Firestore {
  if (!db) {
    const app = initializeFirebaseApp();
    db = getFirestore(app);
    
    // Connect to emulator in development - apenas se explicitamente habilitado
    if (typeof window !== 'undefined' && 
        process.env.NEXT_PUBLIC_USE_FIREBASE_EMULATORS === 'true' && 
        process.env.NODE_ENV === 'development') {
      const firestoreEmulatorHost = process.env.NEXT_PUBLIC_FIREBASE_FIRESTORE_EMULATOR_HOST;
      if (firestoreEmulatorHost) {
        try {
          const [host, port] = firestoreEmulatorHost.split(':');
          connectFirestoreEmulator(db, host, parseInt(port));
          console.log('🧪 Firestore conectado ao emulador:', firestoreEmulatorHost);
        } catch (error) {
          console.warn('Falha ao conectar Firestore emulator (pode já estar conectado):', error);
        }
      }
    } else if (typeof window !== 'undefined') {
      // Enable network for production - com retry
      enableNetwork(db).catch(error => {
        console.warn('Failed to enable Firestore network:', error);
        // Retry after 2 seconds
        setTimeout(() => {
          if (db) {
            enableNetwork(db).catch(() => {
              console.error('Failed to enable Firestore network after retry');
            });
          }
        }, 2000);
      });
    }
  }
  return db;
}

/**
 * Get Firebase Storage instance
 */
export function getFirebaseStorage(): FirebaseStorage {
  if (!storage) {
    const app = initializeFirebaseApp();
    storage = getStorage(app);
  }
  return storage;
}

/**
 * Get Firebase Analytics instance (browser only)
 */
export function getFirebaseAnalytics(): Analytics | null {
  if (typeof window === 'undefined') return null;
  
  if (!analytics) {
    try {
      const app = initializeFirebaseApp();
      analytics = getAnalytics(app);
    } catch (error) {
      console.warn('Failed to initialize Analytics:', error);
      return null;
    }
  }
  return analytics;
}

/**
 * Get configured Google Auth Provider
 */
export function getGoogleAuthProvider(): GoogleAuthProvider {
  const provider = new GoogleAuthProvider();
  
  // Add required scopes
  provider.addScope('profile');
  provider.addScope('email');
  
  // Configure for better UX
  provider.setCustomParameters({
    prompt: 'select_account'
  });
  
  return provider;
}

/**
 * Test Firestore connection
 */
export async function testFirestoreConnection(): Promise<boolean> {
  try {
    const firestore = getFirebaseDb();
    await enableNetwork(firestore);
    return true;
  } catch (error) {
    console.error('Firestore connection failed:', error);
    return false;
  }
}

/**
 * Get Firebase App instance
 */
export function getFirebaseApp(): FirebaseApp {
  return initializeFirebaseApp();
}