/**
 * Intelligent Retry Strategies with Exponential Backoff
 * Implementa estratégias avançadas de retry com classificação de erro e circuit breakers
 */

export interface RetryConfig {
  maxAttempts: number;
  baseDelay: number;
  maxDelay: number;
  jitterFactor: number;
  backoffMultiplier: number;
  retryableErrors: string[];
  nonRetryableErrors: string[];
}

export interface RetryResult<T> {
  success: boolean;
  result?: T;
  error?: Error;
  attempts: number;
  totalTime: number;
  strategy: string;
}

export interface RetryMetrics {
  totalRetries: number;
  successfulRetries: number;
  failedRetries: number;
  averageAttempts: number;
  averageRetryTime: number;
  errorDistribution: Record<string, number>;
}

/**
 * Error Classifier - Determina se um erro é retriable
 */
export class ErrorClassifier {
  private static readonly RETRYABLE_PATTERNS = [
    /network.*error/i,
    /timeout/i,
    /unavailable/i,
    /rate.*limit/i,
    /temporary/i,
    /ECONNRESET/i,
    /ENOTFOUND/i,
    /permission-denied/i // Firebase auth timing issues
  ];

  private static readonly NON_RETRYABLE_PATTERNS = [
    /invalid.*token/i,
    /not.*found/i,
    /already.*exists/i,
    /forbidden/i,
    /unauthorized/i,
    /bad.*request/i,
    /quota.*exceeded/i
  ];

  static isRetryable(error: Error | unknown, config?: RetryConfig): boolean {
    const errorMessage = error instanceof Error ? error.message : String(error);
    const errorCode = (error as any)?.code || '';
    const combinedError = `${errorMessage} ${errorCode}`.toLowerCase();

    // Check explicit config first
    if (config) {
      if (config.retryableErrors.some(pattern => new RegExp(pattern, 'i').test(combinedError))) {
        return true;
      }
      if (config.nonRetryableErrors.some(pattern => new RegExp(pattern, 'i').test(combinedError))) {
        return false;
      }
    }

    // Check non-retryable patterns first (more specific)
    if (this.NON_RETRYABLE_PATTERNS.some(pattern => pattern.test(combinedError))) {
      return false;
    }

    // Check retryable patterns
    if (this.RETRYABLE_PATTERNS.some(pattern => pattern.test(combinedError))) {
      return true;
    }

    // Default: don't retry unknown errors
    return false;
  }

  static categorizeError(error: Error | unknown): string {
    const errorMessage = error instanceof Error ? error.message : String(error);
    const errorCode = (error as any)?.code || '';
    
    if (/network/i.test(errorMessage)) return 'network';
    if (/timeout/i.test(errorMessage)) return 'timeout';
    if (/permission/i.test(errorMessage)) return 'permission';
    if (/rate.*limit/i.test(errorMessage)) return 'rate_limit';
    if (/unavailable/i.test(errorMessage)) return 'unavailable';
    if (errorCode) return errorCode;
    
    return 'unknown';
  }
}

/**
 * Advanced Retry Strategy with Intelligent Backoff
 */
export class IntelligentRetryStrategy {
  private metrics: RetryMetrics = {
    totalRetries: 0,
    successfulRetries: 0,
    failedRetries: 0,
    averageAttempts: 0,
    averageRetryTime: 0,
    errorDistribution: {}
  };

  private readonly defaultConfig: RetryConfig = {
    maxAttempts: 3,
    baseDelay: 1000,
    maxDelay: 30000,
    jitterFactor: 0.1,
    backoffMultiplier: 2,
    retryableErrors: ['network-error', 'timeout', 'unavailable', 'permission-denied'],
    nonRetryableErrors: ['invalid-token', 'not-found', 'forbidden']
  };

  async executeWithRetry<T>(
    operation: () => Promise<T>,
    config: Partial<RetryConfig> = {},
    context: string = 'unknown'
  ): Promise<RetryResult<T>> {
    const finalConfig = { ...this.defaultConfig, ...config };
    const startTime = performance.now();
    let lastError: Error | unknown;
    
    console.log(`🔄 IntelligentRetry[${context}]: Starting operation with config`, {
      maxAttempts: finalConfig.maxAttempts,
      baseDelay: finalConfig.baseDelay,
      strategy: 'exponential_backoff_with_jitter'
    });

    for (let attempt = 1; attempt <= finalConfig.maxAttempts; attempt++) {
      try {
        console.log(`📡 IntelligentRetry[${context}]: Attempt ${attempt}/${finalConfig.maxAttempts}`);
        
        const result = await operation();
        const totalTime = performance.now() - startTime;
        
        // Update success metrics
        this.updateMetrics(true, attempt, totalTime, null);
        
        console.log(`✅ IntelligentRetry[${context}]: Success on attempt ${attempt} (${totalTime.toFixed(2)}ms)`);
        
        return {
          success: true,
          result,
          attempts: attempt,
          totalTime,
          strategy: 'exponential_backoff_with_jitter'
        };

      } catch (error) {
        lastError = error;
        const errorCategory = ErrorClassifier.categorizeError(error);
        const isRetryable = ErrorClassifier.isRetryable(error, finalConfig);
        
        console.log(`❌ IntelligentRetry[${context}]: Attempt ${attempt} failed`, {
          error: error instanceof Error ? error.message : String(error),
          category: errorCategory,
          retryable: isRetryable,
          remainingAttempts: finalConfig.maxAttempts - attempt
        });

        // Update error distribution
        this.metrics.errorDistribution[errorCategory] = (this.metrics.errorDistribution[errorCategory] || 0) + 1;

        // Check if error is retryable
        if (!isRetryable) {
          console.log(`🚫 IntelligentRetry[${context}]: Non-retryable error, aborting`);
          break;
        }

        // Check if we have more attempts
        if (attempt >= finalConfig.maxAttempts) {
          console.log(`🚫 IntelligentRetry[${context}]: Max attempts reached`);
          break;
        }

        // Calculate backoff delay with jitter
        const delay = this.calculateBackoffDelay(attempt, finalConfig);
        console.log(`⏳ IntelligentRetry[${context}]: Waiting ${delay}ms before retry...`);
        
        await this.sleep(delay);
      }
    }

    // Operation failed after all retries
    const totalTime = performance.now() - startTime;
    this.updateMetrics(false, finalConfig.maxAttempts, totalTime, lastError);
    
    console.error(`💥 IntelligentRetry[${context}]: Operation failed after ${finalConfig.maxAttempts} attempts (${totalTime.toFixed(2)}ms)`);
    
    return {
      success: false,
      error: lastError instanceof Error ? lastError : new Error(String(lastError)),
      attempts: finalConfig.maxAttempts,
      totalTime,
      strategy: 'exponential_backoff_with_jitter'
    };
  }

