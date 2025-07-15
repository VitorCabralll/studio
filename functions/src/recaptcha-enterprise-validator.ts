/**
 * reCAPTCHA Enterprise Validator for Firebase Functions
 * Implements Enterprise API for proper Firebase App Check integration
 */

import { https } from 'firebase-functions/v2';
import { logger } from 'firebase-functions/v2';

interface RecaptchaEnterpriseResponse {
  tokenProperties: {
    valid: boolean;
    hostname: string;
    action: string;
    createTime: string;
    invalidReason?: string;
  };
  riskAnalysis: {
    score: number;
    reasons: string[];
  };
  event: {
    token: string;
    siteKey: string;
    userAgent?: string;
    userIpAddress?: string;
    expectedAction?: string;
  };
  name: string;
}

interface EnterpriseValidationRequest {
  token: string;
  action: string;
  expectedHostname?: string;
  userAgent?: string;
  userIpAddress?: string;
}

interface EnterpriseValidationResponse {
  success: boolean;
  score: number;
  action: string;
  risk_level: 'LOW' | 'MEDIUM' | 'HIGH';
  recommended_action: string;
  details?: {
    hostname: string;
    timestamp: string;
    reasons?: string[];
    invalid_reason?: string;
  };
}

/**
 * Validates reCAPTCHA Enterprise token and returns comprehensive analysis
 */
export const validateRecaptchaEnterprise = https.onCall(
  {
    region: 'us-central1',
    cors: true,
    enforceAppCheck: true,
  },
  async (request): Promise<EnterpriseValidationResponse> => {
    try {
      const { 
        token, 
        action, 
        expectedHostname,
        userAgent,
        userIpAddress 
      } = request.data as EnterpriseValidationRequest;

      if (!token || !action) {
        throw new https.HttpsError(
          'invalid-argument',
          'Token and action are required'
        );
      }

      // Get API key from Firebase config
      const functions = require('firebase-functions/v1');
      const config = functions.config();
      const apiKey = config.recaptcha?.api_key;
      
      if (!apiKey) {
        logger.error('reCAPTCHA Enterprise API key not configured');
        throw new https.HttpsError(
          'failed-precondition',
          'reCAPTCHA Enterprise configuration missing'
        );
      }

      // Prepare Enterprise API request
      const assessmentRequest = {
        event: {
          token: token,
          expectedAction: action,
          siteKey: '6Ld79nMrAAAAAE-oWEVVeBbthv-I49JaHxbRR-_N',
          userAgent: userAgent || request.rawRequest.get('user-agent') || '',
          userIpAddress: userIpAddress || request.rawRequest.ip || ''
        }
      };

      logger.info('Creating reCAPTCHA Enterprise assessment', { 
        action,
        ip: assessmentRequest.event.userIpAddress,
        hostname: expectedHostname 
      });

      // Call reCAPTCHA Enterprise API
      const enterpriseUrl = `https://recaptchaenterprise.googleapis.com/v1/projects/lexai-ef0ab/assessments?key=${apiKey}`;
      
      const response = await fetch(enterpriseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(assessmentRequest),
      });

      if (!response.ok) {
        const errorText = await response.text();
        logger.error('reCAPTCHA Enterprise API error', { 
          status: response.status,
          error: errorText 
        });
        
        throw new https.HttpsError(
          'internal',
          `reCAPTCHA Enterprise API error: ${response.status}`
        );
      }

      const result = await response.json() as RecaptchaEnterpriseResponse;

      // Validate token properties
      if (!result.tokenProperties?.valid) {
        logger.warn('reCAPTCHA Enterprise token invalid', { 
          invalidReason: result.tokenProperties?.invalidReason,
          action 
        });
        
        throw new https.HttpsError(
          'permission-denied',
          'reCAPTCHA token validation failed',
          { 
            invalidReason: result.tokenProperties?.invalidReason 
          }
        );
      }

      // Validate action matches expected
      if (result.tokenProperties.action !== action) {
        logger.warn('Action mismatch in Enterprise validation', { 
          expected: action, 
          received: result.tokenProperties.action 
        });
        
        throw new https.HttpsError(
          'permission-denied',
          'Action mismatch detected'
        );
      }

      // Validate hostname if provided
      if (expectedHostname && result.tokenProperties.hostname !== expectedHostname) {
        logger.warn('Hostname mismatch in Enterprise validation', { 
          expected: expectedHostname, 
          received: result.tokenProperties.hostname 
        });
        
        throw new https.HttpsError(
          'permission-denied',
          'Hostname mismatch detected'
        );
      }

      // Analyze score and determine risk level (Enterprise uses 0.0-1.0 scale)
      const score = result.riskAnalysis?.score || 0;
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

      logger.info('reCAPTCHA Enterprise validation successful', {
        score,
        riskLevel,
        recommendedAction,
        action,
        hostname: result.tokenProperties.hostname,
        reasons: result.riskAnalysis?.reasons
      });

      return {
        success: true,
        score,
        action: result.tokenProperties.action,
        risk_level: riskLevel,
        recommended_action: recommendedAction,
        details: {
          hostname: result.tokenProperties.hostname,
          timestamp: result.tokenProperties.createTime,
          reasons: result.riskAnalysis?.reasons,
        },
      };

    } catch (error) {
      logger.error('reCAPTCHA Enterprise validation error', error);
      
      if (error instanceof https.HttpsError) {
        throw error;
      }
      
      throw new https.HttpsError(
        'internal',
        'Internal Enterprise validation error'
      );
    }
  }
);

/**
 * Simplified Enterprise validation for App Check integration
 */
export const verifyAppCheckTokenEnterprise = https.onCall(
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
      const apiKey = config.recaptcha?.api_key;
      
      if (!apiKey) {
        logger.error('reCAPTCHA Enterprise API key not configured');
        return { valid: false, score: 0 };
      }

      // Simplified Enterprise assessment for App Check
      const assessmentRequest = {
        event: {
          token: token,
          expectedAction: 'app_check_verification',
          siteKey: '6Ld79nMrAAAAAE-oWEVVeBbthv-I49JaHxbRR-_N',
          userIpAddress: request.rawRequest.ip || ''
        }
      };

      const enterpriseUrl = `https://recaptchaenterprise.googleapis.com/v1/projects/lexai-ef0ab/assessments?key=${apiKey}`;
      
      const response = await fetch(enterpriseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(assessmentRequest),
      });

      if (!response.ok) {
        logger.warn('App Check Enterprise validation API error', { 
          status: response.status 
        });
        return { valid: false, score: 0 };
      }

      const result = await response.json() as RecaptchaEnterpriseResponse;
      
      logger.info('App Check Enterprise validation completed', {
        valid: result.tokenProperties?.valid,
        score: result.riskAnalysis?.score,
        action: result.tokenProperties?.action
      });

      return {
        valid: result.tokenProperties?.valid || false,
        score: result.riskAnalysis?.score || 0,
      };

    } catch (error) {
      logger.error('App Check Enterprise validation error', error);
      return { valid: false, score: 0 };
    }
  }
);