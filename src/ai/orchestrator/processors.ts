/**
 * Processadores específicos para cada estágio do pipeline
 * Implementa a lógica de cada etapa da geração de documentos
 */

import { createLLMClient } from './clients';
import {
  PipelineProcessor,
  PipelineContext,
  ProcessingInput,
  LLMResponse,
  RoutingCriteria
} from './types';

interface ContextAnalysisResult {
  keyPoints: string;
  priorityAreas: string[];
  legalStrategy: string;
}

interface StructureDefinition {
  sections: string[];
  outline: string;
  sectionOrder: string[];
}

/**
 * Classe base para processadores com funcionalidade comum de LLM
 */
abstract class BaseLLMProcessor implements PipelineProcessor {
  abstract process(input: unknown, context: PipelineContext): Promise<unknown>;

  protected async callLLM(
    prompt: string, 
    context: PipelineContext, 
    criteria?: RoutingCriteria & { preferredModel?: string; maxTokens?: number }
  ): Promise<LLMResponse> {
    // FORÇA O USO APENAS DO GOOGLE AI
    const { DOCUMENT_TYPE_CONFIGS } = await import('./config');
    const documentConfig = context.input.documentType && 
      context.input.documentType in DOCUMENT_TYPE_CONFIGS ? 
      DOCUMENT_TYPE_CONFIGS[context.input.documentType as keyof typeof DOCUMENT_TYPE_CONFIGS] : null;
    
    // Determina qual modelo Gemini usar
    const model = criteria?.preferredModel || 
                  documentConfig?.preferredModel || 
                  (criteria?.qualityRequirement === 'premium' ? 'gemini-1.5-pro' : 'gemini-1.5-flash');

    const client = createLLMClient('google', {
      apiKey: process.env.GOOGLE_AI_API_KEY || '',
      timeout: 30000
    });

    return client.generateText({
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
  async process(input: unknown, context: PipelineContext): Promise<string> {
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
      taskComplexity: 'low',
      qualityRequirement: 'standard',
      latencyRequirement: 'fast',
      costBudget: 'low',
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
  async process(input: unknown, context: PipelineContext): Promise<ContextAnalysisResult> {
    const processingInput = context.input;
    const summary = input; // Recebe resultado da sumarização
    
    // Extrai instruções específicas e arquivos auxiliares
    const instructions = processingInput.instructions;
    const auxiliaryContent = processingInput.context
      .filter(item => item.type === 'legal_precedent' || item.type === 'template')
      .map(item => item.content)
      .join('\n\n');

    const prompt = this.buildContextPrompt(summary as string, instructions, auxiliaryContent, processingInput);
    const response = await this.callLLM(prompt, context, {
      preferredModel: 'gemini-1.5-pro', // Qualidade para análise jurídica
      maxTokens: 2000,
      taskComplexity: 'medium',
      qualityRequirement: 'standard',
      latencyRequirement: 'balanced',
      costBudget: 'medium',
      temperature: 0.3
    });
    
    return {
      keyPoints: response.content,
      priorityAreas: this.extractPriorityAreas(response.content),
      legalStrategy: this.extractLegalStrategy(response.content)
    } as ContextAnalysisResult;
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
  async process(input: unknown, context: PipelineContext): Promise<StructureDefinition> {
    const processingInput = context.input;
    const contextAnalysis = input;
    
    // Extrai template se disponível
    const template = processingInput.context
      .find(item => item.type === 'template')?.content || '';

    const prompt = this.buildStructurePrompt(contextAnalysis as ContextAnalysisResult, template, processingInput);
    const response = await this.callLLM(prompt, context, {
      preferredModel: 'gemini-1.5-flash', // Eficiente para estrutura
      maxTokens: 1500,
      taskComplexity: 'low',
      qualityRequirement: 'standard',
      latencyRequirement: 'fast',
      costBudget: 'low',
      temperature: 0.1
    });
    
    return {
      sections: this.extractSections(response.content),
      outline: response.content,
      sectionOrder: this.defineSectionOrder(processingInput.documentType)
    } as StructureDefinition;
  }

  private buildStructurePrompt(analysis: ContextAnalysisResult, template: string, input: ProcessingInput): string {
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
  async process(input: unknown, context: PipelineContext): Promise<Record<string, string>> {
    // Corrigido: obter structure dos resultados intermediários
    const structure = context.intermediateResults['structure_definition'];
    const sections: Record<string, string> = {};
    
    // Validação: garantir que structure.sections existe e é iterável
    if (!structure || typeof structure !== 'object' || !('sections' in structure) || !Array.isArray((structure as any).sections)) {
      throw new Error('Invalid structure: sections not found or not iterable');
    }
    
    // Gera conteúdo para cada seção
    for (const section of (structure as any).sections) {
      const prompt = this.buildSectionPrompt(section, context);
      const response = await this.callLLM(prompt, context, {
        preferredModel: 'gemini-1.5-pro', // Máxima qualidade para conteúdo
        maxTokens: 3000,
        taskComplexity: 'high',
        qualityRequirement: 'premium',
        latencyRequirement: 'thorough',
        costBudget: 'high',
        temperature: 0.4
      });
      sections[section] = response.content;
      
      // Pequeno delay entre seções
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    return sections;
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
  async process(input: unknown, context: PipelineContext): Promise<string> {
    const sections = input;
    const structure = context.intermediateResults['structure_definition'];
    
    // Monta documento seguindo a ordem definida
    const sectionOrder = (structure as any)?.sectionOrder || Object.keys(sections as object);
    
    let document = '';
    
    for (const sectionName of sectionOrder) {
      if ((sections as any)[sectionName]) {
        document += `\n\n## ${this.formatSectionTitle(sectionName)}\n\n`;
        document += (sections as any)[sectionName];
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

  validate(input: unknown): boolean {
    return typeof input === 'object' && input !== null && Object.keys(input).length > 0;
  }

  transform(output: unknown): string {
    return typeof output === 'string' ? output : JSON.stringify(output);
  }
}