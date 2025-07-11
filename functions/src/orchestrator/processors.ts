/**
 * Processadores específicos para cada estágio do pipeline
 * Implementa a lógica de cada etapa da geração de documentos
 */

import { createLLMClient } from './clients';
import {
  PipelineProcessor,
  PipelineContext,
  ProcessingInput,
  LLMResponse
} from './types';

/**
 * Classe base para processadores com funcionalidade comum de LLM
 */
abstract class BaseLLMProcessor implements PipelineProcessor {
  abstract process(input: any, context: PipelineContext): Promise<any>;

  protected async callLLM(
    prompt: string, 
    context: PipelineContext, 
    criteria?: any
  ): Promise<LLMResponse> {
    const { isProviderAvailable } = await import('./clients');
    const { DOCUMENT_TYPE_CONFIGS } = await import('./config');
    
    const documentConfig = context.input.documentType && 
      context.input.documentType in DOCUMENT_TYPE_CONFIGS ? 
      DOCUMENT_TYPE_CONFIGS[context.input.documentType as keyof typeof DOCUMENT_TYPE_CONFIGS] : null;
    
    // Escolhe provider baseado na disponibilidade
    let provider: 'google' | 'openai' = 'google';
    let model = criteria?.preferredModel || documentConfig?.preferredModel || 'gemini-1.5-pro';
    
    // Se Google AI não disponível, usa OpenAI
    if (!isProviderAvailable('google') && isProviderAvailable('openai')) {
      provider = 'openai';
      model = documentConfig?.fallbackModel || 'gpt-4o';
    } else if (!isProviderAvailable('google') && !isProviderAvailable('openai')) {
      throw new Error('Nenhum provider de IA disponível. Verifique as API keys.');
    }

    const apiKeyEnv = provider === 'google' ? 'GOOGLE_AI_API_KEY' : 'OPENAI_API_KEY';
    const apiKey = process.env[apiKeyEnv];
    
    if (!apiKey) {
      throw new Error(`API key não encontrada para ${provider}`);
    }

    const client = createLLMClient(provider, {
      apiKey,
      timeout: 30000
    });

    return await client.generateText({
      model,
      messages: [
        { role: 'system', content: 'Você é um assistente jurídico especializado em análise de documentos brasileiros.' },
        { role: 'user', content: prompt }
      ],
      maxTokens: criteria?.maxTokens || 2000,
      temperature: criteria?.temperature || 0.3
    });
  }
}

/**
 * Processador de Sumarização - Etapa 1
 * Extrai fatos principais dos documentos anexados
 */
export class SummarizationProcessor extends BaseLLMProcessor {
  async process(input: any, context: PipelineContext): Promise<string> {
    const processingInput = context.input;
    
    // Extrai conteúdo OCR dos anexos
    const ocrContent = processingInput.context
      .filter(item => item.type === 'ocr_text' || item.type === 'file_content')
      .map(item => item.content)
      .join('\n\n');

    if (!ocrContent.trim()) {
      return 'Nenhum conteúdo encontrado nos documentos anexados.';
    }

    // Seleciona LLM para sumarização (tarefa simples, modelo barato)
    context.config.pipeline.find(p => p.name === 'summarization');
    
    const prompt = this.buildSummarizationPrompt(ocrContent, processingInput);
    
    // Simula chamada para LLM (implementação real faria chamada HTTP)
    const response = await this.callLLM(prompt, context, {
      preferredModel: 'gemini-1.5-flash', // Rápido para sumarização
      maxTokens: 1500,
      temperature: 0.2
    });
    
    return response.content;
  }

  private buildSummarizationPrompt(content: string, input: ProcessingInput): string {
    return `
Como especialista em Direito ${input.legalArea || 'geral'}, analise os documentos fornecidos e extraia:

1. FATOS PRINCIPAIS: Eventos, datas, pessoas envolvidas
2. QUESTÕES JURÍDICAS: Problemas legais identificados  
3. PEDIDOS/REQUERIMENTOS: O que está sendo solicitado
4. DOCUMENTOS RELEVANTES: Contratos, certidões, comprovantes mencionados

DOCUMENTOS PARA ANÁLISE:
${content}

INSTRUÇÕES ESPECÍFICAS:
${input.instructions}

Resposta deve ser objetiva, factual e estruturada para uso em ${input.documentType}.
`;
  }
}

/**
 * Processador de Análise de Contexto - Etapa 2
 * Analisa instruções específicas e arquivos auxiliares
 */
