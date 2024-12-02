import * as functions from 'firebase-functions';
import * as express from 'express';
import * as cors from 'cors';
import fetch from 'node-fetch';
import { appCheckVerification } from './appCheck';

const app = express();
const FINNHUB_API_KEY = 'csh3759r01qu99bfpum0csh3759r01qu99bfpumg';

// Configure CORS
const corsOptions = cors({
  origin: [
    'https://deflationproof.com',
    'https://deflationproof.web.app',
    'http://localhost:5173'
  ],
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'X-Firebase-AppCheck'],
  credentials: true,
  maxAge: 86400 // 24 hours
});

app.use(corsOptions);
app.use(express.json());

// Pre-flight OPTIONS handler
app.options('*', corsOptions);

// Stock prices endpoint
app.post('/api/stock-prices', appCheckVerification, async (req, res) => {
  const { symbols } = req.body;

  if (!Array.isArray(symbols)) {
    return res.status(400).json({ 
      success: false, 
      error: 'Invalid symbols array' 
    });
  }

  try {
    const prices = await Promise.all(
      symbols.map(async (symbol) => {
        try {
          const response = await fetch(
            `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${FINNHUB_API_KEY}`,
            { headers: { 'Accept': 'application/json' }}
          );
          
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          
          const data = await response.json();
          return [symbol, data.c]; // Current price
        } catch (error) {
          console.error(`Error fetching ${symbol}:`, error);
          return [symbol, null];
        }
      })
    );

    const priceMap = Object.fromEntries(prices);
    
    res.json({
      success: true,
      data: { prices: priceMap }
    });
  } catch (error) {
    console.error('Error fetching stock prices:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch stock prices' 
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Export the Express app as a Firebase Cloud Function
export const api = functions
  .runWith({
    timeoutSeconds: 30,
    memory: '256MB'
  })
  .https.onRequest(app);