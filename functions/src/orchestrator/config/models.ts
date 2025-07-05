/**
 * Configuração centralizada de modelos
 */

import type { LLMProvider, DocumentType, LegalArea } from '../types';

export interface ModelConfig {
  provider: LLMProvider;
  model: string;
  priority: number;
  capabilities: string[];
  costEfficiency: number; // 1-10 (higher = more cost efficient)
  qualityRating: number;  // 1-10 (higher = better quality)
  speedRating: number;    // 1-10 (higher = faster)
}

export const MODEL_CONFIGS: ModelConfig[] = [
  // Google AI Flash - PRIMEIRA ESCOLHA (mais barato)
  {
    provider: 'google',
    model: 'gemini-1.5-flash',
    priority: 1,
    capabilities: ['summarization', 'extraction', 'analysis', 'document_generation', 'simple_tasks'],
    costEfficiency: 10,
    qualityRating: 8,
    speedRating: 9
  },
  
  // OpenAI Mini - SEGUNDA ESCOLHA (barato)
  {
    provider: 'openai',
    model: 'gpt-4o-mini',
    priority: 2,
    capabilities: ['summarization', 'extraction', 'analysis', 'document_generation', 'simple_tasks'],
    costEfficiency: 9,
    qualityRating: 8,
    speedRating: 9
  },
  
  // GPT-3.5 Turbo - TERCEIRA ESCOLHA (muito barato)
  {
    provider: 'openai',
    model: 'gpt-3.5-turbo',
    priority: 3,
    capabilities: ['summarization', 'extraction', 'basic_generation', 'document_generation'],
    costEfficiency: 10,
    qualityRating: 7,
    speedRating: 10
  },
  
  // Gemini Pro - APENAS PARA CASOS PREMIUM (mais caro)
  {
    provider: 'google',
    model: 'gemini-1.5-pro',
    priority: 4,
    capabilities: ['document_generation', 'legal_analysis', 'reasoning', 'complex_tasks'],
    costEfficiency: 6,
    qualityRating: 9,
    speedRating: 7
  },
  
  // GPT-4o - APENAS PARA CASOS PREMIUM (caro)
  {
    provider: 'openai',
    model: 'gpt-4o',
    priority: 5,
    capabilities: ['document_generation', 'legal_analysis', 'reasoning', 'complex_tasks'],
    costEfficiency: 4,
    qualityRating: 9,
    speedRating: 8
  }
];

export const DOCUMENT_TYPE_PREFERENCES: Record<DocumentType, {
  quality: 'draft' | 'standard' | 'premium';
  complexity: 'low' | 'medium' | 'high';
  preferredCapabilities: string[];
}> = {
  petition: {
    quality: 'standard', // Reduzido de premium para standard
    complexity: 'medium', // Reduzido de high para medium
    preferredCapabilities: ['document_generation', 'analysis']
  },
  contract: {
    quality: 'standard', // Reduzido de premium para standard
    complexity: 'medium', // Reduzido de high para medium
    preferredCapabilities: ['document_generation']
  },
  legal_opinion: {
    quality: 'standard', // Reduzido de premium para standard
    complexity: 'medium', // Reduzido de high para medium
    preferredCapabilities: ['analysis', 'document_generation']
  },
  notification: {
    quality: 'draft', // Reduzido de standard para draft
    complexity: 'low', // Reduzido de medium para low
    preferredCapabilities: ['document_generation']
  },
  brief: {
    quality: 'draft', // Reduzido de standard para draft
    complexity: 'low', // Reduzido de medium para low
    preferredCapabilities: ['summarization', 'extraction']
  },
  motion: {
    quality: 'standard',
    complexity: 'medium',
    preferredCapabilities: ['document_generation']
  },
  other: {
    quality: 'draft', // Reduzido de standard para draft
    complexity: 'low', // Reduzido de medium para low
    preferredCapabilities: ['document_generation']
  }
};

export const LEGAL_AREA_COMPLEXITY: Record<LegalArea, number> = {
  constitutional: 1.6,
  tax: 1.4,
  corporate: 1.3,
  civil: 1.2,
  administrative: 1.2,
  criminal: 1.5,
  labor: 1.1
};

export const STAGE_MODEL_PREFERENCES: Record<string, {
  preferredCapabilities: string[];
  qualityRequirement: 'draft' | 'standard' | 'premium';
  speedRequirement: 'fast' | 'balanced' | 'thorough';
}> = {
  summarization: {
    preferredCapabilities: ['summarization', 'extraction'],
    qualityRequirement: 'draft', // Mais barato
    speedRequirement: 'fast'
  },
  analysis: {
    preferredCapabilities: ['analysis', 'document_generation'], // Removido legal_analysis e reasoning
    qualityRequirement: 'standard', // Reduzido de premium
    speedRequirement: 'balanced' // Reduzido de thorough
  },
  structure: {
    preferredCapabilities: ['analysis', 'document_generation'],
    qualityRequirement: 'draft', // Reduzido de standard
    speedRequirement: 'fast' // Reduzido de balanced
  },
  generation: {
    preferredCapabilities: ['document_generation'],
    qualityRequirement: 'standard', // Reduzido de premium
    speedRequirement: 'balanced' // Reduzido de thorough
  },
  assembly: {
    preferredCapabilities: ['document_generation'],
    qualityRequirement: 'draft', // Reduzido de standard
    speedRequirement: 'fast'
  }
};