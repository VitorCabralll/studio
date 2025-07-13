/**
 * useUserProfile - Hook especializado para gerenciamento de perfil
 * Responsabilidade única: CRUD do perfil do usuário
 */

import { useState, useEffect, useCallback } from 'react';
import { User } from 'firebase/auth';
import { UserProfile } from '@/lib/auth/types';
import { createAuthContainer } from '@/lib/auth/dependency-container';
import { IProfileManager, DI_TOKENS } from '@/lib/auth/interfaces';


export interface UserProfileHook {
  profile: UserProfile | null;
  loading: boolean;
  error: Error | null;
  loadProfile: (uid: string) => Promise<void>;
  updateProfile: (uid: string, updates: Partial<UserProfile>) => Promise<void>;
  createProfile: (uid: string, data: Partial<UserProfile>) => Promise<void>;
  clearProfile: () => void;
  clearError: () => void;
}

/**
 * Hook para gerenciamento de perfil de usuário
 */
export function useUserProfile(user: User | null): UserProfileHook {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const clearProfile = useCallback(() => {
    setProfile(null);
    setError(null);
  }, []);

  const loadProfile = useCallback(async (uid: string) => {
    if (loading) return; // Prevent concurrent loads

    setLoading(true);
    setError(null);

    try {
      const container = createAuthContainer();
      const profileManager = container.resolve<IProfileManager>(DI_TOKENS.PROFILE_MANAGER);
      
      const userProfile = await profileManager.getProfile(uid);
      setProfile(userProfile);

    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to load profile');
      setError(error);
      console.error('useUserProfile: Error loading profile', { uid, error });

    } finally {
      setLoading(false);
    }
  }, [loading]);

  const createProfile = useCallback(async (uid: string, data: Partial<UserProfile>) => {
    setLoading(true);
    setError(null);

    try {
      const container = createAuthContainer();
      const profileManager = container.resolve<IProfileManager>(DI_TOKENS.PROFILE_MANAGER);
      
      const newProfile = await profileManager.createProfile(uid, data);
      setProfile(newProfile);

    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to create profile');
      setError(error);
      console.error('useUserProfile: Error creating profile', { uid, data, error });
      throw error;

    } finally {
      setLoading(false);
    }
  }, []);

  const updateProfile = useCallback(async (uid: string, updates: Partial<UserProfile>) => {
    setLoading(true);
    setError(null);

    try {
      const container = createAuthContainer();
      const profileManager = container.resolve<IProfileManager>(DI_TOKENS.PROFILE_MANAGER);
      
      const updatedProfile = await profileManager.updateProfile(uid, updates);
      setProfile(updatedProfile);

    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to update profile');
      setError(error);
      console.error('useUserProfile: Error updating profile', { uid, updates, error });
      throw error;

    } finally {
      setLoading(false);
    }
  }, []);

  // Auto-load profile when user changes
  useEffect(() => {
    if (user?.uid && !profile) {
      loadProfile(user.uid);
    } else if (!user) {
      clearProfile();
    }
  }, [user?.uid, profile, loadProfile, clearProfile]);

  // Auto-clear errors after 10 seconds
  useEffect(() => {
    if (error) {
      const timeout = setTimeout(() => {
        setError(null);
      }, 10000);

      return () => clearTimeout(timeout);
    }
  }, [error]);

  return {
    profile,
    loading,
    error,
    loadProfile,
    updateProfile,
    createProfile,
    clearProfile,
    clearError
  };
}