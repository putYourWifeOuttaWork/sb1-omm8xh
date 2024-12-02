import { useState, useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '../lib/firebase';
import { doc, onSnapshot, setDoc, getDoc, collection } from 'firebase/firestore';
import { UserProfile } from '../types/user';

export function useUserProfile() {
  const [user] = useAuthState(auth);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      setProfile(null);
      setLoading(false);
      return;
    }

    const initializeProfile = async () => {
      try {
        const userRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(userRef);

        if (docSnap.exists()) {
          setProfile(docSnap.data() as UserProfile);
        } else {
          // Create new profile
          const newProfile: UserProfile = {
            uid: user.uid,
            email: user.email || '',
            displayName: user.displayName || '',
            tier: 'unpaid',
            positionCount: 0,
            paymentHistory: [],
            createdAt: new Date(),
            updatedAt: new Date()
          } as UserProfile;
          await setDoc(userRef, {
            ...newProfile,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          });
          setProfile(newProfile);
        }
      } catch (err: any) {
        console.error('Error initializing profile:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    // Set up real-time listener
    const unsubscribe = onSnapshot(doc(db, 'users', user.uid), 
      (doc) => {
        if (doc.exists()) {
          setProfile(doc.data() as UserProfile);
        }
      },
      (err: any) => {
        console.error('Error in profile listener:', err);
        setError(err.message);
      }
    );

    // Initialize profile
    initializeProfile();

    return () => unsubscribe();
  }, [user]);

  return { profile, loading, error };
}