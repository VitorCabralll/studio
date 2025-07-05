/**
 * Orquestrador simplificado para build funcional
 */

import { SimplePipeline } from './core/pipeline';
import { ProviderFactory } from './providers/factory';
import type {
  DocumentRequest,
  ProcessingInput,
  ProcessingOutput,
  RoutingDecision
} from './types/index';

export class AIOrchestrator {
  private pipeline: SimplePipeline;

  constructor() {
    this.pipeline = new SimplePipeline();
  }

  /**
   * Processa documento convertendo de ProcessingInput para DocumentRequest
   */
  async processDocument(input: ProcessingInput): Promise<ProcessingOutput> {
    try {
      // Converte ProcessingInput para DocumentRequest
      const request: DocumentRequest = {
        type: input.documentType,
        taskType: input.taskType,
        legalArea: input.legalArea,
        instructions: input.instructions,
        context: input.context || []
      };

      const response = await this.pipeline.execute(request);

      // Converte DocumentResponse para ProcessingOutput
      const output: ProcessingOutput = {
        success: response.success,
        result: response.document,
        error: response.error,
        metadata: {
          processingTime: response.metadata.processingTime,
          llmUsed: response.metadata.providerUsed.map(p => ({ provider: p })) as any[],
          totalCost: response.metadata.totalCost,
          tokensUsed: response.metadata.tokensUsed,
          confidence: response.metadata.confidence
        },
        pipeline: response.trace as any
      };

      return output;
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'ORCHESTRATOR_ERROR',
          message: error instanceof Error ? error.message : 'Erro no orquestrador',
          retryable: true,
          timestamp: new Date()
        },
        metadata: {
          processingTime: 0,
          llmUsed: [],
          totalCost: 0,
          tokensUsed: {
            promptTokens: 0,
            completionTokens: 0,
            totalTokens: 0,
            cost: 0
          },
          confidence: 0
        }
      };
    }
  }

  /**
   * Testa roteamento de um input
   */
  async testRouting(input: ProcessingInput): Promise<RoutingDecision> {
    // Simulação de decisão de roteamento
    return {
      provider: 'google',
      model: 'gemini-1.5-flash',
      reasoning: 'Modelo mais econômico para a tarefa',
      confidence: 0.85,
      estimatedCost: 0.01,
      estimatedLatency: 5000
    };
  }

  /**
   * Health check dos providers
   */
  async healthCheck(): Promise<Record<string, any>> {
    try {
      return await ProviderFactory.healthCheckAll();
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : 'Erro no health check'
      };
    }
  }

  /**
   * Configuração otimizada para custos
   */
  isOptimizedForCost(): boolean {
    return true; // Sempre priorizar economia
  }
}

/**
 * Singleton para Firebase Functions
 */
let orchestratorInstance: AIOrchestrator;

export function getOrchestrator(): AIOrchestrator {
  if (!orchestratorInstance) {
    orchestratorInstance = new AIOrchestrator();
  }
  return orchestratorInstance;
}