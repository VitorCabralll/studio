/**
 * Exporta todos os clientes LLM
 */

import { OpenAIClient } from './openai';
import { GoogleAIClient } from './google';
import { AnthropicClient } from './anthropic';
import { BaseLLMClient, type LLMClientOptions } from './base';

export { BaseLLMClient } from './base';
export type { LLMClientOptions, LLMRequest, LLMResponse, LLMMessage } from './base';

export { OpenAIClient } from './openai';
export { GoogleAIClient } from './google';
export { AnthropicClient } from './anthropic';

// Factory para criar clientes
export function createLLMClient(provider: string, options: LLMClientOptions): BaseLLMClient {
  if (!options.apiKey) {
    throw new Error(`API key is required for ${provider} provider`);
  }
  
  switch (provider) {
    case 'openai':
      return new OpenAIClient(options);
    case 'google':
      return new GoogleAIClient(options);
    case 'anthropic':
      return new AnthropicClient(options);
    default:
      throw new Error(`Unsupported LLM provider: ${provider}`);
  }
}