/**
 * Cliente para comunicação com o Orquestrador de IA via Firebase Functions
 * Substitui a implementação local do orquestrador
 */

import { 
  ProcessingInput, 
  ProcessingOutput, 
  RoutingDecision 
} from '../ai/orchestrator/types';

// URL base das Functions (ajustar conforme ambiente)
const FUNCTIONS_BASE_URL = process.env.NODE_ENV === 'development' 
  ? 'http://127.0.0.1:5001/lexai-ef0ab/us-central1'
  : 'https://us-central1-lexai-ef0ab.cloudfunctions.net';

/**
 * Cliente do orquestrador como serviço remoto
 */
export class OrchestratorClient {
  private baseUrl: string;

  constructor(baseUrl?: string) {
    this.baseUrl = baseUrl || FUNCTIONS_BASE_URL;
  }

  /**
   * Processa um documento via Functions
   */
  async processDocument(input: ProcessingInput): Promise<ProcessingOutput> {
    try {
      console.log('[ORCHESTRATOR-CLIENT] Enviando para Functions:', {
        taskType: input.taskType,
        documentType: input.documentType,
        contextItems: input.context.length
      });

      const response = await fetch(`${this.baseUrl}/processDocument`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(input)
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result: ProcessingOutput = await response.json();
      
      console.log('[ORCHESTRATOR-CLIENT] Resposta recebida:', {
        success: result.success,
        confidence: result.metadata?.confidence,
        processingTime: result.metadata?.processingTime
      });

      return result;

    } catch (error) {
      console.error('[ORCHESTRATOR-CLIENT] Erro na comunicação:', error);
      
      // Retorna erro estruturado
      return {
        success: false,
        error: {
          code: 'CLIENT_ERROR',
          message: error instanceof Error ? error.message : 'Erro de comunicação',
          retryable: true,
          timestamp: new Date()
        },
        metadata: {
          processingTime: 0,
          llmUsed: [],
          totalCost: 0,
          tokensUsed: { promptTokens: 0, completionTokens: 0, totalTokens: 0 },
          confidence: 0
        },
        pipeline: {
          stages: [],
          totalDuration: 0,
          totalCost: 0,
          totalTokens: 0,
          errors: []
        }
      };
    }
  }

  /**
   * Testa roteamento via Functions
   */
  async testRouting(input: ProcessingInput): Promise<RoutingDecision> {
    try {
      const response = await fetch(`${this.baseUrl}/testRouting`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(input)
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();

    } catch (error) {
      console.error('[ORCHESTRATOR-CLIENT] Erro no teste de roteamento:', error);
      throw error;
    }
  }

  /**
   * Verifica status das Functions
   */
  async healthCheck(): Promise<{ status: string; timestamp: string; llmCount: number; version: string }> {
    try {
      const response = await fetch(`${this.baseUrl}/healthCheck`, {
        method: 'GET'
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();

    } catch (error) {
      console.error('[ORCHESTRATOR-CLIENT] Erro no health check:', error);
      throw error;
    }
  }

  /**
   * Testa conectividade
   */
  async isAvailable(): Promise<boolean> {
    try {
      await this.healthCheck();
      return true;
    } catch {
      return false;
    }
  }
}

// Instância singleton
export const orchestratorClient = new OrchestratorClient();

/**
 * Função utilitária para processamento
 * Mantém compatibilidade com a interface local
 */
export async function generateDocument(input: ProcessingInput): Promise<ProcessingOutput> {
  return orchestratorClient.processDocument(input);
}

/**
 * Função utilitária para teste de roteamento
 */
export async function testLLMRouting(input: ProcessingInput): Promise<RoutingDecision> {
  return orchestratorClient.testRouting(input);
}