/**
 * React Query Client Configuration
 * Configuração otimizada para caching e sincronização de dados de autenticação
 */

import { QueryClient, DefaultOptions } from '@tanstack/react-query';
import { retryOperation } from './retry-strategies';

/**
 * Query keys factory para consistency
 */
export const queryKeys = {
  // Auth related queries
  auth: {
    root: ['auth'] as const,
    user: () => [...queryKeys.auth.root, 'user'] as const,
    profile: (uid: string) => [...queryKeys.auth.root, 'profile', uid] as const,
    tokenValidation: (uid: string) => [...queryKeys.auth.root, 'token', uid] as const,
    authState: () => [...queryKeys.auth.root, 'state'] as const,
  },
  
  // Workspace related queries
  workspace: {
    root: ['workspace'] as const,
    list: (uid: string) => [...queryKeys.workspace.root, 'list', uid] as const,
    detail: (workspaceId: string) => [...queryKeys.workspace.root, 'detail', workspaceId] as const,
    agents: (workspaceId: string) => [...queryKeys.workspace.root, 'agents', workspaceId] as const,
  },

  // Documents and AI queries
  documents: {
    root: ['documents'] as const,
    list: (workspaceId: string) => [...queryKeys.documents.root, 'list', workspaceId] as const,
    detail: (docId: string) => [...queryKeys.documents.root, 'detail', docId] as const,
  }
} as const;

/**
 * Custom retry function with our intelligent strategy
 */
const reactQueryRetry = (failureCount: number, error: unknown) => {
  // Don't retry more than 3 times
  if (failureCount >= 3) return false;

  const errorMessage = error instanceof Error ? error.message : String(error);
  const errorCode = (error as any)?.code || '';

  // Don't retry client errors (4xx)
  if (errorCode.includes('permission-denied') || 
      errorCode.includes('unauthorized') || 
      errorCode.includes('forbidden')) {
    return false;
  }

  // Don't retry validation errors
  if (errorMessage.includes('validation') || 
      errorMessage.includes('invalid')) {
    return false;
  }

  // Retry network errors, timeouts, and server errors
  return true;
};

/**
 * Default options para React Query
 */
const defaultOptions: DefaultOptions = {
  queries: {
    // Configurações de caching otimizadas para auth
    staleTime: 5 * 60 * 1000, // 5 minutes - dados considerados fresh
    gcTime: 30 * 60 * 1000, // 30 minutes - garbage collection time
    
    // Retry configuration
    retry: reactQueryRetry,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),

    // Performance optimizations
    refetchOnWindowFocus: false, // Evitar refetch desnecessário
    refetchOnReconnect: true, // Refetch quando reconectar
    refetchOnMount: true, // Refetch quando componente monta

    // Error handling
    throwOnError: false, // Não propagar errors automaticamente
    
    // Network mode
    networkMode: 'online', // Só executar quando online
  },

  mutations: {
    // Retry para mutations críticas
    retry: (failureCount, error) => {
      if (failureCount >= 2) return false;
      
      const errorCode = (error as any)?.code || '';
      // Não retry para erros de validação ou permissão
      if (errorCode.includes('permission-denied') || 
          errorCode.includes('invalid')) {
        return false;
      }
      
      return true;
    },
    
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000),
    networkMode: 'online',
  }
};

/**
 * Create optimized QueryClient for auth operations
 */
export function createAuthQueryClient(): QueryClient {
  const queryClient = new QueryClient({
    defaultOptions,
  });

  // Add custom logging in development
  if (process.env.NODE_ENV === 'development') {
    queryClient.getQueryCache().subscribe((event) => {
      console.log('📊 QueryClient Event:', event);
    });
  }

  return queryClient;
}

/**
 * Utility functions for query operations
 */
export class QueryUtils {
  private static client: QueryClient | null = null;

  static setClient(client: QueryClient) {
    this.client = client;
  }

  static getClient(): QueryClient {
    if (!this.client) {
      throw new Error('QueryClient not initialized. Call QueryUtils.setClient() first.');
    }
    return this.client;
  }

