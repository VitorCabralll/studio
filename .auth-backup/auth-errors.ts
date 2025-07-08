/**
 * Authentication Error Handling
 * Centralized error parsing and user-friendly messages
 */

export interface AuthError {
  code: string;
  message: string;
  originalError?: Error;
}

/**
 * Enhanced Auth Flow Error with categorization
 */
export interface AuthFlowError extends AuthError {
  category: 'auth' | 'profile' | 'permission' | 'network' | 'timing' | 'coordination';
  retryable: boolean;
  retryStrategy?: 'immediate' | 'delayed' | 'exponential' | 'coordinated';
  severity: 'low' | 'medium' | 'high' | 'critical';
}

/**
 * Parse Firebase Auth errors into user-friendly messages
 */
export function parseAuthError(error: unknown): AuthError {
  const errorObj = error as { code?: string; message?: string };
  const code = errorObj?.code || 'unknown';
  const originalMessage = errorObj?.message || 'Unknown error';
  
  const errorMessages: Record<string, string> = {
    // Authentication errors
    'auth/user-not-found': 'Usuário não encontrado. Verifique o email digitado.',
    'auth/wrong-password': 'Senha incorreta. Tente novamente.',
    'auth/invalid-email': 'Email inválido. Verifique o formato do email.',
    'auth/user-disabled': 'Esta conta foi desabilitada. Entre em contato com o suporte.',
    'auth/too-many-requests': 'Muitas tentativas de login. Tente novamente em alguns minutos.',
    'auth/network-request-failed': 'Erro de conexão. Verifique sua internet.',
    
    // Registration errors
    'auth/email-already-in-use': 'Este email já está em uso. Tente fazer login.',
    'auth/weak-password': 'Senha muito fraca. Use pelo menos 6 caracteres.',
    'auth/invalid-password': 'Senha inválida. Use pelo menos 6 caracteres.',
    
    // Google Auth errors
    'auth/popup-closed-by-user': 'Login cancelado pelo usuário.',
    'auth/popup-blocked': 'Pop-up bloqueado. Permita pop-ups para este site.',
    'auth/unauthorized-domain': 'Domínio não autorizado. Entre em contato com o suporte.',
    'auth/operation-not-allowed': 'Método de login não permitido.',
    'auth/cancelled-popup-request': 'Solicitação de pop-up cancelada.',
    
    // Network and timeout errors
    'auth/timeout': 'Operação expirou. Tente novamente.',
    
    // Generic errors
    'auth/internal-error': 'Erro interno. Tente novamente.',
    'auth/invalid-credential': 'Credenciais inválidas. Verifique seus dados.',
    'auth/credential-already-in-use': 'Credencial já está em uso.',
    'auth/invalid-verification-code': 'Código de verificação inválido.',
    'auth/invalid-verification-id': 'ID de verificação inválido.',
    'auth/code-expired': 'Código de verificação expirado.',
    
    // LexAI specific errors
    'auth-not-ready': 'Sistema de autenticação não está pronto. Aguarde um momento.',
    'profile-loading-failed': 'Falha ao carregar perfil do usuário.',
    'permission-denied': 'Acesso negado. Verifique suas permissões.',
    'coordination-failed': 'Erro de coordenação na autenticação. Tente novamente.'
  };

  const message = errorMessages[code] || `Erro de autenticação: ${originalMessage}`;
  
  return {
    code,
    message,
    originalError: error instanceof Error ? error : undefined
  };
}

/**
 * Check if error is a network-related error
 */
export function isNetworkError(error: AuthError): boolean {
  const networkCodes = [
    'auth/network-request-failed',
    'auth/timeout',
    'auth/internal-error'
  ];
  return networkCodes.includes(error.code);
}

/**
 * Check if error is recoverable (user can retry)
 */
export function isRecoverableError(error: AuthError): boolean {
  const recoverableCodes = [
    'auth/network-request-failed',
    'auth/timeout',
    'auth/too-many-requests',
    'auth/popup-closed-by-user',
    'auth/popup-blocked',
    'auth/cancelled-popup-request'
  ];
  return recoverableCodes.includes(error.code);
}

/**
 * Enhanced error categorization for auth flow issues
 */
