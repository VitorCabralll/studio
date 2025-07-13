/**
 * API Security Middleware - LexAI
 * Implementa security hardening para API routes
 */

import { NextRequest, NextResponse } from 'next/server';
import { authLogger } from './auth-logger';
import { reportSecurity } from './monitoring';

interface SecurityConfig {
  enableRateLimit: boolean;
  enableCORS: boolean;
  enableCSRF: boolean;
  enableOriginValidation: boolean;
  enableRequestSizeLimit: boolean;
  maxRequestSize: number; // em bytes
  enableSecurityHeaders: boolean;
  allowedOrigins: string[];
  rateLimitWindowMs: number;
  rateLimitMaxRequests: number;
}

interface RateLimitEntry {
  count: number;
  windowStart: number;
}

interface SecurityValidationResult {
  isValid: boolean;
  error?: string;
  statusCode?: number;
  shouldBlock?: boolean;
}

class ApiSecurity {
  private config: SecurityConfig;
  private rateLimitStore = new Map<string, RateLimitEntry>();
  private blockedIPs = new Set<string>();

  constructor() {
    this.config = {
      enableRateLimit: process.env.NODE_ENV === 'production',
      enableCORS: true,
      enableCSRF: process.env.NODE_ENV === 'production',
      enableOriginValidation: process.env.NODE_ENV === 'production',
      enableRequestSizeLimit: true,
      maxRequestSize: 10 * 1024 * 1024, // 10MB
      enableSecurityHeaders: true,
      allowedOrigins: [
        process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
        'https://lexai.com.br',
        'https://www.lexai.com.br'
      ],
      rateLimitWindowMs: 15 * 60 * 1000, // 15 minutos
      rateLimitMaxRequests: 100, // 100 requests por janela
    };
  }

  /**
   * Middleware principal de segurança
   */
  async validateRequest(request: NextRequest): Promise<SecurityValidationResult> {
    const clientIP = this.getClientIP(request);
    const userAgent = request.headers.get('user-agent') || '';
    const requestId = this.generateRequestId();

    // Log da requisição
    authLogger.info('API request received', {
      context: 'api-security',
      operation: 'request_validation',
      metadata: {
        requestId,
        method: request.method,
        url: request.url,
        clientIP,
        userAgent,
      },
    });

    // 1. Verificar se IP está bloqueado
    if (this.blockedIPs.has(clientIP)) {
      this.reportSecurityEvent('blocked_ip_access_attempt', {
        clientIP,
        requestId,
        url: request.url,
      });
      return {
        isValid: false,
        error: 'Access denied',
        statusCode: 403,
        shouldBlock: true,
      };
    }

    // 2. Validar origem da requisição
    if (this.config.enableOriginValidation) {
      const originValidation = this.validateOrigin(request);
      if (!originValidation.isValid) {
        this.reportSecurityEvent('invalid_origin_access', {
          clientIP,
          requestId,
          origin: request.headers.get('origin'),
          referer: request.headers.get('referer'),
        });
        return originValidation;
      }
    }

    // 3. Rate limiting
    if (this.config.enableRateLimit) {
      const rateLimitValidation = this.validateRateLimit(clientIP);
      if (!rateLimitValidation.isValid) {
        this.reportSecurityEvent('rate_limit_exceeded', {
          clientIP,
          requestId,
          method: request.method,
          url: request.url,
        });
        return rateLimitValidation;
      }
    }

    // 4. Validar tamanho da requisição
    if (this.config.enableRequestSizeLimit) {
      const sizeValidation = this.validateRequestSize(request);
      if (!sizeValidation.isValid) {
        this.reportSecurityEvent('request_size_limit_exceeded', {
          clientIP,
          requestId,
          contentLength: request.headers.get('content-length'),
        });
        return sizeValidation;
      }
    }

    // 5. Validar headers suspeitos
    const headerValidation = this.validateHeaders(request);
    if (!headerValidation.isValid) {
      this.reportSecurityEvent('suspicious_headers_detected', {
        clientIP,
        requestId,
        suspiciousHeaders: headerValidation.error,
      });
      return headerValidation;
    }

    // 6. Verificar User-Agent suspeito
    const userAgentValidation = this.validateUserAgent(userAgent);
    if (!userAgentValidation.isValid) {
      this.reportSecurityEvent('suspicious_user_agent', {
        clientIP,
        requestId,
        userAgent,
      });
      return userAgentValidation;
    }

    return { isValid: true };
  }

