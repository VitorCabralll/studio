/**
 * Interface pública do orquestrador simplificada
 */

import { AIOrchestrator, getOrchestrator } from './orchestrator';
import type {
  DocumentRequest,
  DocumentResponse,
  HealthStatus,
  ProcessingInput,
  ProcessingOutput
} from './types/index';

// Exporta classes e funções principais
export { AIOrchestrator, getOrchestrator };

// Exporta tipos principais
export type {
  DocumentRequest,
  DocumentResponse,
  HealthStatus,
  ProcessingInput,
  ProcessingOutput
};

// Exporta função legacy de compatibilidade
export async function processDocument(input: ProcessingInput): Promise<ProcessingOutput> {
  const orchestrator = getOrchestrator();
  return await orchestrator.processDocument(input);
}

// Exporta função de health check
export async function healthCheck(): Promise<Record<string, any>> {
  const orchestrator = getOrchestrator();
  return await orchestrator.healthCheck();
}