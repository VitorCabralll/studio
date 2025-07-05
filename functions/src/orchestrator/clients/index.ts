/**
 * Factory para clientes LLM
 * Centraliza criação e configuração dos clientes
 */

import { GoogleAIClient } from './google';
import { OpenAIClient } from './openai';
import { AnthropicClient } from './anthropic';
import { LLMClientOptions } from './base';
import type { LLMProvider } from '../types';

export interface LLMClientInterface {
  generateText(request: any): Promise<any>;
}

export { BaseLLMClient } from './base';
export type { LLMClientOptions, LLMRequest, LLMResponse, LLMMessage } from './base';
export { OpenAIClient, GoogleAIClient, AnthropicClient };

/**
 * Cria cliente LLM baseado no provider
 */
export function createLLMClient(
  provider: LLMProvider,
  options: LLMClientOptions
): LLMClientInterface {
  // Validação da API key
  if (!options.apiKey || options.apiKey.length < 10) {
    throw new Error(`API key inválida para provider ${provider}`);
  }

  switch (provider) {
    case 'google':
      return new GoogleAIClient(options);
    
    case 'openai':
      return new OpenAIClient(options);
    
    case 'anthropic':
      return new AnthropicClient(options);
    
    default:
      throw new Error(`Provider não suportado: ${provider}`);
  }
}

/**
 * Verifica se provider está disponível (tem API key)
 */
export function isProviderAvailable(provider: LLMProvider): boolean {
  const envVars = {
    google: 'GOOGLE_AI_API_KEY',
    openai: 'OPENAI_API_KEY', 
    anthropic: 'ANTHROPIC_API_KEY'
  };

  const envVar = envVars[provider as keyof typeof envVars];
  if (!envVar) return false;

  const apiKey = process.env[envVar];
  return !!(apiKey && apiKey.length > 10);
}

/**
 * Lista providers disponíveis
 */
export function getAvailableProviders(): LLMProvider[] {
  const providers: LLMProvider[] = ['google', 'openai', 'anthropic'];
  return providers.filter(isProviderAvailable);
}