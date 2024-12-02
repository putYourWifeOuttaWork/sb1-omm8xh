import { UserProfile, UserTier } from '../types/user';

export const TIER_LABELS: Record<UserTier, string> = {
  admin: 'Community - AdminProof',
  paid: 'Community - Proof',
  unpaid: 'Not a community proof yet'
};

export const MAX_FREE_POSITIONS = 1;

export const hasAdminAccess = (user: UserProfile | null): boolean => {
  return user?.email === 'weisbergmm@gmail.com' && user?.tier === 'admin';
};

export const canAccessManage = (user: UserProfile | null): boolean => {
  return true; // Allow all users to access manage, but limit positions for unpaid users
};

export const canAccessCommunity = (user: UserProfile | null): boolean => {
  if (!user) return false;
  return ['admin', 'paid'].includes(user.tier);
};

export const canManageUsers = (user: UserProfile | null): boolean => {
  return hasAdminAccess(user);
};

export const canManageOwnData = (user: UserProfile | null): boolean => {
  return !!user;
};