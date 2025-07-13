/**
 * useAuth V2 - Hook principal refatorado com separated concerns
 * Orquestra todos os hooks especializados
 */

'use client';

import { createContext, useContext, useEffect, ReactNode } from 'react';
import { User } from 'firebase/auth';
import { useAuthState } from './use-auth-state';
import { useAuthNavigation } from './use-auth-navigation';
import { useAuthOperations } from './use-auth-operations';
import { useUserProfile } from './use-user-profile';
import { UserProfile } from '@/lib/auth/types';
import { waitForAuthReady, getAuthState } from '@/lib/auth-coordinator';

// ===== TYPES =====

interface AuthError {
  code?: string;
  message: string;
}

interface AuthContextValue {
  // State
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  error: AuthError | null;
  isAuthenticated: boolean;
  isAuthReady: boolean;
  isInitialized: boolean;
  
  // Operations
  login: (email: string, password: string) => Promise<User>;
  signup: (email: string, password: string) => Promise<User>;
  loginWithGoogle: () => Promise<User>;
  logout: () => Promise<void>;
  
  // Profile operations
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
  createProfile: (data: Partial<UserProfile>) => Promise<void>;
  
  // Utilities
  clearError: () => void;
  navigateToLogin: (redirectTo?: string) => void;
  navigateToWorkspace: () => void;
  
  // Backward compatibility
  userProfile: UserProfile | null;
  updateUserProfileState: (data: Partial<UserProfile>) => void;
  resetPassword: (email: string) => Promise<void>;
}

// ===== CONTEXT =====

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

/**
 * AuthProvider V2 - Usa arquitetura modular
 */
export function AuthProvider({ children }: AuthProviderProps) {
  // Initialize specialized hooks
  const authState = useAuthState();
  const navigation = useAuthNavigation();
  const operations = useAuthOperations({ authState, navigation });
  const userProfile = useUserProfile(authState.user);

  // Wait for auth to be ready when user changes
  useEffect(() => {
    if (authState.user && !authState.isAuthReady) {
      waitForAuthReady(authState.user).then((isReady) => {
        if (isReady) {
          const coordinatorState = getAuthState();
          authState.setAuthState(coordinatorState);
        }
      });
    }
  }, [authState.user, authState.isAuthReady]);

  // Profile operations that include user ID
  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!authState.user?.uid) {
      throw new Error('No authenticated user');
    }
    return userProfile.updateProfile(authState.user.uid, updates);
  };

  const createProfile = async (data: Partial<UserProfile>) => {
    if (!authState.user?.uid) {
      throw new Error('No authenticated user');
    }
    return userProfile.createProfile(authState.user.uid, data);
  };

  // Backward compatibility
  const updateUserProfileState = (data: Partial<UserProfile>) => {
    // This was used to update local state, now we should update the actual profile
    if (authState.user?.uid) {
      updateProfile(data).catch((error) => {
        // Silent profile update failure - not critical for auth flow
        const profileError = new Error(`Profile update failed: ${error.message}`);
        profileError.cause = error;
        // Log only in development
        if (process.env.NODE_ENV === 'development') {
          console.warn('Profile update failed:', profileError);
        }
      });
    }
  };

  // Reset password implementation
  const resetPassword = async (email: string) => {
    const { sendPasswordResetEmail } = await import('firebase/auth');
    const auth = (await import('@/lib/firebase')).getFirebaseAuth();
    return sendPasswordResetEmail(auth, email);
  };

  const contextValue: AuthContextValue = {
    // State from specialized hooks
    user: authState.user,
    profile: userProfile.profile,
    loading: authState.loading || userProfile.loading || operations.isOperationInProgress,
    error: authState.error || userProfile.error,
    isAuthenticated: authState.isAuthenticated,
    isAuthReady: authState.isAuthReady,
    isInitialized: !authState.loading,

    // Operations
    login: operations.login,
    signup: operations.signup,
    loginWithGoogle: operations.loginWithGoogle,
    logout: operations.logout,

    // Profile operations
    updateProfile,
    createProfile,

    // Utilities
    clearError: () => {
      authState.clearError();
      userProfile.clearError();
    },
    navigateToLogin: navigation.navigateToLogin,
    navigateToWorkspace: () => navigation.navigateToWorkspace(),

    // Backward compatibility
    userProfile: userProfile.profile,
    updateUserProfileState,
    resetPassword
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

/**
 * Hook to use auth context
 */
export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
}

/**
 * HOC for components that require authentication
 */
export function withAuth<P extends object>(Component: React.ComponentType<P>) {
  return function AuthenticatedComponent(props: P) {
    const { isAuthenticated, isInitialized, navigateToLogin } = useAuth();

    useEffect(() => {
      if (isInitialized && !isAuthenticated) {
        navigateToLogin();
      }
    }, [isInitialized, isAuthenticated, navigateToLogin]);

    if (!isInitialized) {
      return <div>Loading...</div>; // Or your loading component
    }

    if (!isAuthenticated) {
      return <div>Redirecting...</div>; // Or your redirect component
    }

    return <Component {...props} />;
  };
}

/**
 * Hook for getting just auth state (lighter than full useAuth)
 */
export function useAuthUser() {
  const { user, isAuthenticated, isAuthReady, loading } = useAuth();
  
  return {
    user,
    isAuthenticated,
    isAuthReady,
    loading
  };
}

/**
 * Hook for getting just profile data
 */
export function useProfile() {
  const { profile, updateProfile, createProfile } = useAuth();
  
  return {
    profile,
    updateProfile,
    createProfile
  };
}

// Export types for external use
export type { AuthError, AuthContextValue };