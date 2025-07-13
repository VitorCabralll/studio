/**
 * Contextual Document Generation Flow
 * Gera documentos jurídicos com base em contexto e anexos
 */

export interface ContextualDocumentGenerationInput {
  outline: {
    title: string;
    sections: Array<{
      title: string;
      subsections?: string[];
      description?: string;
    }>;
  };
  context: string;
  attachments?: Array<{
    name: string;
    content: string;
    type: 'pdf' | 'doc' | 'image' | 'text';
  }>;
  style?: 'formal' | 'informal' | 'academic';
  targetAudience?: string;
  requirements?: string[];
}

export interface ContextualDocumentGenerationOutput {
  content: string;
  metadata: {
    wordCount: number;
    pageCount: number;
    generatedAt: Date;
    processingTime: number;
  };
  sections: Array<{
    title: string;
    content: string;
    wordCount: number;
  }>;
  references?: string[];
  quality: {
    score: number;
    factors: string[];
  };
}

/**
 * Gera documento jurídico contextualizado
 */
export async function contextualDocumentGeneration(
  input: ContextualDocumentGenerationInput
): Promise<ContextualDocumentGenerationOutput> {
  const startTime = Date.now();
  
  try {
    // TODO: Implementar integração com orquestrador de IA
    // Por enquanto, gera conteúdo básico baseado no outline
    
    const { outline, context, style = 'formal' } = input;
    
    // Gera seções baseadas no outline
    const generatedSections = await generateSections(outline, context, style);
    
    // Monta documento completo
    const fullContent = buildFullDocument(outline.title, generatedSections);
    
    // Calcula métricas
    const wordCount = countWords(fullContent);
    const pageCount = Math.ceil(wordCount / 250); // ~250 palavras por página
    
    const processingTime = Date.now() - startTime;
    
    return {
      content: fullContent,
      metadata: {
        wordCount,
        pageCount,
        generatedAt: new Date(),
        processingTime
      },
      sections: generatedSections,
      references: extractReferences(context),
      quality: {
        score: calculateQualityScore(generatedSections),
        factors: ['Estrutura adequada', 'Linguagem técnica', 'Fundamentação presente']
      }
    };
  } catch (error) {
    console.error('Erro na geração contextual do documento:', error);
    throw new Error('Falha na geração contextual do documento');
  }
}

async function generateSections(
  outline: ContextualDocumentGenerationInput['outline'],
  context: string,
  style: string
): Promise<Array<{ title: string; content: string; wordCount: number }>> {
  const sections = [];
  
  for (const section of outline.sections) {
    const content = await generateSectionContent(section, context, style);
    
    sections.push({
      title: section.title,
      content,
      wordCount: countWords(content)
    });
  }
  
  return sections;
}

async function generateSectionContent(
  section: { title: string; description?: string; subsections?: string[] },
  context: string,
  style: string
): Promise<string> {
  // TODO: Integrar com IA para geração real
  // Por enquanto, gera conteúdo template
  
  const { title, description, subsections } = section;
  
  let content = `## ${title}\n\n`;
  
  if (description) {
    content += `${description}\n\n`;
  }
  
  // Adiciona contexto relevante
  content += `Considerando o contexto: ${context.substring(0, 200)}...\n\n`;
  
  // Gera subsections se existirem
  if (subsections && subsections.length > 0) {
    for (const subsection of subsections) {
      content += `### ${subsection}\n\n`;
      content += generateSubsectionContent(subsection, style);
      content += '\n\n';
    }
  } else {
    content += generateSectionText(title, style);
  }
  
  return content;
}

function generateSubsectionContent(subsectionTitle: string, style: string): string {
  // Gera conteúdo básico para subseção
  const templates = {
    formal: `Em relação a ${subsectionTitle.toLowerCase()}, cumpre destacar que a análise jurídica demonstra...`,
    informal: `Sobre ${subsectionTitle.toLowerCase()}, podemos observar que...`,
    academic: `No que tange a ${subsectionTitle.toLowerCase()}, a doutrina estabelece que...`
  };
  
  return templates[style as keyof typeof templates] || templates.formal;
}

function generateSectionText(title: string, style: string): string {
  // Gera texto base para seção
  const templates = {
    formal: `No que se refere a ${title.toLowerCase()}, impende salientar que os aspectos jurídicos envolvidos requerem análise detalhada...`,
    informal: `Em relação a ${title.toLowerCase()}, é importante considerar os seguintes pontos...`,
    academic: `Quanto a ${title.toLowerCase()}, a literatura jurídica especializada aponta que...`
  };
  
  return templates[style as keyof typeof templates] || templates.formal;
}

function buildFullDocument(title: string, sections: Array<{ title: string; content: string }>): string {
  let document = `# ${title}\n\n`;
  
  // Adiciona data
  document += `*Documento gerado em ${new Date().toLocaleDateString('pt-BR')}*\n\n`;
  
  // Adiciona seções
  for (const section of sections) {
    document += section.content + '\n\n';
  }
  
  return document;
}

function countWords(text: string): number {
  return text.trim().split(/\s+/).length;
}

function extractReferences(context: string): string[] {
  // Extrai possíveis referências do contexto
  const references = [];
  
  // Busca por leis (padrão Lei nº X/YYYY)
  const lawPattern = /Lei\s+n[ºo°]?\s*[\d.]+\/\d{4}/gi;
  const laws = context.match(lawPattern);
  if (laws) references.push(...laws);
  
  // Busca por artigos
  const articlePattern = /art\.?\s*\d+/gi;
  const articles = context.match(articlePattern);
  if (articles) references.push(...articles.slice(0, 5)); // Limita a 5
  
  return [...new Set(references)]; // Remove duplicatas
}

function calculateQualityScore(sections: Array<{ content: string }>): number {
  let score = 0;
  
  // Pontuação baseada em fatores de qualidade
  const totalWords = sections.reduce((acc, s) => acc + countWords(s.content), 0);
  
  // Tamanho adequado (500-3000 palavras = score máximo)
  if (totalWords >= 500 && totalWords <= 3000) score += 30;
  else if (totalWords >= 200) score += 20;
  
  // Número de seções adequado
  if (sections.length >= 3 && sections.length <= 8) score += 25;
  
  // Consistência nas seções
  const avgWordsPerSection = totalWords / sections.length;
  if (avgWordsPerSection >= 100 && avgWordsPerSection <= 500) score += 25;
  
  // Estrutura básica presente
  score += 20; // Sempre presente no template
  
  return Math.min(100, score);
}