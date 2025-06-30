/**
 * API Route para listar agentes disponíveis
 */

import { NextResponse } from 'next/server';

interface Agent {
  id: string;
  name: string;
  description: string;
  legalArea: string;
  strengths: string[];
  documentTypes: string[];
  recommended: boolean;
}

interface AgentsResponse {
  agents: Agent[];
  default: string;
}

export async function GET(): Promise<NextResponse<AgentsResponse>> {
  // Informações dos agentes baseadas no wizard existente
  const agents: Agent[] = [
    {
      id: 'geral',
      name: 'Agente Geral',
      description: 'Especialista em documentos jurídicos diversos, ideal para casos gerais.',
      legalArea: 'civil',
      strengths: ['Versatilidade', 'Linguagem clara', 'Estrutura sólida'],
      documentTypes: ['petition', 'brief', 'notification', 'motion'],
      recommended: true
    },
    {
      id: 'civil',
      name: 'Agente de Direito Civil',
      description: 'Focado em contratos, responsabilidade civil e direitos reais.',
      legalArea: 'civil',
      strengths: ['Contratos', 'Responsabilidade civil', 'Direitos reais'],
      documentTypes: ['contract', 'petition', 'legal_opinion'],
      recommended: false
    },
    {
      id: 'stj',
      name: 'Agente de Jurisprudência (STJ)',
      description: 'Especializado em jurisprudência e precedentes do STJ.',
      legalArea: 'constitutional',
      strengths: ['Jurisprudência', 'Precedentes', 'Fundamentação sólida'],
      documentTypes: ['legal_opinion', 'petition', 'brief'],
      recommended: false
    }
  ];

  return NextResponse.json({
    agents,
    default: 'geral'
  });
}