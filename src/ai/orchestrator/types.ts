/**
 * Tipos e interfaces para o Orquestrador de IA do LexAI
 * Arquitetura modular para multi-LLM e pipeline de processamento
 */

// ====================================
// CORE TYPES
// ====================================

export type LLMProvider = 'google' | 'openai' | 'anthropic' | 'local' | 'custom';
export type TaskType = 'document_generation' | 'legal_analysis' | 'contract_review' | 'document_summary' | 'data_extraction';
export type DocumentType = 'petition' | 'contract' | 'legal_opinion' | 'notification' | 'brief' | 'motion' | 'other';
export type LegalArea = 'civil' | 'criminal' | 'labor' | 'corporate' | 'tax' | 'constitutional' | 'administrative';
export type ContextType = 'user_input' | 'ocr_text' | 'file_content' | 'structured_data' | 'legal_precedent' | 'template';

// Additional types for better type safety
export type JSONSchemaType = string | number | boolean | null | JSONSchemaObject | JSONSchemaArray;
export interface JSONSchemaObject { [key: string]: JSONSchemaType; }
export interface JSONSchemaArray extends Array<JSONSchemaType> {}

export interface LLMClientInterface {
  generateCompletion(request: LLMRequest): Promise<LLMResponse>;
  isAvailable(): boolean;
  getConfig(): LLMConfig;
}

// ====================================
// INPUT/OUTPUT INTERFACES
// ====================================

export interface ProcessingInput {
  taskType: TaskType;
  documentType: DocumentType;
  legalArea?: LegalArea;
  instructions: string;
  context: ContextItem[];
  agent?: AgentConfig;
  preferences?: UserPreferences;
  metadata?: ProcessingMetadata;
}

export interface ContextItem {
  type: ContextType;
  content: string;
  confidence?: number;
  source?: string;
  structured?: Record<string, unknown>;
}

export interface ProcessingOutput {
  success: boolean;
  result?: GeneratedDocument;
  error?: ProcessingError;
  metadata: OutputMetadata;
  pipeline: PipelineTrace;
}

export interface GeneratedDocument {
  content: string;
  documentType: DocumentType;
  confidence: number;
  suggestions?: string[];
  citations?: Citation[];
  structuredData?: Record<string, unknown>;
}

// ====================================
// LLM ROUTING & SELECTION
// ====================================

export interface LLMConfig {
  provider: LLMProvider;
  model: string;
  apiKey?: string;
  endpoint?: string;
  capabilities: LLMCapabilities;
  performance: LLMPerformance;
  costs: LLMCosts;
}

export interface LLMCapabilities {
  maxTokens: number;
  supportedLanguages: string[];
  specializations: TaskType[];
  qualityRating: number; // 1-10
  contextWindow: number;
  functionCalling: boolean;
  jsonMode: boolean;
}

export interface LLMPerformance {
  averageLatency: number; // ms
  tokensPerSecond: number;
  reliability: number; // 0-1
  lastUpdated: Date;
}

export interface LLMCosts {
  inputTokenPrice: number; // per 1k tokens
  outputTokenPrice: number; // per 1k tokens
  currency: string;
}

export interface LLMRequest {
  prompt: string;
  maxTokens?: number;
  temperature?: number;
  systemPrompt?: string;
  functions?: LLMFunction[];
  options?: Record<string, unknown>;
}

export interface LLMResponse {
  content: string;
  finishReason: 'stop' | 'length' | 'function_call' | 'content_filter' | 'error';
  usage?: TokenUsage;
  functionCall?: FunctionCall;
  metadata?: Record<string, unknown>;
}

export interface LLMFunction {
  name: string;
  description: string;
  parameters: Record<string, JSONSchemaType>;
}

export interface FunctionCall {
  name: string;
  arguments: Record<string, unknown>;
}

export interface TokenUsage {
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
  cost?: number;
}

// ====================================
// ROUTING LOGIC
// ====================================

export interface RoutingDecision {
  selectedLLM: LLMConfig;
  reasoning: string;
  confidence: number;
  alternatives: LLMConfig[];
  estimatedCost: number;
  estimatedLatency: number;
}

export interface RoutingCriteria {
  taskComplexity: 'low' | 'medium' | 'high';
  qualityRequirement: 'draft' | 'standard' | 'premium';
  latencyRequirement: 'fast' | 'balanced' | 'thorough';
  costBudget: 'low' | 'medium' | 'high';
  specialization?: TaskType;
  legalArea?: LegalArea;
  temperature?: number;
}

// ====================================
// PIPELINE STAGES
// ====================================

export interface PipelineStage {
  name: string;
  description: string;
  processor: PipelineProcessor;
  dependencies?: string[];
  timeout?: number;
  retryConfig?: RetryConfig;
}

