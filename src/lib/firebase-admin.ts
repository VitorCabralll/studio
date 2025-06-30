import { initializeApp, getApps, cert, ServiceAccount } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';
import { getStorage } from 'firebase-admin/storage';

// Configuração do Firebase Admin SDK
const serviceAccount: ServiceAccount = {
  projectId: process.env.FIREBASE_PROJECT_ID!,
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL!,
  privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
};

// Verificar se as credenciais estão configuradas
export const isAdminConfigured = !!(
  process.env.FIREBASE_PROJECT_ID &&
  process.env.FIREBASE_CLIENT_EMAIL &&
  process.env.FIREBASE_PRIVATE_KEY
);

// Inicializar Firebase Admin apenas uma vez
let adminApp: any;

if (isAdminConfigured) {
  try {
    // Verificar se já existe uma instância
    adminApp = getApps().find(app => app.name === '[DEFAULT]') || 
               initializeApp({
                 credential: cert(serviceAccount),
                 projectId: serviceAccount.projectId,
                 storageBucket: `${serviceAccount.projectId}.appspot.com`,
               });
  } catch (error) {
    console.error('Erro ao inicializar Firebase Admin:', error);
  }
}

// Exportar serviços
export const adminFirestore = isAdminConfigured && adminApp ? getFirestore(adminApp) : null;
export const adminAuth = isAdminConfigured && adminApp ? getAuth(adminApp) : null;
export const adminStorage = isAdminConfigured && adminApp ? getStorage(adminApp) : null;

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
    if (!isAdminConfigured || !adminAuth) {
      return {
        data: null,
        error: {
          code: 'admin-not-configured',
          message: 'Firebase Admin não está configurado'
        },
        success: false
      };
    }

    const decodedToken = await adminAuth.verifyIdToken(idToken);
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
    if (!isAdminConfigured || !adminAuth) {
      return {
        data: null,
        error: {
          code: 'admin-not-configured',
          message: 'Firebase Admin não está configurado'
        },
        success: false
      };
    }

    const userRecord = await adminAuth.createUser({
      email: userData.email,
      password: userData.password,
      displayName: userData.displayName,
    });

    // Definir claims customizadas se fornecidas
    if (userData.claims) {
      await adminAuth.setCustomUserClaims(userRecord.uid, userData.claims);
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

// Log de status da configuração
if (typeof window === 'undefined') { // Server-side only
  console.log(`🔧 Firebase Admin SDK: ${isAdminConfigured ? '✅ Configurado' : '❌ Não configurado'}`);
  if (isAdminConfigured) {
    console.log(`📧 Client Email: ${process.env.FIREBASE_CLIENT_EMAIL}`);
    console.log(`🆔 Project ID: ${process.env.FIREBASE_PROJECT_ID}`);
  }
}