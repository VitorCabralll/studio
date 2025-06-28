import { getFirestore, doc, getDoc, setDoc, serverTimestamp, Timestamp } from 'firebase/firestore';
import { firebaseApp, isFirebaseConfigured } from '@/lib/firebase';

const db = isFirebaseConfigured ? getFirestore(firebaseApp) : null;

export interface Workspace {
  name: string;
  members?: number;
  isOwner?: boolean;
}

export interface UserProfile {
  cargo: string;
  areas_atuacao: string[];
  primeiro_acesso: boolean;
  initial_setup_complete: boolean;
  data_criacao: Timestamp | Date;
  workspaces?: Workspace[];
}

export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  if (!isFirebaseConfigured || !db) {
     return {
        cargo: '',
        areas_atuacao: [],
        primeiro_acesso: true,
        initial_setup_complete: false,
        data_criacao: new Date(),
        workspaces: [],
    };
  }
  const docRef = doc(db, 'usuarios', uid);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    const data = docSnap.data() as UserProfile;
    if (!data.workspaces) {
      data.workspaces = [];
    }
    if (data.initial_setup_complete === undefined) {
      data.initial_setup_complete = false;
    }
    return data;
  } else {
    // We can create a default profile here if one doesn't exist
    const defaultProfile = {
        cargo: '',
        areas_atuacao: [],
        primeiro_acesso: true,
        initial_setup_complete: false,
        data_criacao: new Date(),
        workspaces: [],
    };
    await createUserProfile(uid, defaultProfile);
    const newDocSnap = await getDoc(docRef);
    return newDocSnap.data() as UserProfile;
  }
}

export async function createUserProfile(
  uid: string,
  data: Omit<UserProfile, 'data_criacao' | 'workspaces'> & { data_criacao: Date; workspaces?: Workspace[] }
) {
    if (!isFirebaseConfigured || !db) {
      console.log(`Mocking createUserProfile for user ${uid}`, data);
      return Promise.resolve();
    }
    const userDocRef = doc(db, 'usuarios', uid);
    return setDoc(userDocRef, {
        ...data,
        initial_setup_complete: data.initial_setup_complete || false,
        data_criacao: serverTimestamp(),
    });
}

export async function updateUserProfile(uid: string, data: Partial<UserProfile>) {
  if (!isFirebaseConfigured || !db) {
      console.log(`Mocking updateUserProfile for user ${uid}`, data);
      return Promise.resolve();
  }
  const userDocRef = doc(db, 'usuarios', uid);
  return setDoc(userDocRef, data, { merge: true });
}
