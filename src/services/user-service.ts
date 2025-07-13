import { doc, getDoc, setDoc, serverTimestamp, Timestamp, FieldValue } from 'firebase/firestore';
import { log } from '@/lib/logger';
import { getFirebaseDb, getFirebaseAuth } from '@/lib/firebase';
import { addNamespace } from '@/lib/app-config';
import { authCoordinator, waitForAuthReady } from '@/lib/auth-coordinator';
import { authLogger } from '@/lib/auth-logger';

/**
 * AuthError class com contexto inteligente
 */
interface AuthErrorContext {
  operation: string;
  timing: number;
  retryCount: number;
  userState: 'authenticated' | 'pending' | 'anonymous';
  uid?: string;
  stage?: string;
  metadata?: Record<string, unknown>;
}

class AuthError extends Error {
  public readonly code: string;
  public readonly context: AuthErrorContext;
  public readonly timestamp: number;
  public readonly recoverable: boolean;

  constructor(
    message: string,
    code: string,
    context: AuthErrorContext,
    recoverable: boolean = false
  ) {
    super(message);
    this.name = 'AuthError';
    this.code = code;
    this.context = context;
    this.timestamp = Date.now();
    this.recoverable = recoverable;
  }

  /**
   * Criar error específico para permission denied
   */
  static permissionDenied(context: Omit<AuthErrorContext, 'userState'>, uid?: string): AuthError {
    return new AuthError(
      'Permission denied during authentication operation',
      'permission-denied',
      {
        ...context,
        userState: uid ? 'authenticated' : 'anonymous',
        uid
      },
      false // Permission denied não é recuperável
    );
  }

  /**
   * Criar error para timeout/retry
   */
  static timeout(context: Omit<AuthErrorContext, 'userState'>, uid?: string): AuthError {
    return new AuthError(
      'Operation timed out after maximum retries',
      'timeout',
      {
        ...context,
        userState: uid ? 'authenticated' : 'pending',
        uid
      },
      true // Timeout pode ser recuperável
    );
  }

  /**
   * Criar error para profile não encontrado
   */
  static profileNotFound(context: Omit<AuthErrorContext, 'userState'>, uid: string): AuthError {
    return new AuthError(
      'User profile not found after Cloud Function processing',
      'profile-not-found',
      {
        ...context,
        userState: 'authenticated',
        uid
      },
      true // Profile might be created later
    );
  }

  /**
   * Obter mensagem user-friendly
   */
  getUserMessage(): string {
    const messages: Record<string, string> = {
      'permission-denied': 'Erro de autenticação. Faça login novamente.',
      'timeout': 'Operação demorou mais que o esperado. Tente novamente.',
      'profile-not-found': 'Perfil ainda sendo criado. Aguarde um momento.',
      'network-error': 'Erro de conexão. Verifique sua internet.',
      'firestore-unavailable': 'Serviço temporariamente indisponível. Tente novamente.'
    };

    return messages[this.code] || 'Erro inesperado. Tente novamente.';
  }

  /**
   * Obter estratégia de recovery
   */
  getRecoveryStrategy(): { action: string; delay?: number; maxAttempts?: number } {
    const strategies: Record<string, { action: string; delay?: number; maxAttempts?: number }> = {
      'permission-denied': { action: 'redirect_login' },
      'timeout': { action: 'retry', delay: 5000, maxAttempts: 3 },
      'profile-not-found': { action: 'wait_retry', delay: 2000, maxAttempts: 5 },
      'network-error': { action: 'retry', delay: 3000, maxAttempts: 3 }
    };

    return strategies[this.code] || { action: 'manual_intervention' };
  }

  /**
   * Log estruturado do erro
   */
  logError(): void {
    log.error(this.message, this, {
      component: 'auth-error',
      metadata: {
        code: this.code,
        context: this.context,
        recoverable: this.recoverable,
        userMessage: this.getUserMessage(),
        recoveryStrategy: this.getRecoveryStrategy()
      }
    });
  }
}

// Export AuthError for use in other modules
export { AuthError, type AuthErrorContext };

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
 * Get user profile with intelligent Cloud Function wait
 */
