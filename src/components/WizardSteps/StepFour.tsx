import React, { useEffect, useState } from 'react';
import { WizardFormData } from '../../types/forecast';
import { fetchStockPrices } from '../../services/api';
import { AlertTriangle } from 'lucide-react';
import { COMPANY_LOGOS } from '../../constants/stockData';
import { scrollToNextButton } from '../../utils/scrollHelpers';
import { StockCard } from '../StockCard';
import { LoadingOverlay } from '../LoadingOverlay';

interface StepFourProps {
  data: WizardFormData;
  onUpdate: (data: Partial<WizardFormData>) => void;
}

export function StepFour({ data, onUpdate }: StepFourProps) {
  const [stockPrices, setStockPrices] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadStockPrices = async () => {
      try {
        setLoading(true);
        const prices = await fetchStockPrices();
        setStockPrices(prices);
      } catch (err) {
        setError('Failed to load stock prices. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    loadStockPrices();
  }, []);

  const validateStockSelection = (selectedStocks: string[]): boolean => {
    const leverageMultiplier = data.strategy === 'tortoise' ? 1.25 : 1.50;
    const maxBuyingPower = data.startingCapital * leverageMultiplier;
    const capitalPerStock = maxBuyingPower / selectedStocks.length;

    for (const symbol of selectedStocks) {
      const stockPrice = stockPrices[symbol] || 0;
      const contractValue = stockPrice * 100;
      
      if (contractValue > capitalPerStock) {
        setError(`Cannot sell puts on ${symbol} with current capital. Each contract requires $${contractValue.toLocaleString()} in buying power.`);
        return false;
      }
    }

    setError(null);
    return true;
  };

  const handleStockSelect = (symbol: string) => {
    const newSelection = data.selectedStocks.includes(symbol)
      ? data.selectedStocks.filter(s => s !== symbol)
      : [...data.selectedStocks, symbol].slice(0, 2);

    if (validateStockSelection(newSelection)) {
      onUpdate({ selectedStocks: newSelection });
      
      if (newSelection.includes('MSTR')) {
        alert('Note: MSTR has high volatility and implied volatility. Expect more frequent rolling activity.');
      }
      
      if (newSelection.length > 0) {
        scrollToNextButton();
      }
    }
  };

  return (
    <LoadingOverlay loading={loading}>
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Choose Your Stocks</h2>
          <p className="mt-2 text-gray-600 dark:text-gray-300">
            Select up to two stocks from the Magnificent Seven
          </p>
        </div>

        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 flex items-start space-x-3">
            <AlertTriangle className="w-5 h-5 text-red-500 dark:text-red-400 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Object.entries(COMPANY_LOGOS).map(([symbol, info], index) => (
            <StockCard
              key={symbol}
              symbol={symbol}
              name={info.name}
              logo={info.logo}
              price={stockPrices[symbol] || 0}
              isSelected={data.selectedStocks.includes(symbol)}
              onSelect={() => handleStockSelect(symbol)}
              tabIndex={index + 1}
            />
          ))}
        </div>

        <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
          Selected: {data.selectedStocks.length}/2 stocks
        </p>
      </div>
    </LoadingOverlay>
  );
}