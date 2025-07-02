/**
 * API Route para listar agentes disponíveis
 */

import { NextRequest, NextResponse } from 'next/server';
import { agentService } from '@/services/agent-service';
import { getAdminAuth, isAdminConfigured } from '@/lib/firebase-admin';

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
  error?: string;
}

export async function GET(request: NextRequest): Promise<NextResponse<AgentsResponse>> {
  try {
    // Verificar autenticação
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({
        agents: [],
        default: '',
        error: 'Token de autenticação necessário'
      }, { status: 401 });
    }

    const token = authHeader.split('Bearer ')[1];
    
    const adminAuth = getAdminAuth();
    if (!isAdminConfigured() || !adminAuth) {
      return NextResponse.json({
        agents: [],
        default: '',
        error: 'Serviço de autenticação não disponível'
      }, { status: 503 });
    }
    
    const decodedToken = await adminAuth.verifyIdToken(token);
    const userId = decodedToken.uid;

    // Obter workspaceId dos query parameters
    const { searchParams } = new URL(request.url);
    const workspaceId = searchParams.get('workspaceId');
    
    if (!workspaceId) {
      return NextResponse.json({
        agents: [],
        default: '',
        error: 'WorkspaceId é obrigatório'
      }, { status: 400 });
    }

    // Buscar agentes reais do workspace
    const result = await agentService.getWorkspaceAgents(workspaceId);
    
    if (!result.success) {
      return NextResponse.json({
        agents: [],
        default: '',
        error: result.error || 'Erro ao carregar agentes'
      }, { status: 500 });
    }

    // Converter para formato da API
    const agents: Agent[] = result.agents?.map(agent => ({
      id: agent.id,
      name: agent.name,
      description: agent.description || `Especialista em ${agent.legalArea}`,
      legalArea: agent.legalArea,
      strengths: [agent.legalArea, 'IA Personalizada', 'Documentos Treinados'],
      documentTypes: ['petition', 'brief', 'contract', 'legal_opinion'],
      recommended: false // TODO: Implementar lógica de recomendação
    })) || [];

    // Se não há agentes, retornar agente padrão do sistema
    if (agents.length === 0) {
      const defaultAgents: Agent[] = [
        {
          id: 'geral',
          name: 'Agente Geral (Padrão)',
          description: 'Agente padrão do sistema para documentos jurídicos diversos.',
          legalArea: 'Geral',
          strengths: ['Versatilidade', 'Linguagem clara', 'Estrutura sólida'],
          documentTypes: ['petition', 'brief', 'notification', 'motion'],
          recommended: true
        }
      ];
      
      return NextResponse.json({
        agents: defaultAgents,
        default: 'geral'
      });
    }

    // Marcar primeiro agente como recomendado
    if (agents.length > 0) {
      agents[0].recommended = true;
    }

    return NextResponse.json({
      agents,
      default: agents[0]?.id || 'geral'
    });
    
  } catch (error) {
    console.error('Erro na API de agentes:', error);
    return NextResponse.json({
      agents: [],
      default: '',
      error: 'Erro interno do servidor'
    }, { status: 500 });
  }
}