export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  if (!uid?.trim()) {
    throw new Error('User ID is required');
  }

  log.info(`getUserProfile: Loading profile for UID: ${uid}`);

  const auth = getFirebaseAuth();
  const currentUser = auth.currentUser;

  if (!currentUser || currentUser.uid !== uid) {
    log.error('getUserProfile: User not authenticated or UID mismatch');
    throw new Error('User not authenticated or UID mismatch');
  }

  // Use AuthCoordinator deduplication for profile loading with specific operation type
  return authCoordinator.getProfileLoadingPromise(uid, async () => {
    try {
      // Step 1: Ensure auth is ready (JWT token validation only)
      const isAuthReady = await waitForAuthReady(currentUser);
      if (!isAuthReady) {
        throw new Error('Auth coordination failed');
      }

      // Step 2: Wait for Cloud Function to create profile
      const profile = await waitForCloudFunctionProfile(uid);
      
      if (!profile) {
        log.error('getUserProfile: Profile not found after Cloud Function wait');
        
        authLogger.error('Profile not found after Cloud Function timeout', new Error('Profile not found'), {
          context: 'user-service',
          operation: 'getUserProfile',
          userId: uid
        });
        
        return null;
      }

      log.info('getUserProfile: Profile loaded successfully');
      
      authLogger.info('Profile loaded successfully', {
        context: 'user-service',
        operation: 'getUserProfile',
        userId: uid
      });
      
      return {
        ...profile,
        workspaces: profile.workspaces || []
      };

    } catch (error: unknown) {
      const authError = error instanceof Error ? error : new Error(String(error));
      log.error('getUserProfile: Failed to load profile:', authError);
      
      const firebaseError = error as { code?: string };
      authLogger.error('getUserProfile failed', authError, {
        context: 'user-service',
        operation: 'getUserProfile',
        userId: uid,
        errorCode: firebaseError?.code
      });

      // Re-throw with user-friendly message
      const friendlyError = new Error(getFirestoreErrorMessage(error));
      friendlyError.name = 'ProfileLoadError';
      throw friendlyError;
    }
  });
}

/**
 * Wait for Cloud Function to create user profile
 */
async function waitForCloudFunctionProfile(uid: string): Promise<UserProfile | null> {
  const MAX_ATTEMPTS = 3;   // Otimizado: 3 tentativas máximo
  const INTERVAL = 500;     // 500ms entre tentativas para total de ~1.5s
  const startTime = Date.now();
  
  log.info(`waitForCloudFunctionProfile: Starting wait for UID: ${uid}`);
  
  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    try {
      const db = getFirebaseDb();
      const collection = process.env.NODE_ENV === 'production' ? 'usuarios' : addNamespace('usuarios');
      const docRef = doc(db, collection, uid);
      
      log.info(`waitForCloudFunctionProfile: Attempt ${attempt}/${MAX_ATTEMPTS}`, {
        metadata: {
          uid,
          collection,
          database: db.app.options.projectId
        }
      });
      
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const profile = docSnap.data() as UserProfile;
        log.info(`✅ waitForCloudFunctionProfile: Profile found on attempt ${attempt}`);
        return profile;
      }
      
      // Profile not ready yet, wait more
      log.info(`⏳ waitForCloudFunctionProfile: Profile not ready, attempt ${attempt}/${MAX_ATTEMPTS}`);
      
      if (attempt < MAX_ATTEMPTS) {
        await new Promise(resolve => setTimeout(resolve, INTERVAL));
      }
      
    } catch (error: unknown) {
      const timing = Date.now() - startTime;
      const firebaseError = error as { code?: string; message?: string };
      
      if (firebaseError.code === 'permission-denied') {
        // Auth problem - fail fast with intelligent context
        const authError = AuthError.permissionDenied({
          operation: 'waitForCloudFunctionProfile',
          timing,
          retryCount: attempt,
          stage: 'profile_wait',
          metadata: {
            collection: process.env.NODE_ENV === 'production' ? 'usuarios' : addNamespace('usuarios'),
            maxAttempts: MAX_ATTEMPTS,
            interval: INTERVAL
          }
        }, uid);
        
        authError.logError();
        throw authError;
      }
      
      // Other errors - continue waiting (might be temporary)
      log.warn(`waitForCloudFunctionProfile: Error on attempt ${attempt}: ${firebaseError.code}`, {
        metadata: {
          uid,
          code: firebaseError.code,
          attempt,
          timing,
          isRecoverable: true
        }
      });
      
      if (attempt < MAX_ATTEMPTS) {
        await new Promise(resolve => setTimeout(resolve, INTERVAL));
      }
    }
  }
  
  // Timeout - create intelligent timeout error
  const timing = Date.now() - startTime;
  const timeoutError = AuthError.timeout({
    operation: 'waitForCloudFunctionProfile',
    timing,
    retryCount: MAX_ATTEMPTS,
    stage: 'profile_wait_timeout',
    metadata: {
      maxAttempts: MAX_ATTEMPTS,
      totalWaitTime: timing,
      expectedTime: MAX_ATTEMPTS * INTERVAL
    }
  }, uid);
  
  timeoutError.logError();
  throw timeoutError;
}

