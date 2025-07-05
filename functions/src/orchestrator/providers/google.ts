/**
 * Google AI Provider - Implementação otimizada
 */

import { BaseLLMProvider } from './base';
import type { LLMRequest, LLMResponse, ModelInfo } from '../types/index';

export class GoogleAIProvider extends BaseLLMProvider {
  private readonly baseUrl = 'https://generativelanguage.googleapis.com/v1beta';

  constructor(apiKey: string, timeout?: number) {
    super('google', apiKey, timeout);
    this.validateConfig();
  }

  async generateText(request: LLMRequest): Promise<LLMResponse> {
    const model = request.model || 'gemini-1.5-pro';
    const contents = this.convertToGeminiFormat(request);

    const body = {
      contents,
      generationConfig: {
        maxOutputTokens: request.maxTokens || 8192,
        temperature: request.temperature || 0.7,
      },
      safetySettings: this.getSafetySettings(),
    };

    const url = `${this.baseUrl}/models/${model}:generateContent?key=${this.apiKey}`;
    
    try {
      const response = await this.makeRequest(url, body);
      return this.normalizeResponse(response, model);
    } catch (error) {
      throw new Error(`Google AI API failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
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
      'gemini-1.5-pro': {
        name: 'Gemini 1.5 Pro',
        provider: 'google',
        maxTokens: 2097152,
        costPer1MTokens: { input: 1.25, output: 5.0 },
        capabilities: ['document_generation', 'legal_analysis', 'reasoning'],
        qualityRating: 9
      },
      'gemini-1.5-flash': {
        name: 'Gemini 1.5 Flash',
        provider: 'google',
        maxTokens: 1048576,
        costPer1MTokens: { input: 0.075, output: 0.3 },
        capabilities: ['summarization', 'extraction', 'analysis'],
        qualityRating: 8
      }
    };

    return models[model] || models['gemini-1.5-pro'];
  }

  getAvailableModels(): string[] {
    return ['gemini-1.5-pro', 'gemini-1.5-flash'];
  }

  protected normalizeResponse(rawResponse: any, model: string): LLMResponse {
    if (!rawResponse.candidates || rawResponse.candidates.length === 0) {
      throw new Error('No response candidates from Gemini');
    }

    const candidate = rawResponse.candidates[0];
    const content = candidate.content.parts[0].text;
    const usage = rawResponse.usageMetadata;

    const promptTokens = usage?.promptTokenCount || 0;
    const completionTokens = usage?.candidatesTokenCount || 0;
    const cost = this.calculateCost(promptTokens, completionTokens, model);

    return {
      content,
      usage: {
        promptTokens,
        completionTokens,
        totalTokens: usage?.totalTokenCount || 0
      },
      model,
      finishReason: this.mapFinishReason(candidate.finishReason),
      metadata: {
        provider: 'google',
        model,
        latency: 0,
        cost,
        safetyRatings: candidate.safetyRatings
      }
    };
  }

  private convertToGeminiFormat(request: LLMRequest): any[] {
    const contents: any[] = [];
    
    // Add system prompt if provided
    if (request.systemPrompt) {
      contents.push({
        role: 'user',
        parts: [{ text: `System: ${request.systemPrompt}` }]
      });
    }
    
    // Add main prompt
    contents.push({
      role: 'user',
      parts: [{ text: request.prompt }]
    });

    return contents;
  }

  private getSafetySettings() {
    return [
      {
        category: 'HARM_CATEGORY_HARASSMENT',
        threshold: 'BLOCK_MEDIUM_AND_ABOVE',
      },
      {
        category: 'HARM_CATEGORY_HATE_SPEECH',
        threshold: 'BLOCK_MEDIUM_AND_ABOVE',
      },
      {
        category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
        threshold: 'BLOCK_MEDIUM_AND_ABOVE',
      },
      {
        category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
        threshold: 'BLOCK_MEDIUM_AND_ABOVE',
      },
    ];
  }

  private mapFinishReason(reason: string): 'stop' | 'length' | 'error' {
    switch (reason) {
      case 'STOP':
        return 'stop';
      case 'MAX_TOKENS':
        return 'length';
      default:
        return 'error';
    }
  }
}