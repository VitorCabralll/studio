/**
 * Firebase configuration extractor for Firebase App Hosting
 * 
 * Firebase App Hosting automatically injects FIREBASE_CONFIG and FIREBASE_WEBAPP_CONFIG
 * This utility extracts the required variables from these injected configs
 */

interface FirebaseAppHostingConfig {
  projectId: string;
  storageBucket: string;
  databaseURL?: string;
}

interface FirebaseWebAppConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
  measurementId?: string;
}

/**
 * Get Firebase configuration from Firebase App Hosting injected variables
 * Falls back to environment variables if not in App Hosting environment
 */
export function getFirebaseConfig() {
  // Try to get from Firebase App Hosting injected config first
  if (process.env.FIREBASE_WEBAPP_CONFIG) {
    try {
      const webappConfig: FirebaseWebAppConfig = JSON.parse(process.env.FIREBASE_WEBAPP_CONFIG);
      
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
  
  // Fallback to standard environment variables
  return {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
  };
}

/**
 * Validate that all required Firebase config values are present
 */
export function validateFirebaseConfig(config: ReturnType<typeof getFirebaseConfig>) {
  const required = ['apiKey', 'authDomain', 'projectId', 'storageBucket', 'messagingSenderId', 'appId'];
  const missing = required.filter(key => !config[key as keyof typeof config]);
  
  if (missing.length > 0) {
    throw new Error(
      `❌ Missing required Firebase configuration values:\n${missing.map(v => `  - ${v}`).join('\n')}\n\n` +
      `This can happen if:\n` +
      `1. You're running locally without .env.local configured\n` +
      `2. Firebase App Hosting environment variables are not set\n` +
      `3. FIREBASE_WEBAPP_CONFIG is malformed\n\n` +
      `See .env.example for the required format.`
    );
  }
  
  return config;
}

/**
 * Check if we're running in Firebase App Hosting environment
 */
export function isFirebaseAppHosting(): boolean {
  return !!(process.env.FIREBASE_CONFIG || process.env.FIREBASE_WEBAPP_CONFIG);
}