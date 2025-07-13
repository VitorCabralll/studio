/**
 * Input Validation - Segurança e Sanitização
 * 
 * ✅ SEGURANÇA: Validações robustas para produção
 * 
 * FEATURES:
 * - Sanitização de inputs de usuário
 * - Validação de tamanhos e formatos
 * - Prevenção contra injection attacks
 * - Rate limiting checks
 * - Content filtering
 * 
 * @version 1.0.0
 * @since 2025-07-05
 */

import { z } from 'zod';

// Constantes de segurança
export const SECURITY_LIMITS = {
  // Tamanhos máximos
  MAX_INSTRUCTION_LENGTH: 10000,      // 10KB para instruções
  MAX_ATTACHMENT_SIZE: 5 * 1024 * 1024, // 5MB por arquivo
  MAX_ATTACHMENTS_COUNT: 5,           // Máximo 5 anexos
  MAX_FILENAME_LENGTH: 255,           // Nome do arquivo
  
  // Rate limiting
  MAX_REQUESTS_PER_MINUTE: 10,        // 10 requests por minuto por usuário
  MAX_REQUESTS_PER_HOUR: 100,         // 100 requests por hora
  
  // Content filtering
  MAX_TOKENS_ESTIMATED: 15000,        // Limite estimado de tokens
  MIN_INSTRUCTION_LENGTH: 10,         // Mínimo 10 caracteres
} as const;

// Padrões perigosos para detectar
const DANGEROUS_PATTERNS = [
  // Scripts e código malicioso
  /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
  /javascript:/gi,
  /vbscript:/gi,
  /onload\s*=/gi,
  /onerror\s*=/gi,
  /onclick\s*=/gi,
  
  // SQL Injection patterns
  /(\b(union|select|insert|update|delete|drop|create|alter|exec|execute)\b)/gi,
  
  // Template injection
  /\{\{.*\}\}/g,
  /\$\{.*\}/g,
  
  // Path traversal
  /\.\.\//g,
  /\.\.\\/g,
] as const;

// Schema Zod para validação de requisições
export const DocumentGenerationSchema = z.object({
  instructions: z.string()
    .min(SECURITY_LIMITS.MIN_INSTRUCTION_LENGTH, 'Instruções muito curtas')
    .max(SECURITY_LIMITS.MAX_INSTRUCTION_LENGTH, 'Instruções muito longas')
    .refine(
      (value) => !containsDangerousContent(value),
      'Conteúdo potencialmente perigoso detectado'
    ),
  
  attachments: z.array(z.string())
    .max(SECURITY_LIMITS.MAX_ATTACHMENTS_COUNT, 'Muitos anexos')
    .optional()
    .default([]),
  
  agent: z.enum(['geral', 'civil', 'stj']),
  
  mode: z.enum(['outline', 'full']),
  
  legalArea: z.string()
    .max(100, 'Área jurídica muito longa')
    .optional(),
});

export type ValidatedDocumentRequest = z.infer<typeof DocumentGenerationSchema>;

/**
 * Sanitiza string removendo caracteres perigosos
 */
