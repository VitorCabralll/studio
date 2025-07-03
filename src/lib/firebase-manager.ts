/**
 * Unified Firebase Manager
 * Clean architecture for Firebase services with environment awareness
 */

import { FirebaseApp, initializeApp, getApps } from 'firebase/app';
import { Auth, getAuth } from 'firebase/auth';
import { Firestore, getFirestore } from 'firebase/firestore';
import { FirebaseStorage, getStorage } from 'firebase/storage';
import { Analytics, getAnalytics, isSupported } from 'firebase/analytics';
import { initializeAppCheck, ReCaptchaV3Provider } from 'firebase/app-check';
import { getPerformance } from 'firebase/performance';

import { 
  getEnvironmentInfo, 
  envLog, 
  onlyInBrowser,
  getEnvConfig 
} from './environment';

// Configuration interfaces
interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
  measurementId?: string;
}

interface FirebaseServices {
  app: FirebaseApp;
  auth: Auth;
  db: Firestore;
  storage: FirebaseStorage;
  analytics?: Analytics;
}

interface InitializationOptions {
  enableAnalytics?: boolean;
  enableAppCheck?: boolean;
  enablePerformance?: boolean;
  recaptchaSiteKey?: string;
}

/**
 * Firebase Manager with clean separation of concerns
 */
export class FirebaseManager {
  private static instance: FirebaseManager;
  private app: FirebaseApp | null = null;
  private services: Partial<FirebaseServices> = {};
  private initialized = false;
  private initializationPromise: Promise<void> | null = null;

  private constructor() {
    envLog('Firebase Manager instantiated');
  }

  /**
   * Get singleton instance
   */
  static getInstance(): FirebaseManager {
    if (!this.instance) {
      this.instance = new FirebaseManager();
    }
    return this.instance;
  }

  /**
   * Initialize Firebase with environment-aware configuration
   */
  async initialize(options: InitializationOptions = {}): Promise<void> {
    if (this.initializationPromise) {
      return this.initializationPromise;
    }

    this.initializationPromise = this.performInitialization(options);
    return this.initializationPromise;
  }

  private async performInitialization(options: InitializationOptions): Promise<void> {
    const env = getEnvironmentInfo();
    const config = getEnvConfig();

    envLog('Initializing Firebase', { context: env.context, options });

    try {
      // Skip initialization during build
      if (env.isBuild) {
        envLog('Skipping Firebase initialization during build');
        return;
      }

      // Initialize Firebase app
      this.app = this.initializeApp();
      this.services.app = this.app;

      // Initialize core services
      await this.initializeCoreServices();

      // Initialize optional services based on environment
      if (config.initializeFirebaseServices) {
        await this.initializeOptionalServices(options);
      }

      this.initialized = true;
      envLog('Firebase initialization completed successfully');

    } catch (error) {
      envLog('Firebase initialization failed', error);
      throw new Error(`Firebase initialization failed: ${error}`);
    }
  }

  /**
   * Initialize Firebase App
   */
  private initializeApp(): FirebaseApp {
    const config = this.getFirebaseConfig();
    
    // Check if app already exists
    const existingApps = getApps();
    if (existingApps.length > 0) {
      envLog('Using existing Firebase app');
      return existingApps[0];
    }

    envLog('Creating new Firebase app');
    return initializeApp(config);
  }

  /**
   * Initialize core Firebase services (Auth, Firestore, Storage)
   */
  private async initializeCoreServices(): Promise<void> {
    if (!this.app) throw new Error('Firebase app not initialized');

    try {
      // Initialize Auth
      this.services.auth = getAuth(this.app);
      envLog('Auth service initialized');

      // Initialize Firestore
      this.services.db = getFirestore(this.app);
      envLog('Firestore service initialized');

      // Initialize Storage
      this.services.storage = getStorage(this.app);
      envLog('Storage service initialized');

    } catch (error) {
      throw new Error(`Core services initialization failed: ${error}`);
    }
  }

