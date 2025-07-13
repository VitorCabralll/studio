/**
 * Simplified Token Validator - Essential validation with circuit breaker
 * Replaces complex token-validator.ts with focused, secure functionality
 */

import { User } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { getFirebaseDb } from '@/lib/firebase';
import { TokenValidationResult, CircuitBreakerStats } from './types';
import { ITokenValidator } from './interfaces';

// ===== SIMPLE CIRCUIT BREAKER =====

class SimpleCircuitBreaker {
  private failures = 0;
  private lastFailure = 0;
  private state: 'closed' | 'open' | 'half-open' = 'closed';
  
  private readonly failureThreshold = 5;
  private readonly timeout = 60000; // 1 minute

  async execute<T>(operation: () => Promise<T>): Promise<T> {
    if (this.state === 'open') {
      if (Date.now() - this.lastFailure > this.timeout) {
        this.state = 'half-open';
      } else {
        throw new Error('Circuit breaker is open');
      }
    }

    try {
      const result = await operation();
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      throw error;
    }
  }

  private onSuccess(): void {
    this.failures = 0;
    this.state = 'closed';
  }

  private onFailure(): void {
    this.failures++;
    this.lastFailure = Date.now();
    
    if (this.failures >= this.failureThreshold) {
      this.state = 'open';
    }
  }

  getStats(): CircuitBreakerStats {
    return {
      failures: this.failures,
      state: this.state,
      lastFailure: this.lastFailure
    };
  }

  reset(): void {
    this.failures = 0;
    this.lastFailure = 0;
    this.state = 'closed';
  }
}

// ===== TOKEN VALIDATOR =====

export class TokenValidator implements ITokenValidator {
  private static instance: TokenValidator | null = null;
  private circuitBreaker = new SimpleCircuitBreaker();

  constructor() {}

  static getInstance(): TokenValidator {
    if (!TokenValidator.instance) {
      TokenValidator.instance = new TokenValidator();
    }
    return TokenValidator.instance;
  }

  // ===== CORE VALIDATION =====

  async validateToken(user: User): Promise<TokenValidationResult> {
    try {
      return await this.circuitBreaker.execute(async () => {
        // Get fresh token
        const token = await user.getIdToken(true);
        
        if (!token) {
          return {
            isValid: false,
            canAccessFirestore: false,
            error: 'No token available'
          };
        }

        // Test basic Firebase access
        const canAccess = await this.testFirestoreAccess(user.uid);
        
        return {
          isValid: true,
          canAccessFirestore: canAccess
        };
      });

    } catch (error) {
      return {
        isValid: false,
        canAccessFirestore: false,
        error: error instanceof Error ? error.message : 'Token validation failed'
      };
    }
  }

  async validateTokenPropagation(user: User): Promise<TokenValidationResult> {
    // For simplicity, just call regular validation
    // No timing delays - eliminates timing attack vulnerabilities
    return this.validateToken(user);
  }

  async testFirestoreAccess(uid: string): Promise<boolean> {
    try {
      return await this.circuitBreaker.execute(async () => {
        const db = getFirebaseDb();
        
        // Simple test: try to read user's profile doc (or any doc they have access to)
        const testRef = doc(db, 'profiles', uid);
        await getDoc(testRef);
        
        // If we reach here, access is working
        return true;
      });

    } catch (error) {
      console.warn('Firestore access test failed:', error);
      return false;
    }
  }

  // ===== INTERFACE IMPLEMENTATION =====

  async refreshToken(user: User): Promise<string> {
    try {
      return await user.getIdToken(true);
    } catch (error) {
      throw new Error(`Token refresh failed: ${error}`);
    }
  }

  isTokenValid(token: string): boolean {
    if (!token) return false;
    
    try {
      // Basic token format validation
      const parts = token.split('.');
      return parts.length === 3 && parts.every(part => part.length > 0);
    } catch {
      return false;
    }
  }

  // ===== CIRCUIT BREAKER MANAGEMENT =====

  getCircuitBreakerStats(): CircuitBreakerStats {
    return this.circuitBreaker.getStats();
  }

  resetCircuitBreaker(): void {
    this.circuitBreaker.reset();
  }

  // ===== CLEANUP =====

  destroy(): void {
    this.resetCircuitBreaker();
    TokenValidator.instance = null;
  }
}

// ===== EXPORTS =====

// Singleton instance
export const tokenValidator = TokenValidator.getInstance();

// Convenience functions
export async function validateToken(user: User): Promise<TokenValidationResult> {
  return tokenValidator.validateToken(user);
}

export async function validateTokenPropagation(user: User): Promise<TokenValidationResult> {
  return tokenValidator.validateTokenPropagation(user);
}

export function getCircuitBreakerStats(): CircuitBreakerStats {
  return tokenValidator.getCircuitBreakerStats();
}