  /**
   * Aplica security headers na resposta
   */
  applySecurityHeaders(response: NextResponse): NextResponse {
    if (!this.config.enableSecurityHeaders) return response;

    // Security headers básicos
    response.headers.set('X-Frame-Options', 'DENY');
    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('X-XSS-Protection', '1; mode=block');
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
    response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
    
    // CSP básico
    response.headers.set(
      'Content-Security-Policy',
      "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:;"
    );

    // HSTS em produção
    if (process.env.NODE_ENV === 'production') {
      response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
    }

    return response;
  }

  /**
   * Aplica CORS headers
   */
  applyCORSHeaders(response: NextResponse, origin?: string): NextResponse {
    if (!this.config.enableCORS) return response;

    const allowedOrigin = origin && this.config.allowedOrigins.includes(origin) 
      ? origin 
      : this.config.allowedOrigins[0];

    response.headers.set('Access-Control-Allow-Origin', allowedOrigin);
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
    response.headers.set('Access-Control-Allow-Credentials', 'true');
    response.headers.set('Access-Control-Max-Age', '86400');

    return response;
  }

  /**
   * Valida origem da requisição
   */
  private validateOrigin(request: NextRequest): SecurityValidationResult {
    const origin = request.headers.get('origin');
    const referer = request.headers.get('referer');

    // Para requisições same-origin, origin pode ser null
    if (!origin && !referer) {
      // Permitir apenas para desenvolvimento
      if (process.env.NODE_ENV === 'development') {
        return { isValid: true };
      }
      return {
        isValid: false,
        error: 'Missing origin header',
        statusCode: 403,
      };
    }

    // Verificar se origem está na lista permitida
    if (origin && !this.config.allowedOrigins.includes(origin)) {
      return {
        isValid: false,
        error: 'Invalid origin',
        statusCode: 403,
      };
    }

    // Verificar referer se origin não estiver presente
    if (!origin && referer) {
      const refererOrigin = new URL(referer).origin;
      if (!this.config.allowedOrigins.includes(refererOrigin)) {
        return {
          isValid: false,
          error: 'Invalid referer origin',
          statusCode: 403,
        };
      }
    }

    return { isValid: true };
  }

  /**
   * Implementa rate limiting
   */
  private validateRateLimit(clientIP: string): SecurityValidationResult {
    const now = Date.now();
    const windowStart = now - this.config.rateLimitWindowMs;

    // Limpar entradas antigas
    for (const [ip, entry] of this.rateLimitStore.entries()) {
      if (entry.windowStart < windowStart) {
        this.rateLimitStore.delete(ip);
      }
    }

    const entry = this.rateLimitStore.get(clientIP);
    
    if (!entry) {
      // Primeira requisição na janela
      this.rateLimitStore.set(clientIP, {
        count: 1,
        windowStart: now,
      });
      return { isValid: true };
    }

    if (entry.windowStart < windowStart) {
      // Nova janela
      this.rateLimitStore.set(clientIP, {
        count: 1,
        windowStart: now,
      });
      return { isValid: true };
    }

    // Incrementar contador
    entry.count++;

    if (entry.count > this.config.rateLimitMaxRequests) {
      // Bloquear temporariamente IPs que excedem muito o limite
      if (entry.count > this.config.rateLimitMaxRequests * 2) {
        this.blockedIPs.add(clientIP);
        // Remover do bloqueio após 1 hora
        setTimeout(() => {
          this.blockedIPs.delete(clientIP);
        }, 60 * 60 * 1000);
      }

      return {
        isValid: false,
        error: 'Rate limit exceeded',
        statusCode: 429,
      };
    }

    return { isValid: true };
  }

  /**
   * Valida tamanho da requisição
   */
  private validateRequestSize(request: NextRequest): SecurityValidationResult {
    const contentLength = request.headers.get('content-length');
    
    if (contentLength) {
      const size = parseInt(contentLength, 10);
      if (size > this.config.maxRequestSize) {
        return {
          isValid: false,
          error: 'Request size too large',
          statusCode: 413,
        };
      }
    }

    return { isValid: true };
  }

  /**
   * Valida headers suspeitos
   */
  private validateHeaders(request: NextRequest): SecurityValidationResult {
    const suspiciousHeaders = [
      'x-forwarded-for',
      'x-real-ip',
      'x-originating-ip',
      'x-cluster-client-ip',
    ];

    const suspiciousValues = [];
    
    for (const header of suspiciousHeaders) {
      const value = request.headers.get(header);
      if (value && this.containsSuspiciousContent(value)) {
        suspiciousValues.push(`${header}: ${value}`);
      }
    }

    if (suspiciousValues.length > 0) {
      return {
        isValid: false,
        error: suspiciousValues.join(', '),
        statusCode: 403,
      };
    }

    return { isValid: true };
  }

