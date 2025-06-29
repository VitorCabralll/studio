'use client';

import { getAuth, onAuthStateChanged, User, signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';

import { firebaseApp, isFirebaseConfigured } from '@/lib/firebase';
import { getUserProfile, UserProfile } from '@/services/user-service';


interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  login: () => void;
  signup: () => void;
  logout: () => void;
  updateUserProfileState: (data: Partial<UserProfile>) => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  userProfile: null,
  loading: true,
  login: () => {},
  signup: () => {},
  logout: () => {},
  updateUserProfileState: () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Persistência do mock no localStorage
  useEffect(() => {
    if (!isFirebaseConfigured) {
      const storedUser = localStorage.getItem('lexai_mock_user');
      const storedProfile = localStorage.getItem('lexai_mock_userProfile');
      if (storedUser) setUser(JSON.parse(storedUser));
      if (storedProfile) setUserProfile(JSON.parse(storedProfile));
      setLoading(false);
      return;
    }

    const auth = getAuth(firebaseApp);
    
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setLoading(true);
      try {
        if (currentUser) {
          setUser(currentUser);
          const result = await getUserProfile(currentUser.uid);
          if (result.success && result.data) {
            setUserProfile(result.data);
          } else {
            console.error('Erro ao carregar perfil do usuário:', result.error);
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
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const getMockUser = () => ({
    uid: 'test-user-123',
    email: 'test@lexai.com',
    displayName: 'Advogado Teste',
  } as User);

  const getNewMockUser = () => ({
    uid: `new-user-${Date.now()}`,
    email: 'novo@lexai.com',
    displayName: 'Novo Usuário',
  } as User);

  const login = () => {
    if (!isFirebaseConfigured) {
      setLoading(true);
      const mockUser = getMockUser();
      setUser(mockUser);
      const mockProfile = {
        cargo: 'Advogado(a)',
        areas_atuacao: ['Direito Civil'],
        primeiro_acesso: false,
        initial_setup_complete: true,
        data_criacao: new Date() as any,
        workspaces: [{ name: "Workspace Pessoal" }],
      };
      setUserProfile(mockProfile);
      // Persistir no localStorage
      localStorage.setItem('lexai_mock_user', JSON.stringify(mockUser));
      localStorage.setItem('lexai_mock_userProfile', JSON.stringify(mockProfile));
      setLoading(false);
      router.push('/');
    }
  };

  const signup = () => {
    if (!isFirebaseConfigured) {
      setLoading(true);
      const newUser = getNewMockUser();
      setUser(newUser);
      const newUserProfile: UserProfile = {
        cargo: '',
        areas_atuacao: [],
        primeiro_acesso: true,
        initial_setup_complete: false,
        data_criacao: new Date() as any,
        workspaces: [],
      };
      setUserProfile(newUserProfile);
      // Persistir no localStorage
      localStorage.setItem('lexai_mock_user', JSON.stringify(newUser));
      localStorage.setItem('lexai_mock_userProfile', JSON.stringify(newUserProfile));
      setLoading(false);
      router.push('/onboarding');
    }
  };

  const logout = () => {
    if (!isFirebaseConfigured) {
      setUser(null);
      setUserProfile(null);
      localStorage.removeItem('lexai_mock_user');
      localStorage.removeItem('lexai_mock_userProfile');
      router.push('/login');
    } else {
      const auth = getAuth(firebaseApp);
      signOut(auth);
    }
  };

  const updateUserProfileState = (data: Partial<UserProfile>) => {
    setUserProfile(prev => {
      const updated = prev ? { ...prev, ...data } : null;
      if (!isFirebaseConfigured && updated) {
        localStorage.setItem('lexai_mock_userProfile', JSON.stringify(updated));
      }
      return updated;
    });
  };

  return (
    <AuthContext.Provider value={{ user, userProfile, loading, login, signup, logout, updateUserProfileState }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export type { UserProfile };
