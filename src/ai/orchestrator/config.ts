/**
 * Configuração padrão do Orquestrador de IA
 * Define LLMs disponíveis, pipeline e configurações
 */

import {
  OrchestratorConfig,
  LLMConfig,
  PipelineStage,
  MonitoringConfig,
  SecurityConfig
} from './types';
import {
  SummarizationProcessor,
  ContextAnalysisProcessor,
  StructureDefinitionProcessor,
  ContentGenerationProcessor,
  AssemblyProcessor
} from './processors';

/**
 * Configurações dos LLMs disponíveis
 */
export const DEFAULT_LLM_CONFIGS: LLMConfig[] = [
  // Google Gemini - Bom custo-benefício
  {
    provider: 'google',
    model: 'gemini-1.5-pro',
    capabilities: {
      maxTokens: 2097152,
      supportedLanguages: ['pt-BR', 'en', 'es'],
      specializations: ['document_generation', 'legal_analysis', 'document_summary'],
      qualityRating: 8,
      contextWindow: 2097152,
      functionCalling: true,
      jsonMode: true
    },
    performance: {
      averageLatency: 2000,
      tokensPerSecond: 50,
      reliability: 0.95,
      lastUpdated: new Date('2024-01-01')
    },
    costs: {
      inputTokenPrice: 0.00125, // $1.25 per 1M tokens
      outputTokenPrice: 0.005,  // $5.00 per 1M tokens
      currency: 'USD'
    }
  },

  // Google Gemini Flash - Rápido e barato
  {
    provider: 'google',
    model: 'gemini-1.5-flash',
    capabilities: {
      maxTokens: 1048576,
      supportedLanguages: ['pt-BR', 'en', 'es'],
      specializations: ['data_extraction', 'document_summary'],
      qualityRating: 7,
      contextWindow: 1048576,
      functionCalling: true,
      jsonMode: true
    },
    performance: {
      averageLatency: 800,
      tokensPerSecond: 120,
      reliability: 0.97,
      lastUpdated: new Date('2024-01-01')
    },
    costs: {
      inputTokenPrice: 0.000075, // $0.075 per 1M tokens
      outputTokenPrice: 0.0003,  // $0.30 per 1M tokens
      currency: 'USD'
    }
  },

  // OpenAI GPT-4 - Alta qualidade
  {
    provider: 'openai',
    model: 'gpt-4-turbo',
    capabilities: {
      maxTokens: 128000,
      supportedLanguages: ['pt-BR', 'en', 'es', 'fr'],
      specializations: ['document_generation', 'legal_analysis', 'contract_review'],
      qualityRating: 9,
      contextWindow: 128000,
      functionCalling: true,
      jsonMode: true
    },
    performance: {
      averageLatency: 3000,
      tokensPerSecond: 30,
      reliability: 0.98,
      lastUpdated: new Date('2024-01-01')
    },
    costs: {
      inputTokenPrice: 0.01,  // $10 per 1M tokens
      outputTokenPrice: 0.03, // $30 per 1M tokens
      currency: 'USD'
    }
  },

  // Anthropic Claude - Excelente para análise jurídica
  {
    provider: 'anthropic',
    model: 'claude-3-sonnet',
    capabilities: {
      maxTokens: 200000,
      supportedLanguages: ['pt-BR', 'en'],
      specializations: ['legal_analysis', 'contract_review', 'document_generation'],
      qualityRating: 9,
      contextWindow: 200000,
      functionCalling: false,
      jsonMode: false
    },
    performance: {
      averageLatency: 2500,
      tokensPerSecond: 40,
      reliability: 0.97,
      lastUpdated: new Date('2024-01-01')
    },
    costs: {
      inputTokenPrice: 0.003,  // $3 per 1M tokens
      outputTokenPrice: 0.015, // $15 per 1M tokens
      currency: 'USD'
    }
  }
];

/**
 * Pipeline padrão de processamento
 */
