import { doc, setDoc, getDoc, updateDoc, collection, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { UserProfile } from '../types/user';

export const fetchAllUsers = async (): Promise<UserProfile[]> => {
  const usersCollection = collection(db, 'users');
  const snapshot = await getDocs(usersCollection);
  return snapshot.docs.map(doc => ({
    ...doc.data(),
    uid: doc.id
  } as UserProfile));
};

export const createUserProfile = async (uid: string, data: Partial<UserProfile>) => {
  const userRef = doc(db, 'users', uid);
  const defaultProfile: UserProfile = {
    uid,
    email: data.email || '',
    displayName: data.displayName || '',
    tier: 'unpaid',
    positionCount: 0,
    paymentHistory: [],
    createdAt: new Date(),
    updatedAt: new Date()
  };

  await setDoc(userRef, defaultProfile);
  return defaultProfile;
};

export const updateUserTier = async (uid: string, tier: UserProfile['tier']) => {
  const userRef = doc(db, 'users', uid);
  await updateDoc(userRef, {
    tier,
    updatedAt: new Date()
  });
};

export const getUserProfile = async (uid: string): Promise<UserProfile | null> => {
  const userRef = doc(db, 'users', uid);
  const docSnap = await getDoc(userRef);
  
  if (docSnap.exists()) {
    return docSnap.data() as UserProfile;
  }
  return null;
};

export const updateUserProfile = async (uid: string, data: Partial<UserProfile>) => {
  const userRef = doc(db, 'users', uid);
  await updateDoc(userRef, {
    ...data,
    updatedAt: new Date().toISOString()
  });
};

export const incrementPositionCount = async (uid: string) => {
  const userRef = doc(db, 'users', uid);
  const userSnap = await getDoc(userRef);
  
  if (userSnap.exists()) {
    const currentCount = userSnap.data().positionCount || 0;
    await updateDoc(userRef, {
      positionCount: currentCount + 1,
      updatedAt: new Date().toISOString()
    });
  }
};