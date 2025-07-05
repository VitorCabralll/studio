/**
 * Provider Factory - Criação inteligente de providers
 */

import { BaseLLMProvider } from './base';
import { GoogleAIProvider } from './google';
import { OpenAIProvider } from './openai';
import type { LLMProvider } from '../types/index';
import { config } from 'firebase-functions';

export class ProviderFactory {
  private static instances = new Map<string, BaseLLMProvider>();

  /**
   * Cria ou retorna instância do provider
   */
  static create(type: LLMProvider, apiKey?: string): BaseLLMProvider {
    const key = `${type}-${apiKey?.substring(0, 10)}`;
    
    if (this.instances.has(key)) {
      return this.instances.get(key)!;
    }

    const resolvedApiKey = apiKey || this.getApiKeyFromEnv(type);
    let provider: BaseLLMProvider;

    switch (type) {
      case 'google':
        provider = new GoogleAIProvider(resolvedApiKey);
        break;
      case 'openai':
        provider = new OpenAIProvider(resolvedApiKey);
        break;
      default:
        throw new Error(`Provider '${type}' não suportado`);
    }

    this.instances.set(key, provider);
    return provider;
  }

  /**
   * Verifica se provider está disponível
   */
  static isAvailable(type: LLMProvider): boolean {
    try {
      const apiKey = this.getApiKeyFromEnv(type);
      return !!(apiKey && apiKey.length > 10);
    } catch {
      return false;
    }
  }

  /**
   * Lista providers disponíveis
   */
  static getAvailableProviders(): LLMProvider[] {
    const providers: LLMProvider[] = ['google', 'openai'];
    return providers.filter(provider => this.isAvailable(provider));
  }

  /**
   * Testa conectividade de um provider
   */
  static async testProvider(type: LLMProvider): Promise<boolean> {
    if (!this.isAvailable(type)) {
      return false;
    }

    try {
      const provider = this.create(type);
      return await provider.isAvailable();
    } catch {
      return false;
    }
  }

  /**
   * Health check de todos os providers
   */
  static async healthCheckAll(): Promise<Record<LLMProvider, any>> {
    const results: Record<string, any> = {};
    
    for (const providerType of ['google', 'openai'] as LLMProvider[]) {
      if (this.isAvailable(providerType)) {
        try {
          const provider = this.create(providerType);
          results[providerType] = await provider.healthCheck();
        } catch (error) {
          results[providerType] = {
            available: false,
            error: error instanceof Error ? error.message : 'Unknown error'
          };
        }
      } else {
        results[providerType] = {
          available: false,
          error: 'API key not configured'
        };
      }
    }

    return results;
  }

  /**
   * Obtém API key do ambiente ou Firebase config
   */
  private static getApiKeyFromEnv(type: LLMProvider): string {
    const envVars: Record<LLMProvider, string> = {
      google: 'GOOGLE_AI_API_KEY',
      openai: 'OPENAI_API_KEY',
      anthropic: 'ANTHROPIC_API_KEY',
      local: 'LOCAL_API_KEY',
      custom: 'CUSTOM_API_KEY'
    };

    const envVar = envVars[type];
    
    // Primeiro tenta process.env
    let apiKey = process.env[envVar];
    
    // Se não encontrar, tenta Firebase config
    if (!apiKey) {
      const firebaseConfig = config();
      if (type === 'google' && firebaseConfig.google?.api_key) {
        apiKey = firebaseConfig.google.api_key;
      } else if (type === 'openai' && firebaseConfig.openai?.api_key) {
        apiKey = firebaseConfig.openai.api_key;
      }
    }

    if (!apiKey) {
      throw new Error(`API key não encontrada para ${type}. Configure ${envVar} ou firebase config`);
    }

    return apiKey;
  }

  /**
   * Limpa cache de instâncias
   */
  static clearCache(): void {
    this.instances.clear();
  }
}