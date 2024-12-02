import { useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../lib/firebase';
import { createUserProfile, getUserProfile } from '../services/userService';
import { useUserProfile } from './useUserProfile';

export function useAuth() {
  const [user, loading, error] = useAuthState(auth);
  const { profile, loading: profileLoading } = useUserProfile();

  useEffect(() => {
    const initializeUserProfile = async () => {
      if (user && !profileLoading) {
        const existingProfile = await getUserProfile(user.uid);
        if (!existingProfile) {
          await createUserProfile(user.uid, {
            email: user.email || '',
            displayName: user.displayName || ''
          });
        }
      }
    };

    initializeUserProfile();
  }, [user, profileLoading]);

  return {
    user,
    profile,
    loading: loading || profileLoading,
    error
  };
}