export interface PipelineProcessor {
  process(input: unknown, context: PipelineContext): Promise<unknown>;
  validate?(input: unknown): boolean;
  transform?(output: unknown): unknown;
}

export interface PipelineContext {
  stage: string;
  input: ProcessingInput;
  intermediateResults: Record<string, unknown>;
  llmClients: Record<LLMProvider, LLMClientInterface>;
  config: OrchestratorConfig;
  trace: PipelineTrace;
}

export interface PipelineTrace {
  stages: StageTrace[];
  totalDuration: number;
  totalCost: number;
  totalTokens: number;
  errors: ProcessingError[];
}

export interface StageTrace {
  stageName: string;
  startTime: Date;
  endTime?: Date;
  duration?: number;
  input: unknown;
  output?: unknown;
  error?: ProcessingError;
  llmUsed?: LLMConfig;
  tokensUsed?: TokenUsage;
}

// ====================================
// AGENT CONFIGURATION
// ====================================

export interface AgentConfig {
  id: string;
  name: string;
  description: string;
  legalArea: LegalArea;
  specializations: TaskType[];
  prompt: AgentPrompt;
  llmPreferences: LLMPreferences;
  templates: DocumentTemplate[];
  knowledgeBase?: KnowledgeBase;
}

export interface AgentPrompt {
  system: string;
  context: string;
  examples: PromptExample[];
  constraints: string[];
}

export interface PromptExample {
  input: string;
  output: string;
  explanation?: string;
}

export interface LLMPreferences {
  preferredProviders: LLMProvider[];
  fallbackStrategy: 'cascade' | 'parallel' | 'hybrid';
  qualityThreshold: number;
  maxRetries: number;
}

export interface DocumentTemplate {
  id: string;
  name: string;
  documentType: DocumentType;
  template: string;
  variables: TemplateVariable[];
  validationRules: ValidationRule[];
}

export interface TemplateVariable {
  name: string;
  type: 'string' | 'number' | 'date' | 'boolean' | 'array';
  required: boolean;
  description: string;
  defaultValue?: unknown;
}

export interface ValidationRule {
  field: string;
  rule: string;
  message: string;
}

// ====================================
// CONTEXT & MEMORY
// ====================================

export interface KnowledgeBase {
  documents: DocumentVector[];
  precedents: LegalPrecedent[];
  regulations: Regulation[];
  updateDate: Date;
}

export interface DocumentVector {
  id: string;
  content: string;
  embedding: number[];
  metadata: Record<string, unknown>;
}

export interface LegalPrecedent {
  id: string;
  court: string;
  date: Date;
  summary: string;
  relevantLaws: string[];
  keywords: string[];
}

export interface Regulation {
  id: string;
  name: string;
  content: string;
  effectiveDate: Date;
  category: LegalArea;
}

export interface ContextManager {
  addContext(item: ContextItem): void;
  getRelevantContext(query: string, limit?: number): ContextItem[];
  summarizeContext(): string;
  clear(): void;
}

// ====================================
// ERROR HANDLING
// ====================================

export interface ProcessingError {
  code: string;
  message: string;
  stage?: string;
  provider?: LLMProvider;
  retryable: boolean;
  timestamp: Date;
  details?: Record<string, unknown>;
}

export interface RetryConfig {
  maxAttempts: number;
  baseDelay: number; // ms
  maxDelay: number; // ms
  exponentialBackoff: boolean;
  retryableErrors: string[];
}

// ====================================
// CONFIGURATION
// ====================================

export interface OrchestratorConfig {
  llmConfigs: LLMConfig[];
  defaultRouting: RoutingCriteria;
  pipeline: PipelineStage[];
  monitoring: MonitoringConfig;
  security: SecurityConfig;
}

export interface MonitoringConfig {
  enableTracing: boolean;
  enableMetrics: boolean;
  logLevel: 'debug' | 'info' | 'warn' | 'error';
  metricsEndpoint?: string;
}

export interface SecurityConfig {
  enableAPIKeyRotation: boolean;
  encryptPrompts: boolean;
  auditLogging: boolean;
  dataRetentionDays: number;
}

export interface UserPreferences {
  preferredLanguage: string;
  outputFormat: 'formal' | 'casual' | 'technical';
  qualityLevel: 'draft' | 'standard' | 'premium';
  maxCostPerRequest: number;
  maxLatency: number; // ms
}

export interface ProcessingMetadata {
  requestId: string;
  userId: string;
  timestamp: Date;
  clientInfo: {
    userAgent?: string;
    ipAddress?: string;
    sessionId?: string;
  };
}

export interface OutputMetadata {
  processingTime: number;
  llmUsed: LLMConfig[];
  totalCost: number;
  tokensUsed: TokenUsage;
  qualityScore?: number;
  confidence: number;
}

export interface Citation {
  source: string;
  type: 'law' | 'precedent' | 'regulation' | 'doctrine';
  relevance: number;
  excerpt?: string;
}