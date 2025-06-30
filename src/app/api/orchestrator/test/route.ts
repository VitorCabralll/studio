/**
 * API Route para testar o orquestrador com dados simples
 */

import { NextRequest, NextResponse } from 'next/server';
import { generateDocument } from '@/ai/orchestrator';
import type { ProcessingInput } from '@/ai/orchestrator/types';

interface TestRequest {
  simple?: boolean; // Teste simples ou completo
}

interface TestResponse {
  success: boolean;
  result?: {
    document: string;
    processingTime: number;
    cost: number;
    llmUsed: string[];
  };
  error?: {
    message: string;
    code: string;
  };
  debug?: {
    input: ProcessingInput;
    timestamp: string;
  };
}

export async function POST(request: NextRequest): Promise<NextResponse<TestResponse>> {
  try {
    const body: TestRequest = await request.json();
    const isSimpleTest = body.simple !== false; // Padrão é teste simples

    // Input de teste (simples ou completo)
    const testInput: ProcessingInput = isSimpleTest 
      ? getSimpleTestInput()
      : getComplexTestInput();

    console.log('[API TEST] Iniciando teste do orquestrador:', {
      type: isSimpleTest ? 'simple' : 'complex',
      timestamp: new Date().toISOString()
    });

    const startTime = Date.now();

    // Executar teste do orquestrador
    const result = await generateDocument(testInput);
    
    const endTime = Date.now();
    const processingTime = endTime - startTime;

    console.log('[API TEST] Teste concluído:', {
      success: result.success,
      processingTime: `${processingTime}ms`,
      hasDocument: !!result.result?.content
    });

    if (result.success && result.result) {
      return NextResponse.json({
        success: true,
        result: {
          document: result.result.content,
          processingTime: result.metadata.processingTime,
          cost: result.metadata.totalCost,
          llmUsed: result.metadata.llmUsed.map(llm => `${llm.provider}:${llm.model}`)
        },
        debug: {
          input: testInput,
          timestamp: new Date().toISOString()
        }
      });
    } else {
      return NextResponse.json({
        success: false,
        error: {
          message: result.error?.message || 'Teste falhou',
          code: result.error?.code || 'TEST_FAILED'
        },
        debug: {
          input: testInput,
          timestamp: new Date().toISOString()
        }
      }, { status: 500 });
    }

  } catch (error) {
    console.error('[API TEST] Erro no teste do orquestrador:', error);
    
    return NextResponse.json({
      success: false,
      error: {
        message: 'Erro interno no teste',
        code: 'TEST_ERROR'
      }
    }, { status: 500 });
  }
}

// Teste simples - dados mínimos
function getSimpleTestInput(): ProcessingInput {
  return {
    taskType: 'document_generation',
    documentType: 'brief',
    legalArea: 'civil',
    instructions: 'Gerar um resumo simples de teste para validar a integração da API.',
    context: [
      {
        type: 'ocr_text',
        content: 'Este é um documento de teste para validação da API. Contém informações básicas para processamento.',
        source: 'test_document.txt'
      }
    ]
  };
}

// Teste complexo - dados mais elaborados
function getComplexTestInput(): ProcessingInput {
  return {
    taskType: 'document_generation',
    documentType: 'petition',
    legalArea: 'civil',
    instructions: 'Gerar uma petição inicial completa baseada nos documentos anexados, incluindo fundamentação jurídica detalhada.',
    context: [
      {
        type: 'ocr_text',
        content: `CONTRATO DE PRESTAÇÃO DE SERVIÇOS
        
        Partes: João Silva (contratante) e Empresa XYZ (contratada)
        Objeto: Prestação de serviços de consultoria
        Valor: R$ 10.000,00
        Prazo: 30 dias
        
        Cláusula 5: Em caso de inadimplemento, será aplicada multa de 10%.`,
        source: 'contrato.pdf'
      },
      {
        type: 'file_content',
        content: 'Notificação extrajudicial enviada em 15/01/2024 cobrando o pagamento em atraso.',
        source: 'notificacao.pdf'
      }
    ]
  };
}

// Endpoint GET para informações sobre os testes disponíveis
export async function GET(): Promise<NextResponse> {
  return NextResponse.json({
    available_tests: [
      {
        type: 'simple',
        description: 'Teste básico com dados mínimos',
        endpoint: 'POST /api/orchestrator/test',
        body: { simple: true }
      },
      {
        type: 'complex',
        description: 'Teste completo com documentos simulados',
        endpoint: 'POST /api/orchestrator/test',
        body: { simple: false }
      }
    ],
    usage: 'Envie POST com { "simple": true/false } para escolher o tipo de teste'
  });
}