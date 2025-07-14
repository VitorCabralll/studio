'use client';

/**
 * Sistema de Autenticação Simples - Zero Bugs
 * Substitui o AuthCoordinator por algo direto e confiável
 */

import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { 
  User,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { getFirebaseAuth, getFirebaseDb } from '@/lib/firebase';

// Tipos simples
export interface UserProfile {
  name?: string;
  displayName?: string;
  email?: string;
  phone?: string;
  company?: string;
  oab?: string;
  cargo: string;
  areas_atuacao: string[];
  primeiro_acesso: boolean;
  initial_setup_complete: boolean;
  data_criacao: any;
  workspaces: any[];
}

interface SimpleAuthState {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  error: string | null;
}

interface SimpleAuthContextType extends SimpleAuthState {
  // Actions
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
  refetchProfile: () => Promise<void>;
}

// Context
const SimpleAuthContext = createContext<SimpleAuthContextType | null>(null);

// Hook público
export function useSimpleAuth() {
  const context = useContext(SimpleAuthContext);
  if (!context) {
    throw new Error('useSimpleAuth must be used within SimpleAuthProvider');
  }
  return context;
}

// Provider
export function SimpleAuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<SimpleAuthState>({
    user: null,
    profile: null,
    loading: true,
    error: null
  });

  const auth = getFirebaseAuth();
  const db = getFirebaseDb();

  // Criar perfil padrão
  const createDefaultProfile = (user: User): UserProfile => ({
    name: user.displayName || '',
    displayName: user.displayName || '',
    email: user.email || '',
    cargo: '',
    areas_atuacao: [],
    primeiro_acesso: true,
    initial_setup_complete: false,
    data_criacao: serverTimestamp(),
    workspaces: []
  });

  // Buscar ou criar perfil
  const getOrCreateProfile = async (user: User): Promise<UserProfile> => {
    try {
      const docRef = doc(db, 'usuarios', user.uid);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        // Perfil existe
        return docSnap.data() as UserProfile;
      } else {
        // Criar perfil novo
        const newProfile = createDefaultProfile(user);
        await setDoc(docRef, newProfile);
        return newProfile;
      }
    } catch (error) {
      console.error('Erro ao buscar/criar perfil:', error);
      throw error;
    }
  };

  // Atualizar perfil
  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!state.user) throw new Error('Usuário não autenticado');
    
    try {
      const docRef = doc(db, 'usuarios', state.user.uid);
      await setDoc(docRef, updates, { merge: true });
      
      setState(prev => ({
        ...prev,
        profile: prev.profile ? { ...prev.profile, ...updates } : null
      }));
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
      throw error;
    }
  };

  // Recarregar perfil
  const refetchProfile = async () => {
    if (!state.user) return;
    
    try {
      const profile = await getOrCreateProfile(state.user);
      setState(prev => ({ ...prev, profile }));
    } catch (error) {
      console.error('Erro ao recarregar perfil:', error);
      setState(prev => ({ ...prev, error: 'Erro ao carregar perfil' }));
    }
  };

  // Login
  const login = async (email: string, password: string) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // onAuthStateChanged irá lidar com o resto
    } catch (error: any) {
      setState(prev => ({ 
        ...prev, 
        loading: false, 
        error: error.message || 'Erro no login' 
      }));
      throw error;
    }
  };

  // Signup
  const signup = async (email: string, password: string) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      // onAuthStateChanged irá lidar com o resto
    } catch (error: any) {
      setState(prev => ({ 
        ...prev, 
        loading: false, 
        error: error.message || 'Erro no cadastro' 
      }));
      throw error;
    }
  };

  // Login Google
  const loginWithGoogle = async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const provider = new GoogleAuthProvider();
      provider.addScope('profile');
      provider.addScope('email');
      provider.setCustomParameters({ prompt: 'select_account' });
      
      await signInWithPopup(auth, provider);
      // onAuthStateChanged irá lidar com o resto
    } catch (error: any) {
      setState(prev => ({ 
        ...prev, 
        loading: false, 
        error: error.message || 'Erro no login Google' 
      }));
      throw error;
    }
  };

  // Logout
  const logout = async () => {
    try {
      await signOut(auth);
      setState({
        user: null,
        profile: null,
        loading: false,
        error: null
      });
    } catch (error: any) {
      console.error('Erro no logout:', error);
    }
  };

  // Listener principal - SIMPLES e DIRETO
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Usuário logado
        try {
          setState(prev => ({ ...prev, loading: true, error: null }));
          
          // Buscar/criar perfil
          const profile = await getOrCreateProfile(user);
          
          setState({
            user,
            profile,
            loading: false,
            error: null
          });
          
        } catch (error: any) {
          console.error('Erro ao carregar perfil do usuário:', error);
          setState({
            user,
            profile: null,
            loading: false,
            error: 'Erro ao carregar perfil'
          });
        }
      } else {
        // Usuário deslogado
        setState({
          user: null,
          profile: null,
          loading: false,
          error: null
        });
      }
    });

    return unsubscribe;
  }, []);

  const value: SimpleAuthContextType = {
    ...state,
    login,
    signup,
    loginWithGoogle,
    logout,
    updateProfile,
    refetchProfile
  };

  return (
    <SimpleAuthContext.Provider value={value}>
      {children}
    </SimpleAuthContext.Provider>
  );
}