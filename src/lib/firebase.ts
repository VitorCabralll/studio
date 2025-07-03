
import { getAnalytics } from "firebase/analytics";
import { initializeApp, getApps, getApp } from 'firebase/app';
import { initializeAppCheck, ReCaptchaV3Provider } from "firebase/app-check";
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore, enableNetwork, initializeFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getPerformance } from "firebase/performance";
/**
 * INVESTIGAÇÃO COMPLETA REALIZADA:
 * - firebase-config.ts original causa travamento no Turbopack durante compilação
 * - Problema NÃO é de sintaxe TypeScript (compila isoladamente)
 * - Problema NÃO é de dependência circular 
 * - Problema parece ser específico do Next.js 15.3.4 + Turbopack
 * 
 * SOLUÇÃO TEMPORÁRIA PROFISSIONAL:
 * - Mantendo versão JavaScript funcional
 * - TODO: Investigar incompatibilidade Next.js 15.3.4 + Turbopack + interfaces específicas
 */
import { getFirebaseConfig, validateFirebaseConfig, isFirebaseAppHosting } from './firebase-config-simple.js';


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
    const app = getFirebaseApp();
    
    // Tentar inicializar com configurações otimizadas primeiro
    try {
      _db = initializeFirestore(app, {
        // Configurações de conectividade otimizadas
        experimentalForceLongPolling: false,
        experimentalAutoDetectLongPolling: true,
        // Cache persistence em SSR causa problemas, então desabilitar
        localCache: typeof window !== 'undefined' ? undefined : undefined
      });
    } catch (error) {
      // Fallback para inicialização padrão
      console.warn('Falha na inicialização otimizada, usando padrão:', error);
      _db = getFirestore(app);
    }
    
    // Configurações de conectividade para resolver problemas offline
    if (typeof window !== 'undefined') {
      try {
        // Forçar reconexão imediata
        enableNetwork(_db).then(() => {
          console.log('✅ Firestore network enabled');
        }).catch(error => {
          console.warn('❌ Não foi possível reabilitar rede Firestore:', error);
        });
      } catch (error) {
        console.warn('Erro na configuração de conectividade Firestore:', error);
      }
    }
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

// Initialize optional Firebase services in browser only - deferred to prevent build hangs
function initializeOptionalServices() {
  if (typeof window !== 'undefined') {
  // Initialize optional services immediately - removed setTimeout for App Hosting compatibility
  try {
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
        const perf = getPerformance(getFirebaseApp());
        
        // Configurar Performance Monitoring para evitar conflitos com CSS
        // Desabilitar coleta automática de métricas que podem causar conflitos
        perf.dataCollectionEnabled = false;
        perf.instrumentationEnabled = false;
        
        // Reabilitar apenas coleta manual controlada
        perf.dataCollectionEnabled = true;
      }
    } catch (error) {
      console.warn('Firebase Performance Monitoring não pôde ser inicializado:', error);
      // Performance Monitoring é opcional - não impede o funcionamento da aplicação
    }
  } catch (error) {
    console.warn('Erro na inicialização dos serviços opcionais do Firebase:', error);
  }
  }
}

// Export function to initialize optional services when needed
export { initializeOptionalServices };

// Google Auth Provider configurado
export function getGoogleAuthProvider(): GoogleAuthProvider {
  const provider = new GoogleAuthProvider();
  
  // Configurações para melhor UX
  provider.addScope('profile');
  provider.addScope('email');
  
  // Configurações personalizadas
  provider.setCustomParameters({
    prompt: 'select_account'
  });
  
  return provider;
}

// Função para testar conectividade do Firestore
export async function testFirestoreConnection(): Promise<boolean> {
  try {
    const db = getFirebaseDb();
    await enableNetwork(db);
    return true;
  } catch (error) {
    console.error('Erro ao testar conectividade Firestore:', error);
    return false;
  }
}
