/**
 * Sistema de Monitoramento e Alerting - LexAI
 * Implementa integração com Firebase Crashlytics, Sentry e alerting
 */

import { logger, type LogContext } from './logger';
import { authLogger } from './auth-logger';

interface MonitoringConfig {
  sentryDsn?: string;
  firebaseCrashlyticsEnabled?: boolean;
  environment: string;
  enableUserReporting?: boolean;
  enablePerformanceMonitoring?: boolean;
}

interface ErrorReport {
  message: string;
  error: Error;
  context?: LogContext;
  severity: 'low' | 'medium' | 'high' | 'critical';
  userId?: string;
  sessionId?: string;
  tags?: Record<string, string>;
  fingerprint?: string[];
}

interface PerformanceMetric {
  name: string;
  duration: number;
  context?: LogContext;
  tags?: Record<string, string>;
}

class MonitoringService {
  private config: MonitoringConfig;
  private initialized = false;
  private sentryInitialized = false;
  private crashlyticsInitialized = false;

  constructor() {
    this.config = {
      environment: process.env.NODE_ENV || 'development',
      sentryDsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
      firebaseCrashlyticsEnabled: process.env.NEXT_PUBLIC_FIREBASE_CRASHLYTICS_ENABLED === 'true',
      enableUserReporting: process.env.NEXT_PUBLIC_ENABLE_USER_REPORTING === 'true',
      enablePerformanceMonitoring: process.env.NEXT_PUBLIC_ENABLE_PERFORMANCE_MONITORING === 'true',
    };
  }

  /**
   * Inicializa o sistema de monitoramento
   */
  async initialize(): Promise<void> {
    if (this.initialized) return;

    try {
      // Inicializar Sentry se configurado
      if (this.config.sentryDsn && this.config.environment === 'production') {
        await this.initializeSentry();
      }

      // Inicializar Firebase Crashlytics se configurado
      if (this.config.firebaseCrashlyticsEnabled) {
        await this.initializeCrashlytics();
      }

      // Setup global error handlers
      this.setupGlobalErrorHandlers();

      this.initialized = true;
      logger.info('Monitoring service initialized', {
        component: 'monitoring',
        metadata: {
          sentryEnabled: this.sentryInitialized,
          crashlyticsEnabled: this.crashlyticsInitialized,
          environment: this.config.environment,
        },
      });
    } catch (error) {
      logger.error('Failed to initialize monitoring service', error as Error, {
        component: 'monitoring',
      });
    }
  }

  /**
   * Inicializa Sentry para error tracking
   */
  private async initializeSentry(): Promise<void> {
    try {
      // Sentry initialization seria feita aqui em produção
      // Por ora, apenas simular para desenvolvimento
      if (this.config.environment === 'development') {
        logger.info('Sentry initialization simulated for development', {
          component: 'monitoring',
          metadata: { dsn: this.config.sentryDsn },
        });
        this.sentryInitialized = true;
        return;
      }

      // TODO: Implementar integração real com Sentry
      // const Sentry = await import('@sentry/nextjs');
      // Sentry.init({
      //   dsn: this.config.sentryDsn,
      //   environment: this.config.environment,
      //   tracesSampleRate: 0.1,
      //   integrations: [
      //     new Sentry.BrowserTracing(),
      //   ],
      // });

      logger.info('Sentry initialization would be implemented here', {
        component: 'monitoring',
      });
      this.sentryInitialized = true;
    } catch (error) {
      logger.error('Failed to initialize Sentry', error as Error, {
        component: 'monitoring',
      });
    }
  }

  /**
   * Inicializa Firebase Crashlytics
   */
  private async initializeCrashlytics(): Promise<void> {
    try {
      // Firebase Crashlytics initialization seria feita aqui em produção
      if (this.config.environment === 'development') {
        logger.info('Firebase Crashlytics initialization simulated for development', {
          component: 'monitoring',
        });
        this.crashlyticsInitialized = true;
        return;
      }

      // TODO: Implementar integração real com Firebase Crashlytics
      // const { getAnalytics } = await import('firebase/analytics');
      // const { getCrashlytics } = await import('firebase/crashlytics');
      // const analytics = getAnalytics(app);
      // const crashlytics = getCrashlytics(app);

      logger.info('Firebase Crashlytics initialization would be implemented here', {
        component: 'monitoring',
      });
      this.crashlyticsInitialized = true;
    } catch (error) {
      logger.error('Failed to initialize Firebase Crashlytics', error as Error, {
        component: 'monitoring',
      });
    }
  }

