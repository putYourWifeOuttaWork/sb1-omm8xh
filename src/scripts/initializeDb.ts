import { adminDb } from '../lib/firebase-admin';
import { COMPANY_LOGOS } from '../constants/stockData';
import { JOB_THRESHOLDS } from '../types/forecast';
import type { Stock, UserProfile } from '../types/database';
import { Timestamp } from 'firebase-admin/firestore';

async function initializeDatabase() {
  try {
    console.log('Starting database initialization...');
    
    // Verify admin connection
    try {
      const collections = await adminDb.listCollections();
      console.log('Successfully connected to Firestore');
      console.log('Existing collections:', collections.map(col => col.id));
    } catch (error) {
      console.error('Failed to connect to Firestore:', error);
      process.exit(1);
    }
    
    const batch = adminDb.batch();

    // Initialize collections
    const collections = [
      'users',
      'sessions',
      'positions',
      'positionAudits',
      'stocks',
      'plans',
      'pointSystem',
      'jobThresholds',
      'strategyParameters',
      'posts',
      'comments'
    ];

    // Create collection schemas
    for (const collectionName of collections) {
      const schemaRef = adminDb.collection(collectionName).doc('_schema');
      batch.set(schemaRef, {
        version: '1.0.0',
        created: new Date().toISOString(),
        updated: new Date().toISOString()
      });
    }

    // Initialize subscription plans
    const plansRef = adminDb.collection('plans');
    const plans = [
      {
        id: 'paid_basic_monthly',
        name: 'Paid Basic Monthly',
        price: 45,
        interval: 'month',
        features: ['Unlimited positions', 'Community read access', 'Basic analytics']
      },
      {
        id: 'paid_basic_yearly',
        name: 'Paid Basic Yearly', 
        price: 445,
        interval: 'year',
        features: ['Unlimited positions', 'Community read access', 'Basic analytics']
      },
      {
        id: 'paid_advanced_monthly',
        name: 'Paid Advanced Monthly',
        price: 150,
        interval: 'month', 
        features: ['Unlimited positions', 'Full community access', 'Advanced analytics', 'Position sharing']
      },
      {
        id: 'paid_advanced_yearly',
        name: 'Paid Advanced Yearly',
        price: 1447,
        interval: 'year',
        features: ['Unlimited positions', 'Full community access', 'Advanced analytics', 'Position sharing']
      }
    ];

    for (const plan of plans) {
      batch.set(plansRef.doc(plan.id), {
        ...plan,
        updatedAt: new Date().toISOString()
      });
    }

    // Initialize points system
    const pointsRef = adminDb.collection('pointSystem');
    batch.set(pointsRef.doc('config'), {
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

    // Initialize stocks
    const stocksRef = adminDb.collection('stocks');
    for (const [symbol, info] of Object.entries(COMPANY_LOGOS)) {
      const stockData: Partial<Stock> = {
        symbol,
        name: info.name,
        logo: info.logo,
        currentPrice: 0,
        metrics: {
          volatility: symbol === 'MSTR' ? 'high' : 'moderate',
          optionPremiumRate: symbol === 'MSTR' ? 0.09 : 0.07,
          strategicReserveRate: symbol === 'MSTR' ? 0.15 : 0.10
        },
        historicalData: [],
        updatedAt: new Date().toISOString()
      };
      batch.set(stocksRef.doc(symbol), stockData);
    }

    // Initialize job thresholds
    const thresholdsRef = adminDb.collection('jobThresholds');
    for (const [type, data] of Object.entries(JOB_THRESHOLDS)) {
      batch.set(thresholdsRef.doc(type), {
        ...data,
        endDate: data.endDate.toISOString(),
        updatedAt: new Date().toISOString()
      });
    }

    // Initialize strategy parameters
    const strategyRef = adminDb.collection('strategyParameters');
    const strategies = [
      {
        id: 'tortoise',
        name: 'Tortoise Strategy',
        leverageMultiplier: 1.25,
        monthlyRate: 0.045,
        description: 'Lower risk profile with consistent returns',
        minimumCapital: 26000
      },
      {
        id: 'hare',
        name: 'Hare Strategy',
        leverageMultiplier: 1.50,
        monthlyRate: 0.04,
        description: 'Higher risk profile with accelerated growth',
        minimumCapital: 26000
      }
    ];

    for (const strategy of strategies) {
      batch.set(strategyRef.doc(strategy.id), {
        ...strategy,
        updatedAt: new Date().toISOString()
      });
    }

    // Create admin user
    const adminRef = adminDb.collection('users').doc('admin');
    const adminData: Partial<UserProfile> = {
      email: 'weisbergmm@gmail.com',
      displayName: 'Admin',
      tier: 'admin',
      positionCount: 0,
      points: 0,
      level: 'rolling_wheel',
      stats: {
        totalPositions: 0,
        totalRolls: 0,
        totalPnL: 0
      },
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    };
    batch.set(adminRef, adminData);

    // Commit all changes
    console.log('Committing all changes...');
    await batch.commit();
    console.log('Database initialization completed successfully!');

  } catch (error: any) {
    console.error('Error initializing database:', error);
    process.exit(1);
  }
}

initializeDatabase();