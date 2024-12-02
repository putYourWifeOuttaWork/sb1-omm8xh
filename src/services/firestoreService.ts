import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  updateDoc, 
  deleteDoc,
  query,
  where,
  serverTimestamp,
  Timestamp
} from 'firebase/firestore';
import { db } from '../lib/firebase';

// User Management
export const createUserProfile = async (userId: string, data: any) => {
  const userRef = doc(db, 'users', userId);
  await setDoc(userRef, {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  });
};

export const updateUserProfile = async (userId: string, data: any) => {
  const userRef = doc(db, 'users', userId);
  await updateDoc(userRef, {
    ...data,
    updatedAt: serverTimestamp()
  });
};

// Session Management
export const createSession = async (userId: string, deviceInfo: any) => {
  const sessionsRef = collection(db, 'sessions');
  const sessionData = {
    userId,
    startTime: serverTimestamp(),
    device: deviceInfo,
    actions: []
  };
  await setDoc(doc(sessionsRef), sessionData);
};

export const logSessionAction = async (sessionId: string, action: any) => {
  const sessionRef = doc(db, 'sessions', sessionId);
  await updateDoc(sessionRef, {
    actions: [...(await getDoc(sessionRef)).data()?.actions || [], {
      ...action,
      timestamp: serverTimestamp()
    }]
  });
};

// Position Management
export const createPosition = async (userId: string, positionData: any) => {
  const positionsRef = collection(db, 'positions');
  await setDoc(doc(positionsRef), {
    userId,
    ...positionData,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  });
};

export const updatePosition = async (positionId: string, updates: any) => {
  const positionRef = doc(db, 'positions', positionId);
  await updateDoc(positionRef, {
    ...updates,
    updatedAt: serverTimestamp()
  });
};

// Stock Management
export const updateStockData = async (stockId: string, data: any) => {
  const stockRef = doc(db, 'stocks', stockId);
  await setDoc(stockRef, {
    ...data,
    lastUpdated: serverTimestamp()
  }, { merge: true });
};

// Freedom Date Management
export const updateFreedomDate = async (userId: string, data: any) => {
  const freedomDateRef = doc(db, 'freedomDates', userId);
  await setDoc(freedomDateRef, {
    ...data,
    lastUpdated: serverTimestamp()
  }, { merge: true });
};

// Queries
export const getUserPositions = async (userId: string) => {
  const positionsRef = collection(db, 'positions');
  const q = query(positionsRef, where('userId', '==', userId));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
};

export const getUserSessions = async (userId: string) => {
  const sessionsRef = collection(db, 'sessions');
  const q = query(sessionsRef, where('userId', '==', userId));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
};

// Stock Data Collection - Admin Only
export const initializeStockData = async (userId: string) => {
  // Verify admin status first
  const userRef = doc(db, 'users', userId);
  const userDoc = await getDoc(userRef);
  if (!userDoc.exists() || userDoc.data()?.tier !== 'admin') {
    throw new Error('Permission denied');
  }

  const stocksRef = collection(db, 'stocks');
  const stockData = {
    'TSLA': { price: 260.54, name: 'Tesla' },
    'MSTR': { price: 1250.75, name: 'MicroStrategy' },
    'NVDA': { price: 788.17, name: 'NVIDIA' },
    'AAPL': { price: 175.84, name: 'Apple' },
    'MSFT': { price: 407.33, name: 'Microsoft' },
    'GOOGL': { price: 142.71, name: 'Google' },
    'META': { price: 474.99, name: 'Meta' },
    'AMZN': { price: 174.99, name: 'Amazon' }
  };

  for (const [symbol, data] of Object.entries(stockData)) {
    await setDoc(doc(stocksRef, symbol), {
      ...data,
      updatedAt: serverTimestamp(),
      historicalData: [],
      metrics: {
        volatility: symbol === 'MSTR' ? 'high' : 'moderate',
        optionPremiumRate: symbol === 'MSTR' ? 0.09 : 0.07,
        strategicReserveRate: symbol === 'MSTR' ? 0.15 : 0.10
      }
    });
  }
};

// Job Thresholds Collection - Admin Only
export const initializeJobThresholds = async (userId: string) => {
  // Verify admin status first
  const userRef = doc(db, 'users', userId);
  const userDoc = await getDoc(userRef);
  if (!userDoc.exists() || userDoc.data()?.tier !== 'admin') {
    throw new Error('Permission denied');
  }

  const thresholdsRef = collection(db, 'jobThresholds');
  const thresholdData = {
    'white-entry': {
      survival: 6000,
      thriving: 9000,
      endDate: '2025-12-31',
      description: 'Entry Level White Collar'
    },
    'white-senior': {
      survival: 18000,
      thriving: 27000,
      endDate: '2026-12-31',
      description: 'Senior Level White Collar'
    },
    'blue-rideshare': {
      survival: 7500,
      thriving: 11250,
      endDate: '2026-12-31',
      description: 'Ride Share/Delivery'
    },
    'blue-trucker': {
      survival: 15000,
      thriving: 22500,
      endDate: '2028-12-31',
      description: 'Professional Trucking'
    },
    'blue-skilled': {
      survival: 9000,
      thriving: 13500,
      endDate: '2030-12-31',
      description: 'Basic Professional'
    }
  };

  for (const [type, data] of Object.entries(thresholdData)) {
    await setDoc(doc(thresholdsRef, type), {
      ...data,
      updatedAt: serverTimestamp()
    });
  }
};

// Strategy Parameters Collection - Admin Only
export const initializeStrategyParameters = async (userId: string) => {
  // Verify admin status first
  const userRef = doc(db, 'users', userId);
  const userDoc = await getDoc(userRef);
  if (!userDoc.exists() || userDoc.data()?.tier !== 'admin') {
    throw new Error('Permission denied');
  }

  const strategyRef = collection(db, 'strategyParameters');
  const strategyData = {
    'tortoise': {
      leverageMultiplier: 1.25,
      monthlyRate: 0.045,
      description: 'Lower risk profile with consistent returns',
      minimumCapital: 26000
    },
    'hare': {
      leverageMultiplier: 1.50,
      monthlyRate: 0.04,
      description: 'Higher risk profile with accelerated growth',
      minimumCapital: 26000
    }
  };

  for (const [strategy, data] of Object.entries(strategyData)) {
    await setDoc(doc(strategyRef, strategy), {
      ...data,
      updatedAt: serverTimestamp()
    });
  }
};