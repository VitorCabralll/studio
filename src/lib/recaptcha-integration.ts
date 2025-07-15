/**
 * reCAPTCHA Integration for LexAI
 * Integrates Firebase Functions with reCAPTCHA validation
 */

import { getFunctions, httpsCallable } from 'firebase/functions';
import { getFirebaseApp } from './firebase';
import { logger } from './production-logger';

interface RecaptchaValidationResult {
  success: boolean;
  score: number;
  action: string;
  risk_level: 'LOW' | 'MEDIUM' | 'HIGH';
  recommended_action: string;
  details?: {
    hostname: string;
    timestamp: string;
    error_codes?: string[];
  };
}

interface RecaptchaValidationRequest {
  token: string;
  action: string;
  expectedHostname?: string;
}

/**
 * Validates reCAPTCHA Enterprise token using Firebase Functions
 */
export async function validateRecaptchaToken(
  token: string,
  action: string,
  expectedHostname?: string
): Promise<RecaptchaValidationResult> {
  try {
    const app = getFirebaseApp();
    const functions = getFunctions(app, 'us-central1');
    
    const validateRecaptcha = httpsCallable<RecaptchaValidationRequest, RecaptchaValidationResult>(
      functions,
      'validateRecaptchaEnterprise'
    );

    const result = await validateRecaptcha({
      token,
      action,
      expectedHostname
    });

    logger.log('reCAPTCHA validation completed', {
      success: result.data.success,
      score: result.data.score,
      riskLevel: result.data.risk_level,
      action
    });

    return result.data;

  } catch (error) {
    logger.error('reCAPTCHA validation failed', { error, action, token: token.substring(0, 10) + '...' });
    
    // Return safe defaults on error
    return {
      success: false,
      score: 0,
      action,
      risk_level: 'HIGH',
      recommended_action: 'BLOCK'
    };
  }
}

/**
 * Simplified Enterprise validation for App Check integration
 */
export async function verifyAppCheckRecaptcha(token: string): Promise<{ valid: boolean; score: number }> {
  try {
    const app = getFirebaseApp();
    const functions = getFunctions(app, 'us-central1');
    
    const verifyAppCheckToken = httpsCallable<{ token: string }, { valid: boolean; score: number }>(
      functions,
      'verifyAppCheckTokenEnterprise'
    );

    const result = await verifyAppCheckToken({ token });
    
    logger.log('App Check reCAPTCHA verification completed', {
      valid: result.data.valid,
      score: result.data.score
    });

    return result.data;

  } catch (error) {
    logger.error('App Check reCAPTCHA verification failed', { error });
    return { valid: false, score: 0 };
  }
}

/**
 * Enhanced reCAPTCHA execution with automatic validation
 */
export async function executeRecaptchaWithValidation(
  action: string,
  expectedHostname?: string
): Promise<RecaptchaValidationResult> {
  return new Promise((resolve) => {
    // Load reCAPTCHA if not already loaded
    if (typeof window === 'undefined' || !window.grecaptcha) {
      logger.warn('reCAPTCHA not loaded, returning fallback result');
      resolve({
        success: false,
        score: 0,
        action,
        risk_level: 'HIGH',
        recommended_action: 'BLOCK'
      });
      return;
    }

    window.grecaptcha.ready(() => {
      const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;
      
      if (!siteKey) {
        logger.error('reCAPTCHA site key not configured');
        resolve({
          success: false,
          score: 0,
          action,
          risk_level: 'HIGH',
          recommended_action: 'BLOCK'
        });
        return;
      }

      window.grecaptcha.execute(siteKey, { action })
        .then(async (token: string) => {
          // Validate the token using our Firebase Function
          const result = await validateRecaptchaToken(token, action, expectedHostname);
          resolve(result);
        })
        .catch((error) => {
          logger.error('reCAPTCHA execution failed', { error, action });
          resolve({
            success: false,
            score: 0,
            action,
            risk_level: 'HIGH',
            recommended_action: 'BLOCK'
          });
        });
    });
  });
}

// Global type declaration for grecaptcha
declare global {
  interface Window {
    grecaptcha: {
      ready: (callback: () => void) => void;
      execute: (siteKey: string, options: { action: string }) => Promise<string>;
    };
  }
}