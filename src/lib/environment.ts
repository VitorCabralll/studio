/**
 * Environment Detection System
 * Provides clean, reliable detection of execution context
 */

export enum ExecutionContext {
  BUILD_TIME = 'build',
  SERVER_RUNTIME = 'server',
  CLIENT_RUNTIME = 'client', 
  DEVELOPMENT = 'development',
  TEST = 'test'
}

export interface EnvironmentInfo {
  context: ExecutionContext;
  isProduction: boolean;
  isDevelopment: boolean;
  isClient: boolean;
  isServer: boolean;
  isBuild: boolean;
  isTest: boolean;
  nodeEnv: string;
  nextPhase?: string;
}

/**
 * Get current execution context with comprehensive detection
 */
export function getExecutionContext(): ExecutionContext {
  // Test environment
  if (process.env.NODE_ENV === 'test' || process.env.JEST_WORKER_ID) {
    return ExecutionContext.TEST;
  }

  // Build time detection - multiple indicators
  if (
    process.env.NEXT_PHASE === 'phase-production-build' ||
    process.env.NEXT_PHASE === 'phase-development-build' ||
    process.env.npm_lifecycle_event === 'build' ||
    process.env.BUILDING === 'true'
  ) {
    return ExecutionContext.BUILD_TIME;
  }

  // Client runtime detection
  if (typeof window !== 'undefined') {
    return ExecutionContext.CLIENT_RUNTIME;
  }

  // Server runtime detection
  if (typeof window === 'undefined') {
    return process.env.NODE_ENV === 'development'
      ? ExecutionContext.DEVELOPMENT
      : ExecutionContext.SERVER_RUNTIME;
  }

  // Fallback
  return ExecutionContext.SERVER_RUNTIME;
}

/**
 * Get comprehensive environment information
 */
export function getEnvironmentInfo(): EnvironmentInfo {
  const context = getExecutionContext();
  const nodeEnv = process.env.NODE_ENV || 'development';

  return {
    context,
    isProduction: nodeEnv === 'production',
    isDevelopment: nodeEnv === 'development',
    isClient: context === ExecutionContext.CLIENT_RUNTIME,
    isServer: context === ExecutionContext.SERVER_RUNTIME || context === ExecutionContext.DEVELOPMENT,
    isBuild: context === ExecutionContext.BUILD_TIME,
    isTest: context === ExecutionContext.TEST,
    nodeEnv,
    nextPhase: process.env.NEXT_PHASE
  };
}

// Convenience functions
export const isBuildTime = (): boolean => getExecutionContext() === ExecutionContext.BUILD_TIME;
export const isServerRuntime = (): boolean => {
  const context = getExecutionContext();
  return context === ExecutionContext.SERVER_RUNTIME || context === ExecutionContext.DEVELOPMENT;
};
export const isClientRuntime = (): boolean => getExecutionContext() === ExecutionContext.CLIENT_RUNTIME;
export const isDevelopment = (): boolean => getExecutionContext() === ExecutionContext.DEVELOPMENT;
export const isProduction = (): boolean => process.env.NODE_ENV === 'production';
export const isTest = (): boolean => getExecutionContext() === ExecutionContext.TEST;

/**
 * Safe execution wrapper that respects environment context
 */
export function executeInContext<T>(
  contexts: ExecutionContext[],
  fn: () => T,
  fallback?: T
): T | undefined {
  const currentContext = getExecutionContext();
  
  if (contexts.includes(currentContext)) {
    return fn();
  }
  
  return fallback;
}

/**
 * Conditional execution based on environment
 */
export const onlyInBrowser = <T>(fn: () => T): T | undefined => 
  executeInContext([ExecutionContext.CLIENT_RUNTIME], fn);

export const onlyOnServer = <T>(fn: () => T): T | undefined => 
  executeInContext([ExecutionContext.SERVER_RUNTIME, ExecutionContext.DEVELOPMENT], fn);

export const skipInBuild = <T>(fn: () => T): T | undefined => 
  executeInContext([
    ExecutionContext.CLIENT_RUNTIME, 
    ExecutionContext.SERVER_RUNTIME, 
    ExecutionContext.DEVELOPMENT
  ], fn);

/**
 * Environment-aware logging
 */
export function envLog(message: string, data?: unknown): void {
  const env = getEnvironmentInfo();
  
  if (env.isBuild) {
    // Silent during build to prevent hangs
    return;
  }
  
  if (env.isDevelopment) {
    console.log(`[${env.context}] ${message}`, data || '');
  }
}

/**
 * Get environment-specific configuration
 */
export function getEnvConfig() {
  const env = getEnvironmentInfo();
  
  return {
    // Logging configuration
    enableLogging: env.isDevelopment && !env.isBuild,
    enableVerboseLogging: env.isDevelopment && !env.isBuild,
    
    // Service initialization
    initializeFirebaseServices: !env.isBuild,
    performHealthChecks: !env.isBuild,
    enableAnalytics: env.isClient && env.isProduction,
    
    // Performance configuration
    enableBundleAnalysis: env.isDevelopment && process.env.ANALYZE === 'true',
    enableSourceMaps: env.isDevelopment,
    enableOptimizations: env.isProduction,
    
    // Security configuration
    enableAppCheck: env.isProduction && env.isClient,
    validateAuthTokens: !env.isBuild,
    
    // Development helpers
    enableHotReload: env.isDevelopment,
    enableDebugMode: env.isDevelopment && process.env.DEBUG === 'true'
  };
}