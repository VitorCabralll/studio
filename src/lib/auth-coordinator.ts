/**
 * Auth Coordinator - Coordenação de Auth Flow LexAI
 * Resolve race conditions e timing issues na autenticação
 */

import { User } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { getFirebaseDb, getFirebaseAuth } from './firebase';
import { addNamespace } from './staging-config';

export interface AuthState {
  authReady: boolean;
  tokenValidated: boolean;
  profileLoaded: boolean;
  user: User | null;
}

export interface TokenValidationResult {
  isValid: boolean;
  canAccessFirestore: boolean;
  error?: string;
}

/**
 * AuthCoordinator - Singleton para coordenar auth flow
 */
export class AuthCoordinator {
  private static instance: AuthCoordinator | null = null;
  private static authState: AuthState = {
    authReady: false,
    tokenValidated: false,
    profileLoaded: false,
    user: null
  };
  
  private static profileLoadingPromises = new Map<string, Promise<any>>();
  private static tokenValidationPromise: Promise<TokenValidationResult> | null = null;

  // Singleton pattern
  public static getInstance(): AuthCoordinator {
    if (!AuthCoordinator.instance) {
      AuthCoordinator.instance = new AuthCoordinator();
    }
    return AuthCoordinator.instance;
  }

  /**
   * Aguarda auth state estar ready para operações seguras
   */
  public static async waitForAuthReady(user: User | null = null): Promise<boolean> {
    console.log('🔄 AuthCoordinator: Waiting for auth ready...', {
      currentState: AuthCoordinator.authState,
      userProvided: !!user
    });

    const currentUser = user || getFirebaseAuth().currentUser;
    
    if (!currentUser) {
      console.log('❌ AuthCoordinator: No user available');
      AuthCoordinator.resetAuthState();
      return false;
    }

    // Update user reference
    AuthCoordinator.authState.user = currentUser;
    
    // Se já está ready, retornar imediatamente
    if (AuthCoordinator.authState.authReady && AuthCoordinator.authState.tokenValidated) {
      console.log('✅ AuthCoordinator: Already ready');
      return true;
    }

    try {
      // Step 1: Validar token JWT
      const tokenResult = await AuthCoordinator.validateTokenPropagation(currentUser);
      
      // CORREÇÃO DEFINITIVA: Verificar se o acesso ao Firestore foi validado
      if (!tokenResult.canAccessFirestore) {
        console.error('❌ AuthCoordinator: Firestore access validation failed', tokenResult.error);
        AuthCoordinator.authState.authReady = false;
        AuthCoordinator.authState.tokenValidated = false;
        return false;
      }

      // Update state
      AuthCoordinator.authState.authReady = true;
      AuthCoordinator.authState.tokenValidated = tokenResult.canAccessFirestore;

      console.log('✅ AuthCoordinator: Auth ready completed', AuthCoordinator.authState);
      return true;

    } catch (error: any) {
      console.error('❌ AuthCoordinator: Error in waitForAuthReady', error);
      AuthCoordinator.resetAuthState();
      return false;
    }
  }

  /**
   * Valida se token JWT propagou para Firestore
   */
  public static async validateTokenPropagation(user: User): Promise<TokenValidationResult> {
    // Usar cache se já está validando
    if (AuthCoordinator.tokenValidationPromise) {
      console.log('🔄 AuthCoordinator: Using cached token validation');
      return AuthCoordinator.tokenValidationPromise;
    }

    AuthCoordinator.tokenValidationPromise = AuthCoordinator.performTokenValidation(user);
    
    try {
      const result = await AuthCoordinator.tokenValidationPromise;
      return result;
    } finally {
      // Clear cache after completion
      AuthCoordinator.tokenValidationPromise = null;
    }
  }

