import { doc, getDoc, setDoc, serverTimestamp, Timestamp, FieldValue } from 'firebase/firestore';
import { getFirebaseDb } from '@/lib/firebase';
import { addNamespace } from '@/lib/staging-config';

// Service result types
export interface ServiceResult<T> {
  data: T | null;
  error: ServiceError | null;
  success: boolean;
}

export interface ServiceError {
  code: string;
  message: string;
  details?: string;
}

export interface Workspace {
  name: string;
  members?: number;
  isOwner?: boolean;
}

export interface UserProfile {
  name?: string;
  displayName?: string;
  phone?: string;
  company?: string;
  oab?: string;
  acceptNewsletter?: boolean;
  cargo: string;
  areas_atuacao: string[];
  primeiro_acesso: boolean;
  initial_setup_complete: boolean;
  data_criacao: Timestamp | Date | FieldValue;
  workspaces: Workspace[];
}

export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  if (!uid?.trim()) {
    throw new Error('User ID is required');
  }

  const db = getFirebaseDb();
  const docRef = doc(db, addNamespace('usuarios'), uid);
  
  try {
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const data = docSnap.data() as UserProfile;
      
      // Ensure required fields
      return {
        ...data,
        workspaces: data.workspaces || [],
        initial_setup_complete: data.initial_setup_complete ?? false
      };
    } else {
      // User doesn't exist - create default profile
      const defaultProfile: UserProfile = {
        cargo: '',
        areas_atuacao: [],
        primeiro_acesso: true,
        initial_setup_complete: false,
        data_criacao: new Date(),
        workspaces: [],
      };
      
      await createUserProfile(uid, defaultProfile);
      return defaultProfile;
    }
  } catch (error) {
    console.error('Error getting user profile:', error);
    throw error;
  }
}

export async function createUserProfile(
  uid: string,
  data: Partial<UserProfile>
): Promise<void> {
  if (!uid?.trim()) {
    throw new Error('User ID is required');
  }

  if (!data) {
    throw new Error('Profile data is required');
  }

  const db = getFirebaseDb();
  const docRef = doc(db, addNamespace('usuarios'), uid);
  
  const profileData: Partial<UserProfile> = {
    cargo: data.cargo || '',
    areas_atuacao: data.areas_atuacao || [],
    primeiro_acesso: data.primeiro_acesso ?? true,
    initial_setup_complete: data.initial_setup_complete ?? false,
    data_criacao: serverTimestamp(),
    workspaces: data.workspaces || [],
    ...data, // Spread other fields like name, phone, etc.
  };

  try {
    // Use setDoc with merge: true to handle concurrent writes
    await setDoc(docRef, profileData, { merge: true });
  } catch (error) {
    console.error('Error creating user profile:', error);
    throw error;
  }
}

export async function updateUserProfile(
  uid: string,
  data: Partial<UserProfile>
): Promise<ServiceResult<Partial<UserProfile>>> {
  if (!uid?.trim()) {
    return {
      data: null,
      error: { code: 'invalid-argument', message: 'User ID is required' },
      success: false
    };
  }

  if (!data || Object.keys(data).length === 0) {
    return {
      data: null,
      error: { code: 'invalid-argument', message: 'Update data is required' },
      success: false
    };
  }

  const db = getFirebaseDb();
  const docRef = doc(db, addNamespace('usuarios'), uid);
  
  // Remove fields that shouldn't be updated
  const updateData = { ...data };
  delete updateData.data_criacao; // Don't allow overwriting creation date
  
  try {
    // Use setDoc with merge: true for atomic updates
    await setDoc(docRef, updateData, { merge: true });
    return {
      data: updateData,
      error: null,
      success: true
    };
  } catch (error) {
    console.error('Error updating user profile:', error);
    return {
      data: null,
      error: {
        code: 'update-failed',
        message: 'Failed to update profile',
        details: error instanceof Error ? error.message : String(error)
      },
      success: false
    };
  }
}