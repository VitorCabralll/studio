/**
 * API Route para geração de documentos via orquestrador
 * Conecta o frontend ao orquestrador sem alterar lógicas existentes
 */

import { NextRequest, NextResponse } from 'next/server';
import { generateDocument } from '@/ai/orchestrator';
import { adminAuth } from '@/lib/firebase-admin';
import type { ProcessingInput, DocumentType, LegalArea } from '@/ai/orchestrator/types';

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

    try {
      if (adminAuth) {
        const token = authHeader.split('Bearer ')[1];
        await adminAuth.verifyIdToken(token);
      }
    } catch (error) {
      return NextResponse.json({
        success: false,
        error: {
          message: 'Invalid token',
          code: 'INVALID_TOKEN'
        }
      }, { status: 401 });
    }

    // Parse do body da requisição
    const body: GenerateRequest = await request.json();
    
    // Validação básica
    if (!body.instructions?.trim()) {
      return NextResponse.json({
        success: false,
        error: {
          message: 'Instruções são obrigatórias',
          code: 'MISSING_INSTRUCTIONS'
        }
      }, { status: 400 });
    }

    // Mapear dados do frontend para formato do orquestrador
    const orchestratorInput: ProcessingInput = {
      taskType: 'document_generation',
      documentType: mapModeToDocumentType(body.mode),
      legalArea: mapAgentToLegalArea(body.agent),
      instructions: body.instructions,
      context: mapAttachmentsToContext(body.attachments || [])
    };

    // Log da requisição (desenvolvimento)
    console.log('[API] Iniciando geração de documento:', {
      agent: body.agent,
      mode: body.mode,
      hasAttachments: (body.attachments?.length || 0) > 0,
      instructionsLength: body.instructions.length
    });

    // Chamar orquestrador (SEM ALTERAR SUA LÓGICA)
    const result = await generateDocument(orchestratorInput);

    // Mapear resposta do orquestrador para formato da API
    if (result.success && result.result) {
      return NextResponse.json({
        success: true,
        document: result.result.content,
        metadata: {
          processingTime: result.metadata.processingTime,
          cost: result.metadata.totalCost,
          confidence: result.metadata.confidence,
          llmUsed: result.metadata.llmUsed.map(llm => `${llm.provider}:${llm.model}`)
        }
      });
    } else {
      // Erro do orquestrador
      return NextResponse.json({
        success: false,
        error: {
          message: result.error?.message || 'Erro desconhecido no processamento',
          code: result.error?.code || 'ORCHESTRATOR_ERROR'
        }
      }, { status: 500 });
    }

  } catch (error) {
    // Erro na API route
    console.error('[API] Erro na geração de documento:', error);
    
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
function mapModeToDocumentType(mode: 'outline' | 'full'): DocumentType {
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

function mapAttachmentsToContext(attachments: string[]): Array<{
  type: 'file_content';
  content: string;
  source: string;
}> {
  return attachments.map((dataUri, index) => ({
    type: 'file_content' as const,
    content: dataUri,
    source: `attachment_${index + 1}`
  }));
}

// Endpoint de healthcheck
export async function GET(): Promise<NextResponse> {
  return NextResponse.json({
    status: 'ok',
    service: 'document-generation-api',
    timestamp: new Date().toISOString()
  });
}