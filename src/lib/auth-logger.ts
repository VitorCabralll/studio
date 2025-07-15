/**
 * Enhanced Authentication Logger
 * Sistema de logging específico para operações de autenticação
 * Baseado no context engineering para debug sistemático
 */

import { User } from 'firebase/auth';
import { logger, type LogContext } from './logger';
import { type AuthError } from './auth-errors';

interface AuthLogContext extends LogContext {
  operation?: string;
  context?: string;
  attempt?: number;
  authState?: 'loading' | 'authenticated' | 'unauthenticated';
  userInfo?: {
    uid?: string;
    email?: string;
    emailVerified?: boolean;
    isAnonymous?: boolean;
  };
  profileInfo?: {
    primeiro_acesso?: boolean;
    initial_setup_complete?: boolean;
    cargo?: string;
    areas_count?: number;
  };
  errorDetails?: {
    code?: string;
    message?: string;
    stack?: string;
  };
  errorCode?: string;
  performance?: {
    duration?: number;
    timestamp?: number;
  };
}

class AuthLogger {
  private isDevelopment: boolean;
  private debugMode: boolean;

  constructor() {
    this.isDevelopment = process.env.NODE_ENV === 'development';
    this.debugMode = process.env.DEBUG === 'true' || process.env.NEXT_PUBLIC_DEBUG === 'true';
  }

  private createAuthContext(context: AuthLogContext = {}): AuthLogContext {
    return {
      ...context,
      component: 'auth',
      environment: process.env.NODE_ENV || 'unknown',
      timestamp: new Date().toISOString(),
    };
  }

  private sanitizeUserInfo(user: User | null): AuthLogContext['userInfo'] {
    if (!user) return undefined;
    
    return {
      uid: user.uid,
      email: user.email || undefined,
      emailVerified: user.emailVerified,
      isAnonymous: user.isAnonymous,
    };
  }

  /**
   * Log informações gerais de autenticação
   */
  info(message: string, context: AuthLogContext = {}): void {
    if (this.isDevelopment) {
      const authContext = this.createAuthContext(context);
      logger.info(`[AUTH] ${message}`, authContext);
    }
  }

  /**
   * Log erros de autenticação
   */
  error(message: string, error?: AuthError | Error, context: AuthLogContext = {}): void {
    const authContext = this.createAuthContext({
      ...context,
      errorDetails: error ? {
        code: 'code' in error ? error.code : 'unknown',
        message: error.message,
        stack: error instanceof Error ? error.stack : undefined,
      } : undefined,
    });

    logger.error(`[AUTH ERROR] ${message}`, error instanceof Error ? error : undefined, authContext);
  }

  /**
   * Log debug detalhado (apenas em desenvolvimento com DEBUG=true)
   */
  debug(message: string, context: AuthLogContext = {}): void {
    if (this.debugMode) {
      const authContext = this.createAuthContext(context);
      logger.debug(`[AUTH DEBUG] ${message}`, authContext);
    }
  }

  /**
   * Log mudanças de estado de autenticação
   */
  stateChange(
    user: User | null, 
    authState: 'loading' | 'authenticated' | 'unauthenticated',
    context: AuthLogContext = {}
  ): void {
    const authContext = this.createAuthContext({
      ...context,
      operation: 'state_change',
      authState,
      userInfo: this.sanitizeUserInfo(user),
    });

    this.info('Auth state changed', authContext);
  }

  /**
   * Log operações de login
   */
  loginAttempt(method: 'email' | 'google' | 'anonymous', email?: string): void {
    this.info('Login attempt started', {
      operation: 'login_attempt',
      metadata: {
        method,
        email: email ? email.replace(/(.{2})(.*)(@.*)/, '$1***$3') : undefined, // Mask email
      },
    });
  }

  loginSuccess(user: User, method: 'email' | 'google' | 'anonymous'): void {
    this.info('Login successful', {
      operation: 'login_success',
      userInfo: this.sanitizeUserInfo(user),
      metadata: { method },
    });
  }

  loginFailure(error: AuthError, method: 'email' | 'google' | 'anonymous', email?: string): void {
    this.error('Login failed', error.metadata?.originalError || new Error(error.message), {
      operation: 'login_failure',
      metadata: {
        method,
        email: email ? email.replace(/(.{2})(.*)(@.*)/, '$1***$3') : undefined,
      },
    });
  }

  /**
   * Log operações de cadastro
   */
  signupAttempt(email: string): void {
    this.info('Signup attempt started', {
      operation: 'signup_attempt',
      metadata: {
        email: email.replace(/(.{2})(.*)(@.*)/, '$1***$3'),
      },
    });
  }

  signupSuccess(user: User): void {
    this.info('Signup successful', {
      operation: 'signup_success',
      userInfo: this.sanitizeUserInfo(user),
    });
  }

  signupFailure(error: AuthError, email: string): void {
    this.error('Signup failed', error.metadata?.originalError || new Error(error.message), {
      operation: 'signup_failure',
      metadata: {
        email: email.replace(/(.{2})(.*)(@.*)/, '$1***$3'),
      },
    });
  }

  /**
   * Log operações de logout
   */
  logoutAttempt(uid?: string): void {
    this.info('Logout attempt started', {
      operation: 'logout_attempt',
      metadata: { uid },
    });
  }

