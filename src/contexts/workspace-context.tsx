'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { doc, getDoc, collection, addDoc, query, where, getDocs, updateDoc, deleteDoc } from 'firebase/firestore';
import { getFirebaseDb, getFirebaseAuth } from '@/lib/firebase';
import { addNamespace } from '@/lib/staging-config';
import { useAuth } from '@/hooks/use-auth';
import { AuthCoordinator } from '@/lib/auth-coordinator';
import { authLogger } from '@/lib/auth-logger';

// 🛡️ Função utilitária para validar auth usando AuthCoordinator
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
    return { success: false, error: 'Falha na validação do token de autenticação' };
  }
}

export interface Workspace {
  id: string;
  name: string;
  description?: string;
  members: string[]; // Array de UIDs dos usuários
  owners: string[]; // Array de UIDs dos proprietários
  createdAt: Date;
  updatedAt: Date;
  settings?: {
    allowPublicJoin?: boolean;
    defaultRole?: 'member' | 'admin';
  };
}

export interface WorkspaceContextType {
  // Estado atual
  currentWorkspace: Workspace | null;
  workspaces: Workspace[];
  isLoading: boolean;
  error: string | null;

  // Ações de workspace
  setCurrentWorkspace: (workspace: Workspace | null) => void;
  createWorkspace: (name: string, description?: string) => Promise<{ success: boolean; workspace?: Workspace; error?: string }>;
  updateWorkspace: (workspaceId: string, updates: Partial<Workspace>) => Promise<{ success: boolean; error?: string }>;
  deleteWorkspace: (workspaceId: string) => Promise<{ success: boolean; error?: string }>;
  
  // Ações de membros
  addMember: (workspaceId: string, userId: string) => Promise<{ success: boolean; error?: string }>;
  removeMember: (workspaceId: string, userId: string) => Promise<{ success: boolean; error?: string }>;
  
  // Helpers
  isOwner: (workspaceId: string, userId?: string) => boolean;
  isMember: (workspaceId: string, userId?: string) => boolean;
  getUserWorkspaces: () => void;
}

const WorkspaceContext = createContext<WorkspaceContextType | undefined>(undefined);

