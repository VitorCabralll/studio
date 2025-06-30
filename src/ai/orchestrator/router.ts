/**
 * Roteador Multi-LLM para o Orquestrador de IA do LexAI
 * Decide qual LLM usar baseado em critérios de qualidade, custo e latência
 */

import { 
  LLMConfig, 
  RoutingDecision, 
  RoutingCriteria, 
  TaskType, 
  ProcessingInput 
} from './types';

export class LLMRouter {
  private availableLLMs: LLMConfig[] = [];

  constructor(llmConfigs: LLMConfig[]) {
    this.availableLLMs = llmConfigs;
  }

  /**
   * Seleciona o melhor LLM para uma tarefa específica
   */
  selectLLM(input: ProcessingInput, criteria?: RoutingCriteria): RoutingDecision {
    const effectiveCriteria = criteria || this.inferCriteria(input);
    
    // Filtra LLMs compatíveis com a tarefa
    const compatibleLLMs = this.filterCompatibleLLMs(input, effectiveCriteria);
    
    if (compatibleLLMs.length === 0) {
      throw new Error('Nenhum LLM compatível encontrado para esta tarefa');
    }

    // Calcula score para cada LLM
    const scoredLLMs = compatibleLLMs.map(llm => ({
      llm,
      score: this.calculateScore(llm, effectiveCriteria),
      estimatedCost: this.estimateCost(llm, input),
      estimatedLatency: this.estimateLatency(llm, input)
    }));

    // Ordena por score (maior é melhor)
    scoredLLMs.sort((a, b) => b.score - a.score);

    const selected = scoredLLMs[0];
    const alternatives = scoredLLMs.slice(1, 4).map(s => s.llm);

    return {
      selectedLLM: selected.llm,
      reasoning: this.generateReasoning(selected.llm, effectiveCriteria),
      confidence: this.calculateConfidence(selected.score, scoredLLMs),
      alternatives,
      estimatedCost: selected.estimatedCost,
      estimatedLatency: selected.estimatedLatency
    };
  }

  /**
   * Infere critérios de roteamento baseado no input
   */
  private inferCriteria(input: ProcessingInput): RoutingCriteria {
    const { taskType, documentType, legalArea } = input;

    // Determina complexidade baseada no tipo de tarefa
    let taskComplexity: 'low' | 'medium' | 'high' = 'medium';
    if (taskType === 'data_extraction' || taskType === 'document_summary') {
      taskComplexity = 'low';
    } else if (taskType === 'document_generation' || taskType === 'legal_analysis') {
      taskComplexity = 'high';
    }

    // Determina qualidade necessária
    let qualityRequirement: 'draft' | 'standard' | 'premium' = 'standard';
    if (documentType === 'petition' || documentType === 'legal_opinion') {
      qualityRequirement = 'premium';
    }

    // Determina latência baseada no tipo
    let latencyRequirement: 'fast' | 'balanced' | 'thorough' = 'balanced';
    if (taskType === 'data_extraction') {
      latencyRequirement = 'fast';
    } else if (taskType === 'document_generation') {
      latencyRequirement = 'thorough';
    }

    return {
      taskComplexity,
      qualityRequirement,
      latencyRequirement,
      costBudget: 'medium',
      specialization: taskType,
      legalArea
    };
  }

  /**
   * Filtra LLMs compatíveis com a tarefa
   */
  private filterCompatibleLLMs(input: ProcessingInput, criteria: RoutingCriteria): LLMConfig[] {
    return this.availableLLMs.filter(llm => {
      // Verifica se suporta a especialização
      if (criteria.specialization && 
          !llm.capabilities.specializations.includes(criteria.specialization)) {
        return false;
      }

      // Verifica idioma português
      if (!llm.capabilities.supportedLanguages.includes('pt-BR')) {
        return false;
      }

      // Verifica qualidade mínima
      const minQuality = this.getMinQualityThreshold(criteria.qualityRequirement);
      if (llm.capabilities.qualityRating < minQuality) {
        return false;
      }

      return true;
    });
  }

