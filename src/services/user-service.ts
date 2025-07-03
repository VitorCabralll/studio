import { doc, getDoc, setDoc, serverTimestamp, Timestamp, FirestoreError, DocumentSnapshot } from 'firebase/firestore';

import { getFirebaseDb } from '@/lib/firebase';

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

// Mensagens amigáveis para códigos de erro do Firestore
function getFirestoreErrorMessage(code: string): string {
  switch (code) {
    case 'permission-denied':
      return 'Você não tem permissão para acessar este recurso.';
    case 'not-found':
      return 'Dados não encontrados.';
    case 'unavailable':
      return 'Serviço temporariamente indisponível. Tente novamente.';
    case 'cancelled':
      return 'Operação cancelada.';
    case 'deadline-exceeded':
      return 'Tempo limite excedido. Verifique sua conexão.';
    case 'unauthenticated':
      return 'Você precisa estar logado para realizar esta ação.';
    default:
      return 'Ocorreu um erro inesperado. Tente novamente.';
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
  cargo: string;
  areas_atuacao: string[];
  primeiro_acesso: boolean;
  initial_setup_complete: boolean;
  data_criacao: Timestamp | Date;
  workspaces?: Workspace[];
}

export async function getUserProfile(uid: string): Promise<ServiceResult<UserProfile>> {
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

    const db = getFirebaseDb();
    const docRef = doc(db, 'usuarios', uid);
    
    // Tentar múltiplas vezes com timeouts progressivos
    let docSnap;
    let lastError: any;
    
    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        const timeout = attempt * 3000; // 3s, 6s, 9s
        console.log(`Tentativa ${attempt}/3 - Timeout: ${timeout}ms`);
        
        const timeoutPromise = new Promise((_, reject) => {
          setTimeout(() => reject(new Error(`Timeout tentativa ${attempt}: Servidor não responde`)), timeout);
        });
        
        docSnap = await Promise.race([
          getDoc(docRef),
          timeoutPromise
        ]) as DocumentSnapshot;
        
        // Se chegou aqui, deu certo
        break;
        
      } catch (error) {
        lastError = error;
        console.warn(`Tentativa ${attempt} falhou:`, error);
        
        if (attempt < 3) {
          // Aguardar antes da próxima tentativa
          await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
        }
      }
    }
    
    // Se todas as tentativas falharam, criar perfil local temporário
    if (!docSnap) {
      console.error('Todas as tentativas de conexão falharam, criando perfil local temporário');
      
      // Retornar perfil padrão temporário para não quebrar a aplicação
      const temporaryProfile: UserProfile = {
        cargo: '',
        areas_atuacao: [],
        primeiro_acesso: true,
        initial_setup_complete: false,
        data_criacao: new Date(),
        workspaces: [],
        displayName: 'Usuário (Offline)'
      };
      
      return {
        data: temporaryProfile,
        error: {
          code: 'offline-mode',
          message: 'Funcionando offline. Dados não serão salvos.',
          details: 'Conectividade com servidor perdida'
        },
        success: true // true para não quebrar o fluxo
      };
    }

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


    const userDocRef = doc(getFirebaseDb(), 'usuarios', uid);
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

    if (!data || Object.keys(data).length === 0) {
      return {
        data: null,
        error: {
          code: 'invalid-argument',
          message: 'Dados para atualização são obrigatórios.'
        },
        success: false
      };
    }


    const userDocRef = doc(getFirebaseDb(), 'usuarios', uid);
    
    // Preparar dados para atualização (remover campos que não devem ser sobrescritos)
    const updateData = { ...data };
    delete updateData.data_criacao; // Não permitir sobrescrever data de criação
    
    await setDoc(userDocRef, updateData, { merge: true });

    return { data: updateData, error: null, success: true };
  } catch (error) {
    console.error('Erro em updateUserProfile:', error);
    return {
      data: null,
      error: createServiceError(error, 'atualizar perfil do usuário'),
      success: false
    };
  }
}
