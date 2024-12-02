import React, { useState, useEffect } from 'react';
import { Trash2, Settings } from 'lucide-react';
import { Plus, FileSpreadsheet } from 'lucide-react';
import { useFieldHighlight } from '../../hooks/useFieldHighlight';
import { scrollToElement } from '../../utils/scrollHelpers';
import { PositionAdvisor } from './PositionAdvisor';
import { PositionCampaign } from './PositionCampaign';
import { calculateOptionPrice } from '../../services/optionPriceService';
import { COMPANY_LOGOS } from '../../constants/stockData';

interface Roll {
  id: string;
  date: string;
  strikePrice: number;
  premium: number;
  expirationDate: string;
}

interface PositionCardProps {
  position: number;
  stockPrices: Record<string, number>;
  companyLogos: Record<string, { name: string; logo: string; }>;
  onDelete?: () => void;
  onUpdate?: (data: {
    symbol: string;
    positionType: 'short_put' | 'short_call';
    strikePrice: number;
    currentPrice: number;
    quantity: number;
    creditReceived: number;
    expirationDate: string;
    currentOptionPrice: number;
  }) => void;
}

export function PositionCard({ position, stockPrices, companyLogos, onDelete, onUpdate }: PositionCardProps) {
  const [selectedStock, setSelectedStock] = useState('');
  const [positionType, setPositionType] = useState<'short_put' | 'short_call'>('short_put');
  const [currentPrice, setCurrentPrice] = useState<number>(0);
  const [strikePrice, setStrikePrice] = useState<number>(0);
  const [quantity, setQuantity] = useState<number>(1);
  const [creditReceived, setCreditReceived] = useState<number>(0);
  const [expirationDate, setExpirationDate] = useState('');
  const [showCampaign, setShowCampaign] = useState(false);
  const [currentOptionPrice, setCurrentOptionPrice] = useState<number>(0);
  const [rolls, setRolls] = useState<Roll[]>([]);
  const [strikePriceError, setStrikePriceError] = useState<string>('');
  const [expirationError, setExpirationError] = useState<string>('');
  const { highlightedField, moveToNextField } = useFieldHighlight([
    'stock-select',
    'position-type',
    'strike-price',
    'expiration-date',
    'estimate-button'
  ]);

  // Calculate profit metrics
  const calculateProfitMetrics = () => {
    if (!creditReceived || !currentOptionPrice) return null;
    
    const unrealizedProfit = creditReceived - currentOptionPrice;
    const profitPercentage = (unrealizedProfit / creditReceived) * 100;
    
    return {
      unrealizedProfit,
      profitPercentage
    };
  };

  // Update credit received when strike price changes
  React.useEffect(() => {
    if (strikePrice > 0) {
      // Set credit received to 6% of strike price
      setCreditReceived(Number((strikePrice * 0.06).toFixed(2)));
    }
  }, [strikePrice]);

  const handleEstimatePrice = () => {
    if (!strikePrice || !currentPrice || !expirationDate) {
      if (!expirationDate) {
        setExpirationError('Expiration Date For Position Required');
      }
      return;
    }
    setExpirationError('');
    
    const estimate = calculateOptionPrice({
      strikePrice,
      currentPrice,
      expirationDate,
      initialPremium: creditReceived
    });
    
    setCurrentOptionPrice(estimate.finalPrice);
  };

  // Update parent component with position data
  useEffect(() => {
    if (selectedStock && strikePrice && expirationDate && onUpdate) {
      const timer = setTimeout(() => {
        onUpdate({
          symbol: selectedStock,
          positionType,
          strikePrice,
          currentPrice,
          quantity,
          creditReceived,
          expirationDate,
          currentOptionPrice
        });
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [
    selectedStock,
    positionType,
    strikePrice,
    currentPrice,
    quantity,
    creditReceived,
    expirationDate,
    currentOptionPrice,
    // Removed onUpdate from dependencies to prevent infinite loop
    onUpdate
  ]);
  // Update current price when stock selection changes
  React.useEffect(() => {
    if (selectedStock && stockPrices[selectedStock]) {
      setCurrentPrice(stockPrices[selectedStock]);
    }
  }, [selectedStock, stockPrices]);

  const handleStartCampaign = () => {
    // Initialize the first roll with current position data
    const initialRoll: Roll = {
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0],
      strikePrice,
      premium: creditReceived,
      expirationDate
    };
    setRolls([initialRoll]);
    setShowCampaign(true);
  };

  const handleAddRoll = (newRoll: Omit<Roll, 'id'>) => {
    const roll: Roll = {
      ...newRoll,
      id: Date.now().toString()
    };
    setRolls(prev => [...prev, roll]);
  };

  const handleEndCampaign = (type: 'close' | 'profit') => {
    setShowCampaign(false);
    setRolls([]);
    if (type === 'profit') {
      // Reset position for new trade
      setStrikePrice(0);
      setCreditReceived(0);
      setExpirationDate('');
    }
  };

  const shouldShowRollCampaignButton = () => {
    if (!strikePrice || !currentPrice || !expirationDate) return false;
    
    // Calculate price change percentage
    const priceChange = ((currentPrice - strikePrice) / strikePrice) * 100;
    
    const profitMetrics = calculateProfitMetrics();
    
    // Only show button if position is showing a loss
    if (!profitMetrics || profitMetrics.profitPercentage >= 0) return false;
    
    // Check ITM conditions based on position type
    const isITM = positionType === 'short_call' 
      ? priceChange >= 1.0  // Current price is above strike by at least 1%
      : priceChange <= -1.0; // Current price is below strike by at least 1%
    
    return isITM;
  };

  return (
    <div className="bg-white dark:bg-dark-element rounded-xl shadow-lg overflow-hidden" data-position-id={position}>
      {/* Header section */}
      <div className="bg-accent-blue dark:bg-accent-teal px-6 py-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-white flex items-center">
            <Settings className="h-5 w-5 mr-2" />
            Position {position}
          </h2>
          {onDelete && (
            <button
              onClick={onDelete}
              className="text-white hover:text-red-200 transition-colors"
              aria-label="Delete position"
            >
              <Trash2 className="h-5 w-5" />
            </button>
          )}
        </div>
      </div>

      <div className="p-6">
        {/* Form fields */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          {/* Stock selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Stock
            </label>
            <select
              value={selectedStock}
              onChange={(e) => setSelectedStock(e.target.value)}
              data-highlight="stock-select"
              className={`w-full p-3 border border-gray-300 dark:border-dark-300 rounded-lg 
                focus:ring-2 focus:ring-accent-blue dark:focus:ring-accent-teal focus:border-transparent
                ${highlightedField === 'stock-select' ? 'ring-2 ring-accent-blue dark:ring-accent-teal animate-pulse' : ''}
                bg-white dark:bg-dark-element text-gray-900 dark:text-white`}
              onFocus={() => moveToNextField('position-type')}
            >
              <option value="">Select Stock</option>
              {Object.entries(stockPrices).map(([symbol, price]) => (
                <option key={symbol} value={symbol}>
                  {companyLogos[symbol].name} ({symbol}) - ${price.toFixed(2)}
                </option>
              ))}
            </select>
          </div>

          {/* Position type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Position Type
            </label>
            <select
              value={positionType}
              onChange={(e) => setPositionType(e.target.value as 'short_put' | 'short_call')}
              data-highlight="position-type"
              className={`w-full p-3 border border-gray-300 dark:border-dark-300 rounded-lg 
                focus:ring-2 focus:ring-accent-blue dark:focus:ring-accent-teal focus:border-transparent
                ${highlightedField === 'position-type' ? 'ring-2 ring-accent-blue dark:ring-accent-teal animate-pulse' : ''}
                bg-white dark:bg-dark-element text-gray-900 dark:text-white`}
              onFocus={() => moveToNextField('strike-price')}
            >
              <option value="short_put">Short Put</option>
              <option value="short_call">Short Call</option>
            </select>
          </div>

          {/* Current price */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Current Stock Price
            </label>
            <input
              type="number"
              value={currentPrice}
              onChange={(e) => setCurrentPrice(Number(e.target.value))}
              className="w-full p-3 border border-gray-300 dark:border-dark-300 rounded-lg 
                focus:ring-2 focus:ring-accent-blue dark:focus:ring-accent-teal focus:border-transparent
                bg-white dark:bg-dark-element text-gray-900 dark:text-white"
            />
          </div>

          {/* Strike price and quantity */}
          <div className="grid grid-cols-1 xs:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Sold Option Strike Price
              </label>
              <input
                type="number"
                value={strikePrice}
                data-highlight="strike-price"
                onChange={(e) => {
                  const value = Number(e.target.value);
                  setStrikePrice(value);
                }}
                className={`w-full p-3 border border-gray-300 dark:border-dark-300 rounded-lg 
                  focus:ring-2 focus:ring-accent-blue dark:focus:ring-accent-teal focus:border-transparent
                  ${highlightedField === 'strike-price' ? 'ring-2 ring-accent-blue dark:ring-accent-teal animate-pulse' : ''}
                  bg-white dark:bg-dark-element text-gray-900 dark:text-white`}
                onFocus={() => moveToNextField('expiration-date')}
              />
              {!strikePrice && (
                <p className="mt-2 text-[#32C08E] text-sm">
                  Strike Price Required
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Quantity Contracts
              </label>
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="w-full p-3 border border-gray-300 dark:border-dark-300 rounded-lg 
                  focus:ring-2 focus:ring-accent-blue dark:focus:ring-accent-teal focus:border-transparent
                  bg-white dark:bg-dark-element text-gray-900 dark:text-white"
                min="1"
              />
            </div>
          </div>
          
         
 {/* Expiration date */}
           {/* Credit received */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Credit Received (per contract at open or roll)
            </label>
            <input
              type="number"
              value={creditReceived}
              onChange={(e) => setCreditReceived(Number(e.target.value))}
              className="w-full p-3 border border-gray-300 dark:border-dark-300 rounded-lg 
                focus:ring-2 focus:ring-accent-blue dark:focus:ring-accent-teal focus:border-transparent
                bg-white dark:bg-dark-element text-gray-900 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Option Expiration Date
            </label>
            <input
              type="date"
              value={expirationDate}
              data-highlight="expiration-date"
              onChange={(e) => setExpirationDate(e.target.value)}
              className={`w-full p-3 border border-gray-300 dark:border-dark-300 rounded-lg 
                focus:ring-2 focus:ring-accent-blue dark:focus:ring-accent-teal focus:border-transparent
                ${highlightedField === 'expiration-date' ? 'ring-2 ring-accent-blue dark:ring-accent-teal animate-pulse' : ''}
                bg-white dark:bg-dark-element text-gray-900 dark:text-white`}
              onFocus={() => moveToNextField('estimate-button')}
            />
            {expirationError && (
              <p className="mt-2 text-[#32C08E] text-sm">
                {expirationError}
              </p>
            )}
          </div>
          {/* Current Option Price and Auto-Estimate centered column */}
          <div className="col-span-1 sm:col-span-2 mx-auto w-full max-w-md space-y-3 sm:space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Current Option Price
              </label>
              <input
                type="number"
                value={currentOptionPrice}
                onChange={(e) => setCurrentOptionPrice(Number(e.target.value))}
                className="w-full p-3 border border-gray-300 dark:border-dark-300 rounded-lg
                  focus:ring-2 focus:ring-accent-blue dark:focus:ring-accent-teal focus:border-transparent 
                  bg-white dark:bg-dark-element text-gray-900 dark:text-white"
              />
            </div>
            <button
              data-highlight="estimate-button"
              onClick={handleEstimatePrice}
              className={`w-full p-3 rounded-lg transition-all duration-300
                ${highlightedField === 'estimate-button' || expirationDate
                  ? 'bg-accent-blue dark:bg-accent-teal text-white animate-pulse shadow-lg'
                  : 'bg-gray-100 dark:bg-dark-200 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-dark-300'
                }`}
            >
              Auto-Estimate Price
            </button>
          </div>

          {/* Profit Metrics */}
          {calculateProfitMetrics() && (
            <div className="col-span-1 sm:col-span-2 bg-gray-50 dark:bg-dark-200 p-3 sm:p-4 rounded-lg">
              <div className="grid grid-cols-1 xs:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Unrealized Profit
                  </label>
                  <span className={`text-lg font-semibold ${
                    calculateProfitMetrics()!.unrealizedProfit >= 0 
                      ? 'text-green-600 dark:text-green-400' 
                      : 'text-red-600 dark:text-red-400'
                  }`}>
                    ${calculateProfitMetrics()!.unrealizedProfit.toFixed(2)}
                  </span>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Profit %
                  </label>
                  <span className={`text-lg font-semibold ${
                    calculateProfitMetrics()!.profitPercentage >= 0 
                      ? 'text-green-600 dark:text-green-400' 
                      : 'text-red-600 dark:text-red-400'
                  }`}>
                    {calculateProfitMetrics()!.profitPercentage.toFixed(2)}%
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Position advisor or campaign */}
        {selectedStock && strikePrice && expirationDate && (
          <div className="mt-6">
            {!showCampaign ? (
              <>
                <PositionAdvisor
                  currentPrice={currentPrice}
                  strikePrice={strikePrice}
                  expirationDate={expirationDate}
                  positionType={positionType}
                  quantity={quantity}
                  creditReceived={creditReceived}
                  currentOptionPrice={currentOptionPrice}
                />
                {shouldShowRollCampaignButton() && (
                  <button
                    onClick={handleStartCampaign}
                    className="mt-4 w-full p-3 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 
                      transition-colors duration-200 flex items-center justify-center"
                  >
                    Start Roll Campaign
                  </button>
                )}
              </>
            ) : (
              <PositionCampaign
                currentPrice={currentPrice}
                initialStrike={strikePrice}
                positionType={positionType}
                rolls={rolls}
                onAddRoll={handleAddRoll}
                onEndCampaign={handleEndCampaign}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}