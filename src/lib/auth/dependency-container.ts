/**
 * Simple Dependency Injection Container
 * Lightweight DI implementation for auth system
 */

import { 
  IDependencyContainer, 
  IProfileManager, 
  ITokenValidator, 
  IAuthStateManager, 
  IRetryCoordinator,
  DI_TOKENS 
} from './interfaces';
import { ProfileService } from './profile-service';
import { TokenValidator } from './token-validator';

// ===== SIMPLE DI CONTAINER =====

class SimpleDependencyContainer implements IDependencyContainer {
  private dependencies = new Map<symbol, any>();

  register<T>(token: symbol, implementation: T): void {
    this.dependencies.set(token, implementation);
  }

  resolve<T>(token: symbol): T {
    const implementation = this.dependencies.get(token);
    if (!implementation) {
      throw new Error(`Dependency not registered for token: ${token.toString()}`);
    }
    return implementation;
  }

  unregister(token: symbol): void {
    this.dependencies.delete(token);
  }

  clear(): void {
    this.dependencies.clear();
  }
}

// ===== CONTAINER INSTANCE =====

let containerInstance: SimpleDependencyContainer | null = null;

export function createAuthContainer(): SimpleDependencyContainer {
  if (!containerInstance) {
    containerInstance = new SimpleDependencyContainer();
    
    // Register default implementations
    registerDefaultImplementations(containerInstance);
  }
  
  return containerInstance;
}

export function resetAuthContainer(): void {
  if (containerInstance) {
    containerInstance.clear();
    containerInstance = null;
  }
}

// ===== DEFAULT IMPLEMENTATIONS =====

function registerDefaultImplementations(container: SimpleDependencyContainer): void {
  // Profile Manager
  container.register<IProfileManager>(
    DI_TOKENS.PROFILE_MANAGER,
    ProfileService.getInstance()
  );

  // Token Validator  
  container.register<ITokenValidator>(
    DI_TOKENS.TOKEN_VALIDATOR,
    new TokenValidator()
  );

  // Simple Auth State Manager
  container.register<IAuthStateManager>(
    DI_TOKENS.AUTH_STATE_MANAGER,
    createSimpleAuthStateManager()
  );

  // Simple Retry Coordinator
  container.register<IRetryCoordinator>(
    DI_TOKENS.RETRY_COORDINATOR,
    createSimpleRetryCoordinator()
  );
}

// ===== SIMPLE IMPLEMENTATIONS =====

function createSimpleAuthStateManager(): IAuthStateManager {
  let state = {
    authReady: false,
    tokenValidated: false,
    profileLoaded: false,
    user: null as any
  };

  return {
    getState: () => ({ ...state }),
    updateState: (updates) => {
      state = { ...state, ...updates };
    },
    resetState: () => {
      state = {
        authReady: false,
        tokenValidated: false,
        profileLoaded: false,
        user: null
      };
    },
    waitForReady: async (user) => {
      if (!user) return false;
      
      // Simple implementation - just return true
      state.authReady = true;
      state.user = user;
      return true;
    }
  };
}

function createSimpleRetryCoordinator(): IRetryCoordinator {
  return {
    execute: async <T>(operation: () => Promise<T>, maxAttempts = 3): Promise<T> => {
      let lastError: Error;
      
      for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        try {
          return await operation();
        } catch (error) {
          lastError = error instanceof Error ? error : new Error(String(error));
          
          if (attempt === maxAttempts) {
            throw lastError;
          }
          
          // Simple exponential backoff
          const delay = Math.min(300 * Math.pow(2, attempt - 1), 2000);
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
      
      throw lastError!;
    },
    
    canRetry: (error: Error): boolean => {
      // Simple retry logic - most auth errors are retryable
      const nonRetryableCodes = ['auth/user-not-found', 'auth/invalid-email'];
      return !nonRetryableCodes.some(code => error.message.includes(code));
    },
    
    getBackoffDelay: (attempt: number): number => {
      return Math.min(300 * Math.pow(2, attempt - 1), 2000);
    }
  };
}