import { doc, getDoc, setDoc, serverTimestamp, Timestamp, FieldValue, updateDoc } from 'firebase/firestore';
import { logger } from '@/lib/production-logger';
import { getFirebaseDb, getFirebaseAuth } from '@/lib/firebase';

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
 * Get user profile - VERSÃO SIMPLES SEM BUGS
 */
export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  if (!uid?.trim()) {
    throw new Error('User ID is required');
  }

  logger.log(`getUserProfile: Loading profile for UID: ${uid}`);

  const auth = getFirebaseAuth();
  const currentUser = auth.currentUser;

  if (!currentUser || currentUser.uid !== uid) {
    logger.error('getUserProfile: User not authenticated or UID mismatch');
    throw new Error('User not authenticated or UID mismatch');
  }

  try {
    const db = getFirebaseDb();
    const docRef = doc(db, 'usuarios', uid); // SEMPRE 'usuarios' - sem complicações
    
    logger.log('getUserProfile: Querying Firestore', {
      database: db.app.options.projectId,
      collection: 'usuarios',
      uid
    });

    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const data = docSnap.data() as UserProfile;
      logger.log('getUserProfile: Profile found and loaded');
      
      return {
        ...data,
        workspaces: data.workspaces || []
      };
    } else {
      // Perfil não existe - criar na hora (SIMPLES)
      logger.log('getUserProfile: Profile not found, creating new profile');
      
      const newProfile = createDefaultProfile();
      // Adicionar campos opcionais se disponíveis
      if (currentUser.email) {
        (newProfile as any).email = currentUser.email;
      }
      if (currentUser.displayName) {
        newProfile.name = currentUser.displayName;
        newProfile.displayName = currentUser.displayName;
      }
      
      await setDoc(docRef, newProfile);
      logger.log('getUserProfile: New profile created successfully');
      
      return newProfile;
    }

  } catch (error: any) {
    logger.error('getUserProfile: Failed to load/create profile:', error);

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

  logger.log(`createUserProfile: Creating profile for UID: ${uid}`);

  const auth = getFirebaseAuth();
  const currentUser = auth.currentUser;

  if (!currentUser || currentUser.uid !== uid) {
    throw new Error('User not authenticated or UID mismatch');
  }

  try {
    const db = getFirebaseDb();
    const docRef = doc(db, 'usuarios', uid); // SEMPRE 'usuarios' - simples

    const completeProfile: UserProfile = {
      ...createDefaultProfile(),
      ...profile,
      data_criacao: serverTimestamp()
    };

    await setDoc(docRef, completeProfile);

    logger.log('createUserProfile: Profile created successfully');

    return completeProfile;

  } catch (error: any) {
    logger.error('createUserProfile: Failed to create profile:', error);
    
    // Erro removido - sistema simples

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
    // Sistema simples - sem complicações

    const db = getFirebaseDb();
    const docRef = doc(db, 'usuarios', uid); // SEMPRE 'usuarios' - simples

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

    // Log removido - sistema simples

    return updatedProfile;

  } catch (error: any) {
    logger.error('Error updating user profile:', error);
    
    // Erro removido - sistema simples

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