export class ContextAnalysisProcessor extends BaseLLMProcessor {
  async process(input: any, context: PipelineContext): Promise<any> {
    const processingInput = context.input;
    const summary = input; // Recebe resultado da sumarização
    
    // Extrai instruções específicas e arquivos auxiliares
    const instructions = processingInput.instructions;
    const auxiliaryContent = processingInput.context
      .filter(item => item.type === 'legal_precedent' || item.type === 'template')
      .map(item => item.content)
      .join('\n\n');

    const prompt = this.buildContextPrompt(summary, instructions, auxiliaryContent, processingInput);
    const response = await this.callLLM(prompt, context, {
      preferredModel: 'gemini-1.5-pro', // Qualidade para análise jurídica
      maxTokens: 2000,
      temperature: 0.3
    });
    
    return {
      keyPoints: response.content,
      priorityAreas: this.extractPriorityAreas(response.content),
      legalStrategy: this.extractLegalStrategy(response.content)
    };
  }

  private buildContextPrompt(summary: string, instructions: string, auxiliary: string, input: ProcessingInput): string {
    return `
Baseado na sumarização dos fatos e nas instruções específicas, identifique:

1. PONTOS PRIORITÁRIOS: Aspectos que devem ser enfatizados
2. ESTRATÉGIA JURÍDICA: Linha argumentativa principal
3. FUNDAMENTAÇÃO: Leis, artigos e precedentes aplicáveis
4. TESE PRINCIPAL: Argumento central do documento

SUMARIZAÇÃO DOS FATOS:
${summary}

INSTRUÇÕES ESPECÍFICAS:
${instructions}

MATERIAL AUXILIAR:
${auxiliary}

TIPO DE DOCUMENTO: ${input.documentType}
ÁREA JURÍDICA: ${input.legalArea}

Forneça análise estratégica para orientar a geração do documento.
`;
  }

  private extractPriorityAreas(content: string): string[] {
    // Lógica simples para extrair áreas prioritárias
    const priorities = content.match(/\d+\.\s*([^:\n]+)/g) || [];
    return priorities.map(p => p.replace(/\d+\.\s*/, '').trim()).slice(0, 5);
  }

  private extractLegalStrategy(content: string): string {
    // Extrai estratégia principal
    const strategyMatch = content.match(/ESTRATÉGIA JURÍDICA[:\s]*([^\.]+)/i);
    return strategyMatch ? strategyMatch[1].trim() : 'Estratégia padrão baseada nos fatos apresentados';
  }

}

/**
 * Processador de Definição de Estrutura - Etapa 3
 * Define a estrutura do documento baseada no template
 */
export class StructureDefinitionProcessor extends BaseLLMProcessor {
  async process(input: any, context: PipelineContext): Promise<any> {
    const processingInput = context.input;
    const contextAnalysis = input;
    
    // Extrai template se disponível
    const template = processingInput.context
      .find(item => item.type === 'template')?.content || '';

    const prompt = this.buildStructurePrompt(contextAnalysis, template, processingInput);
    const response = await this.callLLM(prompt, context, {
      preferredModel: 'gemini-1.5-flash', // Eficiente para estrutura
      maxTokens: 1500,
      temperature: 0.1
    });
    
    return {
      sections: this.extractSections(response.content),
      outline: response.content,
      sectionOrder: this.defineSectionOrder(processingInput.documentType)
    };
  }

  private buildStructurePrompt(analysis: any, template: string, input: ProcessingInput): string {
    return `
Defina a estrutura detalhada para ${input.documentType} baseada na análise:

ANÁLISE CONTEXTUAL:
${JSON.stringify(analysis, null, 2)}

TEMPLATE DISPONÍVEL:
${template}

Crie estrutura com:
1. SEÇÕES PRINCIPAIS: Cabeçalho, fundamentação, conclusão, etc.
2. SUBSEÇÕES: Divisões internas de cada seção
3. ORDEM LÓGICA: Sequência de apresentação
4. CONTEÚDO ESPERADO: O que incluir em cada seção

TIPO: ${input.documentType}
ÁREA: ${input.legalArea}

Forneça estrutura clara e hierárquica.
`;
  }

  private extractSections(content: string): string[] {
    // Extrai seções do conteúdo
    const sections = content.match(/\d+\.\s*([A-ZÁÉÍÓÚÇ][^:\n]+)/g) || [];
    return sections.map(s => s.replace(/\d+\.\s*/, '').trim());
  }

  private defineSectionOrder(documentType: string): string[] {
    const defaultOrder = ['header', 'introduction', 'facts', 'legal_basis', 'conclusion', 'footer'];
    
    const orderMap: Record<string, string[]> = {
      petition: ['header', 'parties', 'facts', 'legal_basis', 'requests', 'conclusion'],
      contract: ['header', 'parties', 'definitions', 'obligations', 'conditions', 'signatures'],
      legal_opinion: ['header', 'summary', 'analysis', 'legal_basis', 'conclusion', 'recommendations']
    };

    return orderMap[documentType] || defaultOrder;
  }

}

/**
 * Processador de Geração de Conteúdo - Etapa 4
 * Gera conteúdo para cada seção usando LLM premium
 */
