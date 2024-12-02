import React from 'react';
import { AlertTriangle, ArrowRightCircle, CheckCircle } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';

interface PositionAdvisorProps {
  currentPrice: number;
  strikePrice: number;
  expirationDate: string;
  positionType: 'short_put' | 'short_call';
  quantity: number;
  creditReceived: number;
  currentOptionPrice: number;
}

export function PositionAdvisor({ 
  currentPrice, 
  strikePrice, 
  expirationDate,
  positionType,
  quantity,
  creditReceived,
  currentOptionPrice
}: PositionAdvisorProps) {
  if (!currentPrice || !strikePrice || !expirationDate) return null;

  const daysToExpiry = Math.ceil(
    (new Date(expirationDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
  );

  const isExpired = daysToExpiry < 0;
  if (isExpired) {
    return (
      <div className="p-6 rounded-lg border border-red-200 bg-red-50 dark:bg-red-900/20 dark:border-red-800">
        <div className="flex items-start space-x-3">
          <AlertTriangle className="w-6 h-6 text-red-500 dark:text-red-400 flex-shrink-0" />
          <div>
            <h3 className="text-lg font-semibold text-red-800 dark:text-red-200">
              Position Expired
            </h3>
            <p className="mt-1 text-sm text-red-700 dark:text-red-300">
              This position expired on {new Date(expirationDate).toLocaleDateString()}. 
              Please add a new position to track a new roll or open position.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const priceChange = ((currentPrice - strikePrice) / strikePrice) * 100;
  const totalCredit = creditReceived * quantity;
  const taxReserve = totalCredit * 0.25;
  const safetyReserve = totalCredit * 0.05;
  const shares = quantity * 100;
  const profitAndLoss = currentOptionPrice ? ((creditReceived - currentOptionPrice) / creditReceived) * 100 : 0;

  const getAdvice = () => {
    const isPut = positionType === 'short_put';
    const isCall = positionType === 'short_call';
    const daysThreshold = 14;

    // Rule 1: >50% PnL at any time (highest priority)
    if (profitAndLoss > 50) {
      return {
        action: 'ROLL',
        color: 'green',
        message: `Roll this position. With ${profitAndLoss.toFixed(1)}% profit secured, roll to 40-45 delta strike 30-35 days out.`
      };
    }

    // Short Put Rules
    if (isPut) {
      // Rule 2: ≤15 DTE with positive PnL
      if (daysToExpiry <= 15 && profitAndLoss > 0) {
        return {
          action: 'ROLL',
          color: 'green',
          message: `Time-based roll with profit. Roll to 40-45 delta strike 30-35 days out.`
        };
      }
      
      // Rule 3: ≤15 DTE with negative PnL
      if (daysToExpiry <= 15 && profitAndLoss < 0) {
        return {
          action: 'ROLL',
          color: 'yellow',
          message: `Roll to same strike (${formatCurrency(strikePrice, 2)}) 30-35 days out. Winning Campaign initiated.`
        };
      }
      
      // Assignment Rule: ITM less than 1% at expiration
      if (daysToExpiry === 0 && priceChange < 0 && priceChange > -1) {
        return {
          action: 'PREPARE',
          color: 'blue',
          message: `Prepare to be put ${shares.toLocaleString()} shares at ${formatCurrency(strikePrice, 2)} in ${daysToExpiry} days.`
        };
      }
    }

    // Short Call Rules
    if (isCall) {
      // Rule 4: ≥50% PnL at any time
      if (profitAndLoss >= 50) {
        return {
          action: 'CHOOSE',
          color: 'green',
          message: `Choose to: 1) Roll to same strike 30-35 days out, or 2) Close position and hold shares`
        };
      }
      
      // Rule 5: <49% PnL and ≤15 DTE
      if (profitAndLoss < 49 && daysToExpiry <= 15) {
        return {
          action: 'CHOOSE',
          color: 'yellow',
          message: `Time-based management: 1) Roll to same strike 30-35 days out, or 2) Close position and hold shares`
        };
      }

      // Assignment Rule: Near ATM at expiration
      if (daysToExpiry === 0 && priceChange >= -1 && priceChange <= 0) {
        return {
          action: 'PREPARE',
          color: 'blue',
          message: `Prepare to have ${shares.toLocaleString()} shares called away at ${formatCurrency(strikePrice, 2)} in ${daysToExpiry} days.`
        };
      }
    }

    // General Rules
    if ((isCall || isPut) && Math.abs(priceChange) >= 4 && daysToExpiry >= daysThreshold) {
      return {
        action: 'STAY',
        color: 'green',
        message: `Stay in position. ${daysToExpiry} days remaining provides adequate time for price recovery.`
      };
    }

    return {
      action: 'MONITOR',
      color: 'blue',
      message: 'Position within normal parameters. Continue monitoring.'
    };
  };

  const advice = getAdvice();
  
  return (
    <div className="mt-6 space-y-6">
      <div className={`p-4 sm:p-6 rounded-lg border ${
        advice.color === 'yellow' 
          ? 'bg-yellow-50 border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-800'
          : advice.color === 'green'
            ? 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800'
            : 'bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800'
      }`}>
        <div className="flex items-start space-x-3">
          {advice.color === 'yellow' ? (
            <AlertTriangle className="w-6 h-6 text-yellow-500 dark:text-yellow-400 flex-shrink-0" />
          ) : advice.color === 'green' ? (
            <CheckCircle className="w-6 h-6 text-green-500 dark:text-green-400 flex-shrink-0" />
          ) : (
            <ArrowRightCircle className="w-6 h-6 text-blue-500 dark:text-blue-400 flex-shrink-0" />
          )}
          <div className="flex-1">
            <h3 className={`text-lg font-semibold ${
              advice.color === 'yellow'
                ? 'text-yellow-800 dark:text-yellow-200'
                : advice.color === 'green'
                  ? 'text-green-800 dark:text-green-200'
                  : 'text-blue-800 dark:text-blue-200'
            }`}>
              TradFi Family Analysis
            </h3>
            <p className={`mt-1 text-sm ${
              advice.color === 'yellow'
                ? 'text-yellow-700 dark:text-yellow-300'
                : advice.color === 'green'
                  ? 'text-green-700 dark:text-green-300'
                  : 'text-blue-700 dark:text-blue-300'
            }`}>
              {advice.message}
            </p>
            {profitAndLoss > 0 && (
              <p className="mt-2 text-sm font-medium text-green-600 dark:text-green-400">
                Current Profit: {profitAndLoss.toFixed(1)}%
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        <div className="bg-white dark:bg-dark-element p-6 rounded-lg shadow-sm">
          <div className="flex items-center space-x-2">
            <span className="text-2xl">$</span>
            <h4 className="text-lg font-medium text-gray-900 dark:text-white">Total Credit</h4>
          </div>
          <p className="mt-2 text-2xl font-semibold text-gray-900 dark:text-white">
            {formatCurrency(totalCredit, 2)}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {quantity} contract{quantity > 1 ? 's' : ''} × {formatCurrency(creditReceived, 2)}
          </p>
        </div>

        <div className="bg-white dark:bg-dark-element p-6 rounded-lg shadow-sm">
          <div className="flex items-center space-x-2">
            <span className="text-2xl">$</span>
            <h4 className="text-lg font-medium text-gray-900 dark:text-white">Tax Reserve</h4>
          </div>
          <p className="mt-2 text-2xl font-semibold text-gray-900 dark:text-white">
            {formatCurrency(taxReserve, 2)} (25%)
          </p>
        </div>

        <div className="bg-white dark:bg-dark-element p-6 rounded-lg shadow-sm">
          <div className="flex items-center space-x-2">
            <span className="text-2xl">$</span>
            <h4 className="text-lg font-medium text-gray-900 dark:text-white">Safety Reserve</h4>
          </div>
          <p className="mt-2 text-2xl font-semibold text-gray-900 dark:text-white">
            {formatCurrency(safetyReserve, 2)} (5%)
          </p>
        </div>
      </div>
    </div>
  );
}