
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAnalytics } from "firebase/analytics";

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

// Initialize Analytics if running in the browser and a valid API key is provided
if (typeof window !== 'undefined' && isFirebaseConfigured) {
  getAnalytics(firebaseApp);
}
