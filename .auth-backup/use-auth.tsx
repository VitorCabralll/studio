'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { authLogger } from '@/lib/auth-logger';
import { 
  User, 
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signInWithRedirect,
  signOut,
  sendPasswordResetEmail
} from 'firebase/auth';
import { useRouter } from 'next/navigation';

import { getFirebaseAuth, getGoogleAuthProvider } from '@/lib/firebase';
import { getUserProfile, UserProfile } from '@/services/user-service';
import { parseAuthError, AuthError } from '@/lib/auth-errors';
import { AuthCoordinator, getProfileLoadingPromise, resetAuthState } from '@/lib/auth-coordinator';

interface AuthState {
  user: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  error: AuthError | null;
  isInitialized: boolean;
}

interface AuthActions {
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, additionalData?: Partial<UserProfile>) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  clearError: () => void;
  updateUserProfileState: (data: Partial<UserProfile>) => void;
  retryLoadProfile: () => Promise<void>;
}

type AuthContextType = AuthState & AuthActions;

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [state, setState] = useState<AuthState>({
    user: null,
    userProfile: null,
    loading: true,
    error: null,
    isInitialized: false,
  });
  
  const router = useRouter();

  // Helper function to load user profile with deduplication
  const loadUserProfile = async (user: User): Promise<UserProfile | null> => {
    try {
      console.log('🔄 use-auth: Loading profile with AuthCoordinator deduplication for', user.uid);
      
      // Use AuthCoordinator for profile loading deduplication
      const result = await getProfileLoadingPromise(user.uid, async () => {
        const profileResult = await getUserProfile(user.uid);
        
        if (profileResult.success && profileResult.data) {
          return profileResult.data;
        }
        
        // If profile loading fails, throw error for proper handling
        throw new Error(profileResult.error?.message || 'Failed to load user profile');
      });
      
      return result;
      
    } catch (error) {
      authLogger.error('Profile loading failed', error as Error, {
        context: 'use-auth',
        operation: 'profile_loading',
        userId: user?.uid,
      });
      throw error;
    }
  };

  // Auth state listener
  useEffect(() => {
    if (typeof window === 'undefined') {
      setState(prev => ({ ...prev, loading: false, isInitialized: true }));
      return;
    }

    const auth = getFirebaseAuth();
    let retryTimeoutRef: NodeJS.Timeout;
    
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      
      if (user) {
        // User is signed in
        setState(prev => ({ ...prev, user, loading: true, error: null }));
        
        try {
          // Wait for AuthCoordinator to ensure auth is ready before profile loading
          console.log('⏳ use-auth: Waiting for auth coordinator to be ready...');
          const isAuthReady = await AuthCoordinator.waitForAuthReady(user);
          
          if (!isAuthReady) {
            throw new Error('Auth coordinator failed to initialize');
          }
          
          console.log('✅ use-auth: Auth coordinator ready, proceeding with profile load');
          const userProfile = await loadUserProfile(user);
          setState(prev => ({ 
            ...prev, 
            userProfile,
            loading: false,
            error: null, // Clear any previous errors
            isInitialized: true
          }));
        } catch (error) {
          const authError = parseAuthError(error);
          setState(prev => ({ 
            ...prev, 
            userProfile: null,
            loading: false,
            error: authError,
            isInitialized: true
          }));
          
          // Auto-retry after 3 seconds for network errors
          if (error instanceof Error && (
            error.message.includes('network') || 
            error.message.includes('offline') ||
            error.message.includes('unavailable') ||
            error.message.includes('Failed to get document')
          )) {
            retryTimeoutRef = setTimeout(async () => {
              try {
                const retryProfile = await loadUserProfile(user);
                setState(prev => ({ 
                  ...prev, 
                  userProfile: retryProfile,
                  error: null
                }));
              } catch (retryError) {
                // Se falhar novamente, criar perfil padrão
                const defaultProfile = {
                  cargo: '',
                  areas_atuacao: [],
                  primeiro_acesso: true,
                  initial_setup_complete: false,
                  data_criacao: new Date(),
                  workspaces: [],
                };
                setState(prev => ({ 
                  ...prev, 
                  userProfile: defaultProfile,
                  error: null
                }));
              }
            }, 3000);
          }
        }
      } else {
        // User is signed out - reset AuthCoordinator state
        console.log('👋 use-auth: User signed out, resetting auth coordinator');
        resetAuthState();
        
        setState({
          user: null,
          userProfile: null,
          loading: false,
          error: null,
          isInitialized: true,
        });
      }
    });

    return () => {
      unsubscribe();
      if (retryTimeoutRef) {
        clearTimeout(retryTimeoutRef);
      }
    };
  }, []);

  // Retry loading profile
  const retryLoadProfile = async (): Promise<void> => {
    if (!state.user) return;
    
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const userProfile = await loadUserProfile(state.user);
      setState(prev => ({ 
        ...prev, 
        userProfile,
        loading: false,
      }));
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        userProfile: null,
        loading: false,
        error: parseAuthError(error)
      }));
    }
  };

  // Auth actions
  const login = async (email: string, password: string): Promise<void> => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const auth = getFirebaseAuth();
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      
      // Não fazer redirecionamento aqui - deixar o OnboardingGuard decidir
      // O onAuthStateChanged irá detectar o login e carregar o perfil
    } catch (error) {
      const authError = parseAuthError(error);
      
      setState(prev => ({ 
        ...prev, 
        loading: false,
        error: authError
      }));
      throw error;
    }
  };

  const signup = async (email: string, password: string, additionalData?: Partial<UserProfile>): Promise<void> => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const auth = getFirebaseAuth();
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Se temos dados adicionais, criar perfil inicial
      if (additionalData && userCredential.user) {
        const { createUserProfile } = await import('@/services/user-service');
        const profileData = {
          ...additionalData,
          cargo: additionalData.cargo || '',
          areas_atuacao: additionalData.areas_atuacao || [],
          primeiro_acesso: true,
          initial_setup_complete: false,
          data_criacao: new Date(),
          workspaces: []
        };
        
        try {
          await createUserProfile(userCredential.user.uid, profileData);
        } catch (profileError) {
          // Don't throw - let auth succeed even if profile creation fails
        }
      }
      
      // Navigation will be handled by onAuthStateChanged
    } catch (error) {
      const authError = parseAuthError(error);
      
      setState(prev => ({ 
        ...prev, 
        loading: false,
        error: authError
      }));
      throw error;
    }
  };

  const loginWithGoogle = async (): Promise<void> => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const auth = getFirebaseAuth();
      const provider = getGoogleAuthProvider();
      
      try {
        // Try popup first
        const userCredential = await signInWithPopup(auth, provider);
      } catch (popupError: unknown) {
        const error = popupError as { code?: string };
        
        // If popup is blocked, use redirect
        if (error.code === 'auth/popup-blocked') {
          await signInWithRedirect(auth, provider);
          return; // Redirect will handle the rest
        }
        throw popupError;
      }
      
      // Não fazer redirecionamento aqui - deixar o OnboardingGuard decidir
      // O onAuthStateChanged irá detectar o login e carregar o perfil
    } catch (error) {
      const authError = parseAuthError(error);
      
      setState(prev => ({ 
        ...prev, 
        loading: false,
        error: authError
      }));
      throw error;
    }
  };

  const logout = async (): Promise<void> => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      // Reset AuthCoordinator state before logout
      resetAuthState();
      
      const auth = getFirebaseAuth();
      await signOut(auth);
      router.push('/login');
    } catch (error) {
      const authError = parseAuthError(error);
      
      setState(prev => ({ 
        ...prev, 
        loading: false,
        error: authError
      }));
    }
  };

  const resetPassword = async (email: string): Promise<void> => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const auth = getFirebaseAuth();
      await sendPasswordResetEmail(auth, email);
      setState(prev => ({ ...prev, loading: false }));
    } catch (error) {
      const authError = parseAuthError(error);
      
      setState(prev => ({ 
        ...prev, 
        loading: false,
        error: authError
      }));
      throw error; // Re-throw para o componente tratar
    }
  };

  const clearError = (): void => {
    setState(prev => ({ ...prev, error: null }));
  };

  const updateUserProfileState = (data: Partial<UserProfile>): void => {
    setState(prev => ({
      ...prev,
      userProfile: prev.userProfile ? { ...prev.userProfile, ...data } : null
    }));
  };

  const contextValue: AuthContextType = {
    ...state,
    login,
    signup,
    loginWithGoogle,
    logout,
    resetPassword,
    clearError,
    updateUserProfileState,
    retryLoadProfile,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// Re-export types for convenience
export type { UserProfile, AuthError };