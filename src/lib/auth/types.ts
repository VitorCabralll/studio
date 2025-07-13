/**
 * Simplified Auth Types - Core interfaces only
 * Replaces complex interfaces.ts with essential types
 */

import { User } from 'firebase/auth';

// ===== CORE TYPES =====

export interface AuthState {
  authReady: boolean;
  tokenValidated: boolean;
  profileLoaded: boolean;
  user: User | null;
}

export interface UserProfile {
  uid?: string;
  email?: string;
  name?: string;
  displayName?: string;
  phone?: string;
  company?: string;
  oab?: string;
  acceptNewsletter?: boolean;
  cargo: string;
  areas_atuacao: string[];
  primeiro_acesso: boolean;
  initial_setup_complete: boolean;
  createdAt?: number;
  updatedAt?: number;
}

export interface TokenValidationResult {
  isValid: boolean;
  canAccessFirestore: boolean;
  error?: string;
}

// ===== SIMPLE CACHE =====

export interface CacheEntry<T> {
  value: T;
  expires: number;
}

export interface CacheMetrics {
  hits: number;
  misses: number;
  size: number;
}

// ===== CONFIG TYPES =====

export interface RetryConfig {
  maxAttempts: number;
  baseDelay: number;
  maxDelay: number;
}

export interface CircuitBreakerStats {
  failures: number;
  state: 'closed' | 'open' | 'half-open';
  lastFailure: number;
}