import { doc, getDoc, setDoc, serverTimestamp, Timestamp, FirestoreError } from 'firebase/firestore';

import { getFirebaseDb } from '@/lib/firebase';
import { addNamespace } from '@/lib/staging-config';

// Tipos para resultado de operações com tratamento de erro
export interface ServiceResult<T> {
  data: T | null;
  error: ServiceError | null;
  success: boolean;
}

export interface ServiceError {
  code: string;
  message: string;
  details?: string;
}

// Função utilitária para criar erros padronizados
function createServiceError(error: unknown, operation: string): ServiceError {
  if (error instanceof Error) {
    // Erro específico do Firestore
    if ('code' in error) {
      const firestoreError = error as FirestoreError;
      return {
        code: firestoreError.code,
        message: getFirestoreErrorMessage(firestoreError.code),
        details: firestoreError.message
      };
    }
    
    // Erro genérico
    return {
      code: 'unknown',
      message: `Erro durante ${operation}: ${error.message}`,
      details: error.stack
    };
  }
  
  // Erro não tipado
  return {
    code: 'unknown',
    message: `Erro desconhecido durante ${operation}`,
    details: String(error)
  };
}

// TRANSPARÊNCIA TOTAL - Erro real sem mascaramento
function getFirestoreErrorMessage(code: string): string {
  switch (code) {
    case 'permission-denied':
      return `Firestore rejeitou acesso: permission-denied. Verifique regras de segurança.`;
    case 'not-found':
      return `Firestore: Documento/coleção não existe (not-found).`;
    case 'unavailable':
      return `Firestore indisponível (unavailable). Servidor com problemas.`;
    case 'cancelled':
      return `Firestore: Operação cancelada pelo servidor (cancelled).`;
    case 'deadline-exceeded':
      return `Firestore timeout (deadline-exceeded). Consulta muito lenta ou rede instável.`;
    case 'unauthenticated':
      return `Firestore: Token de autenticação inválido/expirado (unauthenticated).`;
    default:
      return `Firestore erro desconhecido: ${code}. Consulte documentação Firebase.`;
  }
}

export interface Workspace {
  name: string;
  members?: number;
  isOwner?: boolean;
}

export interface UserProfile {
  name?: string;
  displayName?: string;
  phone?: string;
  company?: string;
  oab?: string;
  acceptNewsletter?: boolean;
  cargo: string;
  areas_atuacao: string[];
  primeiro_acesso: boolean;
  initial_setup_complete: boolean;
  data_criacao: Timestamp | Date;
  workspaces?: Workspace[];
}

export async function getUserProfile(uid: string): Promise<ServiceResult<UserProfile>> {
  try {
    console.log('🔍 getUserProfile called with:', { uid });
    
    // Validação de entrada
    if (!uid || uid.trim() === '') {
      return {
        data: null,
        error: {
          code: 'invalid-argument',
          message: 'ID do usuário é obrigatório.'
        },
        success: false
      };
    }

    const db = getFirebaseDb();
    const namespace = addNamespace('usuarios');
    const docRef = doc(db, namespace, uid);
    
    console.log('🔍 Firestore query:', { 
      database: db.app.options.projectId,
      collection: namespace, 
      uid 
    });
    
    // Single attempt with reasonable timeout
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data() as UserProfile;
      
      // Garantir campos obrigatórios
      const normalizedData: UserProfile = {
        ...data,
        workspaces: data.workspaces || [],
        initial_setup_complete: data.initial_setup_complete ?? false
      };
      
      return { data: normalizedData, error: null, success: true };
    } else {
      // Usuário não existe - criar perfil padrão
      const defaultProfile: UserProfile = {
        cargo: '',
        areas_atuacao: [],
        primeiro_acesso: true,
        initial_setup_complete: false,
        data_criacao: new Date(),
        workspaces: [],
      };
      
      const createResult = await createUserProfile(uid, {
        ...defaultProfile,
        data_criacao: new Date()
      });
      if (!createResult.success) {
        return {
          data: null,
          error: createResult.error,
          success: false
        };
      }
      
      // Retornar o perfil criado
      return { data: createResult.data, error: null, success: true };
    }
  } catch (error) {
    console.error('Erro em getUserProfile:', error);
    return {
      data: null,
      error: createServiceError(error, 'buscar perfil do usuário'),
      success: false
    };
  }
}

export async function createUserProfile(
  uid: string,
  data: Omit<UserProfile, 'data_criacao' | 'workspaces'> & { data_criacao: Date; workspaces?: Workspace[] }
): Promise<ServiceResult<UserProfile>> {
  try {
    // Validação de entrada
    if (!uid || uid.trim() === '') {
      return {
        data: null,
        error: {
          code: 'invalid-argument',
          message: 'ID do usuário é obrigatório.'
        },
        success: false
      };
    }

    if (!data) {
      return {
        data: null,
        error: {
          code: 'invalid-argument',
          message: 'Dados do perfil são obrigatórios.'
        },
        success: false
      };
    }


    const userDocRef = doc(getFirebaseDb(), addNamespace('usuarios'), uid);
    const profileData = {
      ...data,
      initial_setup_complete: data.initial_setup_complete || false,
      data_criacao: serverTimestamp(),
      workspaces: data.workspaces || []
    };

    await setDoc(userDocRef, profileData);

    // Retornar os dados criados (com data_criacao como Date para consistência)
    const createdProfile: UserProfile = {
      ...profileData,
      data_criacao: new Date()
    };

    return { data: createdProfile, error: null, success: true };
  } catch (error) {
    console.error('Erro em createUserProfile:', error);
    return {
      data: null,
      error: createServiceError(error, 'criar perfil do usuário'),
      success: false
    };
  }
}

export async function updateUserProfile(
  uid: string, 
  data: Partial<UserProfile>
): Promise<ServiceResult<Partial<UserProfile>>> {
  console.log('🔄 updateUserProfile: Starting', { uid, data });
  
  try {
    // Validação de entrada
    if (!uid || uid.trim() === '') {
      console.error('❌ updateUserProfile: Invalid UID');
      return {
        data: null,
        error: {
          code: 'invalid-argument',
          message: 'ID do usuário é obrigatório.'
        },
        success: false
      };
    }

    if (!data || Object.keys(data).length === 0) {
      console.error('❌ updateUserProfile: No data provided');
      return {
        data: null,
        error: {
          code: 'invalid-argument',
          message: 'Dados para atualização são obrigatórios.'
        },
        success: false
      };
    }

    console.log('📡 updateUserProfile: Getting Firestore instance');
    const db = getFirebaseDb();
    const namespace = addNamespace('usuarios');
    const userDocRef = doc(db, namespace, uid);
    
    console.log('📝 updateUserProfile: Document reference', { namespace, uid });
    
    // Preparar dados para atualização (remover campos que não devem ser sobrescritos)
    const updateData = { ...data };
    delete updateData.data_criacao; // Não permitir sobrescrever data de criação
    
    console.log('💾 updateUserProfile: Saving to Firestore', updateData);
    await setDoc(userDocRef, updateData, { merge: true });
    
    console.log('✅ updateUserProfile: Successfully saved');
    return { data: updateData, error: null, success: true };
  } catch (error) {
    console.error('💥 updateUserProfile: Error occurred', error);
    return {
      data: null,
      error: createServiceError(error, 'atualizar perfil do usuário'),
      success: false
    };
  }
}