  /**
   * Calculate backoff delay with exponential growth and jitter
   */
  private calculateBackoffDelay(attempt: number, config: RetryConfig): number {
    // Exponential backoff: baseDelay * (multiplier ^ (attempt - 1))
    const exponentialDelay = config.baseDelay * Math.pow(config.backoffMultiplier, attempt - 1);
    
    // Add jitter to prevent thundering herd
    const jitter = exponentialDelay * config.jitterFactor * (Math.random() - 0.5) * 2;
    const delayWithJitter = exponentialDelay + jitter;
    
    // Cap at maxDelay
    return Math.min(delayWithJitter, config.maxDelay);
  }

  /**
   * Sleep utility
   */
  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Update retry metrics
   */
  private updateMetrics(success: boolean, attempts: number, totalTime: number, error: Error | unknown): void {
    this.metrics.totalRetries++;
    
    if (success) {
      this.metrics.successfulRetries++;
    } else {
      this.metrics.failedRetries++;
    }

    // Update running averages
    const total = this.metrics.totalRetries;
    this.metrics.averageAttempts = ((this.metrics.averageAttempts * (total - 1)) + attempts) / total;
    this.metrics.averageRetryTime = ((this.metrics.averageRetryTime * (total - 1)) + totalTime) / total;
  }

  /**
   * Get current metrics
   */
  getMetrics(): RetryMetrics & { successRate: number } {
    const successRate = this.metrics.totalRetries > 0 
      ? (this.metrics.successfulRetries / this.metrics.totalRetries) * 100 
      : 0;

    return {
      ...this.metrics,
      successRate
    };
  }

  /**
   * Reset metrics
   */
  resetMetrics(): void {
    this.metrics = {
      totalRetries: 0,
      successfulRetries: 0,
      failedRetries: 0,
      averageAttempts: 0,
      averageRetryTime: 0,
      errorDistribution: {}
    };
  }
}

/**
 * Specialized retry strategies for different operations
 */
export class AuthRetryStrategies {
  private static loginStrategy = new IntelligentRetryStrategy();
  private static tokenValidationStrategy = new IntelligentRetryStrategy();
  private static profileLoadStrategy = new IntelligentRetryStrategy();

  static async retryLogin<T>(operation: () => Promise<T>): Promise<RetryResult<T>> {
    return this.loginStrategy.executeWithRetry(
      operation,
      {
        maxAttempts: 3,
        baseDelay: 1000,
        maxDelay: 5000,
        retryableErrors: ['network-error', 'timeout', 'rate-limit-exceeded'],
        nonRetryableErrors: ['invalid-credentials', 'user-disabled', 'too-many-requests']
      },
      'auth_login'
    );
  }

  static async retryTokenValidation<T>(operation: () => Promise<T>): Promise<RetryResult<T>> {
    return this.tokenValidationStrategy.executeWithRetry(
      operation,
      {
        maxAttempts: 5,
        baseDelay: 500,
        maxDelay: 8000,
        retryableErrors: ['permission-denied', 'unavailable', 'timeout'],
        nonRetryableErrors: ['invalid-token', 'token-expired', 'user-not-found']
      },
      'token_validation'
    );
  }

  static async retryProfileLoad<T>(operation: () => Promise<T>): Promise<RetryResult<T>> {
    return this.profileLoadStrategy.executeWithRetry(
      operation,
      {
        maxAttempts: 4,
        baseDelay: 800,
        maxDelay: 10000,
        retryableErrors: ['unavailable', 'timeout', 'network-error'],
        nonRetryableErrors: ['permission-denied', 'not-found', 'quota-exceeded']
      },
      'profile_load'
    );
  }

  static getMetrics() {
    return {
      login: this.loginStrategy.getMetrics(),
      tokenValidation: this.tokenValidationStrategy.getMetrics(),
      profileLoad: this.profileLoadStrategy.getMetrics()
    };
  }

  static resetMetrics() {
    this.loginStrategy.resetMetrics();
    this.tokenValidationStrategy.resetMetrics();
    this.profileLoadStrategy.resetMetrics();
  }
}

// Export singleton instance for general use
export const globalRetryStrategy = new IntelligentRetryStrategy();

// Export utility function for one-off retries
export async function retryOperation<T>(
  operation: () => Promise<T>,
  config?: Partial<RetryConfig>,
  context?: string
): Promise<T> {
  const result = await globalRetryStrategy.executeWithRetry(operation, config, context);
  
  if (result.success && result.result !== undefined) {
    return result.result;
  }
  
  throw result.error || new Error('Operation failed after retries');
}