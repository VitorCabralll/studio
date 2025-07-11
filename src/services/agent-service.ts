import { 
  collection, 
  addDoc, 
  query, 
  where, 
  getDocs, 
  doc, 
  updateDoc, 
  deleteDoc, 
  getDoc,
  orderBy 
} from 'firebase/firestore';
import { getFirebaseDb, getFirebaseAuth } from '@/lib/firebase';
import { addNamespace } from '@/lib/staging-config';

// 🛡️ Função utilitária para validar token JWT antes de consultas Firestore
async function validateAuthToken(): Promise<{ success: boolean; error?: string }> {
  try {
    const auth = getFirebaseAuth();
    const currentUser = auth.currentUser;
    
    if (!currentUser) {
      return { success: false, error: 'Usuário não autenticado' };
    }

    // Forçar refresh do token para garantir que está válido
    await currentUser.getIdToken(true);
    console.log('✅ Token JWT válido obtido para consulta Firestore');
    
    return { success: true };
  } catch (error) {
    console.error('❌ Erro ao validar token JWT:', error);
    return { success: false, error: 'Falha na validação do token de autenticação' };
  }
}

export interface Agent {
  id: string;
  name: string;
  description?: string;
  legalArea: string;
  workspaceId: string;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
  trainingDocuments?: {
    count: number;
    processedAt?: Date;
  };
  settings?: {
    temperature?: number;
    maxTokens?: number;
    model?: string;
  };
}

export interface CreateAgentData {
  name: string;
  description?: string;
  legalArea: string;
  workspaceId: string;
  createdBy: string;
  trainingFiles?: File[];
}

