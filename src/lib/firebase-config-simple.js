/**
 * Firebase configuration simplificada (JavaScript)
 * Versão compatível para evitar problemas TypeScript
 */

/**
 * Get Firebase configuration from Firebase App Hosting injected config or environment variables
 */
function getFirebaseConfig() {
  // Try to get from Firebase App Hosting injected config first
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
  
  // Fallback to standard environment variables
  return {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || 'lexai-ef0ab.firebaseapp.com',
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
function validateFirebaseConfig(config) {
  const required = ['apiKey', 'authDomain', 'projectId', 'storageBucket', 'messagingSenderId', 'appId'];
  const missing = required.filter(key => !config[key]);
  
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
 * Check if we're running in Firebase App Hosting
 */
function isFirebaseAppHosting() {
  return !!(process.env.FIREBASE_CONFIG || process.env.FIREBASE_WEBAPP_CONFIG);
}

module.exports = {
  getFirebaseConfig,
  validateFirebaseConfig,
  isFirebaseAppHosting
};