  private static async performTokenValidation(user: User): Promise<TokenValidationResult> {
    try {
      console.log('🔍 AuthCoordinator: Starting token validation');

      // Step 1: Refresh token to ensure it's current
      const token = await user.getIdToken(true);
      console.log('✅ AuthCoordinator: Token refreshed successfully');

      // Step 2: Wait for token propagation (critical timing)
      await AuthCoordinator.waitForTokenPropagation();

      // Step 3: Test Firestore access with the refreshed token
      const firestoreAccess = await AuthCoordinator.testFirestoreAccess(user.uid);
      
      return {
        isValid: firestoreAccess, // CORREÇÃO: isValid agora reflete resultado real
        canAccessFirestore: firestoreAccess,
        error: firestoreAccess ? undefined : 'Firestore access denied after intelligent retries'
      };

    } catch (error: any) {
      console.error('❌ AuthCoordinator: Token validation failed', error);
      
      return {
        isValid: false,
        canAccessFirestore: false,
        error: error.message || 'Token validation failed'
      };
    }
  }

  /**
   * Aguarda propagação do token (timing crítico)
   */
  private static async waitForTokenPropagation(): Promise<void> {
    // PRODUÇÃO: Timing inteligente baseado na análise dos logs da Cloud Function
    if (process.env.NODE_ENV === 'production') {
      // Cloud Function leva ~700ms + margem de segurança + jitter anti-thundering herd
      const baseDelay = 1200; // 1.2s base (otimizado baseado nos logs reais)
      const jitter = Math.random() * 300; // 0-300ms jitter
      const totalDelay = baseDelay + jitter;
      
      console.log(`⏳ AuthCoordinator: Smart token propagation wait (${Math.round(totalDelay)}ms)`);
      await new Promise(resolve => setTimeout(resolve, totalDelay));
      return;
    }
    
    // DESENVOLVIMENTO: Token válido imediatamente
    console.log('✅ AuthCoordinator: Development mode - immediate validation');
    return Promise.resolve();
  }

  /**
   * Testa acesso ao Firestore com query que requer auth
   */
  private static async testFirestoreAccess(uid: string): Promise<boolean> {
    const MAX_RETRIES = 3;
    const INITIAL_BACKOFF = 500; // 500ms

    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
      try {
        const db = getFirebaseDb();
        const collection = process.env.NODE_ENV === 'production' ? 'usuarios' : addNamespace('usuarios');
        
        console.log(`[Attempt ${attempt}/${MAX_RETRIES}] 🔍 AuthCoordinator: Testing Firestore access`, {
          uid,
          collection,
          database: '(default)',
          environment: process.env.NODE_ENV
        });
        
        const testRef = doc(db, collection, uid);
        // Testar apenas leitura (sem precisar que documento exista)
        const docSnap = await getDoc(testRef);
        // Se chegou até aqui, permissão está OK (mesmo que documento não exista)
        
        console.log(`✅ AuthCoordinator: Firestore access confirmed on attempt ${attempt}.`);
        return true;

      } catch (error: any) {
        // Apenas tentar novamente no erro específico de 'permission-denied'
        if (error.code === 'permission-denied') {
          console.warn(`[Attempt ${attempt}/${MAX_RETRIES}] ⚠️ AuthCoordinator: Firestore permission denied.`);
          
          // Se for a última tentativa, falhar permanentemente
          if (attempt === MAX_RETRIES) {
            console.error('❌ AuthCoordinator: Max retries reached. Firestore access failed.', {
              code: error.code,
              message: error.message,
              uid,
            });
            return false;
          }

          // Calcular o atraso exponencial e esperar
          const backoffDelay = INITIAL_BACKOFF * Math.pow(2, attempt - 1); // 500ms, 1000ms, 2000ms
          console.log(`⏳ AuthCoordinator: Waiting ${backoffDelay}ms before next retry...`);
          await new Promise(resolve => setTimeout(resolve, backoffDelay));

        } else {
          // Para qualquer outro erro (ex: 'not-found', 'unavailable'), não é um problema de permissão.
          // O token é considerado válido para acesso, mesmo que o recurso não exista.
          console.log('✅ AuthCoordinator: Firestore access ok (non-permission error):', error.code);
          return true;
        }
      }
    }
    
