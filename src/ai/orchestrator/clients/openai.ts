/**
 * Cliente OpenAI para integração com API
 */

import { BaseLLMClient, LLMRequest, LLMResponse, LLMClientOptions } from './base';

export class OpenAIClient extends BaseLLMClient {
  private readonly baseUrl = 'https://api.openai.com/v1';

  constructor(options: LLMClientOptions) {
    super(options);
  }

  async generateText(request: LLMRequest): Promise<LLMResponse> {
    const body = {
      model: request.model,
      messages: request.messages,
      max_tokens: request.maxTokens || 4096,
      temperature: request.temperature || 0.7,
      top_p: request.topP || 1,
      stop: request.stopSequences,
    };

    const headers = {
      'Authorization': `Bearer ${this.options.apiKey}`,
    };

    try {
      const response = await this.makeRequest(
        `${this.baseUrl}/chat/completions`,
        body,
        headers
      );

      const choice = response.choices[0];
      const usage = response.usage;

      // Calcula custo baseado no modelo
      const cost = this.calculateModelCost(request.model, usage);

      return {
        content: choice.message.content,
        finishReason: this.mapFinishReason(choice.finish_reason),
        usage: {
          promptTokens: usage.prompt_tokens,
          completionTokens: usage.completion_tokens,
          totalTokens: usage.total_tokens,
          cost,
        },
        model: response.model,
        id: response.id,
      };
    } catch (error) {
      console.error('OpenAI API Error:', error);
      throw new Error(`OpenAI API failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private calculateModelCost(model: string, usage: any): number {
    // Preços por 1M tokens (atualizado conforme pricing OpenAI)
    const pricing: Record<string, { input: number; output: number }> = {
      'gpt-4-turbo': { input: 10, output: 30 },
      'gpt-4': { input: 30, output: 60 },
      'gpt-4o': { input: 5, output: 15 },
      'gpt-4o-mini': { input: 0.15, output: 0.6 },
      'gpt-3.5-turbo': { input: 0.5, output: 1.5 },
    };

    const modelPricing = pricing[model] || pricing['gpt-4-turbo'];
    return this.calculateCost(
      {
        promptTokens: usage.prompt_tokens,
        completionTokens: usage.completion_tokens,
        totalTokens: usage.total_tokens,
      },
      modelPricing.input,
      modelPricing.output
    );
  }

  private mapFinishReason(reason: string): 'stop' | 'length' | 'content_filter' | 'error' {
    switch (reason) {
      case 'stop':
        return 'stop';
      case 'length':
        return 'length';
      case 'content_filter':
        return 'content_filter';
      default:
        return 'error';
    }
  }
}