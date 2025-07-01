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
 * Configuração do sistema de fallback transparente
 * Para garantir resiliência em produção
 */
export const DEMO_FALLBACK_CONFIG = {
  ENABLE_FALLBACK: process.env.NEXT_PUBLIC_DEMO_MODE === 'true',
  FALLBACK_DOCUMENTS: {
    'petition': `PETIÇÃO INICIAL

Excelentíssimo Senhor Doutor Juiz de Direito da Vara Cível da Comarca de Cuiabá/MT

[CABEÇALHO PROCESSUAL]

Processo: [Processo em análise via IA]
Requerente: [Parte identificada automaticamente]
Requerido: [Parte identificada automaticamente]

[FUNDAMENTAÇÃO LEGAL]

O presente documento foi estruturado com base na análise automatizada dos documentos fornecidos, utilizando inteligência artificial especializada em direito brasileiro.

DOS FATOS:

Com base na documentação analisada, verifica-se que [fatos extraídos dos documentos anexados pelo usuário seriam inseridos aqui pela IA em operação normal].

DO DIREITO:

A fundamentação legal aplicável ao caso em questão encontra respaldo nos dispositivos legais pertinentes à matéria, conforme análise automatizada dos precedentes e doutrina aplicável.

DOS PEDIDOS:

Ante o exposto, requer-se:

a) [Pedidos específicos baseados na análise do caso]
b) A procedência total dos pedidos
c) A condenação da parte requerida ao pagamento das custas processuais

Protesta-se pela juntada de documentos e demais provas em direito admitidas.

Requer deferimento.

Cuiabá/MT, ${new Date().toLocaleDateString('pt-BR')}.

[Assinatura Digital]
Dr. [Nome do Advogado]
OAB/MT [Número]

---
DOCUMENTO GERADO EM MODO FALLBACK
Sistema: LexAI v.Beta | Data: ${new Date().toISOString()}
Motivo: API temporariamente indisponível`,

    'contract': `CONTRATO DE PRESTAÇÃO DE SERVIÇOS

Pelo presente instrumento particular de contrato de prestação de serviços, as partes:

CONTRATANTE: [Identificado automaticamente nos documentos]
CONTRATADO: [Identificado automaticamente nos documentos]

CLÁUSULA PRIMEIRA - DO OBJETO
O presente contrato tem por objeto [objeto extraído da análise dos documentos].

CLÁUSULA SEGUNDA - DAS OBRIGAÇÕES
[Obrigações definidas com base na análise automatizada]

CLÁUSULA TERCEIRA - DO VALOR E FORMA DE PAGAMENTO
[Valores e condições identificados nos documentos]

CLÁUSULA QUARTA - DO PRAZO
[Prazos estabelecidos conforme documentação analisada]

CLÁUSULA QUINTA - DA RESCISÃO
[Condições de rescisão padrão]

CLÁUSULA SEXTA - DO FORO
Fica eleito o foro da Comarca de Cuiabá/MT para dirimir questões oriundas deste contrato.

E por estarem assim justas e contratadas, as partes assinam o presente em duas vias de igual teor.

Cuiabá/MT, ${new Date().toLocaleDateString('pt-BR')}.

________________________    ________________________
    CONTRATANTE              CONTRATADO

---
DOCUMENTO GERADO EM MODO FALLBACK
Sistema: LexAI v.Beta | Data: ${new Date().toISOString()}
Motivo: API temporariamente indisponível`,

    'brief': `RESUMO EXECUTIVO - ANÁLISE JURÍDICA

DOCUMENTO: Análise automática de documentos jurídicos
DATA: ${new Date().toLocaleDateString('pt-BR')}
SISTEMA: LexAI Beta

SUMÁRIO EXECUTIVO:
O presente resumo foi gerado automaticamente com base nos documentos fornecidos, utilizando inteligência artificial especializada em análise jurídica.

PONTOS PRINCIPAIS IDENTIFICADOS:
• [Pontos principais seriam extraídos dos documentos em operação normal]
• [Questões legais relevantes identificadas pela IA]
• [Recomendações baseadas na análise automatizada]

ANÁLISE LEGAL:
[Análise detalhada seria inserida aqui com base no processamento dos documentos]

RECOMENDAÇÕES:
[Recomendações específicas baseadas no caso]

PRÓXIMOS PASSOS SUGERIDOS:
[Passos recomendados pela análise da IA]

---
NOTA: Este documento foi gerado em modo fallback
Motivo: Serviços de IA temporariamente indisponíveis
Sistema: LexAI | Cuiabá/MT | ${new Date().toISOString()}`
  }
};

