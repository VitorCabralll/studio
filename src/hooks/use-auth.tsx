
'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { getAuth, onAuthStateChanged, User, signOut } from 'firebase/auth';
import { getUserProfile, UserProfile } from '@/services/user-service';
import { firebaseApp, isFirebaseConfigured } from '@/lib/firebase';

interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  login: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  userProfile: null,
  loading: true,
  login: () => {},
  logout: () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const getMockUser = () => ({
    uid: 'test-user-123',
    email: 'test@lexai.com',
    displayName: 'Advogado Teste',
  } as User);

  const getMockProfile = (): UserProfile => ({
    cargo: 'Advogado(a)',
    areas_atuacao: ['Direito Civil', 'Direito Penal'],
    primeiro_acesso: false,
    data_criacao: new Date() as any,
  });

  const login = () => {
    if (!isFirebaseConfigured) {
      setLoading(true);
      setUser(getMockUser());
      setUserProfile(getMockProfile());
      setLoading(false);
    }
    // In a real app, this would trigger the full Firebase login flow.
    // For testing, this function allows the login page button to "log in" the mock user.
  };

  const logout = () => {
    if (!isFirebaseConfigured) {
      setUser(null);
      setUserProfile(null);
    } else {
      const auth = getAuth(firebaseApp);
      signOut(auth);
    }
  };

  useEffect(() => {
    // If firebase is not configured, we start "logged in" for easier testing of authenticated pages.
    if (!isFirebaseConfigured) {
      login();
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
    <AuthContext.Provider value={{ user, userProfile, loading, login, logout }}>
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
