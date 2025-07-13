/**
 * Stub temporário - funcionalidade será migrada para use-auth principal
 */

'use client';

import { useState, useEffect } from 'react';
import { User } from 'firebase/auth';

interface AuthError {
  code?: string;
  message: string;
}

interface AuthState {
  user: User | null;
  loading: boolean;
  error: AuthError | null;
  isAuthenticated: boolean;
  isAuthReady: boolean;
  setAuthState: (state: any) => void;
  clearError: () => void;
}

export function useAuthState(): AuthState {
  const [state, setState] = useState<AuthState>({
    user: null,
    loading: true,
    error: null,
    isAuthenticated: false,
    isAuthReady: false,
    setAuthState: (newState: any) => setState(prev => ({ ...prev, ...newState })),
    clearError: () => setState(prev => ({ ...prev, error: null }))
  });

  useEffect(() => {
    // Implementação básica - será migrada
    import('@/lib/firebase').then(({ getFirebaseAuth }) => {
      import('firebase/auth').then(({ onAuthStateChanged }) => {
        const auth = getFirebaseAuth();
        const unsubscribe = onAuthStateChanged(auth, (user) => {
          setState(prev => ({
            ...prev,
            user,
            loading: false,
            isAuthenticated: !!user,
            isAuthReady: true
          }));
        });
        return unsubscribe;
      });
    });
  }, []);

  return state;
}