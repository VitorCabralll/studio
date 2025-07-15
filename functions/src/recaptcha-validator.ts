/**
 * reCAPTCHA v3 Score Validator for Firebase Functions
 * Implements server-side score evaluation that Firebase App Check needs
 */

import { https } from 'firebase-functions/v2';
import { logger } from 'firebase-functions/v2';

interface RecaptchaVerifyResponse {
  success: boolean;
  score: number;
  action: string;
  challenge_ts: string;
  hostname: string;
  'error-codes'?: string[];
}

interface ValidationRequest {
  token: string;
  action: string;
  expectedHostname?: string;
}

interface ValidationResponse {
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

/**
 * Validates reCAPTCHA v3 token and returns score analysis
 */
export const validateRecaptcha = https.onCall(
  {
    region: 'us-central1',
    cors: true,
    enforceAppCheck: true,
  },
  async (request): Promise<ValidationResponse> => {
    try {
      const { token, action, expectedHostname } = request.data as ValidationRequest;

      if (!token || !action) {
        throw new https.HttpsError(
          'invalid-argument',
          'Token and action are required'
        );
      }

      // Get reCAPTCHA secret key from Firebase config
      const functions = require('firebase-functions/v1');
      const config = functions.config();
      const secretKey = config.recaptcha?.secret_key;
      
      if (!secretKey) {
        logger.error('RECAPTCHA_SECRET_KEY not configured in Firebase functions config');
        throw new https.HttpsError(
          'failed-precondition',
          'reCAPTCHA configuration missing'
        );
      }

      // Verify token with Google reCAPTCHA API
      const verifyUrl = 'https://www.google.com/recaptcha/api/siteverify';
      const verifyData = new URLSearchParams({
        secret: secretKey,
        response: token,
        remoteip: request.rawRequest.ip || ''
      });

      logger.info('Validating reCAPTCHA token', { 
        action,
        ip: request.rawRequest.ip,
        hostname: expectedHostname 
      });

      const response = await fetch(verifyUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: verifyData,
      });

      if (!response.ok) {
        throw new https.HttpsError(
          'internal',
          `reCAPTCHA API error: ${response.status}`
        );
      }

      const result = await response.json() as RecaptchaVerifyResponse;

      if (!result.success) {
        logger.warn('reCAPTCHA validation failed', { 
          errors: result['error-codes'],
          action 
        });
        
        throw new https.HttpsError(
          'permission-denied',
          'reCAPTCHA validation failed',
          { errors: result['error-codes'] }
        );
      }

      // Validate action matches expected
      if (result.action !== action) {
        logger.warn('Action mismatch', { 
          expected: action, 
          received: result.action 
        });
        
        throw new https.HttpsError(
          'permission-denied',
          'Action mismatch detected'
        );
      }

      // Validate hostname if provided
      if (expectedHostname && result.hostname !== expectedHostname) {
        logger.warn('Hostname mismatch', { 
          expected: expectedHostname, 
          received: result.hostname 
        });
        
        throw new https.HttpsError(
          'permission-denied',
          'Hostname mismatch detected'
        );
      }

      // Analyze score and determine risk level
      const score = result.score;
      let riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
      let recommendedAction: string;

      if (score >= 0.7) {
        riskLevel = 'LOW';
        recommendedAction = 'ALLOW';
      } else if (score >= 0.3) {
        riskLevel = 'MEDIUM';
        recommendedAction = 'CHALLENGE';
      } else {
        riskLevel = 'HIGH';
        recommendedAction = 'BLOCK';
      }

      logger.info('reCAPTCHA validation successful', {
        score,
        riskLevel,
        recommendedAction,
        action,
        hostname: result.hostname
      });

      return {
        success: true,
        score,
        action: result.action,
        risk_level: riskLevel,
        recommended_action: recommendedAction,
        details: {
          hostname: result.hostname,
          timestamp: result.challenge_ts,
        },
      };

    } catch (error) {
      logger.error('reCAPTCHA validation error', error);
      
      if (error instanceof https.HttpsError) {
        throw error;
      }
      
      throw new https.HttpsError(
        'internal',
        'Internal validation error'
      );
    }
  }
);

/**
 * Simplified validation for App Check integration
 */
export const verifyAppCheckToken = https.onCall(
  {
    region: 'us-central1',
    cors: true,
    enforceAppCheck: false, // Allow this to be called during App Check flow
  },
  async (request): Promise<{ valid: boolean; score: number }> => {
    try {
      const { token } = request.data;
      
      if (!token) {
        return { valid: false, score: 0 };
      }

      const functions = require('firebase-functions/v1');
      const config = functions.config();
      const secretKey = config.recaptcha?.secret_key;
      
      if (!secretKey) {
        logger.error('RECAPTCHA_SECRET_KEY not configured in Firebase functions config');
        return { valid: false, score: 0 };
      }

      const verifyUrl = 'https://www.google.com/recaptcha/api/siteverify';
      const verifyData = new URLSearchParams({
        secret: secretKey,
        response: token,
      });

      const response = await fetch(verifyUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: verifyData,
      });

      if (!response.ok) {
        return { valid: false, score: 0 };
      }

      const result = await response.json() as RecaptchaVerifyResponse;
      
      logger.info('App Check reCAPTCHA verification', {
        success: result.success,
        score: result.score,
        action: result.action
      });

      return {
        valid: result.success,
        score: result.score || 0,
      };

    } catch (error) {
      logger.error('App Check reCAPTCHA verification error', error);
      return { valid: false, score: 0 };
    }
  }
);