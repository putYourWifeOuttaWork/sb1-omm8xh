import { collection, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { UserProfile } from '../types/user';

export const fetchUsers = async (): Promise<UserProfile[]> => {
  const usersRef = collection(db, 'users');
  const snapshot = await getDocs(usersRef);
  return snapshot.docs.map(doc => ({
    ...doc.data(),
    uid: doc.id,
  } as UserProfile));
};

export const updateUserTier = async (userId: string, tier: 'admin' | 'paid' | 'unpaid') => {
  const userRef = doc(db, 'users', userId);
  await updateDoc(userRef, { tier });
};

export const deleteUser = async (userId: string) => {
  const userRef = doc(db, 'users', userId);
  await deleteDoc(userRef);
};