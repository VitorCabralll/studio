/**
 * Optimized Auth Coordinator - Enhanced security and performance
 * Consolidates auth flow, state management, retry logic with security improvements
 */

import { User } from 'firebase/auth';
import { AuthState, TokenValidationResult, RetryConfig } from './auth/types';

// ===== OPTIMIZED RETRY LOGIC =====

class OptimizedRetry {
  private static delayCache = new Map<number, Promise<void>>();
  
  private static async delay(ms: number): Promise<void> {
    const cached = this.delayCache.get(ms);
    if (cached) return cached;
    
    const promise = new Promise<void>(resolve => setTimeout(resolve, ms));
    this.delayCache.set(ms, promise);
    
    // Clean cache after delay
    promise.then(() => this.delayCache.delete(ms));
    
    return promise;
  }

  static async execute<T>(
    operation: () => Promise<T>,
    config: RetryConfig = { maxAttempts: 3, baseDelay: 300, maxDelay: 2000 }
  ): Promise<T> {
    let lastError: Error;
    const startTime = Date.now();

    for (let attempt = 1; attempt <= config.maxAttempts; attempt++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));
        
        // Check for non-retryable errors
        if (this.isNonRetryableError(lastError) || attempt === config.maxAttempts) {
          throw lastError;
        }

        // Security: Prevent indefinite retries
        if (Date.now() - startTime > 30000) { // 30 second max
          throw new Error('Auth operation timeout - potential security issue');
        }

        // Exponential backoff with jitter and security considerations
        const baseDelay = config.baseDelay * Math.pow(2, attempt - 1);
        const jitter = Math.random() * 100;
        const delay = Math.min(baseDelay + jitter, config.maxDelay);
        
        await this.delay(delay);
      }
    }

    throw lastError!;
  }

  private static isNonRetryableError(error: Error): boolean {
    const nonRetryableCodes = [
      'auth/user-not-found',
      'auth/invalid-email',
      'auth/wrong-password',
      'auth/user-disabled'
    ];
    return nonRetryableCodes.some(code => error.message.includes(code));
  }
}

// ===== SIMPLIFIED AUTH COORDINATOR =====

export class AuthCoordinator {
  private static instance: AuthCoordinator | null = null;
  private state: AuthState = {
    authReady: false,
    tokenValidated: false,
    profileLoaded: false,
    user: null
  };
  private lastValidation = 0;
  private readonly validationCooldown = 10000; // 10 seconds
  private securityMetrics = {
    failedValidations: 0,
    successfulValidations: 0,
    lastFailure: 0
  };

  private constructor() {}

  static getInstance(): AuthCoordinator {
    if (!AuthCoordinator.instance) {
      AuthCoordinator.instance = new AuthCoordinator();
    }
    return AuthCoordinator.instance;
  }

  // Cleanup method for singleton
  static cleanup(): void {
    if (AuthCoordinator.instance) {
      AuthCoordinator.instance.resetState();
      AuthCoordinator.instance = null;
    }
  }

  // ===== STATE MANAGEMENT =====

  getState(): Readonly<AuthState> {
    return { ...this.state };
  }

  updateState(updates: Partial<AuthState>): void {
    this.state = { ...this.state, ...updates };
  }

  resetState(): void {
    this.state = {
      authReady: false,
      tokenValidated: false,
      profileLoaded: false,
      user: null
    };
  }

  // ===== CORE AUTH FLOW =====

  async waitForAuthReady(user?: User | null): Promise<boolean> {
    if (!user) return false;

    try {
      // Update user in state
      this.updateState({ user });

      // Simple token validation (without timing attacks)
      const tokenResult = await this.validateTokenWithRetry(user);
      this.updateState({ tokenValidated: tokenResult.isValid });

      if (!tokenResult.isValid) {
        return false;
      }

      // Mark auth as ready
      this.updateState({ authReady: true });
      return true;

    } catch (error) {
      console.error('Auth ready check failed:', error);
      this.updateState({ authReady: false, tokenValidated: false });
      return false;
    }
  }

