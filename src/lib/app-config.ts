/**
 * LexAI Unified Application Configuration
 * 
 * Centralizes all environment, Firebase, feature flags, and other configurations
 * into a single, type-safe, and easily accessible object. This file replaces
 * the scattered logic from environment.ts, firebase-config.ts, and staging-config.ts.
 * 
 * @see PLANO_CORRECOES_AUTH.md - Item 4.1
 */

// --- Core Enums and Types ---

export enum ExecutionContext {
  BUILD_TIME = 'build',
  SERVER_RUNTIME = 'server',
  CLIENT_RUNTIME = 'client',
  DEVELOPMENT = 'development',
  TEST = 'test',
  UNKNOWN = 'unknown',
}

export enum AppEnvironment {
  PRODUCTION = 'production',
  DEVELOPMENT = 'development',
  STAGING = 'staging',
  TEST = 'test',
}

export interface EnvironmentInfo {
  context: ExecutionContext;
  appEnv: AppEnvironment;
  isProduction: boolean;
  isDevelopment: boolean;
  isStaging: boolean;
  isTest: boolean;
  isClient: boolean;
  isServer: boolean;
  isBuild: boolean;
  nodeEnv: string;
}

interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
  measurementId?: string;
}

// --- Internal Getter Functions ---

/**
 * Determines the current execution environment for the application.
 * @returns {EnvironmentInfo} A comprehensive object describing the environment.
 */
function getEnvironmentInfoInternal(): EnvironmentInfo {
  const getContext = (): ExecutionContext => {
    if (process.env.NODE_ENV === 'test' || process.env.JEST_WORKER_ID) {
      return ExecutionContext.TEST;
    }
    if (
      process.env.NEXT_PHASE === 'phase-production-build' ||
      process.env.npm_lifecycle_event === 'build'
    ) {
      return ExecutionContext.BUILD_TIME;
    }
    if (typeof window !== 'undefined') {
      return ExecutionContext.CLIENT_RUNTIME;
    }
    if (typeof window === 'undefined') {
      return process.env.NODE_ENV === 'development'
        ? ExecutionContext.DEVELOPMENT
        : ExecutionContext.SERVER_RUNTIME;
    }
    return ExecutionContext.UNKNOWN;
  };

  const context = getContext();
  const appEnv = (process.env.NEXT_PUBLIC_APP_ENV as AppEnvironment) || AppEnvironment.DEVELOPMENT;
  const nodeEnv = process.env.NODE_ENV || 'development';

  return {
    context,
    appEnv,
    isProduction: appEnv === AppEnvironment.PRODUCTION,
    isDevelopment: appEnv === AppEnvironment.DEVELOPMENT,
    isStaging: appEnv === AppEnvironment.STAGING,
    isTest: context === ExecutionContext.TEST,
    isClient: context === ExecutionContext.CLIENT_RUNTIME,
    isServer: context === ExecutionContext.SERVER_RUNTIME || context === ExecutionContext.DEVELOPMENT,
    isBuild: context === ExecutionContext.BUILD_TIME,
    nodeEnv,
  };
}

/**
 * Retrieves Firebase configuration from environment variables.
 * @param envInfo - The current environment information.
 * @returns {FirebaseConfig} The Firebase configuration object.
 */
function getFirebaseConfigInternal(envInfo: EnvironmentInfo): FirebaseConfig {
  if (process.env.FIREBASE_WEBAPP_CONFIG) {
    try {
      return JSON.parse(process.env.FIREBASE_WEBAPP_CONFIG);
    } catch (error) {
      console.warn('Failed to parse FIREBASE_WEBAPP_CONFIG:', error);
    }
  }

  const config = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET!,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID!,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID!,
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
  };

  const required = ['apiKey', 'authDomain', 'projectId', 'storageBucket', 'messagingSenderId', 'appId'];
  const missing = required.filter(key => !config[key as keyof typeof config]);

  if (missing.length > 0 && !envInfo.isBuild) {
    // Avoid throwing errors during build time, as variables might not be available.
    console.error(`Missing Firebase configuration keys: ${missing.join(', ')}`);
  }

  return config;
}

