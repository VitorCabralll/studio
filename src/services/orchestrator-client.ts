/**
 * Cliente para o orquestrador Firebase Functions
 * Interface única para comunicação com o orquestrador via Functions
 */

import type { ProcessingInput, ProcessingOutput, RoutingDecision } from '@/types/orchestrator';
import { AppConfig } from '@/lib/app-config';

interface OrchestratorClientConfig {
  functionUrl?: string;
  timeout?: number;
  retries?: number;
}

/**
 * Cliente para comunicação com Firebase Functions
 */
export class OrchestratorClient {
  private config: Required<OrchestratorClientConfig>;

  constructor(config: OrchestratorClientConfig = {}) {
    const projectId = AppConfig.firebase.projectId;
    const region = 'us-central1';
    
    this.config = {
      functionUrl: config.functionUrl || `https://${region}-${projectId}.cloudfunctions.net`,
      timeout: config.timeout || 120000, // 2 minutos
      retries: config.retries || 2
    };
  }

  /**
   * Processa documento via Firebase Functions
   */
  async processDocument(input: ProcessingInput): Promise<ProcessingOutput> {
    return this.makeRequest('processDocument', input);
  }

  /**
   * Testa roteamento de LLM
   */
  async testRouting(input: ProcessingInput): Promise<RoutingDecision> {
    return this.makeRequest('testRouting', input);
  }

  /**
   * Health check do orquestrador
   */
  async healthCheck(): Promise<{ status: string; timestamp: string; llmCount: number; version: string }> {
    return this.makeRequest('healthCheck', {}, { method: 'GET' });
  }

  /**
   * Faz requisição para Firebase Functions
   */
  private async makeRequest(
    endpoint: string, 
    body: any, 
    options: { method?: string } = {}
  ): Promise<any> {
    const method = options.method || 'POST';
    let lastError: Error | null = null;

    for (let attempt = 1; attempt <= this.config.retries; attempt++) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), this.config.timeout);

        const response = await fetch(`${this.config.functionUrl}/${endpoint}`, {
          method,
          headers: {
            'Content-Type': 'application/json',
          },
          body: method === 'POST' ? JSON.stringify(body) : undefined,
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`HTTP ${response.status}: ${errorText}`);
        }

        return await response.json();

      } catch (error) {
        lastError = error instanceof Error ? error : new Error('Unknown error');
        
        // Se não é o último attempt, aguarda antes de retry
        if (attempt < this.config.retries) {
          const delay = Math.min(1000 * Math.pow(2, attempt - 1), 5000);
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
    }

    throw new Error(`Falha após ${this.config.retries} tentativas: ${lastError?.message}`);
  }
}

// Instância singleton
export const orchestratorClient = new OrchestratorClient();

// Função de conveniência para uso direto
export async function processDocument(input: ProcessingInput): Promise<ProcessingOutput> {
  return orchestratorClient.processDocument(input);
}

export async function testRouting(input: ProcessingInput): Promise<RoutingDecision> {
  return orchestratorClient.testRouting(input);
}

export async function checkOrchestratorHealth() {
  return orchestratorClient.healthCheck();
}