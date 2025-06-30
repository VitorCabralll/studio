/**
 * Cliente Mock do Google AI para testes sem API key
 */

import { BaseLLMClient, LLMRequest, LLMResponse, LLMClientOptions } from './base';

export class MockGoogleAIClient extends BaseLLMClient {
  constructor(options: LLMClientOptions) {
    super(options);
  }

  async generateText(request: LLMRequest): Promise<LLMResponse> {
    // Simula latência da API real
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));

    // Simula diferentes tipos de resposta baseado no prompt
    const prompt = request.messages[request.messages.length - 1]?.content || '';
    
    let content = '';
    
    if (prompt.includes('sumarize') || prompt.includes('resumir')) {
      content = `# Resumo do Documento

      **Fatos principais:**
      - Requerente solicita deferimento de pedido
      - Fundamentação baseada em jurisprudência consolidada
      - Documentos anexos comprovam a tese apresentada
      
      **Pontos de atenção:**
      - Prazo processual em andamento
      - Necessidade de fundamentação adicional
      
      **Recomendações:**
      - Incluir precedentes do STJ
      - Fortalecer argumentação constitucional`;
    
    } else if (prompt.includes('estrutura') || prompt.includes('structure')) {
      content = `{
        "titulo": "Petição Inicial - Ação [Tipo]",
        "secoes": [
          {
            "nome": "Qualificação das Partes",
            "subsecoes": ["Requerente", "Requerido"]
          },
          {
            "nome": "Dos Fatos",
            "subsecoes": ["Contexto", "Ocorrências Relevantes"]
          },
          {
            "nome": "Do Direito",
            "subsecoes": ["Fundamentação Legal", "Jurisprudência"]
          },
          {
            "nome": "Do Pedido",
            "subsecoes": ["Pedido Principal", "Pedidos Subsidiários"]
          }
        ]
      }`;
    
    } else if (prompt.includes('gerar') || prompt.includes('content')) {
      content = `**EXCELENTÍSSIMO SENHOR DOUTOR JUIZ DE DIREITO**

      **QUALIFICAÇÃO DAS PARTES**
      
      [NOME DO REQUERENTE], [qualificação completa], por seus advogados que ao final assinam, vem respeitosamente perante Vossa Excelência, com fundamento nos artigos pertinentes do Código de Processo Civil, propor a presente:
      
      **AÇÃO [TIPO DE AÇÃO]**
      
      em face de [NOME DO REQUERIDO], [qualificação], pelas razões de fato e de direito a seguir expostas:
      
      **DOS FATOS**
      
      O requerente encontra-se em situação que demanda a intervenção do Poder Judiciário, conforme detalhadamente exposto nos documentos anexos.
      
      **DO DIREITO**
      
      A pretensão encontra amparo legal nos dispositivos constitucionais e infraconstitucionais aplicáveis à espécie.
      
      **DO PEDIDO**
      
      Diante do exposto, requer-se:
      a) O deferimento do pedido principal;
      b) A condenação em custas e honorários.
      
      Termos em que pede deferimento.
      
      Local, data.
      
      [Assinatura do Advogado]`;
    
    } else {
      content = `Documento jurídico processado com sucesso utilizando IA do Google Gemini (modo demo).
      
      Esta é uma resposta simulada para fins de teste. O sistema está configurado corretamente e pronto para usar a API real quando a chave for fornecida.`;
    }

    // Simula métricas realistas
    const promptTokens = Math.floor(prompt.length / 4);
    const completionTokens = Math.floor(content.length / 4);
    const totalTokens = promptTokens + completionTokens;

    // Simula custo baseado no modelo
    const cost = this.calculateMockCost(request.model, totalTokens);

    return {
      content,
      finishReason: 'stop',
      usage: {
        promptTokens,
        completionTokens,
        totalTokens,
        cost,
      },
      model: request.model,
    };
  }

  private calculateMockCost(model: string, totalTokens: number): number {
    // Preços simulados baseados nos valores reais
    const pricing: Record<string, number> = {
      'gemini-1.5-pro': 0.002,      // $2 per 1M tokens (média)
      'gemini-1.5-flash': 0.0002,   // $0.2 per 1M tokens (média)
      'gemini-2.0-flash': 0.0002,   // $0.2 per 1M tokens (média)
    };

    const modelPricing = pricing[model] || pricing['gemini-1.5-pro'];
    return (totalTokens / 1000000) * modelPricing;
  }
}