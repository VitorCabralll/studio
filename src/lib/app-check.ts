/**
 * Firebase App Check Configuration
 * Provides bot protection and request verification for LexAI
 */

import { 
  initializeAppCheck, 
  ReCaptchaV3Provider, 
  CustomProvider,
  AppCheck,
  getToken
} from 'firebase/app-check';
import { FirebaseApp } from 'firebase/app';
import { getEnvironmentInfo, executeInContext, ExecutionContext } from './environment';
import { logger } from './production-logger';

// Types
interface AppCheckConfig {
  provider: ReCaptchaV3Provider | CustomProvider;
  isTokenAutoRefreshEnabled: boolean;
}

interface AppCheckDebugConfig {
  token: string;
  expireTimeMillis: number;
}

// Global App Check instance
let appCheckInstance: AppCheck | null = null;

/**
 * Get reCAPTCHA site key for production
 */
function getRecaptchaSiteKey(): string {
  const key = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;
  if (!key) {
    logger.error(
      'App Check: RECAPTCHA_SITE_KEY is required for production.\n' +
      'Get your key from: https://www.google.com/recaptcha/admin'
    );
    return '';
  }
  return key;
}


/**
 * Create App Check configuration for production
 */
function createAppCheckConfig(): AppCheckConfig | null {
  const env = getEnvironmentInfo();
  
  // Don't initialize during build time
  if (env.isBuild) {
    logger.log('App Check: Skipping initialization during build');
    return null;
  }
  
  // Don't initialize on server side
  if (env.isServer) {
    logger.log('App Check: Skipping initialization on server side');
    return null;
  }

  // Emergency disable for debugging
  if (process.env.EMERGENCY_DISABLE_APP_CHECK === 'true') {
    logger.warn('App Check: EMERGENCY DISABLED via environment variable');
    return null;
  }
  
  // Production configuration with reCAPTCHA v3
  const siteKey = getRecaptchaSiteKey();
  if (!siteKey) {
    logger.warn('App Check: Missing reCAPTCHA site key - disabling App Check');
    return null;
  }
  
  logger.log('App Check: Initializing with reCAPTCHA v3 for production', {
    environment: 'production',
    siteKeyPrefix: siteKey.substring(0, 10) + '...'
  });
  
  return {
    provider: new ReCaptchaV3Provider(siteKey),
    isTokenAutoRefreshEnabled: true
  };
}

/**
 * Initialize Firebase App Check
 */
export function initializeFirebaseAppCheck(app: FirebaseApp): AppCheck | null {
  // Return existing instance if already initialized
  if (appCheckInstance) {
    return appCheckInstance;
  }
  
  // Only initialize in browser
  return executeInContext(
    [ExecutionContext.CLIENT_RUNTIME],
    () => {
      try {
        const config = createAppCheckConfig();
        if (!config) {
          logger.log('App Check: Configuration not available, skipping initialization');
          return null;
        }
        
        // Initialize App Check
        appCheckInstance = initializeAppCheck(app, config);
        
        logger.log('App Check: Successfully initialized', {
          providerType: config.provider.constructor.name,
          autoRefresh: config.isTokenAutoRefreshEnabled
        });
        
        // Test token generation
        testAppCheckToken();
        
        return appCheckInstance;
        
      } catch (error: any) {
        logger.error('App Check: Failed to initialize', {
          error: error.message,
          code: error.code
        });
        
        // Don't throw in production - graceful degradation
        if (getEnvironmentInfo().isProduction) {
          logger.warn('App Check: Continuing without App Check protection');
          return null;
        }
        
        throw error;
      }
    }
  ) || null;
}

/**
 * Get App Check token for manual use
 */
export async function getAppCheckToken(): Promise<string | null> {
  if (!appCheckInstance) {
    logger.warn('App Check: Not initialized, cannot get token');
    return null;
  }
  
  try {
    const result = await getToken(appCheckInstance);
    logger.log('App Check: Token obtained successfully', {
      tokenLength: result.token.length
    });
    return result.token;
  } catch (error: any) {
    logger.error('App Check: Failed to get token', {
      error: error.message,
      code: error.code
    });
    return null;
  }
}

/**
 * Test App Check token generation
 */
async function testAppCheckToken(): Promise<void> {
  try {
    const token = await getAppCheckToken();
    if (token) {
      logger.log('App Check: Token generation successful', {
        tokenPreview: token.substring(0, 20) + '...'
      });
    } else {
      logger.warn('App Check: Token generation failed');
    }
  } catch (error: any) {
    logger.warn('App Check: Token generation error', {
      error: error.message
    });
  }
}

/**
 * Check if App Check is enabled and working
 */
export function isAppCheckEnabled(): boolean {
  return appCheckInstance !== null;
}

/**
 * Get App Check status for debugging
 */
export function getAppCheckStatus() {
  const env = getEnvironmentInfo();
  
  return {
    initialized: !!appCheckInstance,
    environment: 'production',
    isClient: env.isClient,
    hasRecaptchaKey: !!process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY
  };
}

/**
 * Reset App Check instance (for testing)
 */
export function resetAppCheck(): void {
  appCheckInstance = null;
  logger.log('App Check: Instance reset');
}

// Self-declaration for global access (debugging)
if (typeof window !== 'undefined') {
  (window as any).__lexai_app_check_status = getAppCheckStatus;
}