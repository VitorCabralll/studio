/**
 * Sistema de tipos centralizado para o orquestrador
 * Todas as definições de tipos em um local para evitar conflitos
 */

// ============================================================================
// CORE TYPES
// ============================================================================

export type DocumentType = 'petition' | 'contract' | 'legal_opinion' | 'notification' | 'brief' | 'motion' | 'other';
export type LegalArea = 'civil' | 'criminal' | 'labor' | 'corporate' | 'tax' | 'constitutional' | 'administrative';
export type TaskType = 'document_generation' | 'legal_analysis' | 'contract_review' | 'document_summary' | 'data_extraction';
export type ContextType = 'user_input' | 'ocr_text' | 'file_content' | 'structured_data' | 'legal_precedent' | 'template';
export type LLMProvider = 'google' | 'openai' | 'anthropic' | 'local' | 'custom';

// ============================================================================
// REQUEST & RESPONSE
// ============================================================================

export interface DocumentRequest {
  type: DocumentType;
  taskType: TaskType;
  legalArea?: LegalArea;
  instructions: string;
  context: ContextItem[];
  options?: ProcessingOptions;
  metadata?: RequestMetadata;
}

export interface ContextItem {
  type: ContextType;
  content: string;
  confidence?: number;
  source?: string;
  structured?: Record<string, any>;
}

export interface ProcessingOptions {
  qualityLevel?: 'draft' | 'standard' | 'premium';
  maxCost?: number;
  maxLatency?: number;
  preferredProvider?: LLMProvider;
}

export interface RequestMetadata {
  requestId: string;
  userId: string;
  timestamp: Date;
  clientInfo?: {
    userAgent?: string;
    ipAddress?: string;
    sessionId?: string;
  };
}

export interface DocumentResponse {
  success: boolean;
  document?: GeneratedDocument;
  error?: ProcessingError;
  metadata: ProcessingMetadata;
  trace?: ProcessingTrace;
}

export interface GeneratedDocument {
  content: string;
  documentType: DocumentType;
  confidence: number;
  suggestions?: string[];
  citations?: Citation[];
  structuredData?: Record<string, any>;
}

// ============================================================================
// ERRORS & METADATA
// ============================================================================

export interface ProcessingError {
  code: string;
  message: string;
  stage?: string;
  retryable: boolean;
  timestamp: Date;
  details?: Record<string, any>;
}

export interface ProcessingMetadata {
  processingTime: number;
  providerUsed: string[];
  totalCost: number;
  tokensUsed: TokenUsage;
  confidence: number;
}

export interface ProcessingTrace {
  stages: StageTrace[];
  totalDuration: number;
  totalCost: number;
  totalTokens: number;
  errors: ProcessingError[];
}

export interface StageTrace {
  name: string;
  startTime: Date;
  endTime?: Date;
  duration?: number;
  providerUsed?: string;
  success: boolean;
  error?: string;
}

export interface TokenUsage {
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
  cost: number;
}

export interface Citation {
  source: string;
  type: 'law' | 'precedent' | 'regulation' | 'doctrine';
  relevance: number;
  excerpt?: string;
}

// ============================================================================
// LLM TYPES
// ============================================================================

export interface LLMRequest {
  prompt: string;
  maxTokens: number;
  temperature?: number;
  topP?: number;
  systemPrompt?: string;
  model?: string;
  options?: Record<string, any>;
  metadata?: Record<string, any>;
}

export interface LLMResponse {
  content: string;
  finishReason: 'stop' | 'length' | 'error';
  usage: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
  model?: string; // Model used for generation
  metadata: {
    provider: LLMProvider;
    model: string;
    latency: number;
    cost: number;
    [key: string]: any;
  };
  error?: string;
}

export interface ModelInfo {
  name: string;
  provider: LLMProvider;
  maxTokens: number;
  costPer1MTokens: {
    input: number;
    output: number;
  };
  capabilities: string[];
  qualityRating: number;
}

export interface ProviderConfig {
  provider: LLMProvider;
  apiKey: string;
  baseUrl?: string;
  timeout?: number;
  retries?: number;
}

// ============================================================================
// ROUTING TYPES
// ============================================================================

export interface RoutingCriteria {
  complexity: 'low' | 'medium' | 'high';
  quality: 'draft' | 'standard' | 'premium';
  speed: 'fast' | 'balanced' | 'thorough';
  budget: 'low' | 'medium' | 'high';
  documentType?: DocumentType;
  taskType?: TaskType;
}

export interface RoutingDecision {
  provider: LLMProvider;
  model: string;
  reasoning: string;
  confidence: number;
  estimatedCost: number;
  estimatedLatency: number;
}

// ============================================================================
// PIPELINE TYPES
// ============================================================================

export interface PipelineContext {
  request: DocumentRequest;
  currentStage: string;
  results: Record<string, any>;
  trace: ProcessingTrace;
  providerFactory: any;
}

export interface StageResult {
  success: boolean;
  data?: any;
  error?: ProcessingError;
  metadata: {
    duration: number;
    provider?: LLMProvider;
    tokensUsed?: number;
    cost?: number;
  };
}

export interface StageProcessor {
  name: string;
  process(input: any, context: PipelineContext): Promise<StageResult>;
}

export interface PipelineStage {
  name: string;
  description: string;
  processor: StageProcessor;
  timeout?: number;
  retries?: number;
  dependencies?: string[];
}

export interface PipelineConfig {
  stages: PipelineStage[];
  defaultTimeout: number;
  maxRetries: number;
  enableParallelExecution?: boolean;
}

// ============================================================================
// STAGE RESULTS
// ============================================================================

export interface SummarizationResult {
  summary: string;
  keyPoints: string[];
  entities: string[];
}

export interface AnalysisResult {
  strategy: string;
  arguments: string[];
  legalBasis: string[];
  priority: number;
}

export interface StructureResult {
  sections: string[];
  outline: string;
  hierarchy: SectionHierarchy[];
}

export interface SectionHierarchy {
  name: string;
  level: number;
  children?: SectionHierarchy[];
}

export interface GenerationResult {
  sections: Record<string, string>;
  totalTokens: number;
  quality: number;
}

export interface AssemblyResult {
  document: string;
  formatting: string;
  metadata: Record<string, any>;
}

// ============================================================================
// HEALTH & MONITORING
// ============================================================================

export interface HealthStatus {
  status: 'healthy' | 'degraded' | 'unhealthy';
  timestamp: string;
  providers: ProviderStatus[];
  version: string;
}

export interface ProviderStatus {
  name: string;
  available: boolean;
  latency?: number;
  lastCheck: string;
  error?: string;
}

// ============================================================================
// LEGACY COMPATIBILITY
// ============================================================================

export interface ProcessingInput {
  taskType: TaskType;
  documentType: DocumentType;
  legalArea?: LegalArea;
  instructions: string;
  context: ContextItem[];
  agent?: any;
  preferences?: any;
  metadata?: RequestMetadata;
}

export interface ProcessingOutput {
  success: boolean;
  result?: GeneratedDocument;
  error?: ProcessingError;
  metadata: {
    processingTime: number;
    llmUsed: any[];
    totalCost: number;
    tokensUsed: TokenUsage;
    confidence: number;
  };
  pipeline?: ProcessingTrace;
}

export interface OrchestratorConfig {
  llmConfigs: any[];
  defaultRouting: any;
  pipeline: any[];
  monitoring: any;
  security: any;
}