    // Este ponto só seria alcançado se o loop terminasse sem um retorno, o que não deve acontecer.
    return false;
  }

  /**
   * Deduplicação de profile loading - evita concurrent creation
   */
  public static async getProfileLoadingPromise<T>(
    uid: string, 
    loadFunction: () => Promise<T>
  ): Promise<T> {
    // Se já está carregando o perfil deste usuário, retornar a promise existente
    if (AuthCoordinator.profileLoadingPromises.has(uid)) {
      console.log('🔄 AuthCoordinator: Using existing profile loading promise for', uid);
      return AuthCoordinator.profileLoadingPromises.get(uid)!;
    }

    // Criar nova promise e cachear
    console.log('🆕 AuthCoordinator: Creating new profile loading promise for', uid);
    const loadingPromise = loadFunction();
    
    AuthCoordinator.profileLoadingPromises.set(uid, loadingPromise);

    try {
      const result = await loadingPromise;
      
      // Mark profile as loaded
      if (AuthCoordinator.authState.user?.uid === uid) {
        AuthCoordinator.authState.profileLoaded = true;
      }
      
      return result;
    } finally {
      // Always cleanup cache
      AuthCoordinator.profileLoadingPromises.delete(uid);
    }
  }

  /**
   * Reset auth state - usado quando user faz logout ou há erro crítico
   */
  public static resetAuthState(): void {
    console.log('🔄 AuthCoordinator: Resetting auth state');
    
    AuthCoordinator.authState = {
      authReady: false,
      tokenValidated: false,
      profileLoaded: false,
      user: null
    };
    
    // Clear all caches
    AuthCoordinator.profileLoadingPromises.clear();
    AuthCoordinator.tokenValidationPromise = null;
  }

  /**
   * Get current auth state (read-only)
   */
  public static getAuthState(): Readonly<AuthState> {
    return { ...AuthCoordinator.authState };
  }

  /**
   * Coordinated retry para operações que falharam por timing
   */
  public static async retryWithCoordination<T>(
    operation: () => Promise<T>,
    user: User,
    maxAttempts: number = 3
  ): Promise<T> {
    let lastError: any;

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        console.log(`🔄 AuthCoordinator: Retry attempt ${attempt}/${maxAttempts}`);
        
        // Garantir que auth está ready antes da operação
        const isReady = await AuthCoordinator.waitForAuthReady(user);
        
        if (!isReady) {
          throw new Error('Auth not ready after coordination');
        }

        // Executar operação
        return await operation();

      } catch (error: any) {
        lastError = error;
        console.error(`❌ AuthCoordinator: Attempt ${attempt} failed:`, error?.code || error?.message);
        
        // Se é permission-denied, pode ser timing issue - retry
        if (error?.code === 'permission-denied' && attempt < maxAttempts) {
          // Reset token validation para forçar nova validação
          AuthCoordinator.tokenValidationPromise = null;
          AuthCoordinator.authState.tokenValidated = false;
          
          const backoffDelay = attempt * 500; // 500ms, 1s, 1.5s - mais rápido
          console.log(`⏳ AuthCoordinator: Backoff delay ${backoffDelay}ms before retry`);
          await new Promise(resolve => setTimeout(resolve, backoffDelay));
          
          continue;
        }
        
        // Para outros erros ou se esgotaram tentativas, falhar imediatamente
        break;
      }
    }

    throw lastError;
  }
}

/**
 * Utility functions para compatibilidade
 */

export const waitForAuthReady = AuthCoordinator.waitForAuthReady;
export const validateTokenPropagation = AuthCoordinator.validateTokenPropagation;
export const getProfileLoadingPromise = AuthCoordinator.getProfileLoadingPromise;
export const resetAuthState = AuthCoordinator.resetAuthState;
export const retryWithCoordination = AuthCoordinator.retryWithCoordination;