/**
 * Build-Aware Orchestrator
 * Clean architecture for orchestrator services with environment awareness
 */

import { 
  getExecutionContext, 
  ExecutionContext, 
  envLog, 
  skipInBuild,
  getEnvConfig 
} from '@/lib/environment';

// Types
export interface HealthCheckResult {
  status: 'ok' | 'error' | 'timeout' | 'build-time' | 'unavailable';
  context: ExecutionContext;
  timestamp: string;
  version?: string;
  llmCount?: number;
  message?: string;
  responseTime?: number;
}

export interface LLMProviderStatus {
  provider: 'google' | 'openai' | 'anthropic';
  model: string;
  available: boolean;
  hasApiKey: boolean;
  lastCheck?: string;
  error?: string;
}

export interface OrchestratorStatus {
  status: 'ok' | 'error' | 'partial';
  context: ExecutionContext;
  timestamp: string;
  llms: LLMProviderStatus[];
  functions: HealthCheckResult;
  pipeline: {
    stages: number;
    estimatedTime: string;
  };
}

export interface OrchestratorConfig {
  healthCheckTimeout: number;
  maxRetries: number;
  retryDelay: number;
  enableHealthChecks: boolean;
}

/**
 * Build-aware orchestrator client with clean architecture
 */
export class BuildAwareOrchestrator {
  private config: OrchestratorConfig;
  private lastHealthCheck: HealthCheckResult | null = null;
  private healthCheckCache: Map<string, HealthCheckResult> = new Map();

  constructor(config: Partial<OrchestratorConfig> = {}) {
    this.config = {
      healthCheckTimeout: 5000,
      maxRetries: 2,
      retryDelay: 1000,
      enableHealthChecks: true,
      ...config
    };

    envLog('BuildAwareOrchestrator initialized', { config: this.config });
  }

  /**
   * Perform health check with environment awareness
   */
  async healthCheck(force = false): Promise<HealthCheckResult> {
    const context = getExecutionContext();
    const timestamp = new Date().toISOString();
    
    envLog('Health check requested', { context, force });

    // Handle build-time context
    if (context === ExecutionContext.BUILD_TIME) {
      return this.createBuildTimeResult(timestamp);
    }

    // Check cache for recent results (unless forced)
    if (!force && this.lastHealthCheck && this.isRecentHealthCheck()) {
      envLog('Returning cached health check result');
      return this.lastHealthCheck;
    }

    // Perform actual health check
    return this.performHealthCheck(timestamp);
  }

  /**
   * Create build-time health check result
   */
  private createBuildTimeResult(timestamp: string): HealthCheckResult {
    const result: HealthCheckResult = {
      status: 'build-time',
      context: ExecutionContext.BUILD_TIME,
      timestamp,
      message: 'Health check skipped during build phase'
    };

    envLog('Build-time health check result created', result);
    return result;
  }

  /**
   * Perform actual health check with retries and timeout
   */
  private async performHealthCheck(timestamp: string): Promise<HealthCheckResult> {
    const context = getExecutionContext();
    const startTime = Date.now();

    try {
      envLog('Performing actual health check');

      const result = await this.executeHealthCheckWithTimeout();
      const responseTime = Date.now() - startTime;

      const healthCheckResult: HealthCheckResult = {
        status: 'ok',
        context,
        timestamp,
        responseTime,
        ...result
      };

      this.lastHealthCheck = healthCheckResult;
      this.cacheHealthCheck(healthCheckResult);
      
      envLog('Health check completed successfully', { responseTime });
      return healthCheckResult;

    } catch (error) {
      const responseTime = Date.now() - startTime;
      
      const errorResult: HealthCheckResult = {
        status: this.determineErrorStatus(error),
        context,
        timestamp,
        responseTime,
        message: this.formatErrorMessage(error)
      };

      envLog('Health check failed', { error: errorResult.message, responseTime });
      return errorResult;
    }
  }

