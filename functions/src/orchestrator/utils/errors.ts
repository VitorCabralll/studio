/**
 * Error handling centralizado
 */

import type { ProcessingError } from '../types';

export class APIKeyError extends Error {
  constructor(provider: string) {
    super(`API key inválida ou ausente para ${provider}`);
    this.name = 'APIKeyError';
  }
}

export class RateLimitError extends Error {
  constructor(provider: string, retryAfter?: number) {
    super(`Rate limit atingido para ${provider}${retryAfter ? `. Tente novamente em ${retryAfter}s` : ''}`);
    this.name = 'RateLimitError';
  }
}

export class TimeoutError extends Error {
  constructor(operation: string, timeout: number) {
    super(`Timeout de ${timeout}ms excedido em: ${operation}`);
    this.name = 'TimeoutError';
  }
}

export class PipelineError extends Error {
  public cause: Error;
  
  constructor(stage: string, cause: Error) {
    super(`Erro no estágio '${stage}': ${cause.message}`);
    this.name = 'PipelineError';
    this.cause = cause;
  }
}

export class ErrorHandler {
  /**
   * Converte erro genérico em ProcessingError estruturado
   */
  static handle(error: unknown, context?: { stage?: string }): ProcessingError {
    const timestamp = new Date();
    
    if (error instanceof APIKeyError) {
      return {
        code: 'API_KEY_INVALID',
        message: 'Configuração de API inválida. Verifique as chaves de acesso.',
        stage: context?.stage,
        retryable: false,
        timestamp,
        details: { originalError: error.message }
      };
    }
    
    if (error instanceof RateLimitError) {
      return {
        code: 'RATE_LIMIT',
        message: 'Limite de uso atingido. Tente novamente em alguns minutos.',
        stage: context?.stage,
        retryable: true,
        timestamp,
        details: { originalError: error.message }
      };
    }
    
    if (error instanceof TimeoutError) {
      return {
        code: 'TIMEOUT',
        message: 'Tempo limite excedido. O processamento está demorando mais que o esperado.',
        stage: context?.stage,
        retryable: true,
        timestamp,
        details: { originalError: error.message }
      };
    }
    
    if (error instanceof PipelineError) {
      return {
        code: 'PIPELINE_ERROR',
        message: `Falha no estágio '${context?.stage || 'desconhecido'}': ${error.message}`,
        stage: context?.stage,
        retryable: this.isRetryableError(error.cause),
        timestamp,
        details: { originalError: error.message }
      };
    }
    
    // Erro genérico
    const message = error instanceof Error ? error.message : 'Erro inesperado';
    return {
      code: 'UNKNOWN_ERROR',
      message: 'Erro no processamento. Tente novamente ou entre em contato com o suporte.',
      stage: context?.stage,
      retryable: this.isRetryableError(error),
      timestamp,
      details: { originalError: message }
    };
  }

  /**
   * Determina se um erro permite retry
   */
  static isRetryableError(error: unknown): boolean {
    if (error instanceof Error) {
      const retryablePatterns = [
        'timeout', 'rate limit', 'quota', 'network', 'fetch', 
        'temporarily unavailable', '429', '503', '502', 'ECONNRESET',
        'ETIMEDOUT', 'ENOTFOUND'
      ];
      
      return retryablePatterns.some(pattern => 
        error.message.toLowerCase().includes(pattern)
      );
    }
    
    return false;
  }

  /**
   * Gera mensagem user-friendly baseada no código de erro
   */
  static getUserFriendlyMessage(error: ProcessingError): string {
    const messages: Record<string, string> = {
      'API_KEY_INVALID': 'Erro de configuração. Entre em contato com o suporte.',
      'RATE_LIMIT': 'Muitas solicitações. Tente novamente em alguns minutos.',
      'TIMEOUT': 'Processamento muito longo. Tente dividir o documento em partes menores.',
      'PIPELINE_ERROR': 'Erro no processamento. Verifique o conteúdo dos documentos.',
      'VALIDATION_ERROR': 'Dados inválidos. Verifique as informações fornecidas.',
      'UNKNOWN_ERROR': 'Erro inesperado. Tente novamente ou entre em contato com o suporte.'
    };

    return messages[error.code] || error.message;
  }

  /**
   * Calcula delay para retry com backoff exponencial
   */
  static calculateRetryDelay(
    attempt: number, 
    baseDelay: number = 1000, 
    maxDelay: number = 30000,
    exponential: boolean = true
  ): number {
    if (!exponential) {
      return Math.min(baseDelay, maxDelay);
    }
    
    const delay = baseDelay * Math.pow(2, attempt - 1);
    return Math.min(delay, maxDelay);
  }

  /**
   * Log estruturado de erro
   */
  static logError(error: ProcessingError, context?: Record<string, any>): void {
    console.error('[ERROR]', {
      code: error.code,
      message: error.message,
      stage: error.stage,
      retryable: error.retryable,
      timestamp: error.timestamp,
      context,
      details: error.details
    });
  }
}