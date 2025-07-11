import { initializeApp, getApps, cert, ServiceAccount } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';
import { getStorage } from 'firebase-admin/storage';

// Lazy configuration to prevent build-time access to env vars
function createServiceAccount(): ServiceAccount | null {
  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY;
  
  if (!projectId || !clientEmail || !privateKey) {
    return null;
  }
  
  return {
    projectId,
    clientEmail,
    privateKey: privateKey.replace(/\\n/g, '\n'),
  };
}

// Verificar se as credenciais estão configuradas
export function isAdminConfigured(): boolean {
  return !!(
    process.env.FIREBASE_PROJECT_ID &&
    process.env.FIREBASE_CLIENT_EMAIL &&
    process.env.FIREBASE_PRIVATE_KEY
  );
}

// Lazy Firebase Admin initialization
let adminApp: any = null;
let adminInitialized = false;

function getAdminApp() {
  if (adminInitialized) {
    return adminApp;
  }
  
  const serviceAccount = createServiceAccount();
  if (!serviceAccount) {
    adminInitialized = true;
    return null;
  }
  
  try {
    // Verificar se já existe uma instância
    adminApp = getApps().find(app => app.name === '[DEFAULT]') || 
               initializeApp({
                 credential: cert(serviceAccount),
                 projectId: serviceAccount.projectId,
                 storageBucket: `${serviceAccount.projectId}.appspot.com`,
               });
    adminInitialized = true;
    return adminApp;
  } catch (error) {
    console.error('Erro ao inicializar Firebase Admin:', error);
    adminInitialized = true;
    return null;
  }
}

// Lazy Firebase services
export function getAdminFirestore() {
  const app = getAdminApp();
  // 🔧 FIXED: Usar database (default) que tem rules deployadas
  // Alinhado com client-side que usa getFirestore(app) - database (default)
  return app ? getFirestore(app) : null;
}

export function getAdminAuth() {
  const app = getAdminApp();
  return app ? getAuth(app) : null;
}

export function getAdminStorage() {
  const app = getAdminApp();
  return app ? getStorage(app) : null;
}

// Legacy exports (deprecated - use getters instead)
export const adminFirestore = null; // Deprecated: use getAdminFirestore()
export const adminAuth = null; // Deprecated: use getAdminAuth()
export const adminStorage = null; // Deprecated: use getAdminStorage()

// Alias para compatibilidade
export const getFirebaseAdminDb = getAdminFirestore;

// Interface para resultado de operações admin
export interface AdminResult<T> {
  data: T | null;
  error: AdminError | null;
  success: boolean;
}

export interface AdminError {
  code: string;
  message: string;
  details?: string;
}

// Função utilitária para criar erros padronizados
export function createAdminError(error: unknown, operation: string): AdminError {
  if (error instanceof Error) {
    return {
      code: 'admin-error',
      message: `Erro admin durante ${operation}: ${error.message}`,
      details: error.stack
    };
  }
  
  return {
    code: 'unknown-admin-error',
    message: `Erro admin desconhecido durante ${operation}`,
    details: String(error)
  };
}

// Exemplo de função para verificar token de usuário
export async function verifyIdToken(idToken: string): Promise<AdminResult<any>> {
  try {
    const auth = getAdminAuth();
    if (!isAdminConfigured() || !auth) {
      return {
        data: null,
        error: {
          code: 'admin-not-configured',
          message: 'Firebase Admin não está configurado'
        },
        success: false
      };
    }

    const decodedToken = await auth.verifyIdToken(idToken);
    return { data: decodedToken, error: null, success: true };
  } catch (error) {
    return {
      data: null,
      error: createAdminError(error, 'verificar token'),
      success: false
    };
  }
}

// Função para criar usuário customizado
export async function createCustomUser(userData: {
  email: string;
  password: string;
  displayName?: string;
  claims?: object;
}): Promise<AdminResult<any>> {
  try {
    const auth = getAdminAuth();
    if (!isAdminConfigured() || !auth) {
      return {
        data: null,
        error: {
          code: 'admin-not-configured',
          message: 'Firebase Admin não está configurado'
        },
        success: false
      };
    }

    const userRecord = await auth.createUser({
      email: userData.email,
      password: userData.password,
      displayName: userData.displayName,
    });

    // Definir claims customizadas se fornecidas
    if (userData.claims) {
      await auth.setCustomUserClaims(userRecord.uid, userData.claims);
    }

    return { data: userRecord, error: null, success: true };
  } catch (error) {
    return {
      data: null,
      error: createAdminError(error, 'criar usuário'),
      success: false
    };
  }
}

// Firebase Admin configuration status check (moved to runtime only)
export function logFirebaseAdminStatus() {
  if (typeof window === 'undefined' && process.env.NODE_ENV === 'development') {
    const hasProjectId = !!process.env.FIREBASE_PROJECT_ID;
    const hasClientEmail = !!process.env.FIREBASE_CLIENT_EMAIL;
    const hasPrivateKey = !!process.env.FIREBASE_PRIVATE_KEY;
    
    if (hasProjectId && hasClientEmail && hasPrivateKey) {
      console.log('🔧 Firebase Admin SDK: ✅ Configurado');
    } else {
      console.log('🔧 Firebase Admin SDK: ❌ Não configurado - Verificar env vars');
    }
  }
}