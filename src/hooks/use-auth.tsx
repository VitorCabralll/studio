'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { 
  User, 
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
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
}

interface AuthActions {
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
  updateUserProfileState: (data: Partial<UserProfile>) => void;
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
  });
  
  const router = useRouter();

  // Auth state listener
  useEffect(() => {
    if (typeof window === 'undefined') {
      setState(prev => ({ ...prev, loading: false }));
      return;
    }

    const auth = getFirebaseAuth();
    
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      try {
        if (user) {
          // User is signed in - set user first
          setState(prev => ({ ...prev, user, loading: true, error: null }));
          
          // Load user profile with timeout
          const profilePromise = getUserProfile(user.uid);
          const timeoutPromise = new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Profile load timeout')), 10000)
          );
          
          try {
            const profileResult = await Promise.race([profilePromise, timeoutPromise]) as any;
            
            if (profileResult.success && profileResult.data) {
              setState(prev => ({ 
                ...prev, 
                userProfile: profileResult.data,
                loading: false 
              }));
            } else {
              // Profile loading failed, but keep user authenticated
              setState(prev => ({ 
                ...prev, 
                userProfile: null,
                loading: false,
                error: profileResult.error ? parseAuthError(profileResult.error) : null
              }));
            }
          } catch (profileError) {
            console.warn('Profile load failed:', profileError);
            // Keep user authenticated even if profile fails
            setState(prev => ({ 
              ...prev, 
              userProfile: null,
              loading: false,
              error: parseAuthError(profileError)
            }));
          }
        } else {
          // User is signed out
          setState({
            user: null,
            userProfile: null,
            loading: false,
            error: null,
          });
        }
      } catch (error) {
        console.error('Auth state change error:', error);
        setState(prev => ({
          ...prev,
          loading: false,
          error: parseAuthError(error)
        }));
      }
    });

    return unsubscribe;
  }, []);

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
      router.push('/onboarding');
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
      
      // Router will be handled by auth state change
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