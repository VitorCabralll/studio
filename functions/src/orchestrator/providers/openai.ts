/**
 * OpenAI Provider - Implementação otimizada
 */

import { BaseLLMProvider } from './base';
import type { LLMRequest, LLMResponse, ModelInfo } from '../types/index';

export class OpenAIProvider extends BaseLLMProvider {
  private readonly baseUrl = 'https://api.openai.com/v1';

  constructor(apiKey: string, timeout?: number) {
    super('openai', apiKey, timeout);
    this.validateConfig();
  }

  async generateText(request: LLMRequest): Promise<LLMResponse> {
    const model = request.model || 'gpt-4o';
    const messages = this.convertToOpenAIFormat(request);

    const body = {
      model,
      messages,
      max_tokens: request.maxTokens || 4096,
      temperature: request.temperature || 0.7,
      ...request.options
    };

    const headers = {
      'Authorization': `Bearer ${this.apiKey}`,
    };

    try {
      const response = await this.makeRequest(
        `${this.baseUrl}/chat/completions`,
        body,
        headers
      );
      return this.normalizeResponse(response, model);
    } catch (error) {
      throw new Error(`OpenAI API failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async isAvailable(): Promise<boolean> {
    try {
      const testRequest: LLMRequest = {
        prompt: 'Test',
        maxTokens: 10
      };
      await this.generateText(testRequest);
      return true;
    } catch {
      return false;
    }
  }

  getModelInfo(model: string): ModelInfo {
    const models: Record<string, ModelInfo> = {
      'gpt-4o': {
        name: 'GPT-4o',
        provider: 'openai',
        maxTokens: 128000,
        costPer1MTokens: { input: 5.0, output: 15.0 },
        capabilities: ['document_generation', 'legal_analysis', 'reasoning'],
        qualityRating: 9
      },
      'gpt-4o-mini': {
        name: 'GPT-4o Mini',
        provider: 'openai',
        maxTokens: 128000,
        costPer1MTokens: { input: 0.15, output: 0.6 },
        capabilities: ['summarization', 'extraction', 'analysis'],
        qualityRating: 8
      },
      'gpt-3.5-turbo': {
        name: 'GPT-3.5 Turbo',
        provider: 'openai',
        maxTokens: 16384,
        costPer1MTokens: { input: 0.5, output: 1.5 },
        capabilities: ['summarization', 'basic_generation'],
        qualityRating: 7
      }
    };

    return models[model] || models['gpt-4o'];
  }

  getAvailableModels(): string[] {
    return ['gpt-4o', 'gpt-4o-mini', 'gpt-3.5-turbo'];
  }

  protected normalizeResponse(rawResponse: any, model: string): LLMResponse {
    if (!rawResponse.choices || rawResponse.choices.length === 0) {
      throw new Error('No response choices from OpenAI');
    }

    const choice = rawResponse.choices[0];
    const usage = rawResponse.usage;

    const promptTokens = usage.prompt_tokens;
    const completionTokens = usage.completion_tokens;
    const cost = this.calculateCost(promptTokens, completionTokens, model);

    return {
      content: choice.message.content,
      usage: {
        promptTokens,
        completionTokens,
        totalTokens: usage.total_tokens
      },
      model: rawResponse.model || model,
      finishReason: this.mapFinishReason(choice.finish_reason),
      metadata: {
        provider: 'openai',
        model: rawResponse.model || model,
        latency: 0,
        cost,
        id: rawResponse.id
      }
    };
  }

  private convertToOpenAIFormat(request: LLMRequest): any[] {
    const messages: any[] = [];
    
    // Add system message if provided
    if (request.systemPrompt) {
      messages.push({
        role: 'system',
        content: request.systemPrompt
      });
    }
    
    // Add user message
    messages.push({
      role: 'user',
      content: request.prompt
    });

    return messages;
  }

  private mapFinishReason(reason: string): 'stop' | 'length' | 'error' {
    switch (reason) {
      case 'stop':
        return 'stop';
      case 'length':
        return 'length';
      default:
        return 'error';
    }
  }
}