/**
 * Cliente Anthropic (Claude) para integração com API
 */

import { BaseLLMClient, LLMRequest, LLMResponse, LLMClientOptions } from './base';

interface AnthropicUsage {
  input_tokens: number;
  output_tokens: number;
}

interface AnthropicContent {
  text: string;
}

interface AnthropicResponse {
  content: AnthropicContent[];
  usage: AnthropicUsage;
  model: string;
  id: string;
  stop_reason: string;
}

export class AnthropicClient extends BaseLLMClient {
  private readonly baseUrl = 'https://api.anthropic.com/v1';

  constructor(options: LLMClientOptions) {
    super(options);
  }

  async generateText(request: LLMRequest): Promise<LLMResponse> {
    // Separa system message das outras mensagens
    const systemMessage = request.messages.find(m => m.role === 'system');
    const conversationMessages = request.messages.filter(m => m.role !== 'system');

    const body = {
      model: request.model,
      max_tokens: request.maxTokens || 4096,
      temperature: request.temperature || 0.7,
      top_p: request.topP || 1,
      stop_sequences: request.stopSequences,
      messages: conversationMessages,
      ...(systemMessage && { system: systemMessage.content }),
    };

    const headers = {
      'x-api-key': this.options.apiKey,
      'anthropic-version': '2023-06-01',
    };

    try {
      const response = await this.makeRequest(
        `${this.baseUrl}/messages`,
        body,
        headers
      ) as AnthropicResponse;

      const content = response.content[0].text;
      const usage = response.usage;

      // Calcula custo baseado no modelo
      const cost = this.calculateModelCost(request.model, usage);

      return {
        content,
        finishReason: this.mapFinishReason(response.stop_reason),
        usage: {
          promptTokens: usage.input_tokens,
          completionTokens: usage.output_tokens,
          totalTokens: usage.input_tokens + usage.output_tokens,
          cost,
        },
        model: response.model,
        id: response.id,
      };
    } catch (error) {
      console.error('Anthropic API Error:', error);
      throw new Error(`Anthropic API failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private calculateModelCost(model: string, usage: AnthropicUsage): number {
    // Preços por 1M tokens (conforme pricing Anthropic)
    const pricing: Record<string, { input: number; output: number }> = {
      'claude-3-opus-20240229': { input: 15, output: 75 },
      'claude-3-sonnet-20240229': { input: 3, output: 15 },
      'claude-3-haiku-20240307': { input: 0.25, output: 1.25 },
      'claude-3-5-sonnet-20241022': { input: 3, output: 15 },
    };

    const modelPricing = pricing[model] || pricing['claude-3-sonnet-20240229'];
    return this.calculateCost(
      {
        promptTokens: usage.input_tokens,
        completionTokens: usage.output_tokens,
        totalTokens: usage.input_tokens + usage.output_tokens,
      },
      modelPricing.input,
      modelPricing.output
    );
  }

  private mapFinishReason(reason: string): 'stop' | 'length' | 'content_filter' | 'error' {
    switch (reason) {
      case 'end_turn':
        return 'stop';
      case 'max_tokens':
        return 'length';
      case 'stop_sequence':
        return 'stop';
      default:
        return 'error';
    }
  }
}