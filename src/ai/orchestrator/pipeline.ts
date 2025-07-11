/**
 * Pipeline de Processamento do Orquestrador de IA do LexAI
 * Executa as etapas sequenciais de geração de documentos
 */

import { LLMRouter } from './router';
import {
  ProcessingInput,
  ProcessingOutput,
  PipelineStage,
  PipelineContext,
  PipelineTrace,
  StageTrace,
  ProcessingError,
  LLMProvider,
  LLMClientInterface,
  OrchestratorConfig,
  GeneratedDocument,
  LLMConfig,
  Citation
} from './types';

export class DocumentPipeline {
  private config: OrchestratorConfig;
  private router: LLMRouter;

  constructor(config: OrchestratorConfig) {
    this.config = config;
    this.router = new LLMRouter(config.llmConfigs);
  }

  /**
   * Executa o pipeline completo de geração de documento
   */
  async process(input: ProcessingInput): Promise<ProcessingOutput> {
    const trace: PipelineTrace = {
      stages: [],
      totalDuration: 0,
      totalCost: 0,
      totalTokens: 0,
      errors: []
    };

    const context: PipelineContext = {
      stage: '',
      input,
      intermediateResults: {},
      llmClients: {} as Record<LLMProvider, LLMClientInterface>, // Seria populado com clientes reais
      config: this.config,
      trace
    };

    const startTime = Date.now();

    try {
      // Executa cada estágio do pipeline
      for (const stage of this.config.pipeline) {
        await this.executeStage(stage, context);
      }

      // Monta resultado final
      const document = this.assembleDocument(context);
      
      trace.totalDuration = Date.now() - startTime;

      return {
        success: true,
        result: document,
        metadata: {
          processingTime: trace.totalDuration,
          llmUsed: trace.stages.map(s => s.llmUsed).filter(Boolean) as LLMConfig[],
          totalCost: trace.totalCost,
          tokensUsed: {
            promptTokens: trace.stages.reduce((acc, s) => acc + (s.tokensUsed?.promptTokens || 0), 0),
            completionTokens: trace.stages.reduce((acc, s) => acc + (s.tokensUsed?.completionTokens || 0), 0),
            totalTokens: trace.totalTokens,
            cost: trace.totalCost
          },
          confidence: this.calculateOverallConfidence(trace)
        },
        pipeline: trace
      };

    } catch (error) {
      trace.totalDuration = Date.now() - startTime;
      
      // Log estruturado para debugging (apenas em desenvolvimento)
      if (process.env.NODE_ENV === 'development') {
        console.error('[Pipeline Error]', {
          stage: context.stage,
          duration: trace.totalDuration,
          errorType: error instanceof Error ? error.constructor.name : typeof error,
          message: error instanceof Error ? error.message : 'Unknown error'
        });
      }
      
      // NÃO RETORNAR METADATA FAKE - Falha é falha, sem dados cosméticos
      throw new Error(`Pipeline falhou no estágio '${context.stage}': ${error instanceof Error ? error.message : 'Erro técnico desconhecido'}`);
    }
  }

  /**
   * Executa um estágio específico do pipeline
   */
  private async executeStage(stage: PipelineStage, context: PipelineContext): Promise<void> {
    const stageTrace: StageTrace = {
      stageName: stage.name,
      startTime: new Date(),
      input: context.input
    };

    context.stage = stage.name;
    context.trace.stages.push(stageTrace);

    try {
      // Valida entrada se necessário
      if (stage.processor.validate && !stage.processor.validate(context.input)) {
        throw new Error(`Validação falhou para o estágio ${stage.name}`);
      }

      // Executa o processador
      const result = await this.executeWithTimeout(
        () => stage.processor.process(context.input, context),
        stage.timeout || 30000
      );

      // Transforma saída se necessário
      const transformedResult = stage.processor.transform 
        ? stage.processor.transform(result) 
        : result;

      // Armazena resultado
      context.intermediateResults[stage.name] = transformedResult;

      // Completa trace do estágio
      stageTrace.endTime = new Date();
      stageTrace.duration = stageTrace.endTime.getTime() - stageTrace.startTime.getTime();
      stageTrace.output = transformedResult;

      // Atualiza totais
      context.trace.totalDuration += stageTrace.duration;

    } catch (error) {
      const processingError: ProcessingError = {
        code: 'STAGE_ERROR',
        message: error instanceof Error ? error.message : 'Erro no estágio',
        stage: stage.name,
        retryable: true,
        timestamp: new Date(),
        details: { stage: stage.name }
      };

      stageTrace.error = processingError;
      stageTrace.endTime = new Date();
      stageTrace.duration = stageTrace.endTime.getTime() - stageTrace.startTime.getTime();

      context.trace.errors.push(processingError);

      // Tenta retry se configurado
      if (stage.retryConfig && stage.retryConfig.maxAttempts > 1) {
        await this.retryStage(stage, context);
      } else {
        throw error;
      }
    }
  }

  /**
   * Executa função com timeout
   */
  private async executeWithTimeout<T>(
    fn: () => Promise<T>, 
    timeoutMs: number
  ): Promise<T> {
    return Promise.race([
      fn(),
      new Promise<never>((_, reject) => 
        setTimeout(() => reject(new Error('Timeout')), timeoutMs)
      )
    ]);
  }

