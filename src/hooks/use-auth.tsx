'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { getAuth, onAuthStateChanged, User, signOut } from 'firebase/auth';
import { getUserProfile, UserProfile } from '@/services/user-service';
import { firebaseApp, isFirebaseConfigured } from '@/lib/firebase';
import { useRouter } from 'next/navigation';

interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  login: () => void;
  logout: () => void;
  updateUserProfileState: (data: Partial<UserProfile>) => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  userProfile: null,
  loading: true,
  login: () => {},
  logout: () => {},
  updateUserProfileState: () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const getMockUser = () => ({
    uid: 'test-user-123',
    email: 'test@lexai.com',
    displayName: 'Advogado Teste',
  } as User);

  const login = () => {
    if (!isFirebaseConfigured) {
      setLoading(true);
      setUser(getMockUser());
      // Simulate a user who has already completed onboarding and has a workspace
      setUserProfile({
        cargo: 'Advogado(a)',
        areas_atuacao: ['Direito Civil'],
        primeiro_acesso: false,
        initial_setup_complete: true,
        data_criacao: new Date() as any,
        workspaces: [{ name: "Workspace Pessoal" }],
      });
      setLoading(false);
      router.push('/');
    }
  };

  const logout = () => {
    if (!isFirebaseConfigured) {
      setUser(null);
      setUserProfile(null);
      router.push('/login');
    } else {
      const auth = getAuth(firebaseApp);
      signOut(auth);
    }
  };

  const updateUserProfileState = (data: Partial<UserProfile>) => {
    setUserProfile(prev => (prev ? { ...prev, ...data } : null));
  };

  useEffect(() => {
    // In mock mode, auth state is handled by login/logout buttons
    if (!isFirebaseConfigured) {
      setLoading(false);
      return;
    }

    const auth = getAuth(firebaseApp);
    
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setLoading(true);
      if (currentUser) {
        setUser(currentUser);
        const profile = await getUserProfile(currentUser.uid);
        setUserProfile(profile);
      } else {
        setUser(null);
        setUserProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, userProfile, loading, login, logout, updateUserProfileState }}>
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
