/**
 * Firebase Configuration - Unified and Clean
 * Consolidates all Firebase configuration logic
 */

interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
  measurementId?: string;
}

/**
 * Get Firebase configuration from environment variables
 */
export function getFirebaseConfig(): FirebaseConfig {
  // Try Firebase App Hosting config first
  if (process.env.FIREBASE_WEBAPP_CONFIG) {
    try {
      const webappConfig = JSON.parse(process.env.FIREBASE_WEBAPP_CONFIG);
      return {
        apiKey: webappConfig.apiKey,
        authDomain: webappConfig.authDomain,
        projectId: webappConfig.projectId,
        storageBucket: webappConfig.storageBucket,
        messagingSenderId: webappConfig.messagingSenderId,
        appId: webappConfig.appId,
        measurementId: webappConfig.measurementId,
      };
    } catch (error) {
      console.warn('Failed to parse FIREBASE_WEBAPP_CONFIG:', error);
    }
  }
  
  // Detect environment and set appropriate authDomain
  const getAuthDomain = () => {
    // PRODUÇÃO: sempre usar domínio Firebase correto
    if (process.env.NODE_ENV === 'production') {
      return 'lexai-ef0ab.firebaseapp.com';
    }
    
    // DESENVOLVIMENTO: permitir override via env var
    if (process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN) {
      return process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN;
    }
    
    // Default: usar domínio Firebase
    return 'lexai-ef0ab.firebaseapp.com';
  };

  // Fallback to environment variables
  const config = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
    authDomain: getAuthDomain(),
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET!,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID!,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID!,
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
  };

  // Validate required fields
  const required = ['apiKey', 'authDomain', 'projectId', 'storageBucket', 'messagingSenderId', 'appId'];
  const missing = required.filter(key => !config[key as keyof typeof config]);
  
  if (missing.length > 0) {
    throw new Error(`Missing Firebase configuration: ${missing.join(', ')}`);
  }

  return config;
}

/**
 * Check if we're in Firebase App Hosting environment
 */
export function isFirebaseAppHosting(): boolean {
  return !!(process.env.FIREBASE_CONFIG || process.env.FIREBASE_WEBAPP_CONFIG);
}