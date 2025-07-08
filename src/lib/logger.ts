/**
 * Sistema de logging estruturado para produção
 * Substitui console.log com logs estruturados e seguros
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error' | 'critical';

interface LogContext {
  userId?: string;
  sessionId?: string;
  component?: string;
  action?: string;
  metadata?: Record<string, unknown>;
  timestamp?: string;
  environment?: string;
}

interface LogEntry extends LogContext {
  level: LogLevel;
  message: string;
  error?: Error;
  stack?: string;
}

class StructuredLogger {
  private isDevelopment: boolean;
  private sessionId: string;
  private environment: string;

  constructor() {
    this.isDevelopment = process.env.NODE_ENV === 'development';
    this.environment = process.env.NODE_ENV || 'unknown';
    this.sessionId = this.generateSessionId();
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private sanitizeData(data: unknown): unknown {
    if (typeof data !== 'object' || data === null) {
      return data;
    }

    const sensitiveKeys = [
      'password', 'token', 'key', 'secret', 'auth', 'api_key', 
      'apiKey', 'authorization', 'credential', 'private'
    ];

    if (Array.isArray(data)) {
      return data.map(item => this.sanitizeData(item));
    }

    const sanitized: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(data as Record<string, unknown>)) {
      const isSensitive = sensitiveKeys.some(sensitive => 
        key.toLowerCase().includes(sensitive)
      );

      if (isSensitive) {
        sanitized[key] = '[REDACTED]';
      } else if (typeof value === 'object' && value !== null) {
        sanitized[key] = this.sanitizeData(value);
      } else {
        sanitized[key] = value;
      }
    }

    return sanitized;
  }

  private createLogEntry(
    level: LogLevel, 
    message: string, 
    context: LogContext = {},
    error?: Error
  ): LogEntry {
    const entry: LogEntry = {
      level,
      message,
      timestamp: new Date().toISOString(),
      sessionId: this.sessionId,
      environment: this.environment,
      ...context
    };

    if (error) {
      entry.error = {
        name: error.name,
        message: error.message,
        stack: error.stack
      } as Error;
      entry.stack = error.stack;
    }

    // Sanitizar dados sensíveis
    entry.metadata = context.metadata ? 
      this.sanitizeData(context.metadata) as Record<string, unknown> : 
      undefined;

    return entry;
  }

  private outputLog(entry: LogEntry): void {
    if (this.isDevelopment) {
      // Em desenvolvimento, usar console com cores
      const colors = {
        debug: '\x1b[36m',    // Cyan
        info: '\x1b[32m',     // Green
        warn: '\x1b[33m',     // Yellow
        error: '\x1b[31m',    // Red
        critical: '\x1b[35m', // Magenta
        reset: '\x1b[0m'
      };

      const color = colors[entry.level];
      const timestamp = new Date(entry.timestamp!).toLocaleTimeString();
      
      console.log(
        `${color}[${entry.level.toUpperCase()}]${colors.reset} ` +
        `${timestamp} ${entry.component ? `[${entry.component}] ` : ''}` +
        `${entry.message}`
      );

      if (entry.metadata && Object.keys(entry.metadata).length > 0) {
        console.log('  Metadata:', entry.metadata);
      }

      if (entry.error) {
        console.error('  Error:', entry.error);
      }
    } else {
      // Em produção, JSON estruturado
      console.log(JSON.stringify(entry));
    }
  }

  debug(message: string, context?: LogContext): void {
    if (this.isDevelopment) {
      const entry = this.createLogEntry('debug', message, context);
      this.outputLog(entry);
    }
  }

  info(message: string, context?: LogContext): void {
    const entry = this.createLogEntry('info', message, context);
    this.outputLog(entry);
  }

  warn(message: string, context?: LogContext): void {
    const entry = this.createLogEntry('warn', message, context);
    this.outputLog(entry);
  }

  error(message: string, error?: Error, context?: LogContext): void {
    const entry = this.createLogEntry('error', message, context, error);
    this.outputLog(entry);
  }

  critical(message: string, error?: Error, context?: LogContext): void {
    const entry = this.createLogEntry('critical', message, context, error);
    this.outputLog(entry);
    
    // Em produção, críticos vão para alerting via monitoring service
    if (this.environment === 'production' && typeof window !== 'undefined') {
      try {
        // Integração com monitoring service será carregada dinamicamente
        import('./monitoring').then(({ monitoring }) => {
          monitoring.reportError({
            message,
            error: error || new Error(message),
            severity: 'critical',
            context,
          });
        });
      } catch (err) {
        // Fallback se monitoring falhar
        console.error('Failed to report critical error to monitoring:', err);
      }
    }
  }

  // Métodos específicos para diferentes contextos
  security(message: string, context?: LogContext): void {
    this.critical(`[SECURITY] ${message}`, undefined, {
      ...context,
      component: 'security'
    });
  }

  performance(message: string, duration: number, context?: LogContext): void {
    this.info(`[PERFORMANCE] ${message}`, {
      ...context,
      component: 'performance',
      metadata: {
        ...context?.metadata,
        duration,
        timestamp: Date.now()
      }
    });
  }

  audit(action: string, userId?: string, context?: LogContext): void {
    this.info(`[AUDIT] ${action}`, {
      ...context,
      component: 'audit',
      userId,
      action
    });
  }

  // Wrapper para capturar erros não tratados
  captureException(error: Error, context?: LogContext): void {
    this.critical('Unhandled exception captured', error, {
      ...context,
      component: 'exception-handler'
    });
  }
}

// Instância singleton
const logger = new StructuredLogger();

export { logger, type LogLevel, type LogContext };

// Substituições para console.log
export const log = {
  debug: (message: string, context?: LogContext) => logger.debug(message, context),
  info: (message: string, context?: LogContext) => logger.info(message, context),
  warn: (message: string, context?: LogContext) => logger.warn(message, context),
  error: (message: string, error?: Error, context?: LogContext) => logger.error(message, error, context),
  security: (message: string, context?: LogContext) => logger.security(message, context),
  performance: (message: string, duration: number, context?: LogContext) => 
    logger.performance(message, duration, context),
  audit: (action: string, userId?: string, context?: LogContext) => 
    logger.audit(action, userId, context)
};

// Helper para medir performance
export function measurePerformance<T>(
  fn: () => T | Promise<T>,
  operation: string,
  context?: LogContext
): T | Promise<T> {
  const start = performance.now();
  
  try {
    const result = fn();
    
    if (result instanceof Promise) {
      return result
        .then((value) => {
          const duration = performance.now() - start;
          logger.performance(`${operation} completed`, duration, context);
          return value;
        })
        .catch((error) => {
          const duration = performance.now() - start;
          logger.error(`${operation} failed after ${duration}ms`, error, context);
          throw error;
        });
    } else {
      const duration = performance.now() - start;
      logger.performance(`${operation} completed`, duration, context);
      return result;
    }
  } catch (error) {
    const duration = performance.now() - start;
    logger.error(`${operation} failed after ${duration}ms`, error as Error, context);
    throw error;
  }
}