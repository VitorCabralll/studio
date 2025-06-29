/**
 * Exporta todos os clientes LLM
 */

export { BaseLLMClient } from './base';
export type { LLMClientOptions, LLMRequest, LLMResponse, LLMMessage, LLMUsage } from './base';

export { OpenAIClient } from './openai';
export { GoogleAIClient } from './google';
export { AnthropicClient } from './anthropic';

// Factory para criar clientes
export function createLLMClient(provider: string, options: any) {
  switch (provider) {
    case 'openai':
      const { OpenAIClient } = require('./openai');
      return new OpenAIClient(options);
    case 'google':
      const { GoogleAIClient } = require('./google');
      return new GoogleAIClient(options);
    case 'anthropic':
      const { AnthropicClient } = require('./anthropic');
      return new AnthropicClient(options);
    default:
      throw new Error(`Unsupported LLM provider: ${provider}`);
  }
}