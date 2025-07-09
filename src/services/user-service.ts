import { doc, getDoc, setDoc, serverTimestamp, Timestamp, FieldValue } from 'firebase/firestore';
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
 * Create default user profile
 */
function createDefaultProfile(): UserProfile {
  return {
    cargo: '',
    areas_atuacao: [],
    primeiro_acesso: true,
    initial_setup_complete: false,
    data_criacao: serverTimestamp(),
    workspaces: []
  };
}

/**
 * Get user profile with automatic creation for new users
 */
export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  if (!uid?.trim()) {
    throw new Error('User ID is required');
  }

  console.log(`🔍 getUserProfile: Loading profile for UID: ${uid}`);

  const auth = getFirebaseAuth();
  const currentUser = auth.currentUser;

  if (!currentUser || currentUser.uid !== uid) {
    console.error('❌ getUserProfile: User not authenticated or UID mismatch');
    throw new Error('User not authenticated or UID mismatch');
  }

  try {
    // Step 1: Ensure auth is ready
    const isAuthReady = await AuthCoordinator.waitForAuthReady(currentUser);
    if (!isAuthReady) {
      throw new Error('Auth coordination failed');
    }

    // Step 2: Get fresh token
    const token = await currentUser.getIdToken(true);
    console.log('✅ getUserProfile: Fresh JWT token obtained');

    // Step 3: Try to get existing profile
    const db = getFirebaseDb();
    const namespace = addNamespace('usuarios');
    const docRef = doc(db, namespace, uid);
    
    console.log('🔍 getUserProfile: Querying Firestore', {
      database: db.app.options.projectId,
      collection: namespace,
      uid,
      hasToken: !!token
    });

    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const data = docSnap.data() as UserProfile;
      console.log('✅ getUserProfile: Profile found and loaded');
      
      authLogger.info('Profile loaded successfully', {
        context: 'user-service',
        operation: 'getUserProfile',
        userId: uid
      });
      
      return {
        ...data,
        workspaces: data.workspaces || []
      };
    } else {
      // Step 4: Profile doesn't exist - create it
      console.log('⚠️ getUserProfile: Profile not found, creating default profile');
      
      const defaultProfile = createDefaultProfile();
      
      // Try to create the profile
      await setDoc(docRef, defaultProfile);
      
      console.log('✅ getUserProfile: Default profile created successfully');
      
      authLogger.info('Default profile created for new user', {
        context: 'user-service',
        operation: 'getUserProfile',
        userId: uid
      });
      
      return defaultProfile;
    }

  } catch (error: any) {
    console.error('❌ getUserProfile: Failed to load/create profile:', error);
    
    authLogger.error('getUserProfile failed', error, {
      context: 'user-service',
      operation: 'getUserProfile',
      userId: uid,
      errorCode: error?.code
    });

    // Re-throw with user-friendly message
    const friendlyError = new Error(getFirestoreErrorMessage(error));
    friendlyError.name = 'ProfileLoadError';
    throw friendlyError;
  }
}

/**
 * Create user profile (explicit creation)
 */
export async function createUserProfile(uid: string, profile: Partial<UserProfile>): Promise<UserProfile> {
  if (!uid?.trim()) {
    throw new Error('User ID is required');
  }

  console.log(`🔧 createUserProfile: Creating profile for UID: ${uid}`);

  const auth = getFirebaseAuth();
  const currentUser = auth.currentUser;

  if (!currentUser || currentUser.uid !== uid) {
    throw new Error('User not authenticated or UID mismatch');
  }

  try {
    // Ensure auth is ready
    const isAuthReady = await AuthCoordinator.waitForAuthReady(currentUser);
    if (!isAuthReady) {
      throw new Error('Auth coordination failed');
    }

    // Get fresh token
    await currentUser.getIdToken(true);

    const db = getFirebaseDb();
    const namespace = addNamespace('usuarios');
    const docRef = doc(db, namespace, uid);

    const completeProfile: UserProfile = {
      ...createDefaultProfile(),
      ...profile,
      data_criacao: serverTimestamp()
    };

    await setDoc(docRef, completeProfile);

    console.log('✅ createUserProfile: Profile created successfully');
    
    authLogger.info('User profile created', {
      context: 'user-service',
      operation: 'createUserProfile',
      userId: uid
    });

    return completeProfile;

  } catch (error: any) {
    console.error('❌ createUserProfile: Failed to create profile:', error);
    
    authLogger.error('createUserProfile failed', error, {
      context: 'user-service',
      operation: 'createUserProfile',
      userId: uid,
      errorCode: error?.code
    });

    throw error;
  }
}

/**
 * Update user profile
 */
export async function updateUserProfile(uid: string, updates: Partial<UserProfile>): Promise<UserProfile> {
  if (!uid?.trim()) {
    throw new Error('User ID is required');
  }

  const auth = getFirebaseAuth();
  const currentUser = auth.currentUser;

  if (!currentUser || currentUser.uid !== uid) {
    throw new Error('User not authenticated or UID mismatch');
  }

  try {
    // Ensure auth is ready
    const isAuthReady = await AuthCoordinator.waitForAuthReady(currentUser);
    if (!isAuthReady) {
      throw new Error('Auth coordination failed');
    }

    // Get fresh token
    await currentUser.getIdToken(true);

    const db = getFirebaseDb();
    const namespace = addNamespace('usuarios');
    const docRef = doc(db, namespace, uid);

    // Get current profile first
    const docSnap = await getDoc(docRef);
    
    if (!docSnap.exists()) {
      throw new Error('Profile not found');
    }

    const currentProfile = docSnap.data() as UserProfile;
    const updatedProfile: UserProfile = {
      ...currentProfile,
      ...updates,
      data_criacao: currentProfile.data_criacao // Preserve original creation date
    };

    await setDoc(docRef, updatedProfile);

    authLogger.info('User profile updated', {
      context: 'user-service',
      operation: 'updateUserProfile',
      userId: uid
    });

    return updatedProfile;

  } catch (error: any) {
    console.error('Error updating user profile:', error);
    
    authLogger.error('updateUserProfile failed', error, {
      context: 'user-service',
      operation: 'updateUserProfile',
      userId: uid,
      errorCode: error?.code
    });

    throw error;
  }
}

/**
 * Check if error should trigger a retry
 */
function shouldRetryError(error: any): boolean {
  if (!error?.code) return false;
  
  const retryableCodes = [
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
      return 'Acesso negado. Verifique suas permissões e tente novamente.';
    case 'not-found':
      return 'Perfil não encontrado';
    case 'unavailable':
      return 'Serviço temporariamente indisponível. Tente novamente.';
    case 'deadline-exceeded':
      return 'Timeout na consulta. Verifique sua conexão.';
    case 'resource-exhausted':
      return 'Limite de requisições excedido. Aguarde um momento.';
    case 'unauthenticated':
      return 'Usuário não autenticado. Faça login novamente.';
    default:
      return `Erro: ${error.code}`;
  }
}