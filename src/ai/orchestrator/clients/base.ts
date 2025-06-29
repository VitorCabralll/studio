/**
 * Cliente base para APIs de LLM
 * Define interface comum para todos os provedores
 */

export interface LLMClientOptions {
  apiKey: string;
  baseUrl?: string;
  timeout?: number;
  maxRetries?: number;
}

export interface LLMMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface LLMRequest {
  model: string;
  messages: LLMMessage[];
  maxTokens?: number;
  temperature?: number;
  topP?: number;
  stopSequences?: string[];
}

export interface LLMUsage {
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
  cost?: number;
}

export interface LLMResponse {
  content: string;
  finishReason: 'stop' | 'length' | 'content_filter' | 'error';
  usage?: LLMUsage;
  model?: string;
  id?: string;
}

export abstract class BaseLLMClient {
  protected options: LLMClientOptions;

  constructor(options: LLMClientOptions) {
    this.options = options;
  }

  abstract generateText(request: LLMRequest): Promise<LLMResponse>;

  protected async makeRequest(
    url: string,
    body: any,
    headers: Record<string, string> = {}
  ): Promise<any> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.options.timeout || 30000);

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...headers,
        },
        body: JSON.stringify(body),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      return await response.json();
    } catch (error) {
      clearTimeout(timeoutId);
      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error('Request timeout');
      }
      throw error;
    }
  }

  protected calculateCost(usage: LLMUsage, inputPrice: number, outputPrice: number): number {
    const inputCost = (usage.promptTokens / 1000000) * inputPrice;
    const outputCost = (usage.completionTokens / 1000000) * outputPrice;
    return inputCost + outputCost;
  }
}