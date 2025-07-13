'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { 
  User, 
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  sendPasswordResetEmail
} from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { getFirebaseAuth, getGoogleAuthProvider } from '@/lib/firebase';
import { getUserProfile, UserProfile } from '@/services/user-service';

interface AuthError {
  code: string;
  message: string;
}

interface AuthState {
  user: User | null;
  profile: UserProfile | null;
  userProfile: UserProfile | null; // Alias for compatibility
  loading: boolean;
  error: AuthError | null;
  isInitialized: boolean;
}

interface AuthActions {
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, profileData?: Partial<UserProfile>) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  clearError: () => void;
  updateUserProfileState: (data: Partial<UserProfile>) => void;
}

type AuthContextType = AuthState & AuthActions;

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

// Parse Firebase Auth errors into user-friendly messages
function parseAuthError(error: any): AuthError {
  const errorMessages: Record<string, string> = {
    'auth/user-not-found': 'Usuário não encontrado. Verifique o email.',
    'auth/wrong-password': 'Senha incorreta. Tente novamente.',
    'auth/invalid-email': 'Email inválido.',
    'auth/email-already-in-use': 'Este email já está em uso.',
    'auth/weak-password': 'Senha muito fraca. Use pelo menos 6 caracteres.',
    'auth/too-many-requests': 'Muitas tentativas. Tente novamente em alguns minutos.',
    'auth/network-request-failed': 'Erro de conexão. Verifique sua internet.',
    'auth/popup-closed-by-user': 'Login cancelado.',
    'auth/popup-blocked': 'Pop-up bloqueado. Permita pop-ups para este site.',
  };

  return {
    code: error.code || 'unknown',
    message: errorMessages[error.code] || 'Erro de autenticação. Tente novamente.'
  };
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [state, setState] = useState<AuthState>({
    user: null,
    profile: null,
    userProfile: null,
    loading: true,
    error: null,
    isInitialized: false,
  });
  
  const router = useRouter();

  // Listen to auth state changes
  useEffect(() => {
    const auth = getFirebaseAuth();
    
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // User is signed in - load profile
        setState(prev => ({ ...prev, user, loading: true, error: null }));
        
        try {
          const profile = await getUserProfile(user.uid);
          
          if (profile) {
            setState(prev => ({ 
              ...prev, 
              profile, 
              userProfile: profile,
              loading: false,
              isInitialized: true
            }));
          } else {
            // Profile não existe ainda - Cloud Function pode estar processando
            console.log('Profile not found yet - Cloud Function may still be creating it');
            setState(prev => ({ 
              ...prev, 
              profile: null,
              userProfile: null,
              loading: false,
              isInitialized: true
            }));
            
            // Retry após delay para aguardar Cloud Function
            setTimeout(async () => {
              try {
                const retryProfile = await getUserProfile(user.uid);
                if (retryProfile) {
                  setState(prev => ({ 
                    ...prev, 
                    profile: retryProfile, 
                    userProfile: retryProfile
                  }));
                }
              } catch (retryError) {
                console.error('Retry failed to load profile:', retryError);
              }
            }, 2000);
          }
        } catch (error) {
          console.error('Failed to load profile:', error);
          setState(prev => ({ 
            ...prev, 
            profile: null,
            userProfile: null,
            loading: false,
            error: parseAuthError(error),
            isInitialized: true
          }));
        }
      } else {
        // User is signed out
        setState({
          user: null,
          profile: null,
          userProfile: null,
          loading: false,
          error: null,
          isInitialized: true,
        });
      }
    });

    return unsubscribe;
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const auth = getFirebaseAuth();
      await signInWithEmailAndPassword(auth, email, password);
      // onAuthStateChanged will handle the rest
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        loading: false,
        error: parseAuthError(error)
      }));
      throw error;
    }
  };

  const signup = async (email: string, password: string, _profileData?: Partial<UserProfile>): Promise<void> => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const auth = getFirebaseAuth();
      await createUserWithEmailAndPassword(auth, email, password);
      
      // REMOVIDO: Não criar perfil aqui - a Cloud Function fará isso automaticamente
      // O perfil será criado pela Cloud Function createUserProfile quando o usuário for criado
      // profileData será aplicado posteriormente através de updateUserProfile se necessário
      
      // onAuthStateChanged will handle loading the profile created by Cloud Function
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        loading: false,
        error: parseAuthError(error)
      }));
      throw error;
    }
  };

  const loginWithGoogle = async (): Promise<void> => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const auth = getFirebaseAuth();
      const provider = getGoogleAuthProvider();
      await signInWithPopup(auth, provider);
      // onAuthStateChanged will handle the rest
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        loading: false,
        error: parseAuthError(error)
      }));
      throw error;
    }
  };

  const logout = async (): Promise<void> => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const auth = getFirebaseAuth();
      await signOut(auth);
      router.push('/login');
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        loading: false,
        error: parseAuthError(error)
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
      setState(prev => ({ 
        ...prev, 
        loading: false,
        error: parseAuthError(error)
      }));
      throw error;
    }
  };

  const clearError = (): void => {
    setState(prev => ({ ...prev, error: null }));
  };

  const updateUserProfileState = (data: Partial<UserProfile>): void => {
    setState(prev => ({
      ...prev,
      profile: prev.profile ? { ...prev.profile, ...data } : null,
      userProfile: prev.userProfile ? { ...prev.userProfile, ...data } : null,
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

// Export types for convenience
export type { UserProfile, AuthError };