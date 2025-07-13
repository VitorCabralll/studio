/**
 * Tipos compartilhados para o Orquestrador de IA do LexAI
 * Tipos necessários para clientes e APIs
 */

export type LegalArea = 'civil' | 'criminal' | 'labor' | 'corporate' | 'tax' | 'constitutional' | 'administrative';
export type TaskType = 'document_generation' | 'legal_analysis' | 'contract_review' | 'document_summary' | 'data_extraction';
export type DocumentType = 'petition' | 'contract' | 'legal_opinion' | 'notification' | 'brief' | 'motion' | 'other';
export type ContextType = 'user_input' | 'ocr_text' | 'file_content' | 'structured_data' | 'legal_precedent' | 'template';
export type LLMProvider = 'google' | 'openai' | 'anthropic' | 'local' | 'custom';

export interface ContextItem {
  type: ContextType;
  content: string;
  confidence?: number;
  source?: string;
  structured?: Record<string, any>;
}

export interface ProcessingInput {
  taskType: TaskType;
  documentType: DocumentType;
  legalArea?: LegalArea;
  instructions: string;
  context: ContextItem[];
  agent?: {
    id: string;
    name: string;
    legalArea: LegalArea;
  };
  preferences?: {
    preferredLanguage: string;
    outputFormat: 'formal' | 'casual' | 'technical';
    qualityLevel: 'draft' | 'standard' | 'premium';
  };
  metadata?: {
    requestId: string;
    userId: string;
    timestamp: Date;
  };
}

export interface ProcessingOutput {
  success: boolean;
  result?: {
    content: string;
    documentType: DocumentType;
    confidence: number;
    suggestions?: string[];
  };
  error?: {
    code: string;
    message: string;
    stage?: string;
    retryable: boolean;
  };
  metadata: {
    processingTime: number;
    totalCost: number;
    confidence: number;
  };
  pipeline: {
    totalDuration: number;
    totalCost: number;
    totalTokens: number;
  };
}

export interface RoutingDecision {
  selectedLLM: {
    provider: LLMProvider;
    model: string;
  };
  reasoning: string;
  confidence: number;
  alternatives: Array<{
    provider: LLMProvider;
    model: string;
  }>;
  estimatedCost: number;
  estimatedLatency: number;
}