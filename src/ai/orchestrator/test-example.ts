/**
 * Exemplo de teste do Orquestrador LexAI
 * Script para testar o funcionamento do pipeline
 */

import { config } from 'dotenv';
config({ path: '.env.local' });

import { DEFAULT_ORCHESTRATOR_CONFIG } from './config';
import { DocumentPipeline } from './pipeline';
import { ProcessingInput } from './types';

async function testOrchestrator() {
  console.log('🧠 Testando Orquestrador LexAI - APENAS GOOGLE AI...\n');
  
  // Verifica se a chave do Google AI está configurada
  if (!process.env.GOOGLE_AI_API_KEY) {
    console.error('❌ GOOGLE_AI_API_KEY não configurada!');
    console.log('💡 Configure a variável de ambiente GOOGLE_AI_API_KEY');
    return;
  }
  
  console.log('✅ Google AI API Key configurada');

  // Cria pipeline com configuração padrão
  const pipeline = new DocumentPipeline(DEFAULT_ORCHESTRATOR_CONFIG);

  // Input de exemplo para geração de petição
  const testInput: ProcessingInput = {
    taskType: 'document_generation',
    documentType: 'petition',
    legalArea: 'civil',
    instructions: `
Elaborar petição inicial de ação de indenização por danos morais.
Enfatizar a responsabilidade objetiva do requerido.
Incluir fundamentação baseada no CDC e Constituição Federal.
`,
    context: [
      {
        type: 'ocr_text',
        content: `
RELATÓRIO DE ACIDENTE
Data: 15/01/2024
Local: Supermercado ABC
Descrição: Cliente escorregou em piso molhado sem sinalização
Lesões: Fratura no punho direito
Testemunhas: João Silva (funcionário), Maria Santos (cliente)
Valor médico: R$ 3.500,00
Afastamento: 30 dias
`,
        source: 'relatorio_acidente.pdf'
      },
      {
        type: 'template',
        content: `
MODELO DE PETIÇÃO INICIAL

Exmo. Sr. Dr. Juiz de Direito da [Vara]

[REQUERENTE], [qualificação], vem respeitosamente à presença de Vossa Excelência, por meio de seu advogado que esta subscreve, propor a presente:

AÇÃO DE INDENIZAÇÃO POR DANOS MORAIS E MATERIAIS

em face de [REQUERIDO], [qualificação], pelos fatos e fundamentos jurídicos que passa a expor:

I - DOS FATOS
[Narrativa dos fatos]

II - DO DIREITO
[Fundamentação jurídica]

III - DOS PEDIDOS
[Pedidos específicos]

Nestes termos, pede deferimento.
[Local], [data]
[Assinatura do advogado]
`,
        source: 'template_peticao.docx'
      }
    ]
  };

  try {
    console.log('📝 Iniciando processamento...');
    const startTime = Date.now();

    const result = await pipeline.process(testInput);

    const endTime = Date.now();
    const duration = endTime - startTime;

    console.log('\n✅ Processamento concluído!');
    console.log(`⏱️  Tempo total: ${duration}ms`);
    
    console.log('\n📄 DOCUMENTO GERADO:');
    console.log('='.repeat(50));
    console.log(result.result?.content || 'Nenhum documento gerado');
    console.log('='.repeat(50));

    console.log('\n📈 MÉTRICAS:');
    console.log(`📊 Sucesso: ${result.success}`);
    console.log(`📊 Pipeline: ${result.pipeline.stages.length} etapas`);
    console.log(`⏱️  Pipeline total: ${result.pipeline.totalDuration}ms`);
    console.log(`💰 Custo total: $${result.pipeline.totalCost.toFixed(4)}`);
    console.log(`🔢 Tokens totais: ${result.pipeline.totalTokens}`);

  } catch (error) {
    console.error('❌ Erro durante processamento:', error);
    
    if (error instanceof Error) {
      if (error.message.includes('API key')) {
        console.log('\n💡 DICA: Verifique a chave do Google AI:');
        console.log('   - GOOGLE_AI_API_KEY deve estar em .env.local');
        console.log('   - Chave atual:', process.env.GOOGLE_AI_API_KEY ? 'Configurada' : 'Não configurada');
      }
    }
  }
}

// Executa teste se arquivo for executado diretamente
if (require.main === module) {
  testOrchestrator().catch(console.error);
}

export { testOrchestrator };