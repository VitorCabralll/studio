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
 * Parse Firebase Auth errors into user-friendly messages
 */
export function parseAuthError(error: any): AuthError {
  const code = error?.code || 'unknown';
  const originalMessage = error?.message || 'Unknown error';
  
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
  };

  const message = errorMessages[code] || `Erro de autenticação: ${originalMessage}`;
  
  return {
    code,
    message,
    originalError: error
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
  };
  
  return actions[error.code] || 'Tente novamente ou contate o suporte.';
}