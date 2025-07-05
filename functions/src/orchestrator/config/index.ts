/**
 * Configuração padrão para compatibilidade
 */

export const DEFAULT_ORCHESTRATOR_CONFIG = {
  llmConfigs: [],
  defaultRouting: {
    taskComplexity: 'medium',
    qualityRequirement: 'standard',
    latencyRequirement: 'balanced',
    costBudget: 'low'
  },
  pipeline: [],
  monitoring: {
    enableTracing: true,
    enableMetrics: true,
    logLevel: 'info'
  },
  security: {
    enableAPIKeyRotation: false,
    encryptPrompts: false,
    auditLogging: true,
    dataRetentionDays: 30
  }
};