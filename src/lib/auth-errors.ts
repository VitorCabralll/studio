/**
 * Authentication Error Handling System
 * Comprehensive error management for Firebase Auth and App Check
 */

import { logger } from './production-logger';

// Error categories
export enum AuthErrorType {
  AUTHENTICATION = 'authentication',
  APP_CHECK = 'app_check',
  NETWORK = 'network',
  FIRESTORE = 'firestore',
  VALIDATION = 'validation',
  RATE_LIMIT = 'rate_limit',
  CONFIGURATION = 'configuration',
  UNKNOWN = 'unknown'
}

// Error severity levels
export enum ErrorSeverity {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical'
}

// Enhanced error interface
export interface AuthError {
  code: string;
  type: AuthErrorType;
  severity: ErrorSeverity;
  message: string;
  userMessage: string;
  metadata?: Record<string, any>;
  timestamp: number;
  retryable: boolean;
  retryAfter?: number; // seconds
  supportActions?: string[];
}

// Firebase Auth error mappings
const FIREBASE_AUTH_ERRORS: Record<string, Partial<AuthError>> = {
  // Authentication errors
  'auth/user-not-found': {
    type: AuthErrorType.AUTHENTICATION,
    severity: ErrorSeverity.LOW,
    userMessage: 'Email não encontrado. Verifique o endereço ou cadastre-se.',
    retryable: false,
    supportActions: ['check_email', 'try_signup']
  },
  'auth/wrong-password': {
    type: AuthErrorType.AUTHENTICATION,
    severity: ErrorSeverity.LOW,
    userMessage: 'Senha incorreta. Tente novamente ou use "Esqueci minha senha".',
    retryable: true,
    supportActions: ['retry_password', 'reset_password']
  },
  'auth/invalid-email': {
    type: AuthErrorType.VALIDATION,
    severity: ErrorSeverity.LOW,
    userMessage: 'Email inválido. Verifique o formato do endereço.',
    retryable: true,
    supportActions: ['fix_email_format']
  },
  'auth/email-already-in-use': {
    type: AuthErrorType.AUTHENTICATION,
    severity: ErrorSeverity.LOW,
    userMessage: 'Este email já está cadastrado. Tente fazer login ou use "Esqueci minha senha".',
    retryable: false,
    supportActions: ['try_login', 'reset_password']
  },
  'auth/weak-password': {
    type: AuthErrorType.VALIDATION,
    severity: ErrorSeverity.LOW,
    userMessage: 'Senha muito fraca. Use pelo menos 6 caracteres com letras e números.',
    retryable: true,
    supportActions: ['strengthen_password']
  },
  'auth/too-many-requests': {
    type: AuthErrorType.RATE_LIMIT,
    severity: ErrorSeverity.MEDIUM,
    userMessage: 'Muitas tentativas. Aguarde alguns minutos antes de tentar novamente.',
    retryable: true,
    retryAfter: 300, // 5 minutes
    supportActions: ['wait_and_retry', 'contact_support']
  },
  'auth/network-request-failed': {
    type: AuthErrorType.NETWORK,
    severity: ErrorSeverity.MEDIUM,
    userMessage: 'Erro de conexão. Verifique sua internet e tente novamente.',
    retryable: true,
    retryAfter: 5,
    supportActions: ['check_connection', 'retry']
  },
  'auth/invalid-credential': {
    type: AuthErrorType.AUTHENTICATION,
    severity: ErrorSeverity.LOW,
    userMessage: 'Credenciais inválidas. Verifique email e senha.',
    retryable: true,
    supportActions: ['check_credentials', 'reset_password']
  },
  'auth/popup-closed-by-user': {
    type: AuthErrorType.AUTHENTICATION,
    severity: ErrorSeverity.LOW,
    userMessage: 'Login cancelado. Tente novamente quando estiver pronto.',
    retryable: true,
    supportActions: ['retry_oauth']
  },
  'auth/popup-blocked': {
    type: AuthErrorType.CONFIGURATION,
    severity: ErrorSeverity.MEDIUM,
    userMessage: 'Pop-up bloqueado pelo navegador. Permita pop-ups para este site.',
    retryable: true,
    supportActions: ['enable_popups', 'retry_oauth']
  }
};

