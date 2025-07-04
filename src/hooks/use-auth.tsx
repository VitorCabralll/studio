'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { 
  User, 
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signInWithRedirect,
  signOut 
} from 'firebase/auth';
import { useRouter } from 'next/navigation';

import { getFirebaseAuth, getGoogleAuthProvider } from '@/lib/firebase';
import { getUserProfile, UserProfile } from '@/services/user-service';
import { parseAuthError, AuthError } from '@/lib/auth-errors';

interface AuthState {
  user: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  error: AuthError | null;
  isInitialized: boolean;
}

interface AuthActions {
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
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

  // Helper function to load user profile
  const loadUserProfile = async (user: User): Promise<UserProfile | null> => {
    try {
      const result = await getUserProfile(user.uid);
      
      if (result.success && result.data) {
        return result.data;
      }
      
      // If profile loading fails, throw error for proper handling
      throw new Error(result.error?.message || 'Failed to load user profile');
    } catch (error) {
      console.error('Profile loading error:', error);
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
    
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      console.log('🔄 Auth state changed:', { hasUser: !!user, uid: user?.uid });
      
      if (user) {
        // User is signed in
        setState(prev => ({ ...prev, user, loading: true, error: null }));
        
        try {
          const userProfile = await loadUserProfile(user);
          setState(prev => ({ 
            ...prev, 
            userProfile,
            loading: false,
            error: null, // Clear any previous errors
            isInitialized: true
          }));
        } catch (error) {
          console.error('Failed to load profile:', error);
          setState(prev => ({ 
            ...prev, 
            userProfile: null,
            loading: false,
            error: parseAuthError(error),
            isInitialized: true
          }));
          
          // Auto-retry after 3 seconds for network errors
          if (error instanceof Error && (
            error.message.includes('network') || 
            error.message.includes('offline') ||
            error.message.includes('unavailable')
          )) {
            console.log('🔄 Tentando recarregar perfil em 3 segundos...');
            setTimeout(async () => {
              try {
                const retryProfile = await loadUserProfile(user);
                setState(prev => ({ 
                  ...prev, 
                  userProfile: retryProfile,
                  error: null
                }));
              } catch (retryError) {
                console.error('Retry failed:', retryError);
              }
            }, 3000);
          }
        }
      } else {
        // User is signed out
        setState({
          user: null,
          userProfile: null,
          loading: false,
          error: null,
          isInitialized: true,
        });
      }
    });

    return unsubscribe;
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
      await signInWithEmailAndPassword(auth, email, password);
      router.push('/');
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        loading: false,
        error: parseAuthError(error)
      }));
      throw error;
    }
  };

  const signup = async (email: string, password: string): Promise<void> => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const auth = getFirebaseAuth();
      await createUserWithEmailAndPassword(auth, email, password);
      // Navigation will be handled by onAuthStateChanged
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
      
      try {
        // Try popup first
        await signInWithPopup(auth, provider);
      } catch (popupError: unknown) {
        const error = popupError as { code?: string };
        
        // If popup is blocked, use redirect
        if (error.code === 'auth/popup-blocked') {
          console.log('Popup blocked, using redirect method');
          await signInWithRedirect(auth, provider);
          return; // Redirect will handle the rest
        }
        throw popupError;
      }
      
      router.push('/');
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