/**
 * Exporta todos os clientes LLM
 */

export { BaseLLMClient } from './base';
export type { LLMClientOptions, LLMRequest, LLMResponse, LLMMessage } from './base';

import { OpenAIClient } from './openai';
import { GoogleAIClient } from './google';
import { MockGoogleAIClient } from './mock-google';
import { AnthropicClient } from './anthropic';

export { OpenAIClient } from './openai';
export { GoogleAIClient } from './google';
export { MockGoogleAIClient } from './mock-google';
export { AnthropicClient } from './anthropic';

// Factory para criar clientes
export function createLLMClient(provider: string, options: any) {
  // Usa mock se API key não estiver configurada ou for inválida
  const useDemo = !options.apiKey || options.apiKey.length < 20;
  
  switch (provider) {
    case 'openai':
      return new OpenAIClient(options);
    case 'google':
      if (useDemo) {
        return new MockGoogleAIClient(options);
      } else {
        return new GoogleAIClient(options);
      }
    case 'anthropic':
      return new AnthropicClient(options);
    default:
      throw new Error(`Unsupported LLM provider: ${provider}`);
  }
}