  logoutSuccess(): void {
    this.info('Logout successful', {
      operation: 'logout_success',
    });
  }

  logoutFailure(error: Error): void {
    this.error('Logout failed', error, {
      operation: 'logout_failure',
    });
  }

  /**
   * Log operações de perfil
   */
  profileLoad(userId: string, profileExists: boolean): void {
    this.info('Profile load attempt', {
      operation: 'profile_load',
      userId,
      metadata: { profileExists },
    });
  }

  profileLoadSuccess(userId: string, profileData: any): void {
    this.info('Profile loaded successfully', {
      operation: 'profile_load_success',
      userId,
      profileInfo: {
        primeiro_acesso: profileData?.primeiro_acesso,
        initial_setup_complete: profileData?.initial_setup_complete,
        cargo: profileData?.cargo,
        areas_count: profileData?.areas_atuacao?.length,
      },
    });
  }

  profileLoadFailure(userId: string, error: Error): void {
    this.error('Profile load failed', error, {
      operation: 'profile_load_failure',
      userId,
    });
  }

  profileCreate(userId: string, profileData: any): void {
    this.info('Profile creation attempt', {
      operation: 'profile_create',
      userId,
      profileInfo: {
        primeiro_acesso: profileData?.primeiro_acesso,
        initial_setup_complete: profileData?.initial_setup_complete,
        cargo: profileData?.cargo,
        areas_count: profileData?.areas_atuacao?.length,
      },
    });
  }

  profileCreateSuccess(userId: string): void {
    this.info('Profile created successfully', {
      operation: 'profile_create_success',
      userId,
    });
  }

  profileCreateFailure(userId: string, error: Error): void {
    this.error('Profile creation failed', error, {
      operation: 'profile_create_failure',
      userId,
    });
  }

  /**
   * Log operações de reset de senha
   */
  passwordResetAttempt(email: string): void {
    this.info('Password reset attempt', {
      operation: 'password_reset_attempt',
      metadata: {
        email: email.replace(/(.{2})(.*)(@.*)/, '$1***$3'),
      },
    });
  }

  passwordResetSuccess(email: string): void {
    this.info('Password reset email sent', {
      operation: 'password_reset_success',
      metadata: {
        email: email.replace(/(.{2})(.*)(@.*)/, '$1***$3'),
      },
    });
  }

  passwordResetFailure(error: AuthError, email: string): void {
    this.error('Password reset failed', error.metadata?.originalError || new Error(error.message), {
      operation: 'password_reset_failure',
      metadata: {
        email: email.replace(/(.{2})(.*)(@.*)/, '$1***$3'),
      },
    });
  }

  /**
   * Log performance de operações
   */
  performance(operation: string, duration: number, context: AuthLogContext = {}): void {
    const authContext = this.createAuthContext({
      ...context,
      performance: {
        duration,
        timestamp: Date.now(),
      },
    });

    logger.performance(`[AUTH] ${operation}`, duration, authContext);
  }

  /**
   * Log eventos de segurança
   */
  security(message: string, context: AuthLogContext = {}): void {
    const authContext = this.createAuthContext(context);
    logger.security(`[AUTH] ${message}`, authContext);
  }

  /**
   * Log auditoria de ações
   */
  audit(action: string, userId?: string, context: AuthLogContext = {}): void {
    const authContext = this.createAuthContext({
      ...context,
      userId,
      action,
    });

    logger.audit(`[AUTH] ${action}`, userId, authContext);
  }

  /**
   * Helper para interceptar erros de autenticação
   */
  handleAuthError(error: any, operation: string, context: AuthLogContext = {}): AuthError {
    const authError: AuthError = {
      code: error.code || 'unknown',
      message: error.message || 'Unknown error',
      type: 'unknown' as any,
      severity: 'medium' as any,
      userMessage: error.message || 'Unknown error',
      timestamp: Date.now(),
      retryable: false,
      metadata: {
        originalError: error instanceof Error ? error : undefined,
      },
    };

    this.error(`${operation} failed`, authError, {
      ...context,
      operation,
    });

    return authError;
  }

  /**
   * Helper para medir performance de operações auth
   */
  measureAuthOperation<T>(
    fn: () => T | Promise<T>,
    operation: string,
    context: AuthLogContext = {}
  ): T | Promise<T> {
    const start = performance.now();
    
    try {
      const result = fn();
      
      if (result instanceof Promise) {
        return result
          .then((value) => {
            const duration = performance.now() - start;
            this.performance(`${operation} completed`, duration, context);
            return value;
          })
          .catch((error) => {
            const duration = performance.now() - start;
            this.error(`${operation} failed after ${duration}ms`, error, {
              ...context,
              operation,
              performance: { duration, timestamp: Date.now() },
            });
            throw error;
          });
      } else {
        const duration = performance.now() - start;
        this.performance(`${operation} completed`, duration, context);
        return result;
      }
    } catch (error) {
      const duration = performance.now() - start;
      this.error(`${operation} failed after ${duration}ms`, error as Error, {
        ...context,
        operation,
        performance: { duration, timestamp: Date.now() },
      });
      throw error;
    }
  }
}

// Instância singleton
export const authLogger = new AuthLogger();

// Exports para facilitar uso
export { type AuthLogContext };