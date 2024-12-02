import { collection, doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { COMPANY_LOGOS } from '../constants/stockData';
import { JOB_THRESHOLDS } from '../types/forecast';

export async function initializeFirestoreData() {
  // Initialize Subscription Plans
  const plansRef = collection(db, 'plans');
  await setDoc(doc(plansRef, 'paid_basic_monthly'), {
    name: 'Paid Basic Monthly',
    price: 45,
    interval: 'month',
    features: [
      'Unlimited positions',
      'Community read access',
      'Basic analytics'
    ],
    updatedAt: new Date().toISOString()
  });

  await setDoc(doc(plansRef, 'paid_basic_yearly'), {
    name: 'Paid Basic Yearly',
    price: 445,
    interval: 'year',
    features: [
      'Unlimited positions',
      'Community read access',
      'Basic analytics'
    ],
    updatedAt: new Date().toISOString()
  });

  await setDoc(doc(plansRef, 'paid_advanced_monthly'), {
    name: 'Paid Advanced Monthly',
    price: 150,
    interval: 'month',
    features: [
      'Unlimited positions',
      'Full community access',
      'Advanced analytics',
      'Position sharing'
    ],
    updatedAt: new Date().toISOString()
  });

  await setDoc(doc(plansRef, 'paid_advanced_yearly'), {
    name: 'Paid Advanced Yearly',
    price: 1447,
    interval: 'year',
    features: [
      'Unlimited positions',
      'Full community access',
      'Advanced analytics',
      'Position sharing'
    ],
    updatedAt: new Date().toISOString()
  });

  // Initialize Points System
  const pointsRef = collection(db, 'pointSystem');
  await setDoc(doc(pointsRef, 'config'), {
    levels: {
      conventional_wheel: { required: 0, name: 'Conventional Wheel' },
      tasty_wheel: { required: 500, name: 'Tasty Wheel' },
      rolling_wheel: { required: 5000, name: 'Rolling Wheel' }
    },
    actions: {
      new_position: { points: 50, name: 'New Position' },
      roll_position: { points: 100, name: 'Roll Position' }
    },
    updatedAt: new Date().toISOString()
  });

  // Initialize Stocks Collection
  const stocksRef = collection(db, 'stocks');
  for (const [symbol, info] of Object.entries(COMPANY_LOGOS)) {
    await setDoc(doc(stocksRef, symbol), {
      symbol,
      name: info.name,
      logo: info.logo,
      metrics: {
        volatility: symbol === 'MSTR' ? 'high' : 'moderate',
        optionPremiumRate: symbol === 'MSTR' ? 0.09 : 0.07,
        strategicReserveRate: symbol === 'MSTR' ? 0.15 : 0.10
      },
      updatedAt: new Date().toISOString()
    });
  }

  // Initialize Job Thresholds
  const thresholdsRef = collection(db, 'jobThresholds');
  for (const [type, data] of Object.entries(JOB_THRESHOLDS)) {
    await setDoc(doc(thresholdsRef, type), {
      ...data,
      endDate: data.endDate.toISOString(),
      updatedAt: new Date().toISOString()
    });
  }

  // Initialize Strategy Parameters
  const strategyRef = collection(db, 'strategyParameters');
  await setDoc(doc(strategyRef, 'tortoise'), {
    name: 'Tortoise Strategy',
    leverageMultiplier: 1.25,
    monthlyRate: 0.045,
    description: 'Lower risk profile with consistent returns',
    minimumCapital: 26000,
    updatedAt: new Date().toISOString()
  });

  await setDoc(doc(strategyRef, 'hare'), {
    name: 'Hare Strategy',
    leverageMultiplier: 1.50,
    monthlyRate: 0.04,
    description: 'Higher risk profile with accelerated growth',
    minimumCapital: 26000,
    updatedAt: new Date().toISOString()
  });
}