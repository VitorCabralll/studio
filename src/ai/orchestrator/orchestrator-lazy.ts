/**
 * Lazy-loaded AI Orchestrator
 * Reduces initial bundle size by loading orchestrator components only when needed
 */

import { ProcessingInput, ProcessingOutput, RoutingDecision } from './types';

// Lazy imports for heavy components
const loadOrchestrator = () => import('./index').then(mod => mod.AIOrchestrator);
const loadUtils = () => import('./index');

/**
 * Lazy wrapper for AI Orchestrator functionality
 */
class LazyAIOrchestrator {
  private orchestratorInstance: any = null;
  private loadingPromise: Promise<any> | null = null;

  private async getOrchestrator() {
    if (this.orchestratorInstance) {
      return this.orchestratorInstance;
    }

    if (this.loadingPromise) {
      const OrchestratorClass = await this.loadingPromise;
      this.orchestratorInstance = new OrchestratorClass();
      return this.orchestratorInstance;
    }

    this.loadingPromise = loadOrchestrator();
    const OrchestratorClass = await this.loadingPromise;
    this.orchestratorInstance = new OrchestratorClass();
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

  async updateConfig(newConfig: any) {
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

export async function updateOrchestratorConfig(config: any) {
  return lazyOrchestrator.updateConfig(config);
}

export async function getAvailableLLMs() {
  return lazyOrchestrator.getAvailableLLMs();
}

// Re-export types (these are lightweight)
export type { ProcessingInput, ProcessingOutput, RoutingDecision, OrchestratorConfig, LLMConfig } from './types';

export default lazyOrchestrator;