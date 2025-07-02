'use client';

import { getAuth, onAuthStateChanged, User, signOut, signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';

import { getFirebaseAuth } from '@/lib/firebase';
import { getUserProfile, UserProfile } from '@/services/user-service';

/**
 * Context type for authentication state and methods.
 * Provides complete authentication functionality for the LexAI application.
 */
interface AuthContextType {
  /** Current authenticated Firebase user or null if not logged in */
  user: User | null;
  /** Extended user profile data from Firestore or null if not loaded */
  userProfile: UserProfile | null;
  /** Whether authentication state is being determined */
  loading: boolean;
  /** Current authentication error message or null */
  error: string | null;
  /** 
   * Login with email and password
   * @param email - User's email address
   * @param password - User's password
   */
  login: (email: string, password: string) => Promise<void>;
  /** 
   * Create new account with email and password
   * @param email - User's email address
   * @param password - User's password  
   * @param userData - Optional additional user data for profile creation
   */
  signup: (email: string, password: string, userData?: any) => Promise<void>;
  /** Login using Google OAuth popup */
  loginWithGoogle: () => Promise<void>;
  /** Sign out current user and clear state */
  logout: () => void;
  /** 
   * Update user profile state locally (for optimistic updates)
   * @param data - Partial profile data to update
   */
  updateUserProfileState: (data: Partial<UserProfile>) => void;
  /** Clear current error state */
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  userProfile: null,
  loading: true,
  error: null,
  login: async () => {},
  signup: async () => {},
  loginWithGoogle: async () => {},
  logout: () => {},
  updateUserProfileState: () => {},
  clearError: () => {},
});

/**
 * Authentication Provider component that manages Firebase auth state and user profiles.
 * 
 * Features:
 * - Firebase Authentication integration
 * - Automatic profile loading from Firestore
 * - Google OAuth support
 * - Race condition prevention
 * - Automatic redirection based on user state
 * 
 * @param children - React children to wrap with auth context
 * @returns JSX element providing authentication context
 * 
 * @example
 * ```tsx
 * <AuthProvider>
 *   <App />
 * </AuthProvider>
 * ```
 */
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [authProcessing, setAuthProcessing] = useState(false);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  // Initialize Firebase auth state listener
  useEffect(() => {
    let isComponentMounted = true;
    setMounted(true);
    
    const auth = getFirebaseAuth();
    
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      // Prevenir race conditions com abort controller
      if (!isComponentMounted) {
        console.log('Componente desmontado, ignorando mudança de auth');
        return;
      }
      
      // Timeout para evitar locks permanentes
      const processingTimeout = setTimeout(() => {
        if (isComponentMounted) {
          setAuthProcessing(false);
          setLoading(false);
        }
      }, 10000); // 10 segundos timeout
      
      setAuthProcessing(true);
      setLoading(true);
      
      try {
        if (currentUser) {
          setUser(currentUser);
          
          // Buscar ou criar perfil do usuário
          const result = await getUserProfile(currentUser.uid);
          if (result.success && result.data) {
            setUserProfile(result.data);
            console.log('Perfil carregado com sucesso:', result.data);
          } else {
            console.error('Erro ao carregar/criar perfil do usuário:', result.error);
            // Mesmo com erro, manter o usuário logado mas sem perfil
            setUserProfile(null);
          }
        } else {
          setUser(null);
          setUserProfile(null);
        }
      } catch (error) {
        console.error('Erro não tratado no onAuthStateChanged:', error);
        setUser(null);
        setUserProfile(null);
      } finally {
        clearTimeout(processingTimeout);
        // Só atualizar estados se componente ainda estiver montado
        if (isComponentMounted) {
          setLoading(false);
          setAuthProcessing(false);
        }
      }
    });

    return () => {
      isComponentMounted = false;
      setMounted(false);
      unsubscribe();
    };
  }, []); // Remover dependências que podem causar loops

  const login = async (email: string, password: string) => {
    if (authProcessing) {
      console.log('Auth processing em andamento, ignorando login');
      return;
    }
    
    try {
      setError(null);
      
      const auth = getFirebaseAuth();
      await signInWithEmailAndPassword(auth, email, password);
      router.push('/');
    } catch (error: any) {
      console.error('Erro no login:', error);
      setError(error.message || 'Erro ao fazer login');
    } finally {
      setLoading(false);
    }
  };

  const signup = async (email: string, password: string, userData?: any) => {
    if (authProcessing) {
      console.log('Auth processing em andamento, ignorando signup');
      return;
    }
    
    try {
      setError(null);
      
      const auth = getFirebaseAuth();
      await createUserWithEmailAndPassword(auth, email, password);
      router.push('/onboarding');
    } catch (error: any) {
      console.error('Erro no cadastro:', error);
      setError(error.message || 'Erro ao criar conta');
    } finally {
      setLoading(false);
    }
  };

  const loginWithGoogle = async () => {
    if (authProcessing) {
      console.log('Auth processing em andamento, ignorando Google login');
      return;
    }
    
    try {
      setError(null);
      
      const auth = getFirebaseAuth();
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      
      // Não redirecionar nem fazer mais nada - onAuthStateChanged cuidará de tudo
      console.log('Login com Google realizado com sucesso');
    } catch (error: any) {
      console.error('Erro no login com Google:', error);
      setError(error.message || 'Erro ao fazer login com Google');
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    const auth = getFirebaseAuth();
    signOut(auth);
  };

  const updateUserProfileState = (data: Partial<UserProfile>) => {
    setUserProfile(prev => {
      const updated = prev ? { ...prev, ...data } : null;
      return updated;
    });
  };

  const clearError = () => {
    setError(null);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      userProfile, 
      loading, 
      error, 
      login, 
      signup, 
      loginWithGoogle, 
      logout, 
      updateUserProfileState,
      clearError 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

/**
 * Hook to access authentication context and methods.
 * 
 * Must be used within an AuthProvider component.
 * 
 * @returns AuthContextType with current auth state and methods
 * 
 * @throws Error if used outside of AuthProvider
 * 
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { user, loading, login, logout } = useAuth();
 *   
 *   if (loading) return <div>Loading...</div>;
 *   
 *   return (
 *     <div>
 *       {user ? (
 *         <button onClick={logout}>Logout {user.email}</button>
 *       ) : (
 *         <button onClick={() => login('email', 'password')}>Login</button>
 *       )}
 *     </div>
 *   );
 * }
 * ```
 */
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export type { UserProfile };