// App Check error mappings
const APP_CHECK_ERRORS: Record<string, Partial<AuthError>> = {
  'appCheck/token-error': {
    type: AuthErrorType.APP_CHECK,
    severity: ErrorSeverity.HIGH,
    userMessage: 'Erro de verificação de segurança. Tente recarregar a página.',
    retryable: true,
    retryAfter: 10,
    supportActions: ['reload_page', 'clear_cache']
  },
  'appCheck/fetch-status-error': {
    type: AuthErrorType.APP_CHECK,
    severity: ErrorSeverity.HIGH,
    userMessage: 'Falha na verificação de segurança. Verifique sua conexão.',
    retryable: true,
    retryAfter: 5,
    supportActions: ['check_connection', 'retry']
  },
  'appCheck/fetch-network-error': {
    type: AuthErrorType.NETWORK,
    severity: ErrorSeverity.MEDIUM,
    userMessage: 'Erro de rede na verificação de segurança. Tente novamente.',
    retryable: true,
    retryAfter: 5,
    supportActions: ['check_connection', 'retry']
  },
  'appCheck/recaptcha-error': {
    type: AuthErrorType.APP_CHECK,
    severity: ErrorSeverity.HIGH,
    userMessage: 'Erro no reCAPTCHA. Recarregue a página e tente novamente.',
    retryable: true,
    retryAfter: 10,
    supportActions: ['reload_page', 'disable_adblocker']
  }
};

// Network error patterns
const NETWORK_ERROR_PATTERNS = [
  /fetch/i,
  /network/i,
  /timeout/i,
  /connection/i,
  /cors/i
];

// Firestore error mappings
const FIRESTORE_ERRORS: Record<string, Partial<AuthError>> = {
  'permission-denied': {
    type: AuthErrorType.FIRESTORE,
    severity: ErrorSeverity.HIGH,
    userMessage: 'Erro de permissão. Faça login novamente.',
    retryable: false,
    supportActions: ['relogin', 'contact_support']
  },
  'unavailable': {
    type: AuthErrorType.NETWORK,
    severity: ErrorSeverity.MEDIUM,
    userMessage: 'Serviço temporariamente indisponível. Tente em alguns instantes.',
    retryable: true,
    retryAfter: 30,
    supportActions: ['wait_and_retry']
  }
};

/**
 * Parse and enhance any authentication-related error
 */
export function parseAuthError(error: any): AuthError {
  const timestamp = Date.now();
  
  // Basic error structure
  let authError: AuthError = {
    code: error.code || 'unknown',
    type: AuthErrorType.UNKNOWN,
    severity: ErrorSeverity.MEDIUM,
    message: error.message || 'Unknown error occurred',
    userMessage: 'Ocorreu um erro inesperado. Tente novamente.',
    timestamp,
    retryable: false,
    supportActions: ['retry', 'contact_support']
  };
  
  // Try to match Firebase Auth errors
  if (error.code && FIREBASE_AUTH_ERRORS[error.code]) {
    authError = { ...authError, ...FIREBASE_AUTH_ERRORS[error.code] };
  }
  
  // Try to match App Check errors
  else if (error.code && APP_CHECK_ERRORS[error.code]) {
    authError = { ...authError, ...APP_CHECK_ERRORS[error.code] };
  }
  
  // Try to match Firestore errors
  else if (error.code && FIRESTORE_ERRORS[error.code]) {
    authError = { ...authError, ...FIRESTORE_ERRORS[error.code] };
  }
  
  // Check for network errors by message pattern
  else if (NETWORK_ERROR_PATTERNS.some(pattern => pattern.test(error.message))) {
    authError = {
      ...authError,
      type: AuthErrorType.NETWORK,
      severity: ErrorSeverity.MEDIUM,
      userMessage: 'Erro de conexão. Verifique sua internet.',
      retryable: true,
      retryAfter: 5,
      supportActions: ['check_connection', 'retry']
    };
  }
  
  // Special handling for specific HTTP status codes
  if (error.status === 400) {
    authError = {
      ...authError,
      type: AuthErrorType.APP_CHECK,
      severity: ErrorSeverity.HIGH,
      userMessage: 'Erro de verificação (400). Recarregue a página.',
      retryable: true,
      retryAfter: 10,
      supportActions: ['reload_page', 'clear_cache', 'disable_app_check']
    };
  }
  
  // Add metadata
  authError.metadata = {
    originalError: {
      code: error.code,
      message: error.message,
      status: error.status
    },
    userAgent: typeof window !== 'undefined' ? navigator.userAgent : 'server',
    url: typeof window !== 'undefined' ? window.location.href : 'unknown',
    timestamp: new Date().toISOString()
  };
  
  // Log error for monitoring
  logger.error('Authentication Error', {
    code: authError.code,
    type: authError.type,
    severity: authError.severity,
    retryable: authError.retryable,
    metadata: authError.metadata
  });
  
  return authError;
}

