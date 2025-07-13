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
  RoutingCriteria,
  ContextAnalysisResult,
  StructureDefinition,
  ProcessingResult
} from './types';

/**
 * Classe base para processadores com funcionalidade comum de LLM
 */
abstract class BaseLLMProcessor implements PipelineProcessor {
  abstract process(input: ProcessingInput, context: PipelineContext): Promise<ProcessingResult>;

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
  async process(_input: ProcessingInput, context: PipelineContext): Promise<string> {
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
  async process(_input: ProcessingInput, context: PipelineContext): Promise<ContextAnalysisResult> {
    const processingInput = context.input;
    
    // Extrai instruções específicas e arquivos auxiliares
    const instructions = processingInput.instructions;
    const auxiliaryContent = processingInput.context
      .filter(item => item.type === 'legal_precedent' || item.type === 'template')
      .map(item => item.content)
      .join('\n\n');

    const summary = (context.intermediateResults['summarization'] as string) || '';
    const prompt = this.buildContextPrompt(summary, instructions, auxiliaryContent, processingInput);
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
      mainTopics: this.extractMainTopics(response.content),
      legalAreas: [processingInput.legalArea || 'civil'],
      documentTypes: [processingInput.documentType],
      keyEntities: this.extractKeyEntities(response.content),
      confidence: 0.8
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

  private extractMainTopics(content: string): string[] {
    // Lógica simples para extrair tópicos principais
    const topics = content.match(/\d+\.\s*([^:\n]+)/g) || [];
    return topics.map(p => p.replace(/\d+\.\s*/, '').trim()).slice(0, 5);
  }

  private extractKeyEntities(content: string): string[] {
    // Extrai entidades principais
    const entities = content.match(/([A-Z][a-z]+(\s+[A-Z][a-z]+)*)/g) || [];
    return [...new Set(entities)].slice(0, 10);
  }

}

/**
 * Processador de Definição de Estrutura - Etapa 3
 * Define a estrutura do documento baseada no template
 */
export class StructureDefinitionProcessor extends BaseLLMProcessor {
  async process(_input: ProcessingInput, context: PipelineContext): Promise<StructureDefinition> {
    const processingInput = context.input;
    
    // Extrai template se disponível
    const template = processingInput.context
      .find(item => item.type === 'template')?.content || '';

    const contextAnalysisResult = context.intermediateResults['context_analysis'] as ContextAnalysisResult;
    const prompt = this.buildStructurePrompt(contextAnalysisResult, template, processingInput);
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
      format: processingInput.preferences?.outputFormat || 'formal',
      estimatedLength: this.estimateLength(response.content)
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

  private extractSections(content: string): Array<{ name: string; description: string; required: boolean }> {
    // Extrai seções do conteúdo
    const sections = content.match(/\d+\.\s*([A-ZÁÉÍÓÚÇ][^:\n]+)/g) || [];
    return sections.map(s => ({
      name: s.replace(/\d+\.\s*/, '').trim(),
      description: 'Seção do documento',
      required: true
    }));
  }

  private estimateLength(content: string): number {
    // Estima tamanho baseado no conteúdo
    return Math.max(1000, content.length * 3);
  }


}

/**
 * Processador de Geração de Conteúdo - Etapa 4
 * Gera conteúdo para cada seção usando LLM premium
 */
export class ContentGenerationProcessor extends BaseLLMProcessor {
  async process(input: ProcessingInput, context: PipelineContext): Promise<Record<string, string>> {
    // Corrigido: obter structure dos resultados intermediários
    const structure = context.intermediateResults['structure_definition'];
    const sections: Record<string, string> = {};
    
    // Validação: garantir que structure.sections existe e é iterável
    if (!structure || typeof structure !== 'object' || !('sections' in structure) || !Array.isArray((structure as StructureDefinition).sections)) {
      throw new Error('Invalid structure: sections not found or not iterable');
    }
    
    // Gera conteúdo para cada seção
    const structureDef = structure as StructureDefinition;
    if (structureDef?.sections) {
      for (const section of structureDef.sections) {
        const sectionName = typeof section === 'string' ? section : section.name;
        const prompt = this.buildSectionPrompt(sectionName, context);
        const response = await this.callLLM(prompt, context, {
          preferredModel: 'gemini-1.5-pro', // Máxima qualidade para conteúdo
          maxTokens: 3000,
          taskComplexity: 'high',
          qualityRequirement: 'premium',
          latencyRequirement: 'thorough',
          costBudget: 'high',
          temperature: 0.4
        });
        sections[sectionName] = response.content;
        
        // Pequeno delay entre seções
        await new Promise(resolve => setTimeout(resolve, 500));
      }
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
  async process(_input: ProcessingInput, context: PipelineContext): Promise<string> {
    
    // Monta documento seguindo a estrutura definida
    const structureDef = context.intermediateResults['structure'] as StructureDefinition;
    const sectionContent = context.intermediateResults['sections'] as Record<string, string>;
    
    let document = '';
    
    if (structureDef?.sections) {
      for (const section of structureDef.sections) {
        const sectionName = typeof section === 'string' ? section : section.name;
        if (sectionContent[sectionName]) {
          document += `\n\n## ${this.formatSectionTitle(sectionName)}\n\n`;
          document += sectionContent[sectionName];
        }
      }
    } else {
      // Fallback para caso estrutura não esteja definida
      for (const [sectionName, content] of Object.entries(sectionContent)) {
        document += `\n\n## ${this.formatSectionTitle(sectionName)}\n\n`;
        document += content;
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

  validate(input: ProcessingInput): boolean {
    return typeof input === 'object' && input !== null;
  }

  transform(output: ProcessingResult): ProcessingResult {
    return typeof output === 'string' ? output : JSON.stringify(output);
  }
}