/**
 * Provider base abstrato - Interface uniforme para todos os LLMs
 */

import type { LLMRequest, LLMResponse, ModelInfo, LLMProvider } from '../types/index';

export abstract class BaseLLMProvider {
  protected provider: LLMProvider;
  protected apiKey: string;
  protected timeout: number;

  constructor(provider: LLMProvider, apiKey: string, timeout: number = 30000) {
    this.provider = provider;
    this.apiKey = apiKey;
    this.timeout = timeout;
  }

  /**
   * Método principal para geração de texto
   */
  abstract generateText(request: LLMRequest): Promise<LLMResponse>;

  /**
   * Verifica se o provider está disponível
   */
  abstract isAvailable(): Promise<boolean>;

  /**
   * Retorna informações do modelo
   */
  abstract getModelInfo(model: string): ModelInfo;

  /**
   * Lista modelos disponíveis
   */
  abstract getAvailableModels(): string[];

  /**
   * Calcula custo estimado
   */
  protected calculateCost(
    promptTokens: number,
    completionTokens: number,
    model: string
  ): number {
    const modelInfo = this.getModelInfo(model);
    const inputCost = (promptTokens / 1000000) * modelInfo.costPer1MTokens.input;
    const outputCost = (completionTokens / 1000000) * modelInfo.costPer1MTokens.output;
    return inputCost + outputCost;
  }

  /**
   * Faz requisição HTTP com timeout e retry
   */
  protected async makeRequest(
    url: string,
    body: any,
    headers: Record<string, string> = {}
  ): Promise<any> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

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

  /**
   * Valida configuração do provider
   */
  protected validateConfig(): void {
    if (!this.apiKey || this.apiKey.length < 10) {
      throw new Error(`Invalid API key for ${this.provider} provider`);
    }
  }

  /**
   * Normaliza resposta de diferentes providers
   */
  protected normalizeResponse(rawResponse: any, model: string): LLMResponse {
    // Override in child classes
    throw new Error('normalizeResponse must be implemented by child class');
  }

  /**
   * Health check específico do provider
   */
  async healthCheck(): Promise<{ available: boolean; latency?: number; error?: string }> {
    const startTime = Date.now();
    
    try {
      await this.isAvailable();
      return {
        available: true,
        latency: Date.now() - startTime
      };
    } catch (error) {
      return {
        available: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }
}