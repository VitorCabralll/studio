/**
 * API Route para status e informações do orquestrador
 */

import { NextRequest, NextResponse } from 'next/server';
import { orchestratorClient } from '@/services/orchestrator-client';
import { getAdminAuth, isAdminConfigured } from '@/lib/firebase-admin';

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

export async function GET(request: NextRequest): Promise<NextResponse<OrchestratorStatus>> {
  try {
    // Verificar autenticação para informações sensíveis
    const authHeader = request.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({
        status: 'error',
        llms: [],
        pipeline: {
          stages: 0,
          estimatedTime: 'unknown'
        }
      }, { status: 401 });
    }

    try {
      const adminAuth = getAdminAuth();
      if (isAdminConfigured() && adminAuth) {
        const token = authHeader.split('Bearer ')[1];
        await adminAuth.verifyIdToken(token);
      }
    } catch {
      return NextResponse.json({
        status: 'error',
        llms: [],
        pipeline: {
          stages: 0,
          estimatedTime: 'unknown'
        }
      }, { status: 401 });
    }

    // Obter status das Functions
    const functionsStatus = await orchestratorClient.healthCheck();
    
    // Verificar status das APIs (sem chamar - apenas verificar chaves)
    const llmStatus = [
      {
        provider: 'google',
        model: 'gemini-1.5-pro',
        available: true,
        hasApiKey: checkApiKey('google')
      },
      {
        provider: 'openai',
        model: 'gpt-4',
        available: true,
        hasApiKey: checkApiKey('openai')
      },
      {
        provider: 'anthropic',
        model: 'claude-3-opus',
        available: true,
        hasApiKey: checkApiKey('anthropic')
      }
    ];

    // Informações do pipeline
    const pipelineInfo = {
      stages: 5, // Pipeline padrão tem 5 etapas
      estimatedTime: '45s - 2m'
    };

    return NextResponse.json({
      status: 'ok',
      llms: llmStatus,
      pipeline: pipelineInfo,
      functions: {
        status: functionsStatus.status,
        version: functionsStatus.version,
        llmCount: functionsStatus.llmCount
      }
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