export function categorizeAuthError(error: unknown): AuthFlowError {
  const baseError = parseAuthError(error);
  const errorObj = error as { code?: string; message?: string };
  const code = errorObj?.code || 'unknown';
  const originalMessage = errorObj?.message || 'Unknown error';
  
  // Categorize by error type
  let category: AuthFlowError['category'] = 'auth';
  let retryable = false;
  let retryStrategy: AuthFlowError['retryStrategy'] = 'immediate';
  let severity: AuthFlowError['severity'] = 'medium';
  
  // Permission and timing related errors
  if (code.includes('permission-denied') || originalMessage.includes('permission')) {
    category = 'permission';
    retryable = true;
    retryStrategy = 'coordinated';
    severity = 'high';
  }
  // Profile loading errors
  else if (code.includes('not-found') || originalMessage.includes('profile') || originalMessage.includes('document')) {
    category = 'profile';
    retryable = true;
    retryStrategy = 'delayed';
    severity = 'medium';
  }
  // Network related errors
  else if (isNetworkError(baseError) || code.includes('unavailable') || code.includes('deadline-exceeded')) {
    category = 'network';
    retryable = true;
    retryStrategy = 'exponential';
    severity = 'medium';
  }
  // Auth coordinator specific errors
  else if (code.includes('auth-not-ready') || originalMessage.includes('coordinator') || originalMessage.includes('timing')) {
    category = 'coordination';
    retryable = true;
    retryStrategy = 'coordinated';
    severity = 'high';
  }
  // Token and timing issues
  else if (code.includes('unauthenticated') || code.includes('token') || originalMessage.includes('timing')) {
    category = 'timing';
    retryable = true;
    retryStrategy = 'coordinated';
    severity = 'high';
  }
  // Standard auth errors
  else if (code.startsWith('auth/')) {
    category = 'auth';
    retryable = isRecoverableError(baseError);
    retryStrategy = 'immediate';
    severity = code.includes('user-not-found') || code.includes('wrong-password') ? 'low' : 'medium';
  }
  
  return {
    ...baseError,
    category,
    retryable,
    retryStrategy,
    severity
  };
}

/**
 * Get suggested action for an error
 */
export function getErrorAction(error: AuthError): string {
  const actions: Record<string, string> = {
    'auth/user-not-found': 'Verifique o email ou crie uma nova conta.',
    'auth/wrong-password': 'Tente novamente ou redefina sua senha.',
    'auth/email-already-in-use': 'Faça login com este email.',
    'auth/popup-blocked': 'Permita pop-ups nas configurações do navegador.',
    'auth/network-request-failed': 'Verifique sua conexão com a internet.',
    'auth/too-many-requests': 'Aguarde alguns minutos antes de tentar novamente.',
    'auth/unauthorized-domain': 'Contate o suporte técnico.',
    
    // LexAI specific actions
    'auth-not-ready': 'Aguarde alguns segundos e tente novamente.',
    'profile-loading-failed': 'Recarregue a página ou tente fazer login novamente.',
    'permission-denied': 'Aguarde um momento e tente novamente.',
    'coordination-failed': 'Recarregue a página e faça login novamente.',
  };
  
  return actions[error.code] || 'Tente novamente ou contate o suporte.';
}

/**
 * Get retry strategy for categorized errors
 */
export function getRetryStrategy(error: AuthFlowError): {
  shouldRetry: boolean;
  strategy: string;
  maxAttempts: number;
  baseDelay: number;
} {
  if (!error.retryable) {
    return {
      shouldRetry: false,
      strategy: 'none',
      maxAttempts: 0,
      baseDelay: 0
    };
  }
  
  const strategies = {
    immediate: { maxAttempts: 2, baseDelay: 0 },
    delayed: { maxAttempts: 3, baseDelay: 1000 },
    exponential: { maxAttempts: 3, baseDelay: 1000 },
    coordinated: { maxAttempts: 3, baseDelay: 1500 }
  };
  
  const config = strategies[error.retryStrategy || 'immediate'];
  
  return {
    shouldRetry: true,
    strategy: error.retryStrategy || 'immediate',
    maxAttempts: config.maxAttempts,
    baseDelay: config.baseDelay
  };
}

/**
 * Check if error indicates timing/coordination issues
 */
export function isTimingError(error: AuthError | AuthFlowError): boolean {
  const timingCodes = [
    'permission-denied',
    'auth-not-ready',
    'coordination-failed',
    'unauthenticated'
  ];
  
  return timingCodes.includes(error.code) || 
         error.message.includes('timing') ||
         error.message.includes('propagation') ||
         ('category' in error && error.category === 'timing');
}

/**
 * Check if error indicates profile-related issues
 */
export function isProfileError(error: AuthError | AuthFlowError): boolean {
  const profileCodes = [
    'profile-loading-failed',
    'not-found',
    'invalid-argument'
  ];
  
  return profileCodes.includes(error.code) || 
         error.message.includes('profile') ||
         ('category' in error && error.category === 'profile');
}