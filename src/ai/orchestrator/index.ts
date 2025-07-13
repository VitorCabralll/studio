/**
 * Orquestrador Principal de IA do LexAI
 * Ponto de entrada para geração de documentos jurídicos
 */

import { createDefaultOrchestratorConfig } from './config';
import { DocumentPipeline } from './pipeline';
import { LLMRouter } from './router';
import { 
  ProcessingInput, 
  ProcessingOutput, 
  OrchestratorConfig,
  RoutingDecision,
  LLMConfig
} from './types';

/**
 * Classe principal do Orquestrador de IA
 */
export class AIOrchestrator {
  private pipeline: DocumentPipeline;
  private router: LLMRouter;
  private config: OrchestratorConfig;

  constructor(config: OrchestratorConfig) {
    this.config = config;
    this.pipeline = new DocumentPipeline(this.config);
    this.router = new LLMRouter(this.config.llmConfigs);
  }

  /**
   * Factory method to create orchestrator with default config
   */
  static async create(config?: Partial<OrchestratorConfig>): Promise<AIOrchestrator> {
    const defaultConfig = await createDefaultOrchestratorConfig();
    const mergedConfig = { ...defaultConfig, ...config };
    return new AIOrchestrator(mergedConfig);
  }

  /**
   * Processa uma solicitação de geração de documento
   */
  async processDocument(input: ProcessingInput): Promise<ProcessingOutput> {
    try {
      // Valida entrada
      this.validateInput(input);

      // Log do início do processamento
      this.logProcessingStart(input);

      // Executa pipeline completo
      const result = await this.pipeline.process(input);

      // Log do resultado
      this.logProcessingResult(result);

      return result;

    } catch (error) {
      const errorResult: ProcessingOutput = {
        success: false,
        error: {
          code: 'ORCHESTRATOR_ERROR',
          message: error instanceof Error ? error.message : 'Erro desconhecido',
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
            totalTokens: 0
          },
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

      this.logError(error, input);
      return errorResult;
    }
  }

  /**
   * Testa roteamento para uma tarefa específica
   */
  async testRouting(input: ProcessingInput): Promise<RoutingDecision> {
    return this.router.selectLLM(input);
  }

  /**
   * Retorna configuração atual
   */
  getConfig(): OrchestratorConfig {
    return { ...this.config };
  }

  /**
   * Atualiza configuração
   */
  updateConfig(newConfig: Partial<OrchestratorConfig>): void {
    this.config = { ...this.config, ...newConfig };
    this.pipeline = new DocumentPipeline(this.config);
    this.router = new LLMRouter(this.config.llmConfigs);
  }

  /**
   * Adiciona novo LLM à configuração
   */
  addLLM(llmConfig: LLMConfig): void {
    this.config.llmConfigs.push(llmConfig);
    this.router = new LLMRouter(this.config.llmConfigs);
  }

  /**
   * Remove LLM da configuração
   */
  removeLLM(provider: string, model: string): void {
    this.config.llmConfigs = this.config.llmConfigs.filter(
      llm => !(llm.provider === provider && llm.model === model)
    );
    this.router = new LLMRouter(this.config.llmConfigs);
  }

  /**
   * Lista LLMs disponíveis
   */
  getAvailableLLMs(): LLMConfig[] {
    return [...this.config.llmConfigs];
  }

  /**
   * Valida entrada do processamento
   */
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
      throw new Error('Contexto (documentos anexados) é obrigatório');
    }

    // Valida se há conteúdo OCR ou de arquivo
    const hasContent = input.context.some(item => 
      (item.type === 'ocr_text' || item.type === 'file_content') && 
      item.content?.trim()
    );

    if (!hasContent) {
      throw new Error('É necessário anexar documentos com conteúdo para processamento');
    }
  }

  /**
   * Log do início do processamento
   */
  private logProcessingStart(input: ProcessingInput): void {
    if (this.config.monitoring.enableTracing) {
      console.log(`[ORCHESTRATOR] Iniciando processamento:`, {
        taskType: input.taskType,
        documentType: input.documentType,
        legalArea: input.legalArea,
        contextItems: input.context.length,
        timestamp: new Date().toISOString()
      });
    }
  }

  /**
   * Log do resultado do processamento
   */
  private logProcessingResult(result: ProcessingOutput): void {
    if (this.config.monitoring.enableTracing) {
      console.log(`[ORCHESTRATOR] Processamento finalizado:`, {
        success: result.success,
        duration: result.metadata.processingTime,
        cost: result.metadata.totalCost,
        tokens: result.metadata.tokensUsed.totalTokens,
        confidence: result.metadata.confidence,
        stages: result.pipeline.stages.length,
        timestamp: new Date().toISOString()
      });
    }
  }

  /**
   * Log de erro
   */
  private logError(error: unknown, input: ProcessingInput): void {
    console.error(`[ORCHESTRATOR] Erro no processamento:`, {
      error: error instanceof Error ? error.message : 'Erro desconhecido',
      stack: error instanceof Error ? error.stack : undefined,
      input: {
        taskType: input.taskType,
        documentType: input.documentType,
        legalArea: input.legalArea
      },
      timestamp: new Date().toISOString()
    });
  }
}

// Exportações principais
export * from './types';
export * from './config';
export { LLMRouter } from './router';
export { DocumentPipeline } from './pipeline';

// Lazy singleton for default orchestrator
let defaultOrchestratorInstance: AIOrchestrator | null = null;

/**
 * Obtém instância padrão do orquestrador (singleton lazy)
 */
export async function getDefaultOrchestrator(): Promise<AIOrchestrator> {
  if (!defaultOrchestratorInstance) {
    defaultOrchestratorInstance = await AIOrchestrator.create();
  }
  return defaultOrchestratorInstance;
}

/**
 * Função utilitária para processamento direto
 */
export async function generateDocument(input: ProcessingInput): Promise<ProcessingOutput> {
  const orchestrator = await getDefaultOrchestrator();
  return orchestrator.processDocument(input);
}

/**
 * Função utilitária para teste de roteamento
 */
export async function testLLMRouting(input: ProcessingInput): Promise<RoutingDecision> {
  const orchestrator = await getDefaultOrchestrator();
  return orchestrator.testRouting(input);
}