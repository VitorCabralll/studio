import { doc, getDoc, setDoc, serverTimestamp, Timestamp, FieldValue, FirestoreError } from 'firebase/firestore';
import { getFirebaseDb, getFirebaseAuth } from '@/lib/firebase';
import { addNamespace } from '@/lib/staging-config';
import { AuthCoordinator } from '@/lib/auth-coordinator';
import { authLogger } from '@/lib/auth-logger';

// Service result types
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
  data_criacao: Timestamp | Date | FieldValue;
  workspaces: Workspace[];
}

/**
 * Get user profile with coordinated auth and retry logic
 */
async function getUserProfileWithCoordination(uid: string, attempt: number = 1, maxAttempts: number = 3): Promise<UserProfile | null> {
  console.log(`getUserProfile attempt ${attempt}/${maxAttempts} with:`, { uid });

  if (!uid?.trim()) {
    throw new Error('User ID is required');
  }

  const auth = getFirebaseAuth();
  const currentUser = auth.currentUser;

  if (!currentUser || currentUser.uid !== uid) {
    throw new Error('User not authenticated or UID mismatch');
  }

  try {
    // Step 1: Ensure auth is ready using AuthCoordinator
    const isAuthReady = await AuthCoordinator.waitForAuthReady(currentUser);
    
    if (!isAuthReady) {
      throw new Error('Auth coordination failed');
    }

    // Step 2: Validate JWT token
    const token = await currentUser.getIdToken(true);
    console.log('Token JWT valido obtido para consulta Firestore');

    // Step 3: Query Firestore with validated token
    const db = getFirebaseDb();
    const namespace = addNamespace('usuarios');
    const docRef = doc(db, namespace, uid);
    
    console.log('Firestore query debug:', {
      database: db.app.options.projectId,
      collection: namespace,
      uid,
      environment: process.env.NEXT_PUBLIC_APP_ENV || 'production',
      namespace_prefix: addNamespace(''),
      hasToken: !!token
    });

    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const data = docSnap.data() as UserProfile;
      
      authLogger.info('Profile loaded successfully', {
        context: 'user-service',
        operation: 'getUserProfile',
        userId: uid,
        attempt
      });
      
      return {
        ...data,
        workspaces: data.workspaces || [],
        initial_setup_complete: data.initial_setup_complete ?? false
      };
    } else {
      // User doesn't exist - create default profile
      console.log('Creating default profile for new user');
      const defaultProfile: UserProfile = {
        cargo: '',
        areas_atuacao: [],
        primeiro_acesso: true,
        initial_setup_complete: false,
        data_criacao: new Date(),
        workspaces: [],
      };
      
      await createUserProfile(uid, defaultProfile);
      return defaultProfile;
    }

  } catch (error: any) {
    console.error(`Attempt ${attempt} failed:`, error?.code || error?.message);
    
    authLogger.error(`getUserProfile attempt ${attempt} failed`, error, {
      context: 'user-service',
      operation: 'getUserProfile',
      userId: uid,
      attempt,
      errorCode: error?.code
    });

    // Retry logic for permission-denied and timing issues
    if (attempt < maxAttempts && shouldRetryError(error)) {
      console.log(`Retrying... (${attempt + 1}/${maxAttempts})`);
      
      const retryDelay = attempt * 1000; // 1s, 2s, 3s - mais rápido
      console.log(`Retry ${attempt + 1}: aguardando ${retryDelay}ms para propagacao...`);
      
      await new Promise(resolve => setTimeout(resolve, retryDelay));
      return getUserProfileWithCoordination(uid, attempt + 1, maxAttempts);
    }

    // Final error handling
    const friendlyError = new Error(getFirestoreErrorMessage(error));
    friendlyError.name = 'ProfileLoadError';
    throw friendlyError;
  }
}

/**
 * Check if error should trigger a retry
 */
function shouldRetryError(error: any): boolean {
  if (!error?.code) return false;
  
  const retryableCodes = [
    'permission-denied',
    'unavailable',
    'deadline-exceeded',
    'internal',
    'resource-exhausted'
  ];
  
  return retryableCodes.includes(error.code);
}

/**
 * Convert Firestore errors to user-friendly messages
 */
function getFirestoreErrorMessage(error: any): string {
  if (!error?.code) {
    return error?.message || 'Erro desconhecido ao carregar perfil';
  }

  switch (error.code) {
    case 'permission-denied':
      return `Firestore rejeitou acesso: permission-denied. Verifique regras de seguranca.`;
    case 'not-found':
      return 'Perfil nao encontrado';
    case 'unavailable':
      return 'Servico temporariamente indisponivel. Tente novamente.';
    case 'deadline-exceeded':
      return 'Timeout na consulta. Verifique sua conexao.';
    case 'resource-exhausted':
      return 'Limite de requisicoes excedido. Aguarde um momento.';
    default:
      return `Erro do Firestore: ${error.code}`;
  }
}

export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  return getUserProfileWithCoordination(uid);
}

export async function createUserProfile(
  uid: string,
  data: Partial<UserProfile>
): Promise<void> {
  if (!uid?.trim()) {
    throw new Error('User ID is required');
  }

  if (!data) {
    throw new Error('Profile data is required');
  }

  const db = getFirebaseDb();
  const docRef = doc(db, addNamespace('usuarios'), uid);
  
  const profileData: Partial<UserProfile> = {
    cargo: data.cargo || '',
    areas_atuacao: data.areas_atuacao || [],
    primeiro_acesso: data.primeiro_acesso ?? true,
    initial_setup_complete: data.initial_setup_complete ?? false,
    data_criacao: serverTimestamp(),
    workspaces: data.workspaces || [],
    ...data, // Spread other fields like name, phone, etc.
  };

  try {
    // Use setDoc with merge: true to handle concurrent writes
    await setDoc(docRef, profileData, { merge: true });
  } catch (error) {
    console.error('Error creating user profile:', error);
    throw error;
  }
}

export async function updateUserProfile(
  uid: string,
  data: Partial<UserProfile>
): Promise<ServiceResult<Partial<UserProfile>>> {
  if (!uid?.trim()) {
    return {
      data: null,
      error: { code: 'invalid-argument', message: 'User ID is required' },
      success: false
    };
  }

  if (!data || Object.keys(data).length === 0) {
    return {
      data: null,
      error: { code: 'invalid-argument', message: 'Update data is required' },
      success: false
    };
  }

  const db = getFirebaseDb();
  const docRef = doc(db, addNamespace('usuarios'), uid);
  
  // Remove fields that shouldn't be updated
  const updateData = { ...data };
  delete updateData.data_criacao; // Don't allow overwriting creation date
  
  try {
    // Use setDoc with merge: true for atomic updates
    await setDoc(docRef, updateData, { merge: true });
    return {
      data: updateData,
      error: null,
      success: true
    };
  } catch (error) {
    console.error('Error updating user profile:', error);
    return {
      data: null,
      error: {
        code: 'update-failed',
        message: 'Failed to update profile',
        details: error instanceof Error ? error.message : String(error)
      },
      success: false
    };
  }
}