  /**
   * Execute health check with timeout
   */
  private async executeHealthCheckWithTimeout(): Promise<Partial<HealthCheckResult>> {
    return skipInBuild(async () => {
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error('Health check timeout')), this.config.healthCheckTimeout);
      });

      const healthCheckPromise = this.callExternalHealthCheck();

      return Promise.race([healthCheckPromise, timeoutPromise]);
    }) || { status: 'unavailable' as const };
  }

  /**
   * Call external health check service
   */
  private async callExternalHealthCheck(): Promise<Partial<HealthCheckResult>> {
    // This would normally call an external service
    // For now, simulate a successful health check
    
    const delay = Math.random() * 1000 + 500; // 500-1500ms
    await new Promise(resolve => setTimeout(resolve, delay));

    return {
      version: '1.0.0',
      llmCount: 3,
      message: 'All systems operational'
    };
  }

  /**
   * Get LLM providers status
   */
  getLLMStatus(): LLMProviderStatus[] {
    const config = getEnvConfig();
    
    if (!config.initializeFirebaseServices) {
      envLog('LLM status check skipped - services not initialized');
      return [];
    }

    return [
      {
        provider: 'google',
        model: 'gemini-1.5-pro',
        available: true,
        hasApiKey: this.checkApiKey('GOOGLE_AI_API_KEY'),
        lastCheck: new Date().toISOString()
      },
      {
        provider: 'openai', 
        model: 'gpt-4',
        available: true,
        hasApiKey: this.checkApiKey('OPENAI_API_KEY'),
        lastCheck: new Date().toISOString()
      },
      {
        provider: 'anthropic',
        model: 'claude-3-opus',
        available: true,
        hasApiKey: this.checkApiKey('ANTHROPIC_API_KEY'),
        lastCheck: new Date().toISOString()
      }
    ];
  }

  /**
   * Get complete orchestrator status
   */
  async getStatus(force = false): Promise<OrchestratorStatus> {
    const context = getExecutionContext();
    const timestamp = new Date().toISOString();

    envLog('Getting orchestrator status', { context, force });

    const [functionsStatus, llmStatus] = await Promise.all([
      this.healthCheck(force),
      Promise.resolve(this.getLLMStatus())
    ]);

    const status: OrchestratorStatus = {
      status: this.determineOverallStatus(functionsStatus, llmStatus),
      context,
      timestamp,
      llms: llmStatus,
      functions: functionsStatus,
      pipeline: {
        stages: 5,
        estimatedTime: '45s - 2m'
      }
    };

    envLog('Orchestrator status compiled', { status: status.status });
    return status;
  }

  /**
   * Utility methods
   */
  private checkApiKey(keyName: string): boolean {
    return !!process.env[keyName] && process.env[keyName]!.length > 10;
  }

  private isRecentHealthCheck(): boolean {
    if (!this.lastHealthCheck) return false;
    
    const lastCheckTime = new Date(this.lastHealthCheck.timestamp).getTime();
    const now = Date.now();
    const fiveMinutes = 5 * 60 * 1000;
    
    return (now - lastCheckTime) < fiveMinutes;
  }

  private cacheHealthCheck(result: HealthCheckResult): void {
    const cacheKey = `health-${result.context}-${Date.now()}`;
    this.healthCheckCache.set(cacheKey, result);
    
    // Keep only last 10 results
    if (this.healthCheckCache.size > 10) {
      const firstKey = this.healthCheckCache.keys().next().value;
      if (firstKey) {
        this.healthCheckCache.delete(firstKey);
      }
    }
  }

  private determineErrorStatus(error: unknown): 'error' | 'timeout' | 'unavailable' {
    const errorMessage = error instanceof Error ? error.message : String(error);
    
    if (errorMessage.includes('timeout')) return 'timeout';
    if (errorMessage.includes('unavailable')) return 'unavailable';
    return 'error';
  }

  private formatErrorMessage(error: unknown): string {
    if (error instanceof Error) {
      return error.message;
    }
    return String(error);
  }

  private determineOverallStatus(
    functionsStatus: HealthCheckResult, 
    llmStatus: LLMProviderStatus[]
  ): 'ok' | 'error' | 'partial' {
    // If functions are down, overall status is error
    if (functionsStatus.status === 'error') {
      return 'error';
    }

    // If build time or functions timeout, but LLMs available, it's partial
    if (functionsStatus.status === 'build-time' || functionsStatus.status === 'timeout') {
      const availableLLMs = llmStatus.filter(llm => llm.hasApiKey).length;
      return availableLLMs > 0 ? 'partial' : 'error';
    }

    // If functions are OK, check LLM availability
    const availableLLMs = llmStatus.filter(llm => llm.hasApiKey).length;
    if (availableLLMs === 0) {
      return 'error';
    }
    
    if (availableLLMs < llmStatus.length) {
      return 'partial';
    }

    return 'ok';
  }

  /**
   * Get health check history
   */
  getHealthCheckHistory(): HealthCheckResult[] {
    return Array.from(this.healthCheckCache.values()).sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  }

  /**
   * Clear caches (useful for testing)
   */
  clearCaches(): void {
    this.lastHealthCheck = null;
    this.healthCheckCache.clear();
    envLog('Orchestrator caches cleared');
  }
}

// Export singleton instance
export const orchestrator = new BuildAwareOrchestrator();

// Export factory function for custom configurations
export const createOrchestrator = (config?: Partial<OrchestratorConfig>) => 
  new BuildAwareOrchestrator(config);