export const agentService = {
  /**
   * Criar um novo agente
   */
  async createAgent(data: CreateAgentData): Promise<{ success: boolean; agent?: Agent; error?: string }> {
    // 🛡️ Validar token JWT antes da consulta
    const authValidation = await validateAuthToken();
    if (!authValidation.success) {
      return { success: false, error: authValidation.error };
    }

    try {
      const agentData = {
        name: data.name.trim(),
        description: data.description?.trim() || '',
        legalArea: data.legalArea,
        workspaceId: data.workspaceId,
        createdBy: data.createdBy,
        createdAt: new Date(),
        updatedAt: new Date(),
        isActive: true,
        trainingDocuments: data.trainingFiles ? {
          count: data.trainingFiles.length,
          processedAt: new Date()
        } : undefined,
        settings: {
          temperature: 0.7,
          maxTokens: 2000,
          model: 'gpt-4'
        }
      };

      const workspacesCollection = process.env.NODE_ENV === 'production' ? 'workspaces' : addNamespace('workspaces');
      const docRef = await addDoc(collection(getFirebaseDb(), workspacesCollection, data.workspaceId, 'agentes'), agentData);
      
      const newAgent: Agent = {
        id: docRef.id,
        ...agentData
      };

      return { success: true, agent: newAgent };
    } catch (error) {
      console.error('Erro ao criar agente:', error);
      return { success: false, error: 'Erro ao criar agente' };
    }
  },

  /**
   * Listar agentes de um workspace
   */
  async getWorkspaceAgents(workspaceId: string): Promise<{ success: boolean; agents?: Agent[]; error?: string }> {
    // 🛡️ Validar token JWT antes da consulta
    const authValidation = await validateAuthToken();
    if (!authValidation.success) {
      return { success: false, error: authValidation.error };
    }

    try {
      const workspacesCollection = process.env.NODE_ENV === 'production' ? 'workspaces' : addNamespace('workspaces');
      const agentsRef = collection(getFirebaseDb(), workspacesCollection, workspaceId, 'agentes');
      const q = query(
        agentsRef, 
        where('isActive', '==', true),
        orderBy('createdAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      const agents: Agent[] = [];
      
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        agents.push({
          id: doc.id,
          name: data.name,
          description: data.description,
          legalArea: data.legalArea,
          workspaceId: data.workspaceId,
          createdBy: data.createdBy,
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date(),
          isActive: data.isActive,
          trainingDocuments: data.trainingDocuments,
          settings: data.settings || {}
        });
      });
      
      return { success: true, agents };
    } catch (error) {
      console.error('Erro ao carregar agentes:', error);
      return { success: false, error: 'Erro ao carregar agentes' };
    }
  },

  /**
   * Buscar um agente específico
   */
  async getAgent(workspaceId: string, agentId: string): Promise<{ success: boolean; agent?: Agent; error?: string }> {
    // 🛡️ Validar token JWT antes da consulta
    const authValidation = await validateAuthToken();
    if (!authValidation.success) {
      return { success: false, error: authValidation.error };
    }

    try {
      const workspacesCollection = process.env.NODE_ENV === 'production' ? 'workspaces' : addNamespace('workspaces');
      const agentRef = doc(getFirebaseDb(), workspacesCollection, workspaceId, 'agentes', agentId);
      const agentDoc = await getDoc(agentRef);
      
      if (!agentDoc.exists()) {
        return { success: false, error: 'Agente não encontrado' };
      }

      const data = agentDoc.data();
      const agent: Agent = {
        id: agentDoc.id,
        name: data.name,
        description: data.description,
        legalArea: data.legalArea,
        workspaceId: data.workspaceId,
        createdBy: data.createdBy,
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
        isActive: data.isActive,
        trainingDocuments: data.trainingDocuments,
        settings: data.settings || {}
      };

      return { success: true, agent };
    } catch (error) {
      console.error('Erro ao buscar agente:', error);
      return { success: false, error: 'Erro ao buscar agente' };
    }
  },

  /**
   * Atualizar um agente
   */
  async updateAgent(
    workspaceId: string, 
    agentId: string, 
    updates: Partial<Omit<Agent, 'id' | 'workspaceId' | 'createdBy' | 'createdAt'>>
  ): Promise<{ success: boolean; error?: string }> {
    // 🛡️ Validar token JWT antes da consulta
    const authValidation = await validateAuthToken();
    if (!authValidation.success) {
      return { success: false, error: authValidation.error };
    }

    try {
      const workspacesCollection = process.env.NODE_ENV === 'production' ? 'workspaces' : addNamespace('workspaces');
      const agentRef = doc(getFirebaseDb(), workspacesCollection, workspaceId, 'agentes', agentId);
      await updateDoc(agentRef, {
        ...updates,
        updatedAt: new Date()
      });

      return { success: true };
    } catch (error) {
      console.error('Erro ao atualizar agente:', error);
      return { success: false, error: 'Erro ao atualizar agente' };
    }
  },

  /**
   * Desativar um agente (soft delete)
   */
  async deactivateAgent(workspaceId: string, agentId: string): Promise<{ success: boolean; error?: string }> {
    // 🛡️ Validar token JWT antes da consulta
    const authValidation = await validateAuthToken();
    if (!authValidation.success) {
      return { success: false, error: authValidation.error };
    }

    try {
      const workspacesCollection = process.env.NODE_ENV === 'production' ? 'workspaces' : addNamespace('workspaces');
      const agentRef = doc(getFirebaseDb(), workspacesCollection, workspaceId, 'agentes', agentId);
      await updateDoc(agentRef, {
        isActive: false,
        updatedAt: new Date()
      });

      return { success: true };
    } catch (error) {
      console.error('Erro ao desativar agente:', error);
      return { success: false, error: 'Erro ao desativar agente' };
    }
  },

  /**
   * Deletar um agente completamente
   */
  async deleteAgent(workspaceId: string, agentId: string): Promise<{ success: boolean; error?: string }> {
    // 🛡️ Validar token JWT antes da consulta
    const authValidation = await validateAuthToken();
    if (!authValidation.success) {
      return { success: false, error: authValidation.error };
    }

    try {
      const workspacesCollection = process.env.NODE_ENV === 'production' ? 'workspaces' : addNamespace('workspaces');
      const agentRef = doc(getFirebaseDb(), workspacesCollection, workspaceId, 'agentes', agentId);
      await deleteDoc(agentRef);

      return { success: true };
    } catch (error) {
      console.error('Erro ao deletar agente:', error);
      return { success: false, error: 'Erro ao deletar agente' };
    }
  }
};