export class ContentGenerationProcessor extends BaseLLMProcessor {
  async process(input: any, context: PipelineContext): Promise<any> {
    // Obtém structure dos resultados intermediários ou usa input direto
    const structure = context.intermediateResults['structure_definition'] || input;
    const sections: Record<string, string> = {};
    
    // Validação melhorada: aceita diferentes formatos de estrutura
    let sectionsToProcess: string[] = [];
    
    if (structure?.sections && Array.isArray(structure.sections)) {
      sectionsToProcess = structure.sections;
    } else if (Array.isArray(structure)) {
      sectionsToProcess = structure;
    } else if (typeof structure === 'object' && structure?.outline) {
      // Extrai seções do outline se disponível
      sectionsToProcess = this.extractSectionsFromOutline(structure.outline);
    } else {
      // Fallback para seções padrão
      sectionsToProcess = ['introdução', 'desenvolvimento', 'conclusão'];
    }
    
    if (sectionsToProcess.length === 0) {
      throw new Error('Nenhuma seção válida encontrada para processamento');
    }
    
    // Gera conteúdo para cada seção
    for (const section of sectionsToProcess) {
      const prompt = this.buildSectionPrompt(section, context);
      const response = await this.callLLM(prompt, context, {
        preferredModel: 'gemini-1.5-pro', // Máxima qualidade para conteúdo
        maxTokens: 3000,
        temperature: 0.4
      });
      sections[section] = response.content;
      
      // Pequeno delay entre seções
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    return sections;
  }
  
  private extractSectionsFromOutline(outline: string): string[] {
    // Extrai seções de um outline de texto
    const matches = outline.match(/\d+\.[\s]*([^:\n]+)/g) || [];
    return matches.map(match => 
      match.replace(/\d+\.[\s]*/, '').trim()
    ).filter(section => section.length > 0);
  }

  private buildSectionPrompt(section: string, context: PipelineContext): string {
    const { input } = context;
    const summary = context.intermediateResults['summarization'] || '';
    const analysis = context.intermediateResults['context_analysis'] || {};
    
    return `
Redija a seção "${section}" para ${input.documentType} em ${input.legalArea}.

CONTEXTO DOS FATOS:
${summary}

ESTRATÉGIA JURÍDICA:
${JSON.stringify(analysis, null, 2)}

INSTRUÇÕES ESPECÍFICAS:
${input.instructions}

REQUISITOS:
- Linguagem técnica jurídica apropriada
- Fundamentação legal sólida
- Argumentação persuasiva
- Formatação adequada para documento oficial
- Citação de leis e precedentes quando relevante

Redija apenas o conteúdo desta seção, sem cabeçalhos ou numeração.
`;
  }

}

/**
 * Processador de Montagem Final - Etapa 5
 * Une todas as seções no documento final
 */
export class AssemblyProcessor implements PipelineProcessor {
  async process(input: any, context: PipelineContext): Promise<string> {
    const sections = input;
    const structure = context.intermediateResults['structure_definition'];
    
    // Monta documento seguindo a ordem definida
    const sectionOrder = structure?.sectionOrder || Object.keys(sections);
    
    let document = '';
    
    for (const sectionName of sectionOrder) {
      if (sections[sectionName]) {
        document += `\n\n## ${this.formatSectionTitle(sectionName)}\n\n`;
        document += sections[sectionName];
      }
    }
    
    // Adiciona cabeçalho e rodapé padrão
    const header = this.generateHeader(context.input);
    const footer = this.generateFooter();
    
    return `${header}\n\n${document.trim()}\n\n${footer}`;
  }

  private formatSectionTitle(sectionName: string): string {
    const titleMap: Record<string, string> = {
      header: 'CABEÇALHO',
      parties: 'DAS PARTES',
      facts: 'DOS FATOS',
      legal_basis: 'DO DIREITO',
      requests: 'DOS PEDIDOS',
      conclusion: 'CONCLUSÃO',
      recommendations: 'RECOMENDAÇÕES'
    };
    
    return titleMap[sectionName] || sectionName.toUpperCase().replace('_', ' ');
  }

  private generateHeader(input: ProcessingInput): string {
    const today = new Date().toLocaleDateString('pt-BR');
    
    return `DOCUMENTO GERADO AUTOMATICAMENTE
Tipo: ${input.documentType.toUpperCase()}
Área: ${input.legalArea?.toUpperCase() || 'GERAL'}
Data: ${today}

---`;
  }

  private generateFooter(): string {
    return `---

Este documento foi gerado automaticamente pelo LexAI.
Recomenda-se revisão jurídica antes da utilização.`;
  }

  validate(input: any): boolean {
    return typeof input === 'object' && Object.keys(input).length > 0;
  }

  transform(output: any): string {
    return typeof output === 'string' ? output : JSON.stringify(output);
  }
}