  /**
   * Calcula score para um LLM baseado nos critérios
   */
  private calculateScore(llm: LLMConfig, criteria: RoutingCriteria): number {
    let score = 0;

    // Score de qualidade (0-40 pontos)
    const qualityWeight = this.getQualityWeight(criteria.qualityRequirement);
    score += llm.capabilities.qualityRating * qualityWeight;

    // Score de performance/latência (0-20 pontos)
    const latencyWeight = this.getLatencyWeight(criteria.latencyRequirement);
    const latencyScore = Math.max(0, 20 - (llm.performance.averageLatency / 1000));
    score += latencyScore * latencyWeight;

    // Score de custo (0-20 pontos) - invertido (menor custo = maior score)
    const costWeight = this.getCostWeight(criteria.costBudget);
    const avgCost = (llm.costs.inputTokenPrice + llm.costs.outputTokenPrice) / 2;
    const costScore = Math.max(0, 20 - (avgCost * 1000));
    score += costScore * costWeight;

    // Score de confiabilidade (0-10 pontos)
    score += llm.performance.reliability * 10;

    // Score de especialização (0-10 pontos)
    if (criteria.specialization && 
        llm.capabilities.specializations.includes(criteria.specialization)) {
      score += 10;
    }

    return score;
  }

  /**
   * Estima custo da operação
   */
  private estimateCost(llm: LLMConfig, input: ProcessingInput): number {
    // Estima tokens baseado no contexto
    const estimatedInputTokens = this.estimateInputTokens(input);
    const estimatedOutputTokens = this.estimateOutputTokens(input.taskType);

    return (estimatedInputTokens * llm.costs.inputTokenPrice / 1000) +
           (estimatedOutputTokens * llm.costs.outputTokenPrice / 1000);
  }

  /**
   * Estima latência da operação
   */
  private estimateLatency(llm: LLMConfig, input: ProcessingInput): number {
    const estimatedTokens = this.estimateOutputTokens(input.taskType);
    const baseLatency = llm.performance.averageLatency;
    const processingTime = estimatedTokens / llm.performance.tokensPerSecond * 1000;
    
    return baseLatency + processingTime;
  }

  /**
   * Estima quantidade de tokens de entrada
   */
  private estimateInputTokens(input: ProcessingInput): number {
    let tokens = 0;
    
    // Tokens das instruções
    tokens += input.instructions.length / 4; // ~4 chars per token
    
    // Tokens do contexto
    input.context.forEach(item => {
      tokens += item.content.length / 4;
    });

    return Math.ceil(tokens);
  }

  /**
   * Estima quantidade de tokens de saída baseado no tipo de tarefa
   */
  private estimateOutputTokens(taskType: TaskType): number {
    const tokenEstimates = {
      document_generation: 2000,
      legal_analysis: 1500,
      contract_review: 1000,
      document_summary: 500,
      data_extraction: 200
    };

    return tokenEstimates[taskType] || 1000;
  }

  /**
   * Gera explicação da escolha do LLM
   */
  private generateReasoning(llm: LLMConfig, criteria: RoutingCriteria): string {
    const reasons: string[] = [];
    
    reasons.push(`Selecionado ${llm.provider}/${llm.model}`);
    
    if (criteria.qualityRequirement === 'premium') {
      reasons.push(`alta qualidade necessária (rating: ${llm.capabilities.qualityRating}/10)`);
    }
    
    if (criteria.specialization) {
      reasons.push(`especializado em ${criteria.specialization}`);
    }
    
    if (criteria.latencyRequirement === 'fast') {
      reasons.push(`baixa latência (${llm.performance.averageLatency}ms)`);
    }

    return reasons.join(', ');
  }

  /**
   * Calcula confiança na decisão
   */
  private calculateConfidence(topScore: number, allScores: Array<{score: number}>): number {
    if (allScores.length === 1) return 1.0;
    
    const secondScore = allScores[1]?.score || 0;
    const gap = topScore - secondScore;
    
    // Normaliza para 0-1
    return Math.min(1.0, gap / 50);
  }

  private getMinQualityThreshold(requirement: 'draft' | 'standard' | 'premium'): number {
    return { draft: 5, standard: 7, premium: 8 }[requirement];
  }

  private getQualityWeight(requirement: 'draft' | 'standard' | 'premium'): number {
    return { draft: 2, standard: 3, premium: 4 }[requirement];
  }

  private getLatencyWeight(requirement: 'fast' | 'balanced' | 'thorough'): number {
    return { fast: 2, balanced: 1, thorough: 0.5 }[requirement];
  }

  private getCostWeight(budget: 'low' | 'medium' | 'high'): number {
    return { low: 2, medium: 1, high: 0.5 }[budget];
  }
}