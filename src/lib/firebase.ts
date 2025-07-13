/**
 * Firebase Services - Clean and Simple
 * Provides Firebase services with lazy initialization
 */

import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, Auth } from 'firebase/auth';
import { getFirestore, Firestore, enableNetwork } from 'firebase/firestore';
import { getStorage, FirebaseStorage } from 'firebase/storage';
import { getAnalytics, Analytics } from 'firebase/analytics';
import { AppConfig } from './app-config';
import { log } from './logger';

/**
 * Robust Firebase singleton manager with enhanced caching and error handling
 */
class FirebaseManager {
  private static instance: FirebaseManager | null = null;
  private app: FirebaseApp | null = null;
  private auth: Auth | null = null;
  private db: Firestore | null = null;
  private storage: FirebaseStorage | null = null;
  private analytics: Analytics | null = null;
  private isInitialized: boolean = false;
  private config: typeof AppConfig.firebase | null = null;

  private constructor() {}

  static getInstance(): FirebaseManager {
    if (!FirebaseManager.instance) {
      FirebaseManager.instance = new FirebaseManager();
    }
    return FirebaseManager.instance;
  }

  /**
   * Initialize Firebase app with enhanced error handling and caching
   */
  private initializeApp(): FirebaseApp {
    if (this.app && this.isInitialized) {
      return this.app;
    }
    
    try {
      // Check for existing apps first
      const existingApps = getApps();
      if (existingApps.length > 0) {
        this.app = existingApps[0];
        this.isInitialized = true;
        log.info('Firebase: Using existing app instance');
        return this.app;
      }

      // Initialize new app if needed
      if (!this.config) {
        this.config = AppConfig.firebase;
      }
      
      this.app = initializeApp(this.config);
      this.isInitialized = true;
      
      log.info('Firebase: Initialized new app instance', {
        metadata: {
          projectId: this.config.projectId,
          environment: process.env.NODE_ENV
        }
      });
      
      return this.app;
    } catch (error) {
      log.error('Firebase: Failed to initialize app', error as Error);
      throw new Error(`Firebase initialization failed: ${error}`);
    }
  }

  getApp(): FirebaseApp {
    return this.initializeApp();
  }

  getAuth(): Auth {
    if (!this.auth) {
      const app = this.getApp();
      this.auth = getAuth(app);
      log.info('Firebase: Auth service initialized');
    }
    return this.auth;
  }

  getFirestore(): Firestore {
    if (!this.db) {
      const app = this.getApp();
      this.db = getFirestore(app);
      
      log.info('Firebase: Firestore service initialized', {
        metadata: {
          projectId: app.options.projectId,
          databaseId: '(default)'
        }
      });
      
      // Enable network for production
      if (typeof window !== 'undefined') {
        enableNetwork(this.db).catch(error => {
          log.warn('Failed to enable Firestore network:', { error });
        });
      }
    }
    return this.db;
  }

  getStorage(): FirebaseStorage {
    if (!this.storage) {
      const app = this.getApp();
      this.storage = getStorage(app);
      log.info('Firebase: Storage service initialized');
    }
    return this.storage;
  }

  getAnalytics(): Analytics | null {
    if (typeof window === 'undefined') return null;
    
    if (!this.analytics) {
      try {
        const app = this.getApp();
        this.analytics = getAnalytics(app);
        log.info('Firebase: Analytics service initialized');
      } catch (error: unknown) {
        const errorObj = error instanceof Error ? error : new Error(String(error));
        log.warn('Failed to initialize Analytics:', { error: errorObj });
        return null;
      }
    }
    return this.analytics;
  }

  /**
   * Reset all cached instances (useful for testing or environment switches)
   */
  reset(): void {
    this.app = null;
    this.auth = null;
    this.db = null;
    this.storage = null;
    this.analytics = null;
    this.isInitialized = false;
    this.config = null;
    log.info('Firebase: All services reset');
  }

  /**
   * Get current initialization status
   */
  getStatus(): { isInitialized: boolean; hasApp: boolean; services: string[] } {
    const services = [];
    if (this.auth) services.push('auth');
    if (this.db) services.push('firestore');
    if (this.storage) services.push('storage');
    if (this.analytics) services.push('analytics');
    
    return {
      isInitialized: this.isInitialized,
      hasApp: !!this.app,
      services
    };
  }
}

// Get the singleton instance
const firebaseManager = FirebaseManager.getInstance();

/**
 * Get Firebase Auth instance
 */
export function getFirebaseAuth(): Auth {
  return firebaseManager.getAuth();
}

/**
 * Get Firestore instance
 */
export function getFirebaseDb(): Firestore {
  return firebaseManager.getFirestore();
}

/**
 * Get Firebase Storage instance
 */
export function getFirebaseStorage(): FirebaseStorage {
  return firebaseManager.getStorage();
}

/**
 * Get Firebase Analytics instance (browser only)
 */
export function getFirebaseAnalytics(): Analytics | null {
  return firebaseManager.getAnalytics();
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
  } catch (error: unknown) {
    const errorObj = error instanceof Error ? error : new Error(String(error));
    log.error('Firestore connection failed:', errorObj);
    return false;
  }
}

/**
 * Get Firebase App instance
 */
export function getFirebaseApp(): FirebaseApp {
  return firebaseManager.getApp();
}

/**
 * Get Firebase Manager status for debugging
 */
export function getFirebaseStatus() {
  return firebaseManager.getStatus();
}

/**
 * Reset Firebase services (useful for testing)
 */
export function resetFirebaseServices(): void {
  firebaseManager.reset();
}