export function WorkspaceProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [currentWorkspace, setCurrentWorkspace] = useState<Workspace | null>(null);
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Carregar workspaces do usuário quando fazer login
  useEffect(() => {
    let isComponentMounted = true;
    
    const loadWorkspaces = async () => {
      if (!user || !isComponentMounted) return;
      
      setIsLoading(true);
      setError(null);
      
      try {
        // 🛡️ Validar auth usando AuthCoordinator
        const authValidation = await validateAuthWithCoordinator();
        if (!authValidation.success) {
          throw new Error(authValidation.error || 'Falha na autenticação');
        }

        const db = getFirebaseDb();
        const workspacesCollection = addNamespace('workspaces');
        const workspacesRef = collection(db, workspacesCollection);
        const q = query(
          workspacesRef, 
          where('members', 'array-contains', user.uid)
        );
        
        // 🔧 Debug logs para desenvolvimento
        if (process.env.NODE_ENV === 'development') {
          console.log('🏢 Workspace query debug:', {
            userId: user.uid,
            query: `where('members', 'array-contains', '${user.uid}')`,
            collection: workspacesCollection,
            database: db.app.options.projectId,
            namespace: process.env.NEXT_PUBLIC_APP_NAMESPACE
          });
        }
        
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
            createdAt: data.createdAt?.toDate() || new Date(),
            updatedAt: data.updatedAt?.toDate() || new Date(),
            settings: data.settings || {}
          });
        });
        
        if (isComponentMounted) {
          setWorkspaces(userWorkspaces);
          
          // Se não há workspace atual e tem workspaces, selecionar o primeiro
          setCurrentWorkspace(prev => {
            if (!prev && userWorkspaces.length > 0) {
              return userWorkspaces[0];
            }
            return prev;
          });
        }
      } catch (err) {
        if (isComponentMounted) {
          console.error('Erro ao carregar workspaces:', err);
          
          // 🔧 Debug detalhado para permission-denied em desenvolvimento
          if (process.env.NODE_ENV === 'development' && err instanceof Error && 'code' in err && err.code === 'permission-denied') {
            console.error('🚨 Workspace Permission Debug:', {
              operation: 'loadWorkspaces',
              collection: addNamespace('workspaces'),
              userId: user?.uid,
              error_code: err.code,
              error_message: err.message,
              timestamp: new Date().toISOString()
            });
          }
          
          setError('Erro ao carregar workspaces');
        }
      } finally {
        if (isComponentMounted) {
          setIsLoading(false);
        }
      }
    };
    
    if (user) {
      loadWorkspaces();
    } else {
      setWorkspaces([]);
      setCurrentWorkspace(null);
    }
    
    return () => {
      isComponentMounted = false;
    };
  }, [user]);

  const getUserWorkspaces = () => {
    // Esta função agora é apenas um trigger para recarregar
    // A lógica real está no useEffect para evitar memory leaks
    if (!user) return;
    
    // Força um reload atualizando um estado
    setError(null);
    setIsLoading(true);
    
    // Pequeno delay para garantir que o useEffect processe
    setTimeout(() => {
      if (!user) {
        setIsLoading(false);
      }
    }, 100);
  };

  const createWorkspace = async (name: string, description?: string): Promise<{ success: boolean; workspace?: Workspace; error?: string }> => {
    if (!user) {
      return { success: false, error: 'Usuário não autenticado' };
    }

    // 🛡️ Validar auth usando AuthCoordinator
    const authValidation = await validateAuthWithCoordinator();
    if (!authValidation.success) {
      return { success: false, error: authValidation.error || 'Falha na autenticação' };
    }

    // Verificar limite de workspaces (máximo 5 por usuário)
    if (workspaces.length >= 5) {
      return { 
        success: false, 
        error: 'Limite máximo de 5 workspaces atingido. Exclua um workspace existente para criar um novo.' 
      };
    }

    setIsLoading(true);
    setError(null);

    try {
      const workspaceData = {
        name: name.trim(),
        description: description?.trim() || '',
        members: [user.uid],
        owners: [user.uid],
        createdAt: new Date(),
        updatedAt: new Date(),
        settings: {
          allowPublicJoin: false,
          defaultRole: 'member' as const
        }
      };

      const db = getFirebaseDb();
      const docRef = await addDoc(collection(db, addNamespace('workspaces')), workspaceData);
      
      const newWorkspace: Workspace = {
        id: docRef.id,
        ...workspaceData
      };

      setWorkspaces(prev => [...prev, newWorkspace]);
      setCurrentWorkspace(newWorkspace);

      return { success: true, workspace: newWorkspace };
    } catch (err) {
      console.error('Erro ao criar workspace:', err);
      const errorMessage = 'Erro ao criar workspace';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  const updateWorkspace = async (workspaceId: string, updates: Partial<Workspace>): Promise<{ success: boolean; error?: string }> => {
    if (!user) {
      return { success: false, error: 'Usuário não autenticado' };
    }

    // 🛡️ Validar auth usando AuthCoordinator
    const authValidation = await validateAuthWithCoordinator();
    if (!authValidation.success) {
      return { success: false, error: authValidation.error || 'Falha na autenticação' };
    }

    try {
      const db = getFirebaseDb();
      const workspaceRef = doc(db, addNamespace('workspaces'), workspaceId);
      await updateDoc(workspaceRef, {
        ...updates,
        updatedAt: new Date()
      });

      // Atualizar estado local
      setWorkspaces(prev => prev.map(ws => 
        ws.id === workspaceId 
          ? { ...ws, ...updates, updatedAt: new Date() }
          : ws
      ));

      // Atualizar workspace atual se for o mesmo
      if (currentWorkspace?.id === workspaceId) {
        setCurrentWorkspace(prev => prev ? { ...prev, ...updates, updatedAt: new Date() } : null);
      }

      return { success: true };
    } catch (err) {
      console.error('Erro ao atualizar workspace:', err);
      return { success: false, error: 'Erro ao atualizar workspace' };
    }
  };

  const deleteWorkspace = async (workspaceId: string): Promise<{ success: boolean; error?: string }> => {
    if (!user) {
      return { success: false, error: 'Usuário não autenticado' };
    }

    // 🛡️ Validar auth usando AuthCoordinator
    const authValidation = await validateAuthWithCoordinator();
    if (!authValidation.success) {
      return { success: false, error: authValidation.error || 'Falha na autenticação' };
    }

    try {
      const db = getFirebaseDb();
      await deleteDoc(doc(db, addNamespace('workspaces'), workspaceId));

      // Remover do estado local
      setWorkspaces(prev => prev.filter(ws => ws.id !== workspaceId));
      
      // Se era o workspace atual, limpar
      if (currentWorkspace?.id === workspaceId) {
        const remainingWorkspaces = workspaces.filter(ws => ws.id !== workspaceId);
        setCurrentWorkspace(remainingWorkspaces.length > 0 ? remainingWorkspaces[0] : null);
      }

      return { success: true };
    } catch (err) {
      console.error('Erro ao deletar workspace:', err);
      return { success: false, error: 'Erro ao deletar workspace' };
    }
  };

  const addMember = async (workspaceId: string, userId: string): Promise<{ success: boolean; error?: string }> => {
    // 🛡️ Validar auth usando AuthCoordinator
    const authValidation = await validateAuthWithCoordinator();
    if (!authValidation.success) {
      return { success: false, error: authValidation.error || 'Falha na autenticação' };
    }

    try {
      const db = getFirebaseDb();
      const workspaceRef = doc(db, addNamespace('workspaces'), workspaceId);
      const workspaceDoc = await getDoc(workspaceRef);
      
      if (!workspaceDoc.exists()) {
        return { success: false, error: 'Workspace não encontrado' };
      }

      const currentMembers = workspaceDoc.data().members || [];
      if (currentMembers.includes(userId)) {
        return { success: false, error: 'Usuário já é membro' };
      }

      await updateDoc(workspaceRef, {
        members: [...currentMembers, userId],
        updatedAt: new Date()
      });

      await getUserWorkspaces(); // Recarregar workspaces
      return { success: true };
    } catch (err) {
      console.error('Erro ao adicionar membro:', err);
      return { success: false, error: 'Erro ao adicionar membro' };
    }
  };

  const removeMember = async (workspaceId: string, userId: string): Promise<{ success: boolean; error?: string }> => {
    // 🛡️ Validar auth usando AuthCoordinator
    const authValidation = await validateAuthWithCoordinator();
    if (!authValidation.success) {
      return { success: false, error: authValidation.error || 'Falha na autenticação' };
    }

    try {
      const db = getFirebaseDb();
      const workspaceRef = doc(db, addNamespace('workspaces'), workspaceId);
      const workspaceDoc = await getDoc(workspaceRef);
      
      if (!workspaceDoc.exists()) {
        return { success: false, error: 'Workspace não encontrado' };
      }

      const currentMembers = workspaceDoc.data().members || [];
      const updatedMembers = currentMembers.filter((id: string) => id !== userId);

      await updateDoc(workspaceRef, {
        members: updatedMembers,
        updatedAt: new Date()
      });

      await getUserWorkspaces(); // Recarregar workspaces
      return { success: true };
    } catch (err) {
      console.error('Erro ao remover membro:', err);
      return { success: false, error: 'Erro ao remover membro' };
    }
  };

  const isOwner = (workspaceId: string, userId?: string): boolean => {
    const targetUserId = userId || user?.uid;
    if (!targetUserId) return false;
    
    const workspace = workspaces.find(ws => ws.id === workspaceId);
    return workspace?.owners.includes(targetUserId) || false;
  };

  const isMember = (workspaceId: string, userId?: string): boolean => {
    const targetUserId = userId || user?.uid;
    if (!targetUserId) return false;
    
    const workspace = workspaces.find(ws => ws.id === workspaceId);
    return workspace?.members.includes(targetUserId) || false;
  };

  const value: WorkspaceContextType = {
    currentWorkspace,
    workspaces,
    isLoading,
    error,
    setCurrentWorkspace,
    createWorkspace,
    updateWorkspace,
    deleteWorkspace,
    addMember,
    removeMember,
    isOwner,
    isMember,
    getUserWorkspaces
  };

  return (
    <WorkspaceContext.Provider value={value}>
      {children}
    </WorkspaceContext.Provider>
  );
}

export function useWorkspace() {
  const context = useContext(WorkspaceContext);
  if (context === undefined) {
    throw new Error('useWorkspace must be used within a WorkspaceProvider');
  }
  return context;
}