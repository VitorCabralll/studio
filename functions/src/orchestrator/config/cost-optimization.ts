/**
 * Configurações de otimização de custo
 * Garantia de economia máxima
 */

import type { DocumentType } from '../types';

/**
 * Limites de custo por tipo de documento (USD)
 */
export const COST_LIMITS: Record<DocumentType, number> = {
  petition: 0.15,     // ~R$ 0.75 (mais importante)
  contract: 0.12,     // ~R$ 0.60 
  legal_opinion: 0.10, // ~R$ 0.50
  notification: 0.05,  // ~R$ 0.25 (simples)
  brief: 0.03,        // ~R$ 0.15 (muito simples)
  motion: 0.08,       // ~R$ 0.40
  other: 0.05         // ~R$ 0.25
};

/**
 * Limites de tokens por estágio para controle de custo
 */
export const TOKEN_LIMITS = {
  summarization: {
    input: 8000,      // ~32k chars de documentos
    output: 800       // Resumo conciso
  },
  analysis: {
    input: 2000,      // Resumo + instruções
    output: 1000      // Análise estratégica
  },
  structure: {
    input: 1500,      // Análise + contexto
    output: 600       // Estrutura simples
  },
  generation: {
    input: 2000,      // Por seção
    output: 1200      // Conteúdo da seção
  },
  assembly: {
    input: 500,       // Metadados
    output: 200       // Só montagem
  }
};

/**
 * Configuração de modelos por orçamento
 */
export const BUDGET_CONFIG = {
  ultra_low: {
    maxCostPerDocument: 0.02,
    preferredModels: ['gemini-1.5-flash', 'gpt-3.5-turbo'],
    maxTokensPerStage: 500
  },
  low: {
    maxCostPerDocument: 0.05,
    preferredModels: ['gemini-1.5-flash', 'gpt-4o-mini'],
    maxTokensPerStage: 800
  },
  medium: {
    maxCostPerDocument: 0.10,
    preferredModels: ['gemini-1.5-flash', 'gpt-4o-mini', 'gpt-3.5-turbo'],
    maxTokensPerStage: 1200
  },
  high: {
    maxCostPerDocument: 0.20,
    preferredModels: ['gemini-1.5-pro', 'gpt-4o'],
    maxTokensPerStage: 2000
  }
};

/**
 * Estratégias de economia por complexidade
 */
export const ECONOMY_STRATEGIES = {
  low_complexity: {
    strategy: 'single_model',
    preferredModel: 'gemini-1.5-flash',
    skipStages: ['analysis'], // Pula análise complexa
    mergeStages: ['structure', 'generation'] // Faz tudo junto
  },
  medium_complexity: {
    strategy: 'minimal_pipeline',
    preferredModel: 'gemini-1.5-flash',
    skipStages: [],
    optimizePrompts: true
  },
  high_complexity: {
    strategy: 'selective_quality',
    preferredModel: 'gemini-1.5-flash',
    upgradeOnlyFor: ['generation'], // Só usa modelo melhor na geração
    skipStages: []
  }
};

/**
 * Monitor de custos em tempo real
 */
export class CostMonitor {
  private currentCost = 0;
  private maxBudget = 0;

  constructor(documentType: DocumentType) {
    this.maxBudget = COST_LIMITS[documentType];
  }

  addCost(cost: number): boolean {
    this.currentCost += cost;
    return this.currentCost <= this.maxBudget;
  }

  getRemainingBudget(): number {
    return Math.max(0, this.maxBudget - this.currentCost);
  }

  isOverBudget(): boolean {
    return this.currentCost > this.maxBudget;
  }

  getCurrentCost(): number {
    return this.currentCost;
  }

  getBudgetUtilization(): number {
    return (this.currentCost / this.maxBudget) * 100;
  }
}

/**
 * Otimizador de prompts para economia
 */
export function optimizePromptForCost(prompt: string, maxTokens: number): string {
  // Trunca prompt se muito longo
  const estimatedTokens = Math.ceil(prompt.length / 4);
  
  if (estimatedTokens > maxTokens) {
    const maxChars = maxTokens * 4;
    const truncated = prompt.substring(0, maxChars);
    const lastSpace = truncated.lastIndexOf(' ');
    return lastSpace > 0 ? 
      truncated.substring(0, lastSpace) + '\n\n[PROMPT OTIMIZADO PARA ECONOMIA]' :
      truncated + '\n\n[PROMPT OTIMIZADO PARA ECONOMIA]';
  }
  
  return prompt;
}

/**
 * Determina estratégia de economia baseada no tipo de documento
 */
export function getEconomyStrategy(documentType: DocumentType): keyof typeof ECONOMY_STRATEGIES {
  const complexityMap: Record<DocumentType, keyof typeof ECONOMY_STRATEGIES> = {
    brief: 'low_complexity',
    notification: 'low_complexity',
    other: 'low_complexity',
    motion: 'medium_complexity',
    contract: 'medium_complexity',
    petition: 'high_complexity',
    legal_opinion: 'high_complexity'
  };

  return complexityMap[documentType] || 'medium_complexity';
}