/**
 * Validate Firebase configuration
 */
export function validateFirebaseConfig(config: FirebaseConfig): FirebaseConfig {
  const required: (keyof FirebaseConfig)[] = [
    'apiKey', 'authDomain', 'projectId', 'storageBucket', 'messagingSenderId', 'appId'
  ];
  
  const missing = required.filter(key => !config[key]);
  
  if (missing.length > 0) {
    throw new Error(
      `❌ Missing Firebase configuration: ${missing.join(', ')}\n` +
      `Check your .env.local file or Firebase App Hosting configuration.`
    );
  }
  
  return config;
}

/**
 * Check if running in Firebase App Hosting
 */
export function isFirebaseAppHosting(): boolean {
  return typeof process !== 'undefined' && 
         !!(process.env.FIREBASE_CONFIG || process.env.FIREBASE_WEBAPP_CONFIG);
}

/**
 * Retrieves configurations specific to the staging environment.
 * @param envInfo - The current environment information.
 * @returns {object | null} Staging configuration or null if not in staging.
 */
function getStagingConfigInternal(envInfo: EnvironmentInfo) {
  if (!envInfo.isStaging) {
    return null;
  }
  return {
    limits: {
      maxFileSize: parseInt(process.env.NEXT_PUBLIC_MAX_FILE_SIZE || '5242880'), // 5MB
      maxDocuments: parseInt(process.env.NEXT_PUBLIC_MAX_DOCUMENTS_PER_USER || '10'),
    },
    timeouts: {
      requestTimeout: 30000, // 30s
      retryAttempts: 2,
    },
    ui: {
      showBanner: true,
      bannerColor: '#FF6B35',
    },
  };
}

/**
 * Gathers all feature flags based on the current environment.
 * @param envInfo - The current environment information.
 * @returns {object} An object containing boolean feature flags.
 */
function getFeatureFlagsInternal(envInfo: EnvironmentInfo) {
  return {
    enableAnalytics: envInfo.isProduction && envInfo.isClient,
    enableAppCheck: envInfo.isProduction && envInfo.isClient,
    enableHotReload: envInfo.isDevelopment,
    enableDebugMode: envInfo.isDevelopment && process.env.DEBUG === 'true',
    showStagingBanner: envInfo.isStaging,
  };
}

/**
 * Gathers all monitoring and logging configurations.
 * @param envInfo - The current environment information.
 * @returns {object} An object containing monitoring settings.
 */
function getMonitoringConfigInternal(envInfo: EnvironmentInfo) {
  return {
    enableVerboseLogging: envInfo.isDevelopment && !envInfo.isBuild,
    enablePerformanceLogs: envInfo.isStaging || (envInfo.isDevelopment && process.env.DEBUG === 'true'),
    enableSourceMaps: envInfo.isDevelopment,
  };
}

// --- The Main AppConfig Object ---

const environment = getEnvironmentInfoInternal();
const firebase = getFirebaseConfigInternal(environment);
const staging = getStagingConfigInternal(environment);
const features = getFeatureFlagsInternal(environment);
const monitoring = getMonitoringConfigInternal(environment);

/**
 * The single source of truth for all application configurations.
 * It is built at initialization time and remains constant thereafter.
 * Using "as const" provides deep immutability and type safety.
 */
export const AppConfig = {
  environment,
  firebase,
  staging,
  features,
  monitoring,
} as const;

// --- Convenience Exports ---

export const isProduction = AppConfig.environment.isProduction;
export const isDevelopment = AppConfig.environment.isDevelopment;
export const isStaging = AppConfig.environment.isStaging;
export const isClient = AppConfig.environment.isClient;
export const isServer = AppConfig.environment.isServer;
export const isBuild = AppConfig.environment.isBuild;

/**
 * Since namespaces are no longer used due to separate Firebase projects,
 * this function is now a no-op for backwards compatibility during the transition.
 * It can be removed after all its usages are updated.
 * @deprecated Use direct collection paths instead.
 */
export function addNamespace(path: string): string {
  return path; // No-op
}
