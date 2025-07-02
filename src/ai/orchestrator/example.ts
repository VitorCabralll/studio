/**
 * Exemplo de uso do Orquestrador de IA do LexAI
 * Demonstra como usar o sistema de multi-LLM routing e pipeline
 */

import { 
  AIOrchestrator, 
  ProcessingInput, 
  generateDocument,
  testLLMRouting 
} from './index';

/**
 * Exemplo básico de geração de petição
 */
export async function exemploGeracaoPeticao(): Promise<void> {
  console.log('=== EXEMPLO: Geração de Petição ===\n');

  const input: ProcessingInput = {
    taskType: 'document_generation',
    documentType: 'petition',
    legalArea: 'civil',
    instructions: `
      Elaborar petição inicial de ação de cobrança com base nos documentos anexados.
      Incluir fundamentação legal sólida e pedidos específicos.
      Destacar a inadimplência e os valores em aberto.
    `,
    context: [
      {
        type: 'ocr_text',
        content: `
          CONTRATO DE PRESTAÇÃO DE SERVIÇOS Nº 12345
          CONTRATANTE: João Silva, CPF 123.456.789-00
          CONTRATADA: Empresa ABC Ltda, CNPJ 12.345.678/0001-90
          
          VALOR: R$ 15.000,00 (quinze mil reais)
          VENCIMENTO: 15/03/2024
          STATUS: EM ABERTO
          
          CLÁUSULA 5ª - Em caso de inadimplemento, incidirão juros de 1% ao mês
          e multa de 2% sobre o valor devido.
        `,
        confidence: 0.95,
        source: 'contrato_digitalizacao.pdf'
      },
      {
        type: 'file_content',
        content: `
          E-mail de cobrança enviado em 20/03/2024:
          "Prezado Sr. João Silva, informamos que o pagamento referente ao 
          contrato 12345 encontra-se em atraso. Solicitamos regularização 
          no prazo de 10 dias."
          
          Resposta em 25/03/2024:
          "Estou passando por dificuldades financeiras. Posso parcelar?"
          
          Sem resposta desde então.
        `,
        source: 'emails_cobranca.txt'
      },
      {
        type: 'structured_data',
        content: JSON.stringify({
          devedor: {
            nome: 'João Silva',
            cpf: '123.456.789-00',
            endereco: 'Rua das Flores, 123 - São Paulo/SP'
          },
          divida: {
            principal: 15000.00,
            juros: 450.00,
            multa: 300.00,
            total: 15750.00,
            vencimento: '2024-03-15',
            diasAtraso: 45
          }
        }),
        source: 'calculo_divida.json'
      }
    ],
    preferences: {
      preferredLanguage: 'pt-BR',
      outputFormat: 'formal',
      qualityLevel: 'premium',
      maxCostPerRequest: 5.00,
      maxLatency: 60000
    },
    metadata: {
      requestId: 'req_' + Date.now(),
      userId: 'user_123',
      timestamp: new Date(),
      clientInfo: {
        userAgent: 'LexAI/1.0',
        sessionId: 'session_456'
      }
    }
  };

  try {
    // Primeiro, testa o roteamento
    console.log('1. Testando roteamento de LLM...');
    const routing = await testLLMRouting(input);
    console.log(`   LLM selecionado: ${routing.selectedLLM.provider}/${routing.selectedLLM.model}`);
    console.log(`   Confiança: ${(routing.confidence * 100).toFixed(1)}%`);
    console.log(`   Custo estimado: $${routing.estimatedCost.toFixed(4)}`);
    console.log(`   Latência estimada: ${routing.estimatedLatency}ms`);
    console.log(`   Justificativa: ${routing.reasoning}\n`);

    // Processa o documento
    console.log('2. Executando pipeline de geração...');
    const result = await generateDocument(input);

    if (result.success && result.result) {
      console.log('✅ Documento gerado com sucesso!\n');
      console.log('=== RESULTADO ===');
      console.log(`Tipo: ${result.result.documentType}`);
      console.log(`Confiança: ${(result.result.confidence * 100).toFixed(1)}%`);
      console.log(`Tempo de processamento: ${result.metadata.processingTime}ms`);
      console.log(`Custo total: $${result.metadata.totalCost.toFixed(4)}`);
      console.log(`Tokens utilizados: ${result.metadata.tokensUsed.totalTokens}`);
      console.log('\n=== CONTEÚDO DO DOCUMENTO ===');
      console.log(result.result.content.substring(0, 500) + '...');
      
      if (result.result.suggestions?.length) {
        console.log('\n=== SUGESTÕES ===');
        result.result.suggestions.forEach((suggestion, index) => {
          console.log(`${index + 1}. ${suggestion}`);
        });
      }

      console.log('\n=== TRACE DO PIPELINE ===');
      result.pipeline.stages.forEach(stage => {
        const status = stage.error ? '❌' : '✅';
        console.log(`${status} ${stage.stageName}: ${stage.duration}ms`);
      });

    } else {
      console.log('❌ Erro na geração do documento:');
      console.log(result.error?.message);
    }

  } catch (error) {
    console.error('❌ Erro inesperado:', error);
  }
}