  /**
   * Setup global error handlers
   */
  private setupGlobalErrorHandlers(): void {
    // Unhandled promise rejections
    if (typeof window !== 'undefined') {
      window.addEventListener('unhandledrejection', (event) => {
        this.reportError({
          message: 'Unhandled promise rejection',
          error: new Error(event.reason),
          severity: 'critical',
          context: {
            component: 'global-error-handler',
            metadata: {
              type: 'unhandled-promise-rejection',
              reason: event.reason,
            },
          },
        });
      });

      // Global error handler
      window.addEventListener('error', (event) => {
        this.reportError({
          message: 'Global error caught',
          error: event.error || new Error(event.message),
          severity: 'high',
          context: {
            component: 'global-error-handler',
            metadata: {
              type: 'global-error',
              filename: event.filename,
              lineno: event.lineno,
              colno: event.colno,
            },
          },
        });
      });
    }
  }

  /**
   * Reporta erro para todos os serviços de monitoramento
   */
  reportError(report: ErrorReport): void {
    try {
      // Log estruturado sempre
      const logLevel = report.severity === 'critical' ? 'critical' : 'error';
      
      if (report.context?.component === 'auth') {
        authLogger.error(report.message, report.error, report.context);
      } else {
        logger[logLevel](report.message, report.error, report.context);
      }

      // Enviar para Sentry se inicializado
      if (this.sentryInitialized && this.config.environment === 'production') {
        this.sendToSentry(report);
      }

      // Enviar para Firebase Crashlytics se inicializado
      if (this.crashlyticsInitialized && this.config.environment === 'production') {
        this.sendToCrashlytics(report);
      }

      // Em desenvolvimento, mostrar detalhes
      if (this.config.environment === 'development') {
        console.group(`🚨 [${report.severity.toUpperCase()}] ${report.message}`);
        console.error('Error:', report.error);
        console.log('Context:', report.context);
        console.log('Tags:', report.tags);
        console.groupEnd();
      }
    } catch (error) {
      // Fallback logging se monitoramento falhar
      console.error('Failed to report error to monitoring service:', error);
      console.error('Original error:', report.error);
    }
  }

  /**
   * Envia erro para Sentry
   */
  private sendToSentry(report: ErrorReport): void {
    try {
      // TODO: Implementar envio real para Sentry
      // Sentry.withScope((scope) => {
      //   scope.setLevel(report.severity);
      //   scope.setUser({ id: report.userId });
      //   scope.setContext('report_context', report.context);
      //   if (report.tags) {
      //     Object.entries(report.tags).forEach(([key, value]) => {
      //       scope.setTag(key, value);
      //     });
      //   }
      //   if (report.fingerprint) {
      //     scope.setFingerprint(report.fingerprint);
      //   }
      //   Sentry.captureException(report.error);
      // });

      logger.debug('Error would be sent to Sentry', {
        component: 'monitoring',
        metadata: {
          severity: report.severity,
          userId: report.userId,
          message: report.message,
        },
      });
    } catch (error) {
      logger.error('Failed to send error to Sentry', error as Error, {
        component: 'monitoring',
      });
    }
  }

  /**
   * Envia erro para Firebase Crashlytics
   */
  private sendToCrashlytics(report: ErrorReport): void {
    try {
      // TODO: Implementar envio real para Firebase Crashlytics
      // const crashlytics = getCrashlytics();
      // crashlytics.setUserId(report.userId || 'unknown');
      // crashlytics.setCustomKey('severity', report.severity);
      // crashlytics.setCustomKey('component', report.context?.component || 'unknown');
      // if (report.tags) {
      //   Object.entries(report.tags).forEach(([key, value]) => {
      //     crashlytics.setCustomKey(key, value);
      //   });
      // }
      // crashlytics.recordException(report.error);

      logger.debug('Error would be sent to Firebase Crashlytics', {
        component: 'monitoring',
        metadata: {
          severity: report.severity,
          userId: report.userId,
          message: report.message,
        },
      });
    } catch (error) {
      logger.error('Failed to send error to Firebase Crashlytics', error as Error, {
        component: 'monitoring',
      });
    }
  }

