/**
 * Profile Query Hook - React Query integration for ProfileManager
 * Integra ProfileManager com React Query para caching otimizado
 */

'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib/performance/query-client';
import { UserProfile } from '@/lib/auth/types';
import { createAuthContainer } from '@/lib/auth/dependency-container';
import { IProfileManager, DI_TOKENS } from '@/lib/auth/interfaces';

import { AuthRetryStrategies } from '@/lib/performance/retry-strategies';

/**
 * Hook para obter perfil de usuário com React Query
 */
export function useProfileQuery(uid: string | null | undefined) {
  return useQuery({
    queryKey: queryKeys.auth.profile(uid || ''),
    queryFn: async () => {
      if (!uid) {
        throw new Error('UID is required for profile query');
      }

      return AuthRetryStrategies.retryProfileLoad(async () => {
        const container = createAuthContainer();
        const profileManager = container.resolve<IProfileManager>(DI_TOKENS.PROFILE_MANAGER);
        
        const profile = await profileManager.getProfile(uid);
        
        if (!profile) {
          throw new Error('Profile not found');
        }
        
        return profile;
      });
    },
    enabled: !!uid,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
    select: (result) => {
      // Extract data from retry result
      if (result.success && result.result) {
        return result.result;
      }
      throw result.error || new Error('Profile query failed');
    },
    throwOnError: false, // Handle errors gracefully
  });
}

/**
 * Hook para criar perfil de usuário
 */
export function useCreateProfileMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ uid, data }: { uid: string; data: Partial<UserProfile> }) => {
      const result = await AuthRetryStrategies.retryProfileLoad(async () => {
        const container = createAuthContainer();
        const profileManager = container.resolve<IProfileManager>(DI_TOKENS.PROFILE_MANAGER);
        
        return await profileManager.createProfile(uid, data);
      });

      if (result.success && result.result) {
        return result.result;
      }
      throw result.error || new Error('Profile creation failed');
    },
    onSuccess: (data, { uid }) => {
      // Invalidate and update cache
      queryClient.setQueryData(queryKeys.auth.profile(uid), data);
      queryClient.invalidateQueries({ queryKey: queryKeys.auth.root });
    },
    onError: (error, { uid }) => {
      console.error('Profile creation failed:', error);
      // Invalidate queries to refresh state
      queryClient.invalidateQueries({ queryKey: queryKeys.auth.profile(uid) });
    }
  });
}

/**
 * Hook para atualizar perfil de usuário
 */
export function useUpdateProfileMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ uid, updates }: { uid: string; updates: Partial<UserProfile> }) => {
      const result = await AuthRetryStrategies.retryProfileLoad(async () => {
        const container = createAuthContainer();
        const profileManager = container.resolve<IProfileManager>(DI_TOKENS.PROFILE_MANAGER);
        
        return await profileManager.updateProfile(uid, updates);
      });

      if (result.success && result.result) {
        return result.result;
      }
      throw result.error || new Error('Profile update failed');
    },
    onMutate: async ({ uid, updates }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: queryKeys.auth.profile(uid) });

      // Snapshot previous value
      const previousProfile = queryClient.getQueryData<UserProfile>(queryKeys.auth.profile(uid));

      // Optimistically update cache
      if (previousProfile) {
        queryClient.setQueryData<UserProfile>(queryKeys.auth.profile(uid), {
          ...previousProfile,
          ...updates,
          updatedAt: Date.now()
        });
      }

      return { previousProfile };
    },
    onError: (error, { uid }, context) => {
      console.error('Profile update failed:', error);
      
      // Rollback on error
      if (context?.previousProfile) {
        queryClient.setQueryData(queryKeys.auth.profile(uid), context.previousProfile);
      }
    },
    onSettled: (data, error, { uid }) => {
      // Always refetch after mutation
      queryClient.invalidateQueries({ queryKey: queryKeys.auth.profile(uid) });
    }
  });
}

/**
 * Hook para deletar perfil de usuário
 */
