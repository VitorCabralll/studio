import { getFirestore, doc, getDoc, setDoc, serverTimestamp, Timestamp } from 'firebase/firestore';
import { firebaseApp, isFirebaseConfigured } from '@/lib/firebase';

const db = isFirebaseConfigured ? getFirestore(firebaseApp) : null;

export interface UserProfile {
  cargo: string;
  areas_atuacao: string[];
  primeiro_acesso: boolean;
  data_criacao: Timestamp | Date;
  workspaces?: { name: string }[];
}

export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  if (!isFirebaseConfigured || !db) {
     return {
        cargo: '',
        areas_atuacao: [],
        primeiro_acesso: true,
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
    return data;
  } else {
    // We can create a default profile here if one doesn't exist
    const defaultProfile = {
        cargo: '',
        areas_atuacao: [],
        primeiro_acesso: true,
        data_criacao: new Date(),
        workspaces: [],
    };
    await createUserProfile(uid, defaultProfile);
    const newDocSnap = await getDoc(docRef);
    return newDocSnap.data() as UserProfile;
  }
}

export async function createUserProfile(uid: string, data: Omit<UserProfile, 'data_criacao' | 'workspaces'> & {data_criacao: Date, workspaces?: {name: string}[]}) {
    if (!isFirebaseConfigured || !db) {
      console.log(`Mocking createUserProfile for user ${uid}`, data);
      return Promise.resolve();
    }
    const userDocRef = doc(db, 'usuarios', uid);
    return setDoc(userDocRef, {
        ...data,
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