export function sanitizeString(input: string): string {
  if (!input || typeof input !== 'string') return '';
  
  return input
    // Remove caracteres de controle
    .replace(/[\x00-\x1F\x7F-\x9F]/g, '')
    // Remove caracteres Unicode suspeitos
    .replace(/[\u0000-\u001F\u007F-\u009F]/g, '')
    // Normaliza espaços
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Verifica se o conteúdo contém padrões perigosos
 */
export function containsDangerousContent(input: string): boolean {
  if (!input || typeof input !== 'string') return false;
  
  const normalizedInput = input.toLowerCase();
  
  return DANGEROUS_PATTERNS.some(pattern => pattern.test(normalizedInput));
}

/**
 * Estima número de tokens (aproximado)
 */
export function estimateTokenCount(text: string): number {
  if (!text) return 0;
  
  // Estimativa: ~1 token por 4 caracteres em português
  return Math.ceil(text.length / 4);
}

/**
 * Valida tamanho de arquivo
 */
export function validateFileSize(size: number): boolean {
  return size > 0 && size <= SECURITY_LIMITS.MAX_ATTACHMENT_SIZE;
}

/**
 * Valida nome de arquivo
 */
export function validateFilename(filename: string): boolean {
  if (!filename || filename.length > SECURITY_LIMITS.MAX_FILENAME_LENGTH) {
    return false;
  }
  
  // Bloqueia nomes perigosos
  const dangerousNames = [
    'con', 'prn', 'aux', 'nul',
    'com1', 'com2', 'com3', 'com4', 'com5', 'com6', 'com7', 'com8', 'com9',
    'lpt1', 'lpt2', 'lpt3', 'lpt4', 'lpt5', 'lpt6', 'lpt7', 'lpt8', 'lpt9'
  ];
  
  const baseName = filename.split('.')[0].toLowerCase();
  if (dangerousNames.includes(baseName)) {
    return false;
  }
  
  // Verifica caracteres perigosos
  const dangerousChars = /[<>:"|?*\x00-\x1F]/g;
  return !dangerousChars.test(filename);
}

/**
 * Valida requisição completa de geração de documento
 */
export function validateDocumentRequest(request: unknown): {
  success: boolean;
  data?: ValidatedDocumentRequest;
  error?: string;
} {
  try {
    // Validação com Zod
    const validated = DocumentGenerationSchema.parse(request);
    
    // Validações adicionais de segurança
    const tokenCount = estimateTokenCount(validated.instructions);
    if (tokenCount > SECURITY_LIMITS.MAX_TOKENS_ESTIMATED) {
      return {
        success: false,
        error: `Conteúdo muito longo (${tokenCount} tokens estimados, máximo ${SECURITY_LIMITS.MAX_TOKENS_ESTIMATED})`
      };
    }
    
    // Sanitiza instruções
    validated.instructions = sanitizeString(validated.instructions);
    
    return {
      success: true,
      data: validated
    };
    
  } catch (error) {
    return {
      success: false,
      error: error instanceof z.ZodError 
        ? error.issues.map((e: any) => e.message).join(', ')
        : 'Erro de validação desconhecido'
    };
  }
}

/**
 * Rate limiting simples (em memória - para produção usar Redis)
 */
class RateLimiter {
  private requests = new Map<string, number[]>();
  
  isAllowed(userId: string, limit: number, windowMs: number): boolean {
    const now = Date.now();
    const userRequests = this.requests.get(userId) || [];
    
    // Remove requests antigas
    const validRequests = userRequests.filter(time => now - time < windowMs);
    
    if (validRequests.length >= limit) {
      return false;
    }
    
    // Adiciona request atual
    validRequests.push(now);
    this.requests.set(userId, validRequests);
    
    return true;
  }
  
  cleanup(): void {
    const now = Date.now();
    const oneHour = 60 * 60 * 1000;
    
    for (const [userId, requests] of this.requests.entries()) {
      const validRequests = requests.filter(time => now - time < oneHour);
      if (validRequests.length === 0) {
        this.requests.delete(userId);
      } else {
        this.requests.set(userId, validRequests);
      }
    }
  }
}

export const rateLimiter = new RateLimiter();

// Cleanup automático a cada 5 minutos
if (typeof window === 'undefined') {
  setInterval(() => rateLimiter.cleanup(), 5 * 60 * 1000);
}

/**
 * Middleware de validação para API routes
 */
export function createValidationMiddleware<T>(schema: z.ZodSchema<T>) {
  return async (request: Request): Promise<{
    success: boolean;
    data?: T;
    error?: string;
  }> => {
    try {
      const body = await request.json();
      const validated = schema.parse(body);
      
      return {
        success: true,
        data: validated
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof z.ZodError
          ? error.issues.map((e: any) => `${e.path.join('.')}: ${e.message}`).join(', ')
          : 'Invalid request format'
      };
    }
  };
}

/**
 * Utilidades para logging seguro
 */
export function createSafeLogData(data: any): any {
  if (!data || typeof data !== 'object') return data;
  
  const safe = { ...data };
  
  // Remove campos sensíveis
  const sensitiveFields = ['password', 'token', 'key', 'secret', 'credential'];
  for (const field of sensitiveFields) {
    if (safe[field]) {
      safe[field] = '[REDACTED]';
    }
  }
  
  return safe;
}