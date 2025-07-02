/**
 * Lazy-loaded AI Orchestrator
 * Reduces initial bundle size by loading orchestrator components only when needed
 */

import { ProcessingInput, ProcessingOutput, RoutingDecision, OrchestratorConfig } from './types';

// Lazy imports for heavy components
const loadOrchestrator = () => import('./index').then(mod => mod.AIOrchestrator.create());

// Import AIOrchestrator type for typing
type AIOrchestratorType = import('./index').AIOrchestrator;

/**
 * Lazy wrapper for AI Orchestrator functionality
 */
class LazyAIOrchestrator {
  private orchestratorInstance: AIOrchestratorType | null = null;
  private loadingPromise: Promise<AIOrchestratorType> | null = null;

  private async getOrchestrator(): Promise<AIOrchestratorType> {
    if (this.orchestratorInstance) {
      return this.orchestratorInstance;
    }

    if (this.loadingPromise) {
      this.orchestratorInstance = await this.loadingPromise;
      return this.orchestratorInstance;
    }

    this.loadingPromise = loadOrchestrator() as Promise<AIOrchestratorType>;
    this.orchestratorInstance = await this.loadingPromise;
    return this.orchestratorInstance;
  }

  async processDocument(input: ProcessingInput): Promise<ProcessingOutput> {
    const orchestrator = await this.getOrchestrator();
    return orchestrator.processDocument(input);
  }

  async testRouting(input: ProcessingInput): Promise<RoutingDecision> {
    const orchestrator = await this.getOrchestrator();
    return orchestrator.testRouting(input);
  }

  async getConfig() {
    const orchestrator = await this.getOrchestrator();
    return orchestrator.getConfig();
  }

  async updateConfig(newConfig: Partial<OrchestratorConfig>) {
    const orchestrator = await this.getOrchestrator();
    return orchestrator.updateConfig(newConfig);
  }

  async getAvailableLLMs() {
    const orchestrator = await this.getOrchestrator();
    return orchestrator.getAvailableLLMs();
  }
}

// Singleton instance
const lazyOrchestrator = new LazyAIOrchestrator();

/**
 * Lazy-loaded utility functions
 */
export async function generateDocument(input: ProcessingInput): Promise<ProcessingOutput> {
  return lazyOrchestrator.processDocument(input);
}

export async function testLLMRouting(input: ProcessingInput): Promise<RoutingDecision> {
  return lazyOrchestrator.testRouting(input);
}

export async function getOrchestratorConfig() {
  return lazyOrchestrator.getConfig();
}

export async function updateOrchestratorConfig(config: Partial<OrchestratorConfig>) {
  return lazyOrchestrator.updateConfig(config);
}

export async function getAvailableLLMs() {
  return lazyOrchestrator.getAvailableLLMs();
}

// Re-export types (these are lightweight)
export type { ProcessingInput, ProcessingOutput, RoutingDecision, OrchestratorConfig, LLMConfig } from './types';

export default lazyOrchestrator;