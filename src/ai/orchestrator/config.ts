/**
 * Configuração padrão do Orquestrador de IA
 * Define LLMs disponíveis, pipeline e configurações
 */

import {
  SummarizationProcessor,
  ContextAnalysisProcessor,
  StructureDefinitionProcessor,
  ContentGenerationProcessor,
  AssemblyProcessor
} from './processors';
import {
  OrchestratorConfig,
  LLMConfig,
  PipelineStage,
  MonitoringConfig,
  SecurityConfig
} from './types';

/**
 * Configurações dos LLMs disponíveis - APENAS GOOGLE AI
 */
export const DEFAULT_LLM_CONFIGS: LLMConfig[] = [
  // Google Gemini Pro - Para tarefas complexas de alta qualidade
  {
    provider: 'google',
    model: 'gemini-1.5-pro',
    capabilities: {
      maxTokens: 2097152,
      supportedLanguages: ['pt-BR', 'en', 'es'],
      specializations: ['document_generation', 'legal_analysis', 'document_summary', 'contract_review', 'data_extraction'],
      qualityRating: 9, // Aumentado para ser o principal
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

  // Google Gemini Flash - Para tarefas rápidas e simples
  {
    provider: 'google',
    model: 'gemini-1.5-flash',
    capabilities: {
      maxTokens: 1048576,
      supportedLanguages: ['pt-BR', 'en', 'es'],
      specializations: ['data_extraction', 'document_summary', 'legal_analysis'],
      qualityRating: 8, // Boa qualidade
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
 * Configurações específicas por tipo de documento - OTIMIZADO PARA GOOGLE AI
 */
export const DOCUMENT_TYPE_CONFIGS = {
  petition: {
    qualityRequirement: 'premium' as const,
    preferredLLMs: ['google'], // Gemini Pro para petições
    preferredModel: 'gemini-1.5-pro',
    estimatedTokens: 3000
  },
  contract: {
    qualityRequirement: 'premium' as const,
    preferredLLMs: ['google'], // Gemini Pro para contratos
    preferredModel: 'gemini-1.5-pro',
    estimatedTokens: 2500
  },
  legal_opinion: {
    qualityRequirement: 'premium' as const,
    preferredLLMs: ['google'], // Gemini Pro para pareceres
    preferredModel: 'gemini-1.5-pro',
    estimatedTokens: 2000
  },
  notification: {
    qualityRequirement: 'standard' as const,
    preferredLLMs: ['google'], // Gemini Flash para notificações
    preferredModel: 'gemini-1.5-flash',
    estimatedTokens: 1000
  },
  brief: {
    qualityRequirement: 'standard' as const,
    preferredLLMs: ['google'], // Gemini Flash para resumos
    preferredModel: 'gemini-1.5-flash',
    estimatedTokens: 1500
  },
  motion: {
    qualityRequirement: 'standard' as const,
    preferredLLMs: ['google'], // Gemini Flash para requerimentos
    preferredModel: 'gemini-1.5-flash',
    estimatedTokens: 1200
  }
};

/**
 * Configurações específicas por área jurídica - APENAS GOOGLE AI
 */
export const LEGAL_AREA_CONFIGS = {
  civil: {
    specializedLLMs: ['google'],
    preferredModel: 'gemini-1.5-pro', // Complexidade alta
    complexityMultiplier: 1.2
  },
  criminal: {
    specializedLLMs: ['google'],
    preferredModel: 'gemini-1.5-pro', // Máxima precisão
    complexityMultiplier: 1.5
  },
  labor: {
    specializedLLMs: ['google'],
    preferredModel: 'gemini-1.5-flash', // Boa para trabalhista
    complexityMultiplier: 1.1
  },
  corporate: {
    specializedLLMs: ['google'],
    preferredModel: 'gemini-1.5-pro', // Complexidade alta
    complexityMultiplier: 1.3
  },
  tax: {
    specializedLLMs: ['google'],
    preferredModel: 'gemini-1.5-pro', // Precisão tributária
    complexityMultiplier: 1.4
  },
  constitutional: {
    specializedLLMs: ['google'],
    preferredModel: 'gemini-1.5-pro', // Máxima qualidade
    complexityMultiplier: 1.6
  },
  administrative: {
    specializedLLMs: ['google'],
    preferredModel: 'gemini-1.5-flash', // Eficiência para admin
    complexityMultiplier: 1.2
  }
};