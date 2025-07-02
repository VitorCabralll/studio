
import { getAnalytics } from "firebase/analytics";
import { initializeApp, getApps, getApp } from 'firebase/app';
import { initializeAppCheck, ReCaptchaV3Provider } from "firebase/app-check";
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getPerformance } from "firebase/performance";
import { getFirebaseConfig, validateFirebaseConfig, isFirebaseAppHosting } from './firebase-config';

// Lazy import validation only when needed
let envValidationImported = false;
async function importEnvValidation() {
  if (!envValidationImported && typeof window !== 'undefined') {
    await import('./env-validation');
    envValidationImported = true;
  }
}

// Create Firebase config with validation
function createFirebaseConfig() {
  const config = getFirebaseConfig();
  
  // Only validate if we have environment variables or are in browser
  if (typeof window !== 'undefined' || !isFirebaseAppHosting()) {
    return validateFirebaseConfig(config);
  }
  
  return config;
}

// Lazy Firebase app initialization
function getFirebaseApp() {
  if (!getApps().length) {
    const config = createFirebaseConfig();
    return initializeApp(config);
  }
  return getApp();
}

// Lazy Firebase services - only initialize when needed
let _auth: ReturnType<typeof getAuth> | null = null;
let _db: ReturnType<typeof getFirestore> | null = null;
let _storage: ReturnType<typeof getStorage> | null = null;

export function getFirebaseAuth() {
  if (!_auth) {
    _auth = getAuth(getFirebaseApp());
  }
  return _auth;
}

export function getFirebaseDb() {
  if (!_db) {
    _db = getFirestore(getFirebaseApp());
  }
  return _db;
}

export function getFirebaseStorage() {
  if (!_storage) {
    _storage = getStorage(getFirebaseApp());
  }
  return _storage;
}

// Direct exports for compatibility - ES modules compatible
// These export the getter functions, not the instances (lazy initialization)
export const firebaseApp = getFirebaseApp;
export const auth = getFirebaseAuth;
export const db = getFirebaseDb;
export const storage = getFirebaseStorage;

// Initialize optional Firebase services in browser only
if (typeof window !== 'undefined') {
  // Initialize App Check with reCAPTCHA v3
  try {
    // Enable debug mode only in specific development environment
    if (process.env.NODE_ENV === 'development' && 
        process.env.NEXT_PUBLIC_FIREBASE_DEBUG === 'true') {
      // @ts-expect-error - debug token for development
      window.FIREBASE_APPCHECK_DEBUG_TOKEN = true;
    }
    
    const recaptchaSiteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;
    
    if (recaptchaSiteKey) {
      // Only initialize if Firebase app is available
      if (getApps().length || process.env.NEXT_PUBLIC_FIREBASE_API_KEY) {
        initializeAppCheck(getFirebaseApp(), {
          provider: new ReCaptchaV3Provider(recaptchaSiteKey),
          isTokenAutoRefreshEnabled: true
        });
      }
    }
  } catch (error) {
    console.warn('Firebase App Check não pôde ser inicializado:', error);
  }

  // Initialize Analytics if Firebase is configured
  try {
    if (getApps().length || process.env.NEXT_PUBLIC_FIREBASE_API_KEY) {
      getAnalytics(getFirebaseApp());
    }
  } catch (error) {
    console.warn('Firebase Analytics não pôde ser inicializado:', error);
    // Analytics é opcional - não impede o funcionamento da aplicação
  }

  // Initialize Performance Monitoring if Firebase is configured
  try {
    if (getApps().length || process.env.NEXT_PUBLIC_FIREBASE_API_KEY) {
      getPerformance(getFirebaseApp());
    }
  } catch (error) {
    console.warn('Firebase Performance Monitoring não pôde ser inicializado:', error);
    // Performance Monitoring é opcional - não impede o funcionamento da aplicação
  }
}