/**
 * Get user-friendly error message
 */
export function getUserMessage(error: any): string {
  const authError = parseAuthError(error);
  return authError.userMessage;
}

/**
 * Check if error is retryable
 */
export function isRetryableError(error: any): boolean {
  const authError = parseAuthError(error);
  return authError.retryable;
}

/**
 * Get retry delay in seconds
 */
export function getRetryDelay(error: any): number {
  const authError = parseAuthError(error);
  return authError.retryAfter || 5;
}

/**
 * Get support actions for error
 */
export function getSupportActions(error: any): string[] {
  const authError = parseAuthError(error);
  return authError.supportActions || ['contact_support'];
}

/**
 * Create retry strategy for authentication operations
 */
export class AuthRetryStrategy {
  private maxRetries: number;
  private baseDelay: number;
  private maxDelay: number;
  
  constructor(maxRetries = 3, baseDelay = 1000, maxDelay = 30000) {
    this.maxRetries = maxRetries;
    this.baseDelay = baseDelay;
    this.maxDelay = maxDelay;
  }
  
  async execute<T>(
    operation: () => Promise<T>,
    operationName: string = 'auth_operation'
  ): Promise<T> {
    let lastError: any;
    
    for (let attempt = 1; attempt <= this.maxRetries + 1; attempt++) {
      try {
        const result = await operation();
        
        // Log success if we had previous failures
        if (attempt > 1) {
          logger.log(`${operationName} succeeded on attempt ${attempt}`, {
            totalAttempts: attempt,
            operation: operationName
          });
        }
        
        return result;
      } catch (error) {
        lastError = error;
        const authError = parseAuthError(error);
        
        // Don't retry if error is not retryable
        if (!authError.retryable) {
          logger.warn(`${operationName} failed with non-retryable error`, {
            code: authError.code,
            type: authError.type,
            attempt
          });
          throw error;
        }
        
        // Don't retry if we've exhausted attempts
        if (attempt > this.maxRetries) {
          logger.error(`${operationName} failed after ${this.maxRetries} retries`, {
            code: authError.code,
            type: authError.type,
            totalAttempts: attempt - 1
          });
          throw error;
        }
        
        // Calculate delay with exponential backoff
        const delay = Math.min(
          this.baseDelay * Math.pow(2, attempt - 1),
          authError.retryAfter ? authError.retryAfter * 1000 : this.maxDelay
        );
        
        logger.warn(`${operationName} failed, retrying in ${delay}ms`, {
          code: authError.code,
          type: authError.type,
          attempt,
          nextAttempt: attempt + 1,
          delay
        });
        
        // Wait before retrying
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
    
    throw lastError;
  }
}

/**
 * Default retry strategy instance
 */
export const defaultRetryStrategy = new AuthRetryStrategy();

/**
 * Error reporting for monitoring systems
 */
export function reportAuthError(error: AuthError, context?: Record<string, any>): void {
  // In production, this would integrate with error tracking services
  // like Sentry, LogRocket, etc.
  
  const errorReport = {
    ...error,
    context,
    environment: process.env.NODE_ENV,
    userId: context?.userId || 'anonymous',
    sessionId: context?.sessionId || 'unknown'
  };
  
  // Log locally for now
  logger.error('Auth Error Report', errorReport);
  
  // TODO: Send to external monitoring service
  // if (process.env.NODE_ENV === 'production') {
  //   Sentry.captureException(new Error(error.message), {
  //     tags: {
  //       type: error.type,
  //       severity: error.severity
  //     },
  //     extra: errorReport
  //   });
  // }
}