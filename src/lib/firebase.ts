
import { getAnalytics } from "firebase/analytics";
import { initializeApp, getApps, getApp } from 'firebase/app';
import { initializeAppCheck, ReCaptchaV3Provider } from "firebase/app-check";
import { getPerformance } from "firebase/performance";
import './env-validation'; // Validate environment on import

// Validate Firebase configuration
if (!process.env.NEXT_PUBLIC_FIREBASE_API_KEY) {
  throw new Error('NEXT_PUBLIC_FIREBASE_API_KEY is required');
}
if (!process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID) {
  throw new Error('NEXT_PUBLIC_FIREBASE_PROJECT_ID is required');
}
if (!process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN) {
  throw new Error('NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN is required');
}

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase
export const firebaseApp = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Initialize App Check with reCAPTCHA v3
if (typeof window !== 'undefined') {
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
    }
  } catch (error) {
    console.warn('Firebase App Check não pôde ser inicializado:', error);
  }
}

// Initialize Analytics if running in the browser
if (typeof window !== 'undefined') {
  try {
    getAnalytics(firebaseApp);
  } catch (error) {
    console.warn('Firebase Analytics não pôde ser inicializado:', error);
    // Analytics é opcional - não impede o funcionamento da aplicação
  }
}

// Initialize Performance Monitoring if running in the browser
if (typeof window !== 'undefined') {
  try {
    getPerformance(firebaseApp);
  } catch (error) {
    console.warn('Firebase Performance Monitoring não pôde ser inicializado:', error);
    // Performance Monitoring é opcional - não impede o funcionamento da aplicação
  }
}
