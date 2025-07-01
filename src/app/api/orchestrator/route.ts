/**
 * API Route para status e informações do orquestrador
 */

import { NextResponse } from 'next/server';
import { defaultOrchestrator } from '@/ai/orchestrator';

interface OrchestratorStatus {
  status: 'ok' | 'error';
  llms: Array<{
    provider: string;
    model: string;
    available: boolean;
    hasApiKey: boolean;
  }>;
  pipeline: {
    stages: number;
    estimatedTime: string;
  };
  lastTest?: {
    success: boolean;
    timestamp: string;
    error?: string;
  };
}

export async function GET(): Promise<NextResponse<OrchestratorStatus>> {
  try {
    // Obter configuração do orquestrador
    const config = defaultOrchestrator.getConfig();
    
    // Verificar status das APIs (sem chamar - apenas verificar chaves)
    const llmStatus = config.llmConfigs.map(llm => ({
      provider: llm.provider,
      model: llm.model,
      available: true, // Assumir disponível se configurado
      hasApiKey: checkApiKey(llm.provider)
    }));

    // Informações do pipeline
    const pipelineInfo = {
      stages: config.pipeline.length,
      estimatedTime: estimateProcessingTime(config.pipeline)
    };

    return NextResponse.json({
      status: 'ok',
      llms: llmStatus,
      pipeline: pipelineInfo
    });

  } catch (error) {
    console.error('[API] Erro ao obter status do orquestrador:', error);
    
    return NextResponse.json({
      status: 'error',
      llms: [],
      pipeline: {
        stages: 0,
        estimatedTime: 'unknown'
      }
    }, { status: 500 });
  }
}

// Verificar se API key está configurada
function checkApiKey(provider: string): boolean {
  switch (provider) {
    case 'google':
      return !!process.env.GOOGLE_AI_API_KEY;
    case 'openai':
      return !!process.env.OPENAI_API_KEY;
    case 'anthropic':
      return !!process.env.ANTHROPIC_API_KEY;
    default:
      return false;
  }
}

// Estimar tempo de processamento baseado no pipeline
function estimateProcessingTime(stages: any[]): string {
  const baseTimePerStage = 10; // segundos
  const totalSeconds = stages.length * baseTimePerStage;
  
  if (totalSeconds < 60) {
    return `${totalSeconds}s`;
  } else {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}m ${seconds}s`;
  }
}