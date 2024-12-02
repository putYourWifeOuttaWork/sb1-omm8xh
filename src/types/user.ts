export type UserTier = 'admin' | 'paid_basic' | 'paid_advanced' | 'visitor';

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  tier: UserTier;
  positionCount: number;
  points: number;
  level: 'conventional_wheel' | 'tasty_wheel' | 'rolling_wheel';
  stripeCustomerId?: string;
  subscriptionId?: string;
  paymentHistory: PaymentRecord[];
  stats: {
    totalPositions: number;
    totalRolls: number;
    totalPnL: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface PaymentRecord {
  id: string;
  amount: number;
  status: 'succeeded' | 'failed' | 'pending' | 'refunded';
  createdAt: Date;
  type: 'subscription' | 'one-time';
}