/**
 * Exemplo de configuração customizada
 */
export async function exemploConfiguracaoCustomizada(): Promise<void> {
  console.log('\n=== EXEMPLO: Configuração Customizada ===\n');

  // Cria orquestrador com configuração personalizada
  const orchestrator = await AIOrchestrator.create({
    defaultRouting: {
      taskComplexity: 'high',
      qualityRequirement: 'premium',
      latencyRequirement: 'thorough',
      costBudget: 'high'
    },
    monitoring: {
      enableTracing: true,
      enableMetrics: true,
      logLevel: 'debug'
    }
  });

  // Exemplo de input para análise de contrato
  const input: ProcessingInput = {
    taskType: 'contract_review',
    documentType: 'contract',
    legalArea: 'corporate',
    instructions: 'Analisar contrato societário e identificar cláusulas problemáticas.',
    context: [
      {
        type: 'file_content',
        content: `
          CONTRATO SOCIAL - EMPRESA XYZ LTDA
          
          CLÁUSULA 1ª - A sociedade tem por objeto...
          CLÁUSULA 2ª - O capital social é de R$ 100.000,00...
          CLÁUSULA 3ª - A administração será exercida pelos sócios...
          
          [Documento simulado para exemplo]
        `,
        source: 'contrato_social.pdf'
      }
    ]
  };

  try {
    console.log('Processando análise de contrato...');
    const result = await orchestrator.processDocument(input);
    
    console.log(`Resultado: ${result.success ? 'Sucesso' : 'Erro'}`);
    console.log(`LLMs utilizados: ${result.metadata.llmUsed.length}`);
    
  } catch (error) {
    console.error('Erro:', error);
  }
}

/**
 * Exemplo de múltiplos documentos
 */
export async function exemploMultiplosDocumentos(): Promise<void> {
  console.log('\n=== EXEMPLO: Processamento de Múltiplos Documentos ===\n');

  const documentos = [
    {
      tipo: 'Notificação Extrajudicial',
      taskType: 'document_generation' as const,
      documentType: 'notification' as const,
      legalArea: 'civil' as const,
      instructions: 'Criar notificação para constituir devedor em mora.'
    },
    {
      tipo: 'Parecer Jurídico',
      taskType: 'legal_analysis' as const,
      documentType: 'legal_opinion' as const,
      legalArea: 'labor' as const,
      instructions: 'Analisar legalidade de dispensa por justa causa.'
    },
    {
      tipo: 'Resumo de Contrato',
      taskType: 'document_summary' as const,
      documentType: 'brief' as const,
      legalArea: 'corporate' as const,
      instructions: 'Resumir pontos principais do acordo comercial.'
    }
  ];

  for (const doc of documentos) {
    console.log(`\nProcessando: ${doc.tipo}`);
    
    const input: ProcessingInput = {
      taskType: doc.taskType,
      documentType: doc.documentType,
      legalArea: doc.legalArea,
      instructions: doc.instructions,
      context: [
        {
          type: 'file_content',
          content: `Conteúdo simulado para ${doc.tipo}`,
          source: `${doc.tipo.toLowerCase().replace(' ', '_')}.pdf`
        }
      ]
    };

    try {
      const routing = await testLLMRouting(input);
      console.log(`  LLM: ${routing.selectedLLM.provider}/${routing.selectedLLM.model}`);
      console.log(`  Custo estimado: $${routing.estimatedCost.toFixed(4)}`);
      
    } catch (error) {
      console.log(`  Erro: ${error instanceof Error ? error.message : 'Desconhecido'}`);
    }
  }
}

/**
 * Executa todos os exemplos
 */
export async function executarExemplos(): Promise<void> {
  console.log('🚀 DEMONSTRAÇÃO DO ORQUESTRADOR DE IA - LEXAI\n');
  console.log('='.repeat(60));

  await exemploGeracaoPeticao();
  await exemploConfiguracaoCustomizada();
  await exemploMultiplosDocumentos();

  console.log('\n' + '='.repeat(60));
  console.log('✅ Demonstração concluída!');
}

// Executa exemplos se executado diretamente
if (require.main === module) {
  executarExemplos().catch(console.error);
}