  /**
   * Implementa lógica de retry para estágios
   */
  private async retryStage(
    stage: PipelineStage, 
    context: PipelineContext
  ): Promise<void> {
    const retryConfig = stage.retryConfig!;
    let attempt = 1;

    while (attempt < retryConfig.maxAttempts) {
      try {
        // Calcula delay exponencial
        const delay = Math.min(
          retryConfig.baseDelay * (retryConfig.exponentialBackoff ? Math.pow(2, attempt - 1) : 1),
          retryConfig.maxDelay
        );

        await new Promise(resolve => setTimeout(resolve, delay));

        // Tenta executar novamente
        const result = await this.executeWithTimeout(
          () => stage.processor.process(context.input, context),
          stage.timeout || 30000
        );

        // Se chegou aqui, sucesso
        context.intermediateResults[stage.name] = stage.processor.transform 
          ? stage.processor.transform(result) 
          : result;

        return;

      } catch (error) {
        attempt++;
        if (attempt >= retryConfig.maxAttempts) {
          throw error;
        }
      }
    }
  }

  /**
   * Monta documento final a partir dos resultados intermediários
   */
  private assembleDocument(context: PipelineContext): GeneratedDocument {
    const { intermediateResults, input } = context;

    // Extrai conteúdo dos estágios
    const summary = intermediateResults['summarization'] || '';
    const structure = intermediateResults['structure_definition'] || {};
    const sections = intermediateResults['content_generation'] || {};
    const finalContent = intermediateResults['assembly'] as string || '';

    return {
      content: finalContent || this.fallbackAssembly(sections),
      documentType: input.documentType,
      confidence: this.calculateDocumentConfidence(intermediateResults),
      suggestions: this.generateSuggestions(intermediateResults),
      citations: this.extractCitations(intermediateResults),
      structuredData: {
        summary: summary as string || '',
        structure: JSON.stringify(structure) || '',
        sections: JSON.stringify(sections) || '',
        generatedAt: new Date().toISOString(),
        taskType: input.taskType,
        legalArea: input.legalArea || ''
      }
    };
  }

  /**
   * Montagem de fallback se o estágio de assembly falhar
   */
  private fallbackAssembly(sections: unknown): string {
    if (typeof sections === 'string') return sections;
    
    if (typeof sections === 'object' && sections !== null) {
      return Object.values(sections).join('\n\n');
    }

    return 'Documento gerado com sucesso, mas houve erro na montagem final.';
  }

  /**
   * Calcula confiança geral do documento
   */
  private calculateDocumentConfidence(results: Record<string, unknown>): number {
    // Lógica simplificada - poderia ser mais sofisticada
    const stages = Object.keys(results);
    const successRate = stages.length / this.config.pipeline.length;
    
    return Math.min(0.9, successRate * 0.8 + 0.1);
  }

  /**
   * Calcula confiança geral do pipeline
   */
  private calculateOverallConfidence(trace: PipelineTrace): number {
    const successfulStages = trace.stages.filter(s => !s.error).length;
    const totalStages = trace.stages.length;
    
    return totalStages > 0 ? successfulStages / totalStages : 0;
  }

  /**
   * Gera sugestões baseadas nos resultados
   */
  private generateSuggestions(results: Record<string, unknown>): string[] {
    const suggestions: string[] = [];

    // Sugestões baseadas na qualidade do conteúdo
    if (results['quality_check']) {
      suggestions.push('Revisar fundamentação jurídica');
    }

    if (results['citation_analysis']) {
      suggestions.push('Verificar citações e referências');
    }

    suggestions.push('Revisar formatação e estrutura do documento');
    
    return suggestions;
  }

  /**
   * Extrai citações dos resultados
   */
  private extractCitations(results: Record<string, unknown>): Citation[] {
    const citations = results['citations'] || [];
    
    return Array.isArray(citations) ? citations : [];
  }


  /**
   * Gera mensagem de erro amigável para o usuário
   */
  private getUserFriendlyErrorMessage(error: unknown, stage?: string): string {
    if (error instanceof Error) {
      // Erros de API específicos
      if (error.message.includes('API key')) {
        return 'Erro de configuração da API de IA. Verifique as configurações do sistema.';
      }
      if (error.message.includes('rate limit') || error.message.includes('quota')) {
        return 'Limite de uso da API atingido. Tente novamente em alguns minutos.';
      }
      if (error.message.includes('timeout') || error.message.includes('Timeout')) {
        return 'Tempo limite excedido. O processamento está demorando mais que o esperado.';
      }
      if (error.message.includes('network') || error.message.includes('fetch')) {
        return 'Erro de conexão com os serviços de IA. Verifique sua conexão com a internet.';
      }
    }

    // Mensagens por estágio
    const stageMessages: Record<string, string> = {
      'summarization': 'Falha na análise dos documentos anexados.',
      'context_analysis': 'Falha na análise do contexto e instruções.',
      'structure_definition': 'Falha na definição da estrutura do documento.',
      'content_generation': 'Falha na geração do conteúdo do documento.',
      'assembly': 'Falha na montagem final do documento.'
    };

    const stageMessage = stage ? stageMessages[stage] : null;
    return stageMessage || 'Erro no processamento do documento. Tente novamente ou entre em contato com o suporte.';
  }

  /**
   * Determina se um erro permite nova tentativa
   */
  private isRetryableError(error: unknown): boolean {
    if (error instanceof Error) {
      const retryablePatterns = [
        'timeout', 'rate limit', 'quota', 'network', 'fetch', 
        'temporarily unavailable', '429', '503', '502'
      ];
      
      return retryablePatterns.some(pattern => 
        error.message.toLowerCase().includes(pattern)
      );
    }
    
    return false;
  }
}