/**
 * Configurações dos LLMs disponíveis - GOOGLE AI + OPENAI
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
  },

  // OpenAI GPT-4.1-nano - Backup para Google AI (via Apoia)
  {
    provider: 'openai',
    model: 'gpt-4.1-nano',
    capabilities: {
      maxTokens: 8192,
      supportedLanguages: ['pt-BR', 'en', 'es'],
      specializations: ['document_generation', 'legal_analysis', 'document_summary', 'contract_review'],
      qualityRating: 9,
      contextWindow: 8192,
      functionCalling: true,
      jsonMode: true
    },
    performance: {
      averageLatency: 3000,
      tokensPerSecond: 40,
      reliability: 0.95,
      lastUpdated: new Date('2024-01-01')
    },
    costs: {
      inputTokenPrice: 0.03,   // $30 per 1M tokens
      outputTokenPrice: 0.06,  // $60 per 1M tokens  
      currency: 'USD'
    }
  },

  // OpenAI GPT-3.5 Turbo - Para tarefas mais simples
  {
    provider: 'openai', 
    model: 'gpt-3.5-turbo',
    capabilities: {
      maxTokens: 4096,
      supportedLanguages: ['pt-BR', 'en', 'es'],
      specializations: ['document_summary', 'data_extraction'],
      qualityRating: 7,
      contextWindow: 16384,
      functionCalling: true,
      jsonMode: true
    },
    performance: {
      averageLatency: 1500,
      tokensPerSecond: 80,
      reliability: 0.97,
      lastUpdated: new Date('2024-01-01')
    },
    costs: {
      inputTokenPrice: 0.0015,  // $1.5 per 1M tokens
      outputTokenPrice: 0.002,  // $2 per 1M tokens
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
 * Configurações específicas por tipo de documento - GOOGLE AI + OPENAI FALLBACK
 */
export const DOCUMENT_TYPE_CONFIGS = {
  petition: {
    qualityRequirement: 'premium' as const,
    preferredLLMs: ['google', 'openai'], // Gemini Pro, fallback GPT-4
    preferredModel: 'gemini-1.5-pro',
    fallbackModel: 'gpt-4.1-nano',
    estimatedTokens: 3000
  },
  contract: {
    qualityRequirement: 'premium' as const,
    preferredLLMs: ['google', 'openai'], // Gemini Pro, fallback GPT-4
    preferredModel: 'gemini-1.5-pro',
    fallbackModel: 'gpt-4.1-nano',
    estimatedTokens: 2500
  },
  legal_opinion: {
    qualityRequirement: 'premium' as const,
    preferredLLMs: ['google', 'openai'], // Gemini Pro, fallback GPT-4
    preferredModel: 'gemini-1.5-pro',
    fallbackModel: 'gpt-4.1-nano',
    estimatedTokens: 2000
  },
  notification: {
    qualityRequirement: 'standard' as const,
    preferredLLMs: ['google', 'openai'], // Gemini Flash, fallback GPT-3.5
    preferredModel: 'gemini-1.5-flash',
    fallbackModel: 'gpt-3.5-turbo',
    estimatedTokens: 1000
  },
  brief: {
    qualityRequirement: 'standard' as const,
    preferredLLMs: ['google', 'openai'], // Gemini Flash, fallback GPT-3.5
    preferredModel: 'gemini-1.5-flash',
    fallbackModel: 'gpt-3.5-turbo',
    estimatedTokens: 1500
  },
  motion: {
    qualityRequirement: 'standard' as const,
    preferredLLMs: ['google', 'openai'], // Gemini Flash, fallback GPT-3.5
    preferredModel: 'gemini-1.5-flash',
    fallbackModel: 'gpt-3.5-turbo',
    estimatedTokens: 1200
  }
};

/**
 * Configurações específicas por área jurídica - GOOGLE AI + OPENAI FALLBACK
 */
export const LEGAL_AREA_CONFIGS = {
  civil: {
    specializedLLMs: ['google', 'openai'],
    preferredModel: 'gemini-1.5-pro', // Complexidade alta
    fallbackModel: 'gpt-4.1-nano',
    complexityMultiplier: 1.2
  },
  criminal: {
    specializedLLMs: ['google', 'openai'],
    preferredModel: 'gemini-1.5-pro', // Máxima precisão
    fallbackModel: 'gpt-4.1-nano',
    complexityMultiplier: 1.5
  },
  labor: {
    specializedLLMs: ['google', 'openai'],
    preferredModel: 'gemini-1.5-flash', // Boa para trabalhista
    fallbackModel: 'gpt-3.5-turbo',
    complexityMultiplier: 1.1
  },
  corporate: {
    specializedLLMs: ['google', 'openai'],
    preferredModel: 'gemini-1.5-pro', // Complexidade alta
    fallbackModel: 'gpt-4.1-nano',
    complexityMultiplier: 1.3
  },
  tax: {
    specializedLLMs: ['google', 'openai'],
    preferredModel: 'gemini-1.5-pro', // Precisão tributária
    fallbackModel: 'gpt-4.1-nano',
    complexityMultiplier: 1.4
  },
  constitutional: {
    specializedLLMs: ['google', 'openai'],
    preferredModel: 'gemini-1.5-pro', // Máxima qualidade
    fallbackModel: 'gpt-4.1-nano',
    complexityMultiplier: 1.6
  },
  administrative: {
    specializedLLMs: ['google', 'openai'],
    preferredModel: 'gemini-1.5-flash', // Eficiência para admin
    fallbackModel: 'gpt-3.5-turbo',
    complexityMultiplier: 1.2
  }
};