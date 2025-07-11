/**
 * Production-Safe Logger
 * Logs apenas em desenvolvimento, silencioso em produção
 */

export interface LogContext {
  [key: string]: any;
}

export class Logger {
  private static isDevelopment = process.env.NODE_ENV === 'development';
  private static isProduction = process.env.NODE_ENV === 'production';

  /**
   * Log informativo - apenas em desenvolvimento
   */
  static log(message: string, data?: LogContext): void {
    if (this.isDevelopment) {
      if (data) {
        console.log(message, data);
      } else {
        console.log(message);
      }
    }
    // Em produção: silencioso (pode ser enviado para monitoramento futuro)
  }

  /**
   * Log de erro - sempre registra, mas com diferentes níveis
   */
  static error(message: string, error?: any, context?: LogContext): void {
    if (this.isDevelopment) {
      console.error(message, error, context);
    } else if (this.isProduction) {
      // Em produção: apenas erros críticos (pode ser enviado para Sentry futuro)
      // Por enquanto, silencioso para não expor informações
    }
  }

  /**
   * Log de warning - apenas em desenvolvimento
   */
  static warn(message: string, data?: LogContext): void {
    if (this.isDevelopment) {
      if (data) {
        console.warn(message, data);
      } else {
        console.warn(message);
      }
    }
  }

  /**
   * Log de debug - apenas em desenvolvimento com flag DEBUG
   */
  static debug(message: string, data?: LogContext): void {
    if (this.isDevelopment && process.env.DEBUG === 'true') {
      if (data) {
        console.log(`[DEBUG] ${message}`, data);
      } else {
        console.log(`[DEBUG] ${message}`);
      }
    }
  }

  /**
   * Log de informações do sistema - apenas em desenvolvimento
   */
  static info(message: string, data?: LogContext): void {
    if (this.isDevelopment) {
      if (data) {
        console.info(message, data);
      } else {
        console.info(message);
      }
    }
  }

  /**
   * Log condicional baseado em ambiente
   */
  static conditional(
    condition: boolean,
    message: string,
    data?: LogContext
  ): void {
    if (this.isDevelopment && condition) {
      this.log(message, data);
    }
  }
}

// Exportações de conveniência
export const logger = Logger;
export default Logger;