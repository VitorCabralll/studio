'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { doc, getDoc, collection, addDoc, query, where, getDocs, updateDoc, deleteDoc } from 'firebase/firestore';
import { getFirebaseDb, getFirebaseAuth } from '@/lib/firebase';
import { addNamespace } from '@/lib/staging-config';
import { useAuth } from '@/hooks/use-auth';
import { AuthCoordinator } from '@/lib/auth-coordinator';
import { authLogger } from '@/lib/auth-logger';

// Função utilitária para validar auth usando AuthCoordinator
async function validateAuthWithCoordinator(): Promise<{ success: boolean; error?: string }> {
  try {
    const auth = getFirebaseAuth();
    const currentUser = auth.currentUser;
    
    if (!currentUser) {
      return { success: false, error: 'Usuário não autenticado' };
    }

    // Usar AuthCoordinator para validação coordenada
    const isAuthReady = await AuthCoordinator.waitForAuthReady(currentUser);
    
    if (!isAuthReady) {
      authLogger.error('Workspace auth validation failed via AuthCoordinator', new Error('Auth not ready'), {
        context: 'workspace-context',
        operation: 'auth_validation',
        userId: currentUser.uid,
      });
      return { success: false, error: 'Falha na validação coordenada de autenticação' };
    }

    authLogger.info('Workspace auth validation successful via AuthCoordinator', {
      context: 'workspace-context',
      operation: 'auth_validation',
      userId: currentUser.uid,
    });
    
    return { success: true };
  } catch (error: any) {
    authLogger.error('Workspace auth validation error', error, {
      context: 'workspace-context',
      operation: 'auth_validation',
    });
    return { success: false, error: 'Erro na validação de autenticação' };
  }
}

export interface Workspace {
  id: string;
  name: string;
  description?: string;
  members: string[];
  owners: string[];
  created_at: Date;
  updated_at: Date;
}

export interface WorkspaceContextType {
  workspaces: Workspace[];
  currentWorkspace: Workspace | null;
  isLoading: boolean;
  error: string | null;
  createWorkspace: (name: string, description?: string) => Promise<string | null>;
  selectWorkspace: (workspaceId: string) => void;
  updateWorkspace: (workspaceId: string, updates: Partial<Workspace>) => Promise<boolean>;
  deleteWorkspace: (workspaceId: string) => Promise<boolean>;
  addMember: (workspaceId: string, memberEmail: string) => Promise<boolean>;
  removeMember: (workspaceId: string, memberId: string) => Promise<boolean>;
  refreshWorkspaces: () => Promise<void>;
}

const WorkspaceContext = createContext<WorkspaceContextType | undefined>(undefined);

interface WorkspaceProviderProps {
  children: ReactNode;
}

