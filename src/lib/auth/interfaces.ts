/**
 * Auth System Interfaces - Core abstractions for dependency injection
 * Essential interfaces for the authentication system
 */

import { User } from 'firebase/auth';
import { UserProfile, TokenValidationResult, AuthState, CacheMetrics } from './types';

// ===== CORE INTERFACES =====

export interface IProfileManager {
  loadProfile(uid: string): Promise<UserProfile | null>;
  getProfile(uid: string): Promise<UserProfile | null>;
  createProfile(uid: string, data: Partial<UserProfile>): Promise<UserProfile>;
  updateProfile(uid: string, updates: Partial<UserProfile>): Promise<UserProfile>;
  deleteProfile(uid: string): Promise<void>;
  profileExists(uid: string): Promise<boolean>;
  cacheProfile(uid: string, profile: UserProfile): void;
  getCachedProfile(uid: string): UserProfile | null;
  getCacheMetrics(): CacheMetrics;
  preloadProfiles?(uids: string[]): Promise<void>;
}

export interface ITokenValidator {
  validateToken(user: User): Promise<TokenValidationResult>;
  refreshToken(user: User): Promise<string>;
  isTokenValid(token: string): boolean;
}

export interface IAuthStateManager {
  getState(): AuthState;
  updateState(updates: Partial<AuthState>): void;
  resetState(): void;
  waitForReady(user?: User): Promise<boolean>;
}

export interface IRetryCoordinator {
  execute<T>(operation: () => Promise<T>, maxAttempts?: number): Promise<T>;
  canRetry(error: Error): boolean;
  getBackoffDelay(attempt: number): number;
}

export interface ICacheManager<T> {
  get(key: string): T | null;
  set(key: string, value: T, ttl?: number): void;
  delete(key: string): void;
  clear(): void;
  size(): number;
}

export interface ITTLCache<T> {
  get(key: string): T | undefined;
  set(key: string, value: T, ttl?: number): void;
  delete(key: string): boolean;
  clear(): void;
  getMetrics(): CacheMetrics;
}

// ===== DEPENDENCY INJECTION TOKENS =====

export const DI_TOKENS = {
  PROFILE_MANAGER: Symbol('IProfileManager'),
  TOKEN_VALIDATOR: Symbol('ITokenValidator'),
  AUTH_STATE_MANAGER: Symbol('IAuthStateManager'),
  RETRY_COORDINATOR: Symbol('IRetryCoordinator'),
  CACHE_MANAGER: Symbol('ICacheManager'),
} as const;

// ===== CONTAINER INTERFACE =====

export interface IDependencyContainer {
  register<T>(token: symbol, implementation: T): void;
  resolve<T>(token: symbol): T;
  unregister(token: symbol): void;
  clear(): void;
}

// ===== FACTORY INTERFACES =====

export interface IAuthFactory {
  createProfileManager(): IProfileManager;
  createTokenValidator(): ITokenValidator;
  createAuthStateManager(): IAuthStateManager;
  createRetryCoordinator(): IRetryCoordinator;
}

// ===== AUTH CONFIGURATION =====

export interface AuthConfig {
  tokenRefreshThreshold: number;
  maxRetryAttempts: number;
  cacheTimeoutMs: number;
  enableMetrics: boolean;
}

// ===== UTILITY TYPES =====

export type AuthOperation = 'login' | 'logout' | 'signup' | 'profile_load' | 'token_refresh';

export interface AuthMetrics {
  operationsCount: Record<AuthOperation, number>;
  errorsCount: Record<string, number>;
  averageLatency: Record<AuthOperation, number>;
  timestamp: number;
}

// ===== ERROR TYPES =====

export interface AuthError extends Error {
  code?: string;
  operation?: AuthOperation;
  retryable?: boolean;
  timestamp?: number;
}

export class AuthSystemError extends Error implements AuthError {
  public timestamp: number;
  
  constructor(
    message: string,
    public code?: string,
    public operation?: AuthOperation,
    public retryable: boolean = false
  ) {
    super(message);
    this.name = 'AuthSystemError';
    this.timestamp = Date.now();
  }
}

// ===== EVENT INTERFACES =====

export interface AuthEvent {
  type: 'auth_ready' | 'auth_error' | 'profile_loaded' | 'token_refreshed';
  timestamp: number;
  data?: any;
  error?: Error;
}

export interface IAuthEventEmitter {
  emit(event: AuthEvent): void;
  on(eventType: AuthEvent['type'], handler: (event: AuthEvent) => void): void;
  off(eventType: AuthEvent['type'], handler: (event: AuthEvent) => void): void;
}

// ===== RE-EXPORTS =====

export type { CacheMetrics };