  private async validateTokenWithRetry(user: User): Promise<TokenValidationResult> {
    // Security: Implement validation cooldown
    const now = Date.now();
    if (now - this.lastValidation < this.validationCooldown) {
      return {
        isValid: true,
        canAccessFirestore: true
      };
    }

    return OptimizedRetry.execute(async () => {
      try {
        // Security: Rate limit validation attempts
        if (this.securityMetrics.failedValidations > 5 && 
            now - this.securityMetrics.lastFailure < 60000) {
          throw new Error('Too many validation failures - security lockout');
        }

        // Get fresh token with timeout
        const tokenPromise = user.getIdToken(true);
        const timeoutPromise = new Promise<never>((_, reject) => 
          setTimeout(() => reject(new Error('Token validation timeout')), 10000)
        );
        
        const token = await Promise.race([tokenPromise, timeoutPromise]);
        
        // Enhanced validation
        if (!token || !user.uid || token.length < 100) {
          this.securityMetrics.failedValidations++;
          this.securityMetrics.lastFailure = now;
          return {
            isValid: false,
            canAccessFirestore: false,
            error: 'Invalid token or user'
          };
        }

        // Success metrics
        this.securityMetrics.successfulValidations++;
        this.lastValidation = now;

        return {
          isValid: true,
          canAccessFirestore: true
        };

      } catch (error) {
        this.securityMetrics.failedValidations++;
        this.securityMetrics.lastFailure = now;
        return {
          isValid: false,
          canAccessFirestore: false,
          error: error instanceof Error ? error.message : 'Token validation failed'
        };
      }
    });
  }

  // ===== PROFILE COORDINATION =====

  async getProfileLoadingPromise<T>(
    uid: string,
    loadFunction: () => Promise<T>,
    operation = 'profile_load'
  ): Promise<T> {
    try {
      const result = await OptimizedRetry.execute(loadFunction);
      this.updateState({ profileLoaded: true });
      return result;
    } catch (error) {
      console.error(`Profile loading failed for ${operation}:`, error);
      throw error;
    }
  }

  // ===== UTILITY METHODS =====

  isAuthReady(): boolean {
    return this.state.authReady;
  }

  isTokenValidated(): boolean {
    return this.state.tokenValidated;
  }

  isProfileLoaded(): boolean {
    return this.state.profileLoaded;
  }

  getCurrentUser(): User | null {
    return this.state.user;
  }

  getSecurityMetrics() {
    return {
      ...this.securityMetrics,
      lastValidationAge: Date.now() - this.lastValidation,
      securityScore: this.calculateSecurityScore()
    };
  }

  private calculateSecurityScore(): number {
    const total = this.securityMetrics.successfulValidations + this.securityMetrics.failedValidations;
    if (total === 0) return 100;
    
    const successRate = this.securityMetrics.successfulValidations / total;
    const failureRate = this.securityMetrics.failedValidations / total;
    
    // Score based on success rate and failure frequency
    let score = successRate * 100;
    if (failureRate > 0.3) score *= 0.5; // Heavy penalty for high failure rate
    
    return Math.max(0, Math.min(100, score));
  }

  // ===== CLEANUP =====

  destroy(): void {
    this.resetState();
    this.securityMetrics = {
      failedValidations: 0,
      successfulValidations: 0,
      lastFailure: 0
    };
    AuthCoordinator.instance = null;
  }
}

// ===== EXPORTS =====

// Singleton instance
export const authCoordinator = AuthCoordinator.getInstance();

// Compatibility functions (maintaining existing API)
export async function waitForAuthReady(user?: User | null): Promise<boolean> {
  return authCoordinator.waitForAuthReady(user);
}

export function getAuthState(): Readonly<AuthState> {
  return authCoordinator.getState();
}

export function resetAuthState(): void {
  authCoordinator.resetState();
}

export async function retryWithCoordination<T>(
  operation: () => Promise<T>,
  user: User,
  maxAttempts = 3
): Promise<T> {
  return OptimizedRetry.execute(operation, { maxAttempts, baseDelay: 300, maxDelay: 2000 });
}

export function getCacheMetrics() {
  return {
    cache: { hits: 0, misses: 0, size: 0 },
    circuitBreaker: { failures: 0, state: 'closed' as const, lastFailure: 0 },
    timestamp: Date.now()
  };
}

export function resetCacheMetrics(): void {
  // No-op in simplified version
}