export function WorkspaceProvider({ children }: WorkspaceProviderProps) {
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [currentWorkspace, setCurrentWorkspace] = useState<Workspace | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  // Carregar workspaces do usuário
  const loadWorkspaces = async () => {
    if (!user) {
      setWorkspaces([]);
      setCurrentWorkspace(null);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Validar auth antes de fazer queries
      const authValidation = await validateAuthWithCoordinator();
      if (!authValidation.success) {
        throw new Error(authValidation.error || 'Falha na validação de autenticação');
      }

      const db = getFirebaseDb();
      const workspacesCollection = addNamespace('workspaces');
      
      // Query para workspaces onde o usuário é membro
      const q = query(
        collection(db, workspacesCollection),
        where('members', 'array-contains', user.uid)
      );
      
      const querySnapshot = await getDocs(q);
      const userWorkspaces: Workspace[] = [];
      
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        userWorkspaces.push({
          id: doc.id,
          name: data.name,
          description: data.description,
          members: data.members || [],
          owners: data.owners || [],
          created_at: data.created_at?.toDate() || new Date(),
          updated_at: data.updated_at?.toDate() || new Date(),
        });
      });

      setWorkspaces(userWorkspaces);
      
      // Se não há workspace atual e há workspaces disponíveis, selecionar o primeiro
      if (!currentWorkspace && userWorkspaces.length > 0) {
        setCurrentWorkspace(userWorkspaces[0]);
      }

    } catch (err: any) {
      console.error('Erro ao carregar workspaces:', err);
      
      // Debug detalhado para permission-denied em desenvolvimento
      if (process.env.NODE_ENV === 'development' && err instanceof Error && 'code' in err && err.code === 'permission-denied') {
        console.error('Workspace Permission Debug:', {
          operation: 'loadWorkspaces',
          collection: addNamespace('workspaces'),
          userId: user?.uid,
          error_code: err.code,
          error_message: err.message,
          timestamp: new Date().toISOString()
        });
      }
      
      setError('Erro ao carregar workspaces');
    } finally {
      setIsLoading(false);
    }
  };

  // Criar novo workspace
  const createWorkspace = async (name: string, description?: string): Promise<string | null> => {
    if (!user) {
      setError('Usuário não autenticado');
      return null;
    }

    try {
      // Validar auth antes de criar
      const authValidation = await validateAuthWithCoordinator();
      if (!authValidation.success) {
        throw new Error(authValidation.error || 'Falha na validação de autenticação');
      }

      const db = getFirebaseDb();
      const workspacesCollection = addNamespace('workspaces');
      
      const newWorkspace = {
        name,
        description: description || '',
        members: [user.uid],
        owners: [user.uid],
        created_at: new Date(),
        updated_at: new Date(),
      };

      const docRef = await addDoc(collection(db, workspacesCollection), newWorkspace);
      
      // Adicionar à lista local
      const workspace: Workspace = {
        id: docRef.id,
        ...newWorkspace,
      };
      
      setWorkspaces(prev => [...prev, workspace]);
      setCurrentWorkspace(workspace);
      
      authLogger.info('Workspace created successfully', {
        context: 'workspace-context',
        operation: 'createWorkspace',
        userId: user.uid,
      });

      return docRef.id;

    } catch (err: any) {
      console.error('Erro ao criar workspace:', err);
      setError('Erro ao criar workspace');
      
      authLogger.error('Failed to create workspace', err, {
        context: 'workspace-context',
        operation: 'createWorkspace',
        userId: user.uid,
      });
      
      return null;
    }
  };

  // Selecionar workspace atual
  const selectWorkspace = (workspaceId: string) => {
    const workspace = workspaces.find(ws => ws.id === workspaceId);
    if (workspace) {
      setCurrentWorkspace(workspace);
    }
  };

  // Atualizar workspace
  const updateWorkspace = async (workspaceId: string, updates: Partial<Workspace>): Promise<boolean> => {
    if (!user) {
      setError('Usuário não autenticado');
      return false;
    }

    try {
      // Validar auth antes de atualizar
      const authValidation = await validateAuthWithCoordinator();
      if (!authValidation.success) {
        throw new Error(authValidation.error || 'Falha na validação de autenticação');
      }

      const db = getFirebaseDb();
      const workspacesCollection = addNamespace('workspaces');
      const workspaceRef = doc(db, workspacesCollection, workspaceId);

      const updateData = {
        ...updates,
        updated_at: new Date(),
      };

      await updateDoc(workspaceRef, updateData);

      // Atualizar lista local
      setWorkspaces(prev => 
        prev.map(ws => 
          ws.id === workspaceId 
            ? { ...ws, ...updateData }
            : ws
        )
      );

      // Atualizar workspace atual se for o mesmo
      if (currentWorkspace?.id === workspaceId) {
        setCurrentWorkspace(prev => prev ? { ...prev, ...updateData } : null);
      }

      return true;

    } catch (err: any) {
      console.error('Erro ao atualizar workspace:', err);
      setError('Erro ao atualizar workspace');
      return false;
    }
  };

  // Deletar workspace
  const deleteWorkspace = async (workspaceId: string): Promise<boolean> => {
    if (!user) {
      setError('Usuário não autenticado');
      return false;
    }

    try {
      // Validar auth antes de deletar
      const authValidation = await validateAuthWithCoordinator();
      if (!authValidation.success) {
        throw new Error(authValidation.error || 'Falha na validação de autenticação');
      }

      const db = getFirebaseDb();
      const workspacesCollection = addNamespace('workspaces');
      const workspaceRef = doc(db, workspacesCollection, workspaceId);

      await deleteDoc(workspaceRef);

      // Remover da lista local
      setWorkspaces(prev => prev.filter(ws => ws.id !== workspaceId));

      // Se era o workspace atual, limpar seleção
      if (currentWorkspace?.id === workspaceId) {
        const remainingWorkspaces = workspaces.filter(ws => ws.id !== workspaceId);
        setCurrentWorkspace(remainingWorkspaces.length > 0 ? remainingWorkspaces[0] : null);
      }

      return true;

    } catch (err: any) {
      console.error('Erro ao deletar workspace:', err);
      setError('Erro ao deletar workspace');
      return false;
    }
  };

  // Adicionar membro ao workspace
  const addMember = async (workspaceId: string, memberEmail: string): Promise<boolean> => {
    // TODO: Implementar lógica para adicionar membro
    console.log('addMember não implementado:', { workspaceId, memberEmail });
    return false;
  };

  // Remover membro do workspace
  const removeMember = async (workspaceId: string, memberId: string): Promise<boolean> => {
    // TODO: Implementar lógica para remover membro
    console.log('removeMember não implementado:', { workspaceId, memberId });
    return false;
  };

  // Refresh workspaces
  const refreshWorkspaces = async () => {
    await loadWorkspaces();
  };

  // Carregar workspaces quando o usuário muda
  useEffect(() => {
    loadWorkspaces();
  }, [user]);

  const contextValue: WorkspaceContextType = {
    workspaces,
    currentWorkspace,
    isLoading,
    error,
    createWorkspace,
    selectWorkspace,
    updateWorkspace,
    deleteWorkspace,
    addMember,
    removeMember,
    refreshWorkspaces,
  };

  return (
    <WorkspaceContext.Provider value={contextValue}>
      {children}
    </WorkspaceContext.Provider>
  );
}

export function useWorkspace(): WorkspaceContextType {
  const context = useContext(WorkspaceContext);
  if (context === undefined) {
    throw new Error('useWorkspace must be used within a WorkspaceProvider');
  }
  return context;
}