/**
 * Create user profile (explicit creation)
 */
export async function createUserProfile(uid: string, profile: Partial<UserProfile>): Promise<UserProfile> {
  if (!uid?.trim()) {
    throw new Error('User ID is required');
  }

  log.info(`createUserProfile: Creating profile for UID: ${uid}`);

  const auth = getFirebaseAuth();
  const currentUser = auth.currentUser;

  if (!currentUser || currentUser.uid !== uid) {
    throw new Error('User not authenticated or UID mismatch');
  }

  try {
    // Ensure auth is ready
    const isAuthReady = await waitForAuthReady(currentUser);
    if (!isAuthReady) {
      throw new Error('Auth coordination failed');
    }

    // Get fresh token
    await currentUser.getIdToken(true);

    const db = getFirebaseDb();
    // CORREÇÃO: usar 'usuarios' diretamente em produção
    const collection = process.env.NODE_ENV === 'production' ? 'usuarios' : addNamespace('usuarios');
    const docRef = doc(db, collection, uid);

    const completeProfile: UserProfile = {
      ...createDefaultProfile(),
      ...profile,
      data_criacao: serverTimestamp()
    };

    await setDoc(docRef, completeProfile);

    log.info('createUserProfile: Profile created successfully');
    
    authLogger.info('User profile created', {
      context: 'user-service',
      operation: 'createUserProfile',
      userId: uid
    });

    return completeProfile;

  } catch (error: unknown) {
    const authError = error instanceof Error ? error : new Error(String(error));
    log.error('createUserProfile: Failed to create profile:', authError);
    
    const firebaseError = error as { code?: string };
    authLogger.error('createUserProfile failed', authError, {
      context: 'user-service',
      operation: 'createUserProfile',
      userId: uid,
      errorCode: firebaseError?.code
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
    const isAuthReady = await waitForAuthReady(currentUser);
    if (!isAuthReady) {
      throw new Error('Auth coordination failed');
    }

    // Get fresh token
    await currentUser.getIdToken(true);

    const db = getFirebaseDb();
    // CORREÇÃO: usar 'usuarios' diretamente em produção
    const collection = process.env.NODE_ENV === 'production' ? 'usuarios' : addNamespace('usuarios');
    const docRef = doc(db, collection, uid);

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

  } catch (error: unknown) {
    const authError = error instanceof Error ? error : new Error(String(error));
    log.error('Error updating user profile:', authError);
    
    const firebaseError = error as { code?: string };
    authLogger.error('updateUserProfile failed', authError, {
      context: 'user-service',
      operation: 'updateUserProfile',
      userId: uid,
      errorCode: firebaseError?.code
    });

    throw error;
  }
}


/**
 * Convert Firestore errors to user-friendly messages
 */
function getFirestoreErrorMessage(error: unknown): string {
  const firebaseError = error as { code?: string; message?: string };
  if (!firebaseError?.code) {
    return firebaseError?.message || 'Erro desconhecido ao carregar perfil';
  }

  switch (firebaseError.code) {
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
      return `Erro: ${firebaseError.code}`;
  }
}