/**
 * API Route para geração de documentos via orquestrador
 * Conecta o frontend ao orquestrador sem alterar lógicas existentes
 */

import { NextRequest, NextResponse } from 'next/server';
import { orchestrator } from '@/services/build-aware-orchestrator';
import { getAdminAuth, isAdminConfigured } from '@/lib/firebase-admin';
import { validateDocumentRequest, rateLimiter, createSafeLogData } from '@/lib/input-validation';
import type { DocumentProcessingRequest } from '@/services/build-aware-orchestrator';
import type { LegalArea } from '@/types/orchestrator';

// Tipos para a API
interface GenerateRequest {
  instructions: string;
  attachments?: string[]; // Data URIs dos arquivos
  agent: 'geral' | 'civil' | 'stj';
  mode: 'outline' | 'full';
  legalArea?: string;
}

interface GenerateResponse {
  success: boolean;
  document?: string;
  metadata?: {
    processingTime: number;
    cost: number;
    confidence: number;
    llmUsed: string[];
  };
  error?: {
    message: string;
    code: string;
  };
}

export async function POST(request: NextRequest): Promise<NextResponse<GenerateResponse>> {
  const startTime = Date.now();
  
  try {
    // Verificar autenticação
    const authHeader = request.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({
        success: false,
        error: {
          message: 'Authentication required',
          code: 'AUTH_REQUIRED'
        }
      }, { status: 401 });
    }

    let userId = 'anonymous';
    try {
      const adminAuth = getAdminAuth();
      if (isAdminConfigured() && adminAuth) {
        const tokenParts = authHeader.split('Bearer ');
        if (tokenParts.length !== 2) {
          return NextResponse.json({ 
            success: false,
            error: {
              message: 'Invalid authorization header format',
              code: 'INVALID_AUTH_HEADER'
            }
          }, { status: 401 });
        }
        const token = tokenParts[1];
        const decodedToken = await adminAuth.verifyIdToken(token);
        userId = decodedToken.uid;
      }
    } catch {
      return NextResponse.json({
        success: false,
        error: {
          message: 'Invalid token',
          code: 'INVALID_TOKEN'
        }
      }, { status: 401 });
    }

    // Rate limiting
    if (!rateLimiter.isAllowed(userId, 10, 60 * 1000)) { // 10 requests por minuto
      return NextResponse.json({
        success: false,
        error: {
          message: 'Rate limit exceeded. Try again later.',
          code: 'RATE_LIMIT_EXCEEDED'
        }
      }, { status: 429 });
    }

    // Parse e validação do body da requisição
    const body: GenerateRequest = await request.json();
    
    const validation = validateDocumentRequest(body);
    if (!validation.success) {
      return NextResponse.json({
        success: false,
        error: {
          message: validation.error || 'Invalid request format',
          code: 'VALIDATION_ERROR'
        }
      }, { status: 400 });
    }

    // Mapear dados do frontend para formato do orquestrador
    const orchestratorInput: DocumentProcessingRequest = {
      taskType: 'document_generation',
      documentType: mapModeToDocumentType(body.mode),
      content: body.instructions,
      context: {
        preferences: {
          legalArea: mapAgentToLegalArea(body.agent)
        }
      },
      budget: 'low',
      priority: 'medium'
    };

    // Log da requisição (seguro)
    console.log('[API] Iniciando geração de documento:', createSafeLogData({
      userId,
      agent: body.agent,
      mode: body.mode,
      hasAttachments: (body.attachments?.length || 0) > 0,
      instructionsLength: body.instructions.length,
      timestamp: new Date().toISOString()
    }));

    // Chamar orquestrador (SEM ALTERAR SUA LÓGICA)
    const result = await orchestrator.processDocument(orchestratorInput);

    // Mapear resposta do orquestrador para formato da API
    if (result.success && result.result) {
      return NextResponse.json({
        success: true,
        document: result.result.finalDocument || result.result.content,
        metadata: {
          processingTime: result.metadata.processingTime,
          cost: result.metadata.totalCost,
          confidence: result.metadata.quality,
          llmUsed: result.metadata.modelsUsed
        }
      });
    } else {
      // Erro do orquestrador
      return NextResponse.json({
        success: false,
        error: {
          message: result.error || 'Erro desconhecido no processamento',
          code: 'ORCHESTRATOR_ERROR'
        }
      }, { status: 500 });
    }

  } catch (error) {
    // Erro na API route - log seguro
    const responseTime = Date.now() - startTime;
    console.error('[API] Erro na geração de documento:', createSafeLogData({
      error: error instanceof Error ? error.message : 'Unknown error',
      responseTime,
      timestamp: new Date().toISOString()
    }));
    
    return NextResponse.json({
      success: false,
      error: {
        message: 'Erro interno do servidor',
        code: 'INTERNAL_ERROR'
      }
    }, { status: 500 });
  }
}

// Funções de mapeamento (adaptadores)
function mapModeToDocumentType(mode: 'outline' | 'full'): 'petition' | 'contract' | 'brief' | 'motion' | 'other' {
  switch (mode) {
    case 'outline':
      return 'brief';
    case 'full':
      return 'petition';
    default:
      return 'brief';
  }
}

function mapAgentToLegalArea(agent: 'geral' | 'civil' | 'stj'): LegalArea {
  switch (agent) {
    case 'civil':
      return 'civil';
    case 'stj':
      return 'constitutional'; // STJ = jurisprudência constitucional
    case 'geral':
    default:
      return 'civil'; // Padrão para casos gerais
  }
}

// Função removida - não utilizada
// function mapAttachmentsToContext(attachments: string[]): Array<{
//   type: 'file_content';
//   content: string;
//   source: string;
// }> {
//   return attachments.map((dataUri, index) => ({
//     type: 'file_content' as const,
//     content: dataUri,
//     source: `attachment_${index + 1}`
//   }));
// }

// Endpoint de healthcheck
export async function GET(): Promise<NextResponse> {
  return NextResponse.json({
    status: 'ok',
    service: 'document-generation-api',
    timestamp: new Date().toISOString()
  });
}