  /**
   * Valida User-Agent suspeito
   */
  private validateUserAgent(userAgent: string): SecurityValidationResult {
    const suspiciousPatterns = [
      /bot/i,
      /crawler/i,
      /spider/i,
      /scraper/i,
      /curl/i,
      /wget/i,
      /python/i,
      /php/i,
      /java/i,
      /go-http/i,
    ];

    // Permitir alguns bots conhecidos
    const allowedBots = [
      /googlebot/i,
      /bingbot/i,
      /slurp/i,
      /duckduckbot/i,
    ];

    const isSuspicious = suspiciousPatterns.some(pattern => pattern.test(userAgent));
    const isAllowedBot = allowedBots.some(pattern => pattern.test(userAgent));

    if (isSuspicious && !isAllowedBot) {
      return {
        isValid: false,
        error: 'Suspicious user agent',
        statusCode: 403,
      };
    }

    return { isValid: true };
  }

  /**
   * Verifica conteúdo suspeito em strings
   */
  private containsSuspiciousContent(value: string): boolean {
    const suspiciousPatterns = [
      /<script/i,
      /javascript:/i,
      /vbscript:/i,
      /onload=/i,
      /onerror=/i,
      /onclick=/i,
      /eval\(/i,
      /expression\(/i,
      /\.\./,
      /\/\.\./,
      /\0/,
      /%00/,
      /%2e%2e/,
      /%252e%252e/,
    ];

    return suspiciousPatterns.some(pattern => pattern.test(value));
  }

  /**
   * Obtém IP do cliente
   */
  private getClientIP(request: NextRequest): string {
    const xForwardedFor = request.headers.get('x-forwarded-for');
    const xRealIP = request.headers.get('x-real-ip');
    const xClientIP = request.headers.get('x-client-ip');

    if (xForwardedFor) {
      return xForwardedFor.split(',')[0].trim();
    }

    if (xRealIP) {
      return xRealIP;
    }

    if (xClientIP) {
      return xClientIP;
    }

    return 'unknown';
  }

  /**
   * Gera ID único para requisição
   */
  private generateRequestId(): string {
    return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Reporta evento de segurança
   */
  private reportSecurityEvent(type: string, details: Record<string, any>): void {
    authLogger.security(`Security event: ${type}`, {
      context: 'api-security',
      operation: 'security_event',
      metadata: {
        eventType: type,
        ...details,
        timestamp: new Date().toISOString(),
      },
    });

    reportSecurity(`API Security: ${type}`, {
      component: 'api-security',
      metadata: {
        eventType: type,
        ...details,
      },
    });
  }
}

// Instância singleton
export const apiSecurity = new ApiSecurity();

// Helper para uso nas API routes
export async function withApiSecurity(
  request: NextRequest,
  handler: (request: NextRequest) => Promise<NextResponse>
): Promise<NextResponse> {
  try {
    // Validar requisição
    const validation = await apiSecurity.validateRequest(request);
    
    if (!validation.isValid) {
      let response = NextResponse.json(
        { 
          error: validation.error || 'Request validation failed',
          success: false 
        },
        { status: validation.statusCode || 403 }
      );

      // Aplicar headers de segurança mesmo em respostas de erro
      response = apiSecurity.applySecurityHeaders(response) as NextResponse<{ error: string; success: boolean; }>;
      response = apiSecurity.applyCORSHeaders(response, request.headers.get('origin') || undefined) as NextResponse<{ error: string; success: boolean; }>;

      return response;
    }

    // Executar handler
    let response = await handler(request);

    // Aplicar headers de segurança
    response = apiSecurity.applySecurityHeaders(response) as NextResponse<{ error: string; success: boolean; }>;
    response = apiSecurity.applyCORSHeaders(response, request.headers.get('origin') || undefined) as NextResponse<{ error: string; success: boolean; }>;

    return response;
  } catch (error) {
    authLogger.error('API security middleware error', error as Error, {
      context: 'api-security',
      operation: 'middleware_error',
      metadata: {
        url: request.url,
        method: request.method,
      },
    });

    let response = NextResponse.json(
      { 
        error: 'Internal server error',
        success: false 
      },
      { status: 500 }
    );

    response = apiSecurity.applySecurityHeaders(response) as NextResponse<{ error: string; success: boolean; }>;
    response = apiSecurity.applyCORSHeaders(response, request.headers.get('origin') || undefined) as NextResponse<{ error: string; success: boolean; }>;

    return response;
  }
}

// Helper para OPTIONS requests (CORS preflight)
export function handleOptionsRequest(request: NextRequest): NextResponse {
  const response = new NextResponse(null, { status: 200 });
  
  const securedResponse = apiSecurity.applySecurityHeaders(response);
  return apiSecurity.applyCORSHeaders(securedResponse, request.headers.get('origin') || undefined);
}