  /**
   * Initialize optional services (Analytics, App Check, Performance)
   */
  private async initializeOptionalServices(options: InitializationOptions): Promise<void> {
    if (!this.app) return;

    const env = getEnvironmentInfo();
    const config = getEnvConfig();

    // Initialize Analytics (client-side only)
    if (options.enableAnalytics && config.enableAnalytics) {
      await onlyInBrowser(async () => {
        try {
          const analyticsSupported = await isSupported();
          if (analyticsSupported) {
            this.services.analytics = getAnalytics(this.app!);
            envLog('Analytics service initialized');
          }
        } catch (error) {
          envLog('Analytics initialization failed', error);
        }
      });
    }

    // Initialize App Check (client-side, production only)
    if (options.enableAppCheck && config.enableAppCheck && options.recaptchaSiteKey) {
      await onlyInBrowser(async () => {
        try {
          await initializeAppCheck(this.app!, {
            provider: new ReCaptchaV3Provider(options.recaptchaSiteKey!),
            isTokenAutoRefreshEnabled: true
          });
          envLog('App Check initialized');
        } catch (error) {
          envLog('App Check initialization failed', error);
        }
      });
    }

    // Initialize Performance (client-side only)
    if (options.enablePerformance && env.isClient) {
      await onlyInBrowser(async () => {
        try {
          getPerformance(this.app!);
          envLog('Performance monitoring initialized');
        } catch (error) {
          envLog('Performance monitoring initialization failed', error);
        }
      });
    }
  }

  /**
   * Get Firebase configuration from environment
   */
  private getFirebaseConfig(): FirebaseConfig {
    const requiredConfig = {
      apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
      authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
      appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
      measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
    };

    // Validate required configuration
    const missingKeys = Object.entries(requiredConfig)
      .filter(([key, value]) => key !== 'measurementId' && !value)
      .map(([key]) => key);

    if (missingKeys.length > 0) {
      throw new Error(`Missing Firebase configuration: ${missingKeys.join(', ')}`);
    }

    return requiredConfig as FirebaseConfig;
  }

  /**
   * Get Firebase services with lazy initialization
   */
  async getAuth(): Promise<Auth> {
    await this.ensureInitialized();
    if (!this.services.auth) {
      throw new Error('Auth service not available');
    }
    return this.services.auth;
  }

  async getDb(): Promise<Firestore> {
    await this.ensureInitialized();
    if (!this.services.db) {
      throw new Error('Firestore service not available');
    }
    return this.services.db;
  }

  async getStorage(): Promise<FirebaseStorage> {
    await this.ensureInitialized();
    if (!this.services.storage) {
      throw new Error('Storage service not available');
    }
    return this.services.storage;
  }

  async getAnalytics(): Promise<Analytics | undefined> {
    await this.ensureInitialized();
    return this.services.analytics;
  }

  async getApp(): Promise<FirebaseApp> {
    await this.ensureInitialized();
    if (!this.services.app) {
      throw new Error('Firebase app not available');
    }
    return this.services.app;
  }

  /**
   * Ensure Firebase is initialized
   */
  private async ensureInitialized(): Promise<void> {
    if (!this.initialized && !this.initializationPromise) {
      await this.initialize();
    } else if (this.initializationPromise) {
      await this.initializationPromise;
    }
  }

  /**
   * Check if Firebase is properly configured
   */
  isConfigured(): boolean {
    try {
      this.getFirebaseConfig();
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Get initialization status
   */
  isInitialized(): boolean {
    return this.initialized;
  }

  /**
   * Reset instance (for testing)
   */
  static reset(): void {
    if (this.instance) {
      this.instance.initialized = false;
      this.instance.initializationPromise = null;
      this.instance.services = {};
      this.instance.app = null;
    }
  }
}

// Convenience functions for backward compatibility
export const getFirebaseManager = () => FirebaseManager.getInstance();

export const initializeFirebase = async (options?: InitializationOptions) => {
  const manager = FirebaseManager.getInstance();
  await manager.initialize(options);
  return manager;
};

// Service getters
export const getFirebaseAuth = () => FirebaseManager.getInstance().getAuth();
export const getFirebaseDb = () => FirebaseManager.getInstance().getDb();
export const getFirebaseStorage = () => FirebaseManager.getInstance().getStorage();
export const getFirebaseAnalytics = () => FirebaseManager.getInstance().getAnalytics();
export const getFirebaseApp = () => FirebaseManager.getInstance().getApp();