  /**
   * Reporta métrica de performance
   */
  reportPerformance(metric: PerformanceMetric): void {
    if (!this.config.enablePerformanceMonitoring) return;

    try {
      // Log estruturado
      logger.performance(metric.name, metric.duration, metric.context);

      // Enviar para serviços de monitoramento se em produção
      if (this.config.environment === 'production') {
        // TODO: Implementar envio de métricas para serviços externos
        // Sentry.addBreadcrumb({
        //   category: 'performance',
        //   message: metric.name,
        //   data: { duration: metric.duration, ...metric.tags },
        // });
      }
    } catch (error) {
      logger.error('Failed to report performance metric', error as Error, {
        component: 'monitoring',
      });
    }
  }

  /**
   * Registra evento de auditoria
   */
  reportAudit(action: string, userId?: string, context?: LogContext): void {
    try {
      // Log estruturado
      logger.audit(action, userId, context);

      // Em produção, enviar para sistemas de auditoria
      if (this.config.environment === 'production') {
        // TODO: Implementar envio para sistemas de auditoria
        logger.info('Audit event would be sent to audit system', {
          component: 'monitoring',
          metadata: { action, userId },
        });
      }
    } catch (error) {
      logger.error('Failed to report audit event', error as Error, {
        component: 'monitoring',
      });
    }
  }

  /**
   * Registra evento de segurança
   */
  reportSecurity(message: string, context?: LogContext): void {
    try {
      // Log crítico de segurança
      logger.security(message, context);

      // Alert imediato para eventos de segurança
      this.reportError({
        message: `[SECURITY ALERT] ${message}`,
        error: new Error(message),
        severity: 'critical',
        context: {
          ...context,
          component: 'security',
        },
        tags: {
          type: 'security',
          alert: 'true',
        },
      });
    } catch (error) {
      logger.error('Failed to report security event', error as Error, {
        component: 'monitoring',
      });
    }
  }

  /**
   * Configura informações do usuário para tracking
   */
  setUser(userId: string, email?: string, additionalData?: Record<string, any>): void {
    try {
      // TODO: Implementar configuração de usuário nos serviços
      // if (this.sentryInitialized) {
      //   Sentry.setUser({ id: userId, email, ...additionalData });
      // }
      // if (this.crashlyticsInitialized) {
      //   const crashlytics = getCrashlytics();
      //   crashlytics.setUserId(userId);
      //   if (email) crashlytics.setCustomKey('email', email);
      // }

      logger.info('User tracking configured', {
        component: 'monitoring',
        userId,
        metadata: { email, ...additionalData },
      });
    } catch (error) {
      logger.error('Failed to set user tracking', error as Error, {
        component: 'monitoring',
      });
    }
  }

  /**
   * Limpa informações do usuário (logout)
   */
  clearUser(): void {
    try {
      // TODO: Implementar limpeza de usuário nos serviços
      // if (this.sentryInitialized) {
      //   Sentry.setUser(null);
      // }
      // if (this.crashlyticsInitialized) {
      //   const crashlytics = getCrashlytics();
      //   crashlytics.setUserId('');
      // }

      logger.info('User tracking cleared', {
        component: 'monitoring',
      });
    } catch (error) {
      logger.error('Failed to clear user tracking', error as Error, {
        component: 'monitoring',
      });
    }
  }
}

// Instância singleton
export const monitoring = new MonitoringService();

// Helpers para uso fácil
export const reportError = (error: Error, message?: string, context?: LogContext) => {
  monitoring.reportError({
    message: message || error.message,
    error,
    severity: 'high',
    context,
  });
};

export const reportCriticalError = (error: Error, message?: string, context?: LogContext) => {
  monitoring.reportError({
    message: message || error.message,
    error,
    severity: 'critical',
    context,
  });
};

export const reportPerformance = (name: string, duration: number, context?: LogContext) => {
  monitoring.reportPerformance({ name, duration, context });
};

export const reportSecurity = (message: string, context?: LogContext) => {
  monitoring.reportSecurity(message, context);
};

export const reportAudit = (action: string, userId?: string, context?: LogContext) => {
  monitoring.reportAudit(action, userId, context);
};

// Inicializar automaticamente
if (typeof window !== 'undefined') {
  monitoring.initialize();
}