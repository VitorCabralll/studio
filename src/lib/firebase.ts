
import { getAnalytics } from "firebase/analytics";
import { initializeApp, getApps, getApp } from 'firebase/app';
import { initializeAppCheck, ReCaptchaV3Provider } from "firebase/app-check";

// IMPORTANT: Replace this with your own Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "your-api-key",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "your-auth-domain",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "your-project-id",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "your-storage-bucket",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "your-messaging-sender-id",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "your-app-id",
};

export const isFirebaseConfigured = firebaseConfig.apiKey !== 'your-api-key';

// Initialize Firebase
export const firebaseApp = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Initialize App Check with reCAPTCHA v3
if (typeof window !== 'undefined' && isFirebaseConfigured) {
  try {
    // Enable debug mode in development
    if (process.env.NODE_ENV === 'development') {
      // @ts-expect-error - debug token for development
      window.FIREBASE_APPCHECK_DEBUG_TOKEN = true;
    }
    
    const recaptchaSiteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;
    
    if (recaptchaSiteKey) {
      initializeAppCheck(firebaseApp, {
        provider: new ReCaptchaV3Provider(recaptchaSiteKey),
        isTokenAutoRefreshEnabled: true
      });
    } else {
      console.warn('NEXT_PUBLIC_RECAPTCHA_SITE_KEY não configurada');
    }
  } catch (error) {
    console.warn('Firebase App Check não pôde ser inicializado:', error);
  }
}

// Initialize Analytics if running in the browser and a valid API key is provided
if (typeof window !== 'undefined' && isFirebaseConfigured) {
  try {
    getAnalytics(firebaseApp);
  } catch (error) {
    console.warn('Firebase Analytics não pôde ser inicializado:', error);
    // Analytics é opcional - não impede o funcionamento da aplicação
  }
}
