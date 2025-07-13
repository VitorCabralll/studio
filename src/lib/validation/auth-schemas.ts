/**
 * Authentication Validation Schemas
 * Implementa validação server-side robusta para prevenir ataques de input
 */

import { z } from 'zod';

/**
 * Schema para validação de cadastro/signup
 * Implementa validação rigorosa seguindo melhores práticas de segurança
 */
export const signupSchema = z.object({
  // Nome: apenas letras, acentos e espaços
  name: z.string()
    .min(2, 'Nome deve ter pelo menos 2 caracteres')
    .max(100, 'Nome muito longo (máximo 100 caracteres)')
    .regex(
      /^[a-zA-ZÀ-ÿ\u00C0-\u017F\s]+$/,
      'Nome deve conter apenas letras e espaços'
    )
    .transform(name => name.trim().replace(/\s+/g, ' ')), // Normalizar espaços

  // Email: validação rigorosa com normalização
  email: z.string()
    .min(1, 'Email é obrigatório')
    .max(254, 'Email muito longo') // RFC 5321 limit
    .email('Formato de email inválido')
    .regex(
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      'Email deve ter formato válido'
    )
    .transform(email => email.toLowerCase().trim()),

  // Senha: critérios robustos de segurança
  password: z.string()
    .min(8, 'Senha deve ter pelo menos 8 caracteres')
    .max(128, 'Senha muito longa (máximo 128 caracteres)')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Senha deve conter ao menos: 1 minúscula, 1 maiúscula, 1 número'
    )
    .regex(
      /^[a-zA-Z0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]*$/,
      'Senha contém caracteres não permitidos'
    ),

  // Confirmação de senha
  confirmPassword: z.string()
    .min(1, 'Confirmação de senha é obrigatória'),

  // Telefone: formato brasileiro opcional
  phone: z.string()
    .regex(
      /^\(\d{2}\)\s\d{4,5}-\d{4}$/,
      'Formato de telefone inválido (ex: (11) 99999-9999)'
    )
    .optional()
    .or(z.literal('')),

  // Empresa: sanitização básica
  company: z.string()
    .max(200, 'Nome da empresa muito longo')
    .regex(
      /^[a-zA-ZÀ-ÿ\u00C0-\u017F0-9\s&.-]*$/,
      'Nome da empresa contém caracteres inválidos'
    )
    .transform(company => company.trim())
    .optional()
    .or(z.literal('')),

  // OAB: formato específico brasileiro
  oab: z.string()
    .regex(
      /^[A-Z]{2}\s\d{1,6}$/,
      'Formato OAB inválido (ex: SP 123456)'
    )
    .transform(oab => oab.toUpperCase().trim())
    .optional()
    .or(z.literal('')),

  // Termos: obrigatório para LGPD compliance
  acceptTerms: z.boolean()
    .refine(val => val === true, 'Você deve aceitar os termos de uso'),

  // Newsletter: opcional
  acceptNewsletter: z.boolean().optional().default(false)

}).refine(data => data.password === data.confirmPassword, {
  message: 'As senhas não coincidem',
  path: ['confirmPassword']
});

/**
 * Schema para validação de login
 */
export const loginSchema = z.object({
  email: z.string()
    .min(1, 'Email é obrigatório')
    .max(254, 'Email muito longo')
    .email('Formato de email inválido')
    .transform(email => email.toLowerCase().trim()),

  password: z.string()
    .min(1, 'Senha é obrigatória')
    .max(128, 'Senha muito longa')
});

/**
 * Schema para reset de senha
 */
export const resetPasswordSchema = z.object({
  email: z.string()
    .min(1, 'Email é obrigatório')
    .max(254, 'Email muito longo')
    .email('Formato de email inválido')
    .transform(email => email.toLowerCase().trim())
});

/**
 * Schema para atualização de perfil
 */
export const updateProfileSchema = z.object({
  name: z.string()
    .min(2, 'Nome deve ter pelo menos 2 caracteres')
    .max(100, 'Nome muito longo')
    .regex(
      /^[a-zA-ZÀ-ÿ\u00C0-\u017F\s]+$/,
      'Nome deve conter apenas letras e espaços'
    )
    .transform(name => name.trim().replace(/\s+/g, ' '))
    .optional(),

  phone: z.string()
    .regex(
      /^\(\d{2}\)\s\d{4,5}-\d{4}$/,
      'Formato de telefone inválido'
    )
    .optional()
    .or(z.literal('')),

  company: z.string()
    .max(200, 'Nome da empresa muito longo')
    .regex(
      /^[a-zA-ZÀ-ÿ\u00C0-\u017F0-9\s&.-]*$/,
      'Nome da empresa contém caracteres inválidos'
    )
    .transform(company => company.trim())
    .optional()
    .or(z.literal('')),

  oab: z.string()
    .regex(
      /^[A-Z]{2}\s\d{1,6}$/,
      'Formato OAB inválido'
    )
    .transform(oab => oab.toUpperCase().trim())
    .optional()
    .or(z.literal('')),

  acceptNewsletter: z.boolean().optional()
});

// Tipos TypeScript gerados automaticamente
export type SignupData = z.infer<typeof signupSchema>;
export type LoginData = z.infer<typeof loginSchema>;
export type ResetPasswordData = z.infer<typeof resetPasswordSchema>;
export type UpdateProfileData = z.infer<typeof updateProfileSchema>;

/**
 * Função utilitária para validação segura
 * Retorna erros formatados para o frontend
 */
export function validateInput<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): { success: true; data: T } | { success: false; errors: Record<string, string> } {
  try {
    const result = schema.parse(data);
    return { success: true, data: result };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors: Record<string, string> = {};
      
      error.issues.forEach((err: any) => {
        const path = err.path.join('.');
        errors[path] = err.message;
      });
      
      return { success: false, errors };
    }
    
    // Erro inesperado - não vazar detalhes
    return { 
      success: false, 
      errors: { general: 'Erro de validação inesperado' } 
    };
  }
}

/**
 * Sanitizador de strings para prevenir XSS
 */
export function sanitizeString(input: string): string {
  return input
    .trim()
    .replace(/[<>\"'&]/g, '') // Remove caracteres perigosos
    .replace(/\s+/g, ' '); // Normaliza espaços
}

/**
 * Validação de força da senha
 */
export function getPasswordStrength(password: string): {
  score: number; // 0-4
  feedback: string[];
} {
  const feedback: string[] = [];
  let score = 0;

  if (password.length >= 8) score++;
  else feedback.push('Use pelo menos 8 caracteres');

  if (/[a-z]/.test(password)) score++;
  else feedback.push('Inclua pelo menos uma letra minúscula');

  if (/[A-Z]/.test(password)) score++;
  else feedback.push('Inclua pelo menos uma letra maiúscula');

  if (/\d/.test(password)) score++;
  else feedback.push('Inclua pelo menos um número');

  if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) score++;
  else feedback.push('Inclua pelo menos um caractere especial');

  return { score: Math.min(score, 4), feedback };
}