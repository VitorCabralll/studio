/**
 * Utilitários para o orquestrador
 * Funções auxiliares e validações
 */

import type { ProcessingInput } from './types';

/**
 * Valida se input de processamento está completo
 */
export function validateProcessingInput(input: ProcessingInput): void {
  if (!input.taskType) {
    throw new Error('Tipo de tarefa é obrigatório');
  }

  if (!input.documentType) {
    throw new Error('Tipo de documento é obrigatório');
  }

  if (!input.instructions?.trim()) {
    throw new Error('Instruções são obrigatórias');
  }

  if (!input.context || input.context.length === 0) {
    throw new Error('Contexto é obrigatório');
  }

  const hasContent = input.context.some(item => 
    (item.type === 'ocr_text' || item.type === 'file_content') && 
    item.content?.trim()
  );

  if (!hasContent) {
    throw new Error('É necessário anexar documentos com conteúdo');
  }
}

/**
 * Verifica se um erro é retryable
 */
export function isRetryableError(error: unknown): boolean {
  if (error instanceof Error) {
    const retryablePatterns = [
      'timeout', 'rate limit', 'quota', 'network', 'fetch', 
      'temporarily unavailable', '429', '503', '502', 'ECONNRESET'
    ];
    
    return retryablePatterns.some(pattern => 
      error.message.toLowerCase().includes(pattern)
    );
  }
  
  return false;
}

/**
 * Formata erro para resposta amigável
 */
export function formatUserFriendlyError(error: unknown, stage?: string): string {
  if (error instanceof Error) {
    // Erros de API específicos
    if (error.message.includes('API key')) {
      return 'Erro de configuração da API de IA. Verifique as configurações do sistema.';
    }
    if (error.message.includes('rate limit') || error.message.includes('quota')) {
      return 'Limite de uso da API atingido. Tente novamente em alguns minutos.';
    }
    if (error.message.includes('timeout') || error.message.includes('Timeout')) {
      return 'Tempo limite excedido. O processamento está demorando mais que o esperado.';
    }
    if (error.message.includes('network') || error.message.includes('fetch')) {
      return 'Erro de conexão com os serviços de IA. Verifique sua conexão com a internet.';
    }
  }

  // Mensagens por estágio
  const stageMessages: Record<string, string> = {
    'summarization': 'Falha na análise dos documentos anexados.',
    'context_analysis': 'Falha na análise do contexto e instruções.',
    'structure_definition': 'Falha na definição da estrutura do documento.',
    'content_generation': 'Falha na geração do conteúdo do documento.',
    'assembly': 'Falha na montagem final do documento.'
  };

  const stageMessage = stage ? stageMessages[stage] : null;
  return stageMessage || 'Erro no processamento do documento. Tente novamente ou entre em contato com o suporte.';
}

/**
 * Calcula delay exponencial para retry
 */
export function calculateRetryDelay(
  attempt: number, 
  baseDelay: number, 
  maxDelay: number, 
  exponential: boolean = true
): number {
  if (!exponential) {
    return Math.min(baseDelay, maxDelay);
  }
  
  const delay = baseDelay * Math.pow(2, attempt - 1);
  return Math.min(delay, maxDelay);
}

/**
 * Sanitiza prompt removendo informações sensíveis
 */
export function sanitizePrompt(prompt: string): string {
  // Remove possíveis informações sensíveis
  return prompt
    .replace(/\b\d{3}\.\d{3}\.\d{3}-\d{2}\b/g, '[CPF]') // CPF
    .replace(/\b\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}\b/g, '[CNPJ]') // CNPJ
    .replace(/\b\d{1,2}\/\d{4}\.\d{3}\.\d{3}-\d\b/g, '[RG]') // RG
    .replace(/senha|password/gi, '[SENHA]')
    .replace(/chave|key/gi, '[CHAVE]');
}

/**
 * Estima tokens de um texto (aproximação)
 */
export function estimateTokens(text: string): number {
  // Aproximação: ~4 caracteres por token em português
  return Math.ceil(text.length / 4);
}

/**
 * Trunca texto mantendo palavras completas
 */
export function truncateText(text: string, maxTokens: number): string {
  const maxChars = maxTokens * 4; // Aproximação
  
  if (text.length <= maxChars) {
    return text;
  }
  
  // Trunca em uma palavra completa
  const truncated = text.substring(0, maxChars);
  const lastSpace = truncated.lastIndexOf(' ');
  
  return lastSpace > 0 ? truncated.substring(0, lastSpace) + '...' : truncated + '...';
}

/**
 * Normaliza nome de seção para identificador
 */
export function normalizeSectionName(sectionName: string): string {
  return sectionName
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '');
}