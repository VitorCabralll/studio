/**
 * Cliente Google AI (Gemini) para integração com API
 */

import { BaseLLMClient, LLMRequest, LLMResponse, LLMClientOptions, LLMMessage } from './base';

interface GoogleContent {
  role: string;
  parts: Array<{ text: string }>;
}

interface GoogleUsageMetadata {
  promptTokenCount?: number;
  candidatesTokenCount?: number;
  totalTokenCount?: number;
}

interface GoogleCandidate {
  content: {
    parts: Array<{ text: string }>;
  };
  finishReason: string;
}

interface GoogleResponse {
  candidates?: GoogleCandidate[];
  usageMetadata?: GoogleUsageMetadata;
}

export class GoogleAIClient extends BaseLLMClient {
  private readonly baseUrl = 'https://generativelanguage.googleapis.com/v1beta';

  constructor(options: LLMClientOptions) {
    super(options);
  }

  async generateText(request: LLMRequest): Promise<LLMResponse> {
    // Converte mensagens para formato do Gemini
    const contents = this.convertMessages(request.messages);

    const body = {
      contents,
      generationConfig: {
        maxOutputTokens: request.maxTokens || 8192,
        temperature: request.temperature || 0.7,
        topP: request.topP || 0.95,
        stopSequences: request.stopSequences,
      },
      safetySettings: [
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
      ],
    };

    const url = `${this.baseUrl}/models/${request.model}:generateContent?key=${this.options.apiKey}`;

    try {
      const response = await this.makeRequest(url, body) as GoogleResponse;

      if (!response.candidates || response.candidates.length === 0) {
        throw new Error('No response candidates from Gemini');
      }

      const candidate = response.candidates[0];
      const content = candidate.content.parts[0].text;
      const usage = response.usageMetadata;

      // Calcula custo baseado no modelo
      const cost = this.calculateModelCost(request.model, usage || {});

      return {
        content,
        finishReason: this.mapFinishReason(candidate.finishReason),
        usage: {
          promptTokens: usage?.promptTokenCount || 0,
          completionTokens: usage?.candidatesTokenCount || 0,
          totalTokens: usage?.totalTokenCount || 0,
          cost,
        },
        model: request.model,
      };
    } catch (error) {
      console.error('Google AI API Error:', error);
      throw new Error(`Google AI API failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private convertMessages(messages: LLMMessage[]): GoogleContent[] {
    const contents: GoogleContent[] = [];
    
    for (const message of messages) {
      if (message.role === 'system') {
        // Gemini não tem role system separado, adiciona como primeira mensagem do user
        contents.unshift({
          role: 'user',
          parts: [{ text: `System: ${message.content}` }],
        });
      } else {
        contents.push({
          role: message.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: message.content }],
        });
      }
    }

    return contents;
  }

  private calculateModelCost(model: string, usage: GoogleUsageMetadata): number {
    // Preços por 1M tokens (conforme pricing Google AI)
    const pricing: Record<string, { input: number; output: number }> = {
      'gemini-1.5-pro': { input: 1.25, output: 5.0 },
      'gemini-1.5-flash': { input: 0.075, output: 0.3 },
      'gemini-1.0-pro': { input: 0.5, output: 1.5 },
    };

    const modelPricing = pricing[model] || pricing['gemini-1.5-pro'];
    return this.calculateCost(
      {
        promptTokens: usage?.promptTokenCount || 0,
        completionTokens: usage?.candidatesTokenCount || 0,
        totalTokens: usage?.totalTokenCount || 0,
      },
      modelPricing.input,
      modelPricing.output
    );
  }

  private mapFinishReason(reason: string): 'stop' | 'length' | 'content_filter' | 'error' {
    switch (reason) {
      case 'STOP':
        return 'stop';
      case 'MAX_TOKENS':
        return 'length';
      case 'SAFETY':
        return 'content_filter';
      default:
        return 'error';
    }
  }
}