  /**
   * Invalidate auth-related queries
   */
  static async invalidateAuth(uid?: string) {
    const client = this.getClient();
    
    // Invalidate all auth queries
    await client.invalidateQueries({ queryKey: queryKeys.auth.root });
    
    // If specific user, invalidate user-specific queries
    if (uid) {
      await client.invalidateQueries({ queryKey: queryKeys.auth.profile(uid) });
      await client.invalidateQueries({ queryKey: queryKeys.auth.tokenValidation(uid) });
    }
  }

  /**
   * Clear all auth data (useful on logout)
   */
  static clearAuthCache() {
    const client = this.getClient();
    
    // Remove all auth-related data
    client.removeQueries({ queryKey: queryKeys.auth.root });
    
    // Also clear workspace data that depends on auth
    client.removeQueries({ queryKey: queryKeys.workspace.root });
  }

  /**
   * Prefetch critical auth data
   */
  static async prefetchAuthData(uid: string) {
    const client = this.getClient();
    
    // Prefetch user profile
    await client.prefetchQuery({
      queryKey: queryKeys.auth.profile(uid),
      queryFn: () => this.fetchUserProfile(uid),
      staleTime: 10 * 60 * 1000, // 10 minutes for prefetch
    });
  }

  /**
   * Example profile fetcher with retry strategy
   */
  private static async fetchUserProfile(uid: string) {
    return retryOperation(
      async () => {
        // This would be replaced with actual Firestore call
        const response = await fetch(`/api/profile/${uid}`);
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        return response.json();
      },
      {
        maxAttempts: 3,
        baseDelay: 1000,
        retryableErrors: ['network-error', 'timeout', 'unavailable'],
        nonRetryableErrors: ['not-found', 'forbidden']
      },
      'profile_fetch'
    );
  }

  /**
   * Get cache statistics
   */
  static getCacheStats() {
    const client = this.getClient();
    const cache = client.getQueryCache();
    
    const queries = cache.getAll();
    const authQueries = queries.filter(q => 
      q.queryKey.includes('auth')
    );
    
    return {
      totalQueries: queries.length,
      authQueries: authQueries.length,
      activeQueries: queries.filter(q => q.getObserversCount() > 0).length,
      staleQueries: queries.filter(q => q.isStale()).length,
      cacheSize: queries.reduce((acc, q) => {
        const data = q.state.data;
        return acc + (data ? JSON.stringify(data).length : 0);
      }, 0)
    };
  }
}

/**
 * Hook factory for auth queries
 */
export const authQueries = {
  /**
   * User profile query configuration
   */
  profile: (uid: string) => ({
    queryKey: queryKeys.auth.profile(uid),
    queryFn: async () => {
      return retryOperation(
        async () => {
          // Implementation would call ProfileManager
          throw new Error('Profile fetch not implemented');
        },
        {
          maxAttempts: 3,
          baseDelay: 1000,
          retryableErrors: ['unavailable', 'timeout'],
          nonRetryableErrors: ['permission-denied', 'not-found']
        },
        'profile_query'
      );
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
    enabled: !!uid,
  }),

  /**
   * Auth state query configuration
   */
  authState: () => ({
    queryKey: queryKeys.auth.authState(),
    queryFn: async () => {
      // This would integrate with AuthStateManager
      return {
        isReady: false,
        tokenValidated: false,
        profileLoaded: false
      };
    },
    staleTime: 1 * 60 * 1000, // 1 minute
    refetchInterval: 30 * 1000, // Check every 30 seconds
  }),

  /**
   * Token validation query configuration
   */
  tokenValidation: (uid: string) => ({
    queryKey: queryKeys.auth.tokenValidation(uid),
    queryFn: async () => {
      return retryOperation(
        async () => {
          // This would call TokenValidator
          throw new Error('Token validation not implemented');
        },
        {
          maxAttempts: 5,
          baseDelay: 500,
          retryableErrors: ['permission-denied', 'unavailable'],
          nonRetryableErrors: ['invalid-token', 'token-expired']
        },
        'token_validation'
      );
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
    enabled: !!uid,
  })
};

// Export singleton client instance
export const queryClient = createAuthQueryClient();