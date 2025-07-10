/**
 * Firebase Services - Clean and Simple
 * Provides Firebase services with lazy initialization
 */

import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, Auth } from 'firebase/auth';
import { getFirestore, Firestore, enableNetwork } from 'firebase/firestore';
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
  }
  return auth;
}

/**
 * Get Firestore instance
 */
export function getFirebaseDb(): Firestore {
  if (!db) {
    const app = initializeFirebaseApp();
    // 🔧 TEMPORARY FIX: Usar database (default) que tem rules deployadas
    // TODO: Deploy rules para database 'lexai' e voltar para 'lexai'
    db = getFirestore(app); // usa database (default)
    
    // 📊 Log database configuration for debugging
    console.log('🔧 Firebase Database Configuration:', {
      projectId: app.options.projectId,
      databaseId: '(default)',
      environment: process.env.NODE_ENV,
      authDomain: app.options.authDomain,
      timestamp: new Date().toISOString()
    });
    
    // Enable network for production
    if (typeof window !== 'undefined') {
      enableNetwork(db).catch(error => {
        console.warn('Failed to enable Firestore network:', error);
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