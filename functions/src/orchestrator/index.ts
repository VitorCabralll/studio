/**
 * Orquestrador Principal de IA do LexAI - Firebase Functions
 * Versão adaptada para ambiente serverless
 */

import { DEFAULT_ORCHESTRATOR_CONFIG } from './config';
import { DocumentPipeline } from './pipeline';
import { LLMRouter } from './router';
import { 
  ProcessingInput, 
  ProcessingOutput, 
  OrchestratorConfig,
  RoutingDecision
} from './types';

/**
 * Classe principal do Orquestrador de IA para Functions
 */
export class AIOrchestrator {
  private pipeline: DocumentPipeline;
  private router: LLMRouter;
  private config: OrchestratorConfig;

  constructor(customConfig?: Partial<OrchestratorConfig>) {
    this.config = { ...DEFAULT_ORCHESTRATOR_CONFIG, ...customConfig };
    this.pipeline = new DocumentPipeline(this.config);
    this.router = new LLMRouter(this.config.llmConfigs);
  }

  /**
   * Processa uma solicitação de geração de documento
   */
  async processDocument(input: ProcessingInput): Promise<ProcessingOutput> {
    const startTime = Date.now();
    
    try {
      // Valida entrada
      this.validateInput(input);

      // Log do início
      console.log(`[ORCHESTRATOR] Iniciando processamento:`, {
        taskType: input.taskType,
        documentType: input.documentType,
        contextItems: input.context.length,
        timestamp: new Date().toISOString()
      });

      // Executa pipeline
      const result = await this.pipeline.process(input);

      // Log do resultado
      console.log(`[ORCHESTRATOR] Processamento finalizado:`, {
        success: result.success,
        duration: Date.now() - startTime,
        confidence: result.metadata.confidence
      });

      return result;

    } catch (error) {
      console.error(`[ORCHESTRATOR] Erro:`, error);
      
      return {
        success: false,
        error: {
          code: 'ORCHESTRATOR_ERROR',
          message: error instanceof Error ? error.message : 'Erro desconhecido',
          retryable: true,
          timestamp: new Date()
        },
        metadata: {
          processingTime: Date.now() - startTime,
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
   * Testa roteamento para uma tarefa específica
   */
  async testRouting(input: ProcessingInput): Promise<RoutingDecision> {
    return this.router.selectLLM(input);
  }

  /**
   * Health check para Functions
   */
  getStatus() {
    return {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      llmCount: this.config.llmConfigs.length,
      version: '1.0.0'
    };
  }

  private validateInput(input: ProcessingInput): void {
    if (!input.taskType) {
      throw new Error('Tipo de tarefa é obrigatório');
    }

    if (!input.documentType) {
      throw new Error('Tipo de documento é obrigatório');
    }

    if (!input.instructions?.trim()) {
      throw new Error('Instruções são obrigatórias');
    }

    if (!input.context || input.context.length === 0) {
      throw new Error('Contexto é obrigatório');
    }

    const hasContent = input.context.some(item => 
      (item.type === 'ocr_text' || item.type === 'file_content') && 
      item.content?.trim()
    );

    if (!hasContent) {
      throw new Error('É necessário anexar documentos com conteúdo');
    }
  }
}

// Instância singleton para Functions
let orchestratorInstance: AIOrchestrator | null = null;

export function getOrchestrator(): AIOrchestrator {
  if (!orchestratorInstance) {
    orchestratorInstance = new AIOrchestrator();
  }
  return orchestratorInstance;
}

// Exportações
export * from './types';
export { DEFAULT_ORCHESTRATOR_CONFIG } from './config';