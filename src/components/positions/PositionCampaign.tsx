import React, { useState } from 'react';
import { ArrowRightCircle, AlertTriangle, CheckCircle } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';
import { estimateDeltaStrike } from '../../services/deltaStrikeService';

interface Roll {
  id: string;
  date: string;
  strikePrice: number;
  premium: number;
  expirationDate: string;
}

interface PositionCampaignProps {
  currentPrice: number;
  initialStrike: number;
  positionType: 'short_put' | 'short_call';
  rolls: Roll[];
  onAddRoll: (roll: Omit<Roll, 'id'>) => void;
  onEndCampaign: (type: 'close' | 'profit') => void;
}

export function PositionCampaign({
  currentPrice,
  initialStrike,
  positionType,
  rolls,
  onAddRoll,
  onEndCampaign
}: PositionCampaignProps) {
  const [newRoll, setNewRoll] = useState({
    date: new Date().toISOString().split('T')[0],
    strikePrice: initialStrike,
    premium: initialStrike * 0.06, 
    expirationDate: new Date(new Date().setDate(new Date().getDate() + 32)).toISOString().split('T')[0]
  });

  const calculateNewRollStrike = () => {
    // Calculate expiration date based on the selected roll date
    const rollDate = new Date(newRoll.date);
    const expirationDate = new Date(rollDate);
    expirationDate.setDate(rollDate.getDate() + 32);
    
    const strike = estimateDeltaStrike({
      currentPrice,
      desiredDelta: 42.5, // Midpoint of 40-45 delta
      daysToExpiration: 32,
      isCall: positionType === 'short_call'
    });
    
    setNewRoll(prev => ({
      ...prev,
      strikePrice: strike,
      premium: Number((strike * 0.06).toFixed(2)),
      expirationDate: expirationDate.toISOString().split('T')[0]
    }));
  };

  const totalPremium = rolls.reduce((sum, roll) => sum + roll.premium, 0);
  const taxReserve = totalPremium * 0.25;
  const safetyReserve = totalPremium * 0.05;
  const netPremium = totalPremium - taxReserve - safetyReserve;

  const calculateUnrealizedPnL = () => {
    if (!rolls.length) return 0;
    const lastRoll = rolls[rolls.length - 1];
    const intrinsicValue = positionType === 'short_put' 
      ? Math.max(0, lastRoll.strikePrice - currentPrice)
      : Math.max(0, currentPrice - lastRoll.strikePrice);
    const daysToExpiry = Math.ceil(
      (new Date(lastRoll.expirationDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
    );
    const remainingExtrinsic = (daysToExpiry / 30) * (lastRoll.premium / 2);
    return -(intrinsicValue + remainingExtrinsic) * 100;
  };

  const handleAddRoll = () => {
    onAddRoll(newRoll);
    setNewRoll({
      date: new Date().toISOString().split('T')[0],
      strikePrice: initialStrike,
      premium: initialStrike * 0.06,
      expirationDate: ''
    });
  };

  const unrealizedPnL = calculateUnrealizedPnL();
  const isInProfit = unrealizedPnL > 0;

  return (
    <div className="mt-6 space-y-6">
      <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 p-6 rounded-lg">
        <div className="flex items-start space-x-3">
          <AlertTriangle className="w-6 h-6 text-yellow-500 dark:text-yellow-400 flex-shrink-0" />
          <div>
            <h3 className="text-lg font-semibold text-yellow-800 dark:text-yellow-200">
              Active Roll Campaign
            </h3>
            <p className="mt-1 text-sm text-yellow-700 dark:text-yellow-300">
              {`Managing ${positionType === 'short_put' ? 'put' : 'call'} position with ${rolls.length} roll${rolls.length === 1 ? '' : 's'}`}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-dark-element p-6 rounded-lg shadow-sm">
          <div className="flex items-center space-x-2">
            <span className="text-2xl">$</span>
            <h4 className="text-lg font-medium text-gray-900 dark:text-white">Total Premium</h4>
          </div>
          <p className="mt-2 text-2xl font-semibold text-gray-900 dark:text-white">
            {formatCurrency(totalPremium, 2)}
          </p>
        </div>

        <div className="bg-white dark:bg-dark-element p-6 rounded-lg shadow-sm">
          <div className="flex items-center space-x-2">
            <span className="text-2xl">$</span>
            <h4 className="text-lg font-medium text-gray-900 dark:text-white">Campaign Tax Reserve</h4>
          </div>
          <p className="mt-2 text-2xl font-semibold text-gray-900 dark:text-white">
            {formatCurrency(taxReserve, 2)} (25%)
          </p>
        </div>

        <div className="bg-white dark:bg-dark-element p-6 rounded-lg shadow-sm">
          <div className="flex items-center space-x-2">
            <span className="text-2xl">$</span>
            <h4 className="text-lg font-medium text-gray-900 dark:text-white">Net Premium</h4>
          </div>
          <p className="mt-2 text-2xl font-semibold text-gray-900 dark:text-white">
            {formatCurrency(netPremium, 2)}
          </p>
        </div>
      </div>

      <div className="bg-white dark:bg-dark-element p-6 rounded-lg shadow-sm">
        <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Roll History</h4>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 dark:bg-dark-200">
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 dark:text-gray-300">Date</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 dark:text-gray-300">Strike</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 dark:text-gray-300">Premium</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 dark:text-gray-300">Expiration</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-dark-300">
              {rolls.map((roll) => (
                <tr key={roll.id}>
                  <td className="px-4 py-2 text-gray-900 dark:text-gray-100">{roll.date}</td>
                  <td className="px-4 py-2 text-gray-900 dark:text-gray-100">{formatCurrency(roll.strikePrice, 2)}</td>
                  <td className="px-4 py-2 text-gray-900 dark:text-gray-100">{formatCurrency(roll.premium, 2)}</td>
                  <td className="px-4 py-2 text-gray-900 dark:text-gray-100">{roll.expirationDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white dark:bg-dark-element p-6 rounded-lg shadow-sm">
        <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Add New Roll</h4>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="col-span-4 mb-2">
            <button
              onClick={calculateNewRollStrike}
              className="w-full p-3 bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-200 
                rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/30 transition-colors"
            >
              Calculate 40-45 Delta Strike (32 DTE)
            </button>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Date</label>
            <input
              type="date"
              value={newRoll.date}
              onChange={(e) => {
                const newDate = e.target.value;
                const expirationDate = new Date(newDate);
                expirationDate.setDate(new Date(newDate).getDate() + 32);
                setNewRoll(prev => ({ 
                  ...prev, 
                  date: newDate,
                  expirationDate: expirationDate.toISOString().split('T')[0]
                }));
              }}
              className="w-full p-2 border border-gray-300 dark:border-dark-300 rounded-lg 
                focus:ring-2 focus:ring-accent-blue dark:focus:ring-accent-teal focus:border-transparent
                bg-white dark:bg-dark-element text-gray-900 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Strike Price</label>
            <input
              type="number"
              value={newRoll.strikePrice}
              onChange={(e) => setNewRoll(prev => ({ ...prev, strikePrice: Number(e.target.value) }))}
              className="w-full p-2 border border-gray-300 dark:border-dark-300 rounded-lg 
                focus:ring-2 focus:ring-accent-blue dark:focus:ring-accent-teal focus:border-transparent
                bg-white dark:bg-dark-element text-gray-900 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Premium</label>
            <input
              type="number"
              value={newRoll.premium}
              onChange={(e) => setNewRoll(prev => ({ ...prev, premium: Number(e.target.value) }))}
              className="w-full p-2 border border-gray-300 dark:border-dark-300 rounded-lg 
                focus:ring-2 focus:ring-accent-blue dark:focus:ring-accent-teal focus:border-transparent
                bg-white dark:bg-dark-element text-gray-900 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Expiration</label>
            <input
              type="date"
              value={newRoll.expirationDate}
              onChange={(e) => setNewRoll(prev => ({ ...prev, expirationDate: e.target.value }))}
              className="w-full p-2 border border-gray-300 dark:border-dark-300 rounded-lg 
                focus:ring-2 focus:ring-accent-blue dark:focus:ring-accent-teal focus:border-transparent
                bg-white dark:bg-dark-element text-gray-900 dark:text-white"
            />
          </div>
        </div>
        <div className="mt-4 flex justify-end space-x-4">
          <button
            onClick={() => handleAddRoll()}
            className="px-4 py-2 bg-accent-blue dark:bg-accent-teal text-white rounded-lg 
              hover:opacity-90 transition-colors"
          >
            Add Roll
          </button>
        </div>
      </div>

      <div className="flex justify-end space-x-4">
        <button
          onClick={() => onEndCampaign('close')}
          disabled={isInProfit}
          className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors 
            disabled:opacity-50 disabled:cursor-not-allowed"
        >
          End Campaign
        </button>
          </div>
    </div>
  );
}