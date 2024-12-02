import { fetchWithRetry } from './fetcher';
import type { ApiResponse } from './fetcher';

interface StockPrices {
  [symbol: string]: number;
}

interface StockPricesResponse {
  prices: StockPrices;
}

const FALLBACK_PRICES = {
  'TSLA': 260.54,
  'MSTR': 1250.75,
  'NVDA': 788.17,
  'AAPL': 175.84,
  'MSFT': 407.33,
  'GOOGL': 142.71,
  'META': 474.99,
  'AMZN': 174.99
};

export async function fetchStockPrices(): Promise<StockPrices> {
  try {
    const response = await fetchWithRetry<StockPricesResponse>('/api/stock-prices', {
      method: 'POST',
      body: JSON.stringify({
        symbols: Object.keys(FALLBACK_PRICES)
      })
    });

    if (!response.success || !response.data?.prices) {
      console.warn('Using fallback prices due to API error');
      return FALLBACK_PRICES;
    }

    // Validate received prices and use fallbacks if needed
    const prices = { ...FALLBACK_PRICES };
    Object.entries(response.data.prices).forEach(([symbol, price]) => {
      if (typeof price === 'number' && !isNaN(price) && price > 0) {
        prices[symbol] = price;
      }
    });

    return prices;
  } catch (error) {
    console.warn('Using fallback prices due to error:', error);
    return FALLBACK_PRICES;
  }
}