export const DEFAULT_PIPELINE: PipelineStage[] = [
  {
    name: 'summarization',
    description: 'Sumarização dos documentos anexados',
    processor: new SummarizationProcessor(),
    timeout: 30000,
    retryConfig: {
      maxAttempts: 3,
      baseDelay: 1000,
      maxDelay: 5000,
      exponentialBackoff: true,
      retryableErrors: ['TIMEOUT', 'RATE_LIMIT', 'SERVER_ERROR']
    }
  },
  {
    name: 'context_analysis',
    description: 'Análise de instruções e contexto',
    processor: new ContextAnalysisProcessor(),
    dependencies: ['summarization'],
    timeout: 45000,
    retryConfig: {
      maxAttempts: 2,
      baseDelay: 2000,
      maxDelay: 10000,
      exponentialBackoff: true,
      retryableErrors: ['TIMEOUT', 'RATE_LIMIT']
    }
  },
  {
    name: 'structure_definition',
    description: 'Definição da estrutura do documento',
    processor: new StructureDefinitionProcessor(),
    dependencies: ['context_analysis'],
    timeout: 30000,
    retryConfig: {
      maxAttempts: 2,
      baseDelay: 1000,
      maxDelay: 5000,
      exponentialBackoff: false,
      retryableErrors: ['TIMEOUT']
    }
  },
  {
    name: 'content_generation',
    description: 'Geração de conteúdo por seção',
    processor: new ContentGenerationProcessor(),
    dependencies: ['structure_definition'],
    timeout: 120000, // Mais tempo para geração de conteúdo
    retryConfig: {
      maxAttempts: 2,
      baseDelay: 3000,
      maxDelay: 15000,
      exponentialBackoff: true,
      retryableErrors: ['TIMEOUT', 'RATE_LIMIT']
    }
  },
  {
    name: 'assembly',
    description: 'Montagem final do documento',
    processor: new AssemblyProcessor(),
    dependencies: ['content_generation'],
    timeout: 15000,
    retryConfig: {
      maxAttempts: 3,
      baseDelay: 500,
      maxDelay: 2000,
      exponentialBackoff: false,
      retryableErrors: ['TIMEOUT']
    }
  }
];

/**
 * Configuração de monitoramento
 */
export const DEFAULT_MONITORING: MonitoringConfig = {
  enableTracing: true,
  enableMetrics: true,
  logLevel: 'info',
  metricsEndpoint: process.env.METRICS_ENDPOINT
};

/**
 * Configuração de segurança
 */
export const DEFAULT_SECURITY: SecurityConfig = {
  enableAPIKeyRotation: true,
  encryptPrompts: true,
  auditLogging: true,
  dataRetentionDays: 30
};

/**
 * Configuração completa do orquestrador
 */
export const DEFAULT_ORCHESTRATOR_CONFIG: OrchestratorConfig = {
  llmConfigs: DEFAULT_LLM_CONFIGS,
  defaultRouting: {
    taskComplexity: 'medium',
    qualityRequirement: 'standard',
    latencyRequirement: 'balanced',
    costBudget: 'medium'
  },
  pipeline: DEFAULT_PIPELINE,
  monitoring: DEFAULT_MONITORING,
  security: DEFAULT_SECURITY
};

/**
 * Configurações específicas por tipo de documento
 */
export const DOCUMENT_TYPE_CONFIGS = {
  petition: {
    qualityRequirement: 'premium' as const,
    preferredLLMs: ['openai', 'anthropic'],
    estimatedTokens: 3000
  },
  contract: {
    qualityRequirement: 'premium' as const,
    preferredLLMs: ['anthropic', 'openai'],
    estimatedTokens: 2500
  },
  legal_opinion: {
    qualityRequirement: 'premium' as const,
    preferredLLMs: ['anthropic', 'openai'],
    estimatedTokens: 2000
  },
  notification: {
    qualityRequirement: 'standard' as const,
    preferredLLMs: ['google'],
    estimatedTokens: 1000
  },
  brief: {
    qualityRequirement: 'standard' as const,
    preferredLLMs: ['google', 'openai'],
    estimatedTokens: 1500
  },
  motion: {
    qualityRequirement: 'standard' as const,
    preferredLLMs: ['google', 'openai'],
    estimatedTokens: 1200
  }
};

/**
 * Configurações específicas por área jurídica
 */
export const LEGAL_AREA_CONFIGS = {
  civil: {
    specializedLLMs: ['anthropic', 'openai'],
    complexityMultiplier: 1.2
  },
  criminal: {
    specializedLLMs: ['anthropic'],
    complexityMultiplier: 1.5
  },
  labor: {
    specializedLLMs: ['google', 'openai'],
    complexityMultiplier: 1.1
  },
  corporate: {
    specializedLLMs: ['anthropic', 'openai'],
    complexityMultiplier: 1.3
  },
  tax: {
    specializedLLMs: ['openai'],
    complexityMultiplier: 1.4
  },
  constitutional: {
    specializedLLMs: ['anthropic'],
    complexityMultiplier: 1.6
  },
  administrative: {
    specializedLLMs: ['google', 'openai'],
    complexityMultiplier: 1.2
  }
};