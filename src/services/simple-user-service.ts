/**
 * User Service SIMPLES - Zero Complexidade
 * Substitui o user-service.ts complexo por algo direto
 */

import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { getFirebaseDb, getFirebaseAuth } from '@/lib/firebase';

// Tipos simples
export interface UserProfile {
  name?: string;
  displayName?: string;
  email?: string;
  phone?: string;
  company?: string;
  oab?: string;
  cargo: string;
  areas_atuacao: string[];
  primeiro_acesso: boolean;
  initial_setup_complete: boolean;
  data_criacao: any;
  workspaces: any[];
}

export interface ServiceResult<T> {
  data: T | null;
  error: string | null;
  success: boolean;
}

/**
 * Buscar perfil do usuário (SIMPLES)
 */
export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  if (!uid?.trim()) {
    throw new Error('UID é obrigatório');
  }

  try {
    const db = getFirebaseDb();
    const docRef = doc(db, 'usuarios', uid);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return docSnap.data() as UserProfile;
    } else {
      return null; // Perfil não existe
    }
  } catch (error: any) {
    console.error('Erro ao buscar perfil:', error);
    throw new Error('Erro ao carregar perfil do usuário');
  }
}

/**
 * Criar perfil do usuário (SIMPLES)
 */
export async function createUserProfile(
  uid: string, 
  profileData: Partial<UserProfile>
): Promise<UserProfile> {
  if (!uid?.trim()) {
    throw new Error('UID é obrigatório');
  }

  try {
    const db = getFirebaseDb();
    const docRef = doc(db, 'usuarios', uid);
    
    const newProfile: UserProfile = {
      cargo: '',
      areas_atuacao: [],
      primeiro_acesso: true,
      initial_setup_complete: false,
      data_criacao: serverTimestamp(),
      workspaces: [],
      ...profileData // Mesclar dados fornecidos
    };

    await setDoc(docRef, newProfile);
    return newProfile;
  } catch (error: any) {
    console.error('Erro ao criar perfil:', error);
    throw new Error('Erro ao criar perfil do usuário');
  }
}

/**
 * Buscar OU criar perfil (SIMPLES)
 */
export async function getOrCreateProfile(uid: string, email?: string): Promise<UserProfile> {
  try {
    // Tentar buscar primeiro
    const existingProfile = await getUserProfile(uid);
    
    if (existingProfile) {
      return existingProfile;
    }
    
    // Se não existe, criar
    const newProfile = await createUserProfile(uid, {
      email: email || '',
      name: '',
      displayName: ''
    });
    
    return newProfile;
  } catch (error: any) {
    console.error('Erro ao buscar/criar perfil:', error);
    throw error;
  }
}

/**
 * Atualizar perfil do usuário (SIMPLES)
 */
export async function updateUserProfile(
  uid: string, 
  updates: Partial<UserProfile>
): Promise<void> {
  if (!uid?.trim()) {
    throw new Error('UID é obrigatório');
  }

  try {
    const db = getFirebaseDb();
    const docRef = doc(db, 'usuarios', uid);
    
    await updateDoc(docRef, updates);
  } catch (error: any) {
    console.error('Erro ao atualizar perfil:', error);
    throw new Error('Erro ao atualizar perfil do usuário');
  }
}

/**
 * Verificar se usuário está autenticado (SIMPLES)
 */
export function getCurrentUser() {
  const auth = getFirebaseAuth();
  return auth.currentUser;
}

/**
 * Verificar se UID corresponde ao usuário atual (SIMPLES)
 */
export function validateCurrentUser(uid: string): boolean {
  const currentUser = getCurrentUser();
  return currentUser?.uid === uid;
}