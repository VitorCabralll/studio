'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { doc, getDoc, collection, addDoc, query, where, getDocs, updateDoc, deleteDoc } from 'firebase/firestore';
import { getFirebaseDb } from '@/lib/firebase';
import { useAuth } from '@/hooks/use-auth';

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
  getUserWorkspaces: () => Promise<void>;
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
        const db = getFirebaseDb();
        const workspacesRef = collection(db, 'workspaces');
        const q = query(
          workspacesRef, 
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
            createdAt: data.createdAt?.toDate() || new Date(),
            updatedAt: data.updatedAt?.toDate() || new Date(),
            settings: data.settings || {}
          });
        });
        
        if (isComponentMounted) {
          setWorkspaces(userWorkspaces);
          
          // Se não há workspace atual e tem workspaces, selecionar o primeiro
          if (!currentWorkspace && userWorkspaces.length > 0) {
            setCurrentWorkspace(userWorkspaces[0]);
          }
        }
      } catch (err) {
        if (isComponentMounted) {
          console.error('Erro ao carregar workspaces:', err);
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
  }, [user, currentWorkspace]);

  const getUserWorkspaces = async () => {
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
      const docRef = await addDoc(collection(db, 'workspaces'), workspaceData);
      
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

    try {
      const db = getFirebaseDb();
      const workspaceRef = doc(db, 'workspaces', workspaceId);
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

    try {
      const db = getFirebaseDb();
      await deleteDoc(doc(db, 'workspaces', workspaceId));

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
    try {
      const db = getFirebaseDb();
      const workspaceRef = doc(db, 'workspaces', workspaceId);
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
    try {
      const db = getFirebaseDb();
      const workspaceRef = doc(db, 'workspaces', workspaceId);
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