'use client';

/**
 * Sistema de Autenticação Unificado - LexAI
 * Sistema robusto e confiável para autenticação Firebase
 */

import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { 
  User,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail
} from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { getFirebaseAuth, getFirebaseDb } from '@/lib/firebase';

// Tipos aprimorados
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

interface AuthError {
  code: string;
  message: string;
}

interface SimpleAuthState {
  user: User | null;
  profile: UserProfile | null;
  userProfile: UserProfile | null; // Alias for compatibility
  loading: boolean;
  error: AuthError | null;
  isInitialized: boolean;
}

interface SignupData {
  email: string;
  password: string;
  name?: string;
  phone?: string;
  company?: string;
  oab?: string;
}

interface SimpleAuthContextType extends SimpleAuthState {
  // Actions
  login: (email: string, password: string) => Promise<void>;
  signup: (data: SignupData) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  clearError: () => void;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
  updateUserProfileState: (data: Partial<UserProfile>) => void;
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
    userProfile: null,
    loading: true,
    error: null,
    isInitialized: false
  });

  const router = useRouter();

  const auth = getFirebaseAuth();
  const db = getFirebaseDb();

  // Parse Firebase Auth errors into user-friendly messages
  const parseAuthError = (error: any): AuthError => {
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
      'auth/invalid-credential': 'Credenciais inválidas. Verifique email e senha.',
    };

    return {
      code: error.code || 'unknown',
      message: errorMessages[error.code] || 'Erro de autenticação. Tente novamente.'
    };
  };

  // Criar perfil padrão
  const createDefaultProfile = (user: User, additionalData?: Partial<UserProfile>): UserProfile => ({
    name: additionalData?.name || user.displayName || '',
    displayName: additionalData?.name || user.displayName || '',
    email: user.email || '',
    phone: additionalData?.phone || '',
    company: additionalData?.company || '',
    oab: additionalData?.oab || '',
    cargo: '',
    areas_atuacao: [],
    primeiro_acesso: true,
    initial_setup_complete: false,
    data_criacao: serverTimestamp(),
    workspaces: []
  });

  // Buscar ou criar perfil
  const getOrCreateProfile = async (user: User, additionalData?: Partial<UserProfile>): Promise<UserProfile> => {
    try {
      const docRef = doc(db, 'usuarios', user.uid);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        // Perfil existe - merge com dados adicionais se fornecidos
        const existingProfile = docSnap.data() as UserProfile;
        if (additionalData) {
          const updatedProfile = { ...existingProfile, ...additionalData };
          await setDoc(docRef, updatedProfile, { merge: true });
          return updatedProfile;
        }
        return existingProfile;
      } else {
        // Criar perfil novo com dados adicionais
        const newProfile = createDefaultProfile(user, additionalData);
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
        profile: prev.profile ? { ...prev.profile, ...updates } : null,
        userProfile: prev.userProfile ? { ...prev.userProfile, ...updates } : null
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
      setState(prev => ({ ...prev, profile, userProfile: profile }));
    } catch (error) {
      console.error('Erro ao recarregar perfil:', error);
      setState(prev => ({ ...prev, error: parseAuthError(error) }));
    }
  };

  // Login com logging detalhado
  const login = async (email: string, password: string) => {
    console.log('🔐 [AUTH] Iniciando login para:', email);
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      console.log('🔐 [AUTH] Tentando signInWithEmailAndPassword...');
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log('✅ [AUTH] Login bem-sucedido:', userCredential.user.uid);
      // onAuthStateChanged irá lidar com o resto
    } catch (error: any) {
      console.error('❌ [AUTH] Erro no login:', {
        code: error.code,
        message: error.message,
        email: email,
        timestamp: new Date().toISOString()
      });
      
      setState(prev => ({ 
        ...prev, 
        loading: false, 
        error: parseAuthError(error)
      }));
      throw error;
    }
  };

  // Signup com dados extras e logging detalhado
  const signup = async (data: SignupData) => {
    console.log('📝 [AUTH] Iniciando cadastro para:', data.email);
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      console.log('📝 [AUTH] Criando usuário no Firebase Auth...');
      const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
      console.log('✅ [AUTH] Usuário criado com sucesso:', userCredential.user.uid);
      
      // Criar perfil imediatamente com dados do formulário
      const additionalData = {
        name: data.name,
        phone: data.phone,
        company: data.company,
        oab: data.oab
      };
      
      console.log('📝 [AUTH] Criando perfil do usuário no Firestore...', additionalData);
      await getOrCreateProfile(userCredential.user, additionalData);
      console.log('✅ [AUTH] Perfil criado com sucesso');
      
    } catch (error: any) {
      console.error('❌ [AUTH] Erro no cadastro:', {
        code: error.code,
        message: error.message,
        email: data.email,
        timestamp: new Date().toISOString()
      });
      
      setState(prev => ({ 
        ...prev, 
        loading: false, 
        error: parseAuthError(error)
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
        error: parseAuthError(error)
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
        userProfile: null,
        loading: false,
        error: null,
        isInitialized: true
      });
      router.push('/login');
    } catch (error: any) {
      console.error('Erro no logout:', error);
    }
  };

  // Reset password
  const resetPassword = async (email: string): Promise<void> => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      await sendPasswordResetEmail(auth, email);
      setState(prev => ({ ...prev, loading: false }));
    } catch (error: any) {
      setState(prev => ({ 
        ...prev, 
        loading: false,
        error: parseAuthError(error)
      }));
      throw error;
    }
  };

  // Clear error
  const clearError = (): void => {
    setState(prev => ({ ...prev, error: null }));
  };

  // Update user profile state
  const updateUserProfileState = (data: Partial<UserProfile>): void => {
    setState(prev => ({
      ...prev,
      profile: prev.profile ? { ...prev.profile, ...data } : null,
      userProfile: prev.userProfile ? { ...prev.userProfile, ...data } : null,
    }));
  };

  // Listener principal com logging detalhado
  useEffect(() => {
    console.log('🎧 [AUTH] Configurando listener de estado de autenticação...');
    
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Usuário logado
        console.log('👤 [AUTH] Usuário detectado:', user.uid, user.email);
        try {
          setState(prev => ({ ...prev, loading: true, error: null }));
          
          // Buscar/criar perfil
          console.log('📊 [AUTH] Carregando perfil do usuário...');
          const profile = await getOrCreateProfile(user);
          console.log('✅ [AUTH] Perfil carregado com sucesso:', profile.name || 'Sem nome');
          
          setState({
            user,
            profile,
            userProfile: profile,
            loading: false,
            error: null,
            isInitialized: true
          });
          
        } catch (error: any) {
          console.error('❌ [AUTH] Erro ao carregar perfil do usuário:', error);
          setState({
            user,
            profile: null,
            userProfile: null,
            loading: false,
            error: parseAuthError(error),
            isInitialized: true
          });
        }
      } else {
        // Usuário deslogado
        console.log('🚪 [AUTH] Usuário deslogado ou não autenticado');
        setState({
          user: null,
          profile: null,
          userProfile: null,
          loading: false,
          error: null,
          isInitialized: true
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
    resetPassword,
    clearError,
    updateProfile,
    updateUserProfileState,
    refetchProfile
  };

  return (
    <SimpleAuthContext.Provider value={value}>
      {children}
    </SimpleAuthContext.Provider>
  );
}

// Alias para compatibilidade com código existente
export const useAuth = useSimpleAuth;
export const AuthProvider = SimpleAuthProvider;

// Export types for convenience
export type { AuthError, SignupData };