export function useDeleteProfileMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (uid: string) => {
      const result = await AuthRetryStrategies.retryProfileLoad(async () => {
        const container = createAuthContainer();
        const profileManager = container.resolve<IProfileManager>(DI_TOKENS.PROFILE_MANAGER);
        
        await profileManager.deleteProfile(uid);
        return true;
      });

      if (result.success) {
        return true;
      }
      throw result.error || new Error('Profile deletion failed');
    },
    onSuccess: (_, uid) => {
      // Remove from cache and invalidate related queries
      queryClient.removeQueries({ queryKey: queryKeys.auth.profile(uid) });
      queryClient.invalidateQueries({ queryKey: queryKeys.auth.root });
    },
    onError: (error) => {
      console.error('Profile deletion failed:', error);
    }
  });
}

/**
 * Hook para verificar se perfil existe
 */
export function useProfileExistsQuery(uid: string | null | undefined) {
  return useQuery({
    queryKey: [...queryKeys.auth.profile(uid || ''), 'exists'],
    queryFn: async () => {
      if (!uid) {
        return false;
      }

      const result = await AuthRetryStrategies.retryProfileLoad(async () => {
        const container = createAuthContainer();
        const profileManager = container.resolve<IProfileManager>(DI_TOKENS.PROFILE_MANAGER);
        
        return await profileManager.profileExists(uid);
      });

      if (result.success && result.result !== undefined) {
        return result.result;
      }
      
      return false;
    },
    enabled: !!uid,
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}

/**
 * Hook para obter métricas de cache do ProfileManager
 */
export function useProfileCacheMetrics() {
  return useQuery({
    queryKey: ['profile', 'cache', 'metrics'],
    queryFn: async () => {
      const container = createAuthContainer();
      const profileManager = container.resolve<IProfileManager>(DI_TOKENS.PROFILE_MANAGER);
      
      return profileManager.getCacheMetrics();
    },
    staleTime: 30 * 1000, // 30 seconds
    refetchInterval: 60 * 1000, // Refetch every minute
    enabled: process.env.NODE_ENV === 'development', // Only in dev
  });
}

/**
 * Hook para pré-carregar perfis em batch
 */
export function usePreloadProfilesMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (uids: string[]) => {
      const result = await AuthRetryStrategies.retryProfileLoad(async () => {
        const container = createAuthContainer();
        const profileManager = container.resolve<IProfileManager>(DI_TOKENS.PROFILE_MANAGER);
        
        await profileManager.preloadProfiles?.(uids);
        return uids;
      });

      if (result.success) {
        return result.result || uids;
      }
      throw result.error || new Error('Profile preloading failed');
    },
    onSuccess: (uids) => {
      console.log(`✅ Preloaded ${uids.length} profiles`);
      // Invalidate queries to pick up preloaded data
      uids.forEach(uid => {
        queryClient.invalidateQueries({ queryKey: queryKeys.auth.profile(uid) });
      });
    },
    onError: (error) => {
      console.error('Profile preloading failed:', error);
    }
  });
}

/**
 * Utility hook para invalidar cache de perfil
 */
export function useInvalidateProfile() {
  const queryClient = useQueryClient();

  return {
    invalidateProfile: (uid: string) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.auth.profile(uid) });
    },
    invalidateAllProfiles: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.auth.root });
    },
    removeProfile: (uid: string) => {
      queryClient.removeQueries({ queryKey: queryKeys.auth.profile(uid) });
    }
  };
}

/**
 * Hook combinado para operações completas de perfil
 */
export function useProfile(uid: string | null | undefined) {
  const profileQuery = useProfileQuery(uid);
  const updateMutation = useUpdateProfileMutation();
  const deleteMutation = useDeleteProfileMutation();
  const { invalidateProfile } = useInvalidateProfile();

  return {
    // Query data
    profile: profileQuery.data,
    loading: profileQuery.isLoading,
    error: profileQuery.error,
    isStale: profileQuery.isStale,
    
    // Mutations
    updateProfile: updateMutation.mutate,
    deleteProfile: deleteMutation.mutate,
    
    // Mutation states
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
    updateError: updateMutation.error,
    deleteError: deleteMutation.error,
    
    // Utilities
    refetch: profileQuery.refetch,
    invalidate: () => uid && invalidateProfile(uid),
  };
}