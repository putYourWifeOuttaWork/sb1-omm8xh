export interface Position {
  id: string;
  userId: string;
  symbol: string;
  positionType: 'short_put' | 'short_call';
  strikePrice: number;
  currentPrice: number;
  quantity: number;
  creditReceived: number;
  expirationDate: string;
  currentOptionPrice: number;
  status: 'open' | 'closed' | 'rolled';
  strategy: 'tortoise' | 'hare';
  unrealizedPnL: number;
  realizedPnL: number;
  taxReserve: number;
  strategicReserve: number;
  netIncome: number;
  daysToExpiration: number;
  rollHistory?: RollRecord[];
  createdAt: string;
  updatedAt: string;
}

export interface RollRecord {
  id: string;
  positionId: string;
  date: string;
  oldStrike: number;
  newStrike: number;
  creditReceived: number;
  expirationDate: string;
  pnL: number;
}

export interface Session {
  id: string;
  userId: string;
  startTime: string;
  endTime?: string;
  device: {
    type: string;
    browser: string;
    os: string;
  };
  actions: SessionAction[];
}

export interface SessionAction {
  type: 'position_created' | 'position_updated' | 'position_rolled' | 'position_closed';
  details: any;
  timestamp: string;
}

export interface Stock {
  symbol: string;
  name: string;
  logo: string;
  currentPrice: number;
  metrics: {
    volatility: 'low' | 'moderate' | 'high';
    optionPremiumRate: number;
    strategicReserveRate: number;
  };
  historicalData: {
    date: string;
    price: number;
  }[];
  updatedAt: string;
}

export interface PositionAudit {
  id: string;
  positionId: string;
  userId: string;
  action: 'created' | 'updated' | 'rolled' | 'closed';
  changes: {
    field: string;
    oldValue: any;
    newValue: any;
  }[];
  timestamp: string;
}

export interface CommunityPost {
  id: string;
  userId: string;
  title: string;
  content: string;
  positionId?: string;
  likes: number;
  comments: number;
  createdAt: string;
  updatedAt: string;
}

export interface Comment {
  id: string;
  postId: string;
  userId: string;
  content: string;
  likes: number;
  createdAt: string;
  updatedAt: string;
}