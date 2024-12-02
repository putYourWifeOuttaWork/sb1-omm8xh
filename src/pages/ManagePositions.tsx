import React, { useState, useEffect } from 'react';
import { Plus, FileSpreadsheet } from 'lucide-react';
import { COMPANY_LOGOS } from '../constants/stockData';
import { PositionCard } from '../components/positions';
import { fetchStockPrices } from '../services/stockService';
import { scrollToElement } from '../utils/scrollHelpers';
import { useUserProfile } from '../hooks/useUserProfile';
import { MAX_FREE_POSITIONS, canAccessManage } from '../utils/permissions';
import { useNavigate } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../lib/firebase';
import { UpgradeModal } from '../components/UpgradeModal';
import { AuthModal } from '../components/auth/AuthModal';
import { exportPositionsToCSV } from '../utils/csvExport';

interface Position {
  id: number;
  data?: {
    symbol: string;
    positionType: 'short_put' | 'short_call';
    strikePrice: number;
    currentPrice: number;
    quantity: number;
    creditReceived: number;
    expirationDate: string;
    currentOptionPrice: number;
  };
}

export function ManagePositions() {
  const [positions, setPositions] = useState<Position[]>([{ id: 1 }]);
  const [stockPrices, setStockPrices] = useState<Record<string, number>>({});
  const [user] = useAuthState(auth);
  const { profile } = useUserProfile();
  const [hasCompletePosition, setHasCompletePosition] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  useEffect(() => {
    fetchStockPrices().then(setStockPrices);
  }, []);

  const isPositionComplete = (data: Position['data']) => {
    if (!data) return false;
    return !!(
      data.symbol &&
      data.strikePrice &&
      data.currentPrice &&
      data.quantity &&
      data.creditReceived &&
      data.expirationDate &&
      data.currentOptionPrice
    );
  };

  useEffect(() => {
    const complete = positions.some(p => isPositionComplete(p.data));
    setHasCompletePosition(complete);
  }, [positions]);

  const handleAddPosition = () => {
    if (positions.length >= MAX_FREE_POSITIONS && (!user || (user && profile?.tier === 'unpaid'))) {
      setShowUpgradeModal(true);
      return;
    }

    const newPosition = { id: positions.length + 1 };
    setPositions(prev => [...prev, newPosition]);
    
    // Scroll to new position after a brief delay to ensure DOM update
    setTimeout(() => {
      const positionElements = document.querySelectorAll('[data-position-id]');
      const lastPosition = positionElements[positionElements.length - 1];
      if (lastPosition) {
        lastPosition.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 100);
  };

  const deletePosition = (id: number) => {
    setPositions(prev => {
      const filtered = prev.filter(position => position.id !== id);
      
      // Find the previous position to scroll to
      const prevPosition = filtered.find(p => p.id < id);
      if (prevPosition) {
        setTimeout(() => {
          const prevElement = document.querySelector(`[data-position-id="${prevPosition.id}"]`);
          if (prevElement) {
            prevElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }, 100);
      }
      
      return filtered;
    });
  };

  const handleExport = () => {
    const positionsData = positions
      .filter(p => p.data) // Only export positions with data
      .map(p => p.data!);
    
    exportPositionsToCSV(positionsData);
  };

  return (
    <div className="py-4 sm:py-8 px-3 sm:px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
Self-Advisory With DeflationProofWheel          </h1>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Manage your short options positions with confidence
          </p>
          {!user && (
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 max-w-2xl mx-auto">
              <p className="text-sm text-blue-700 dark:text-blue-300">
                Guest users can create {MAX_FREE_POSITIONS} position. Sign in to unlock unlimited positions and access all features.
              </p>
            </div>
          )}
        </div>

        <div className="space-y-6">
          {positions.map((position) => (
            <PositionCard
              key={position.id}
              position={position.id}
              stockPrices={stockPrices}
              companyLogos={COMPANY_LOGOS}
              onUpdate={(data) => {
                setPositions(prev => prev.map(p => 
                  p.id === position.id ? { ...p, data } : p
                ));
              }}
              onDelete={() => deletePosition(position.id)}
            />
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-6 sm:mt-8">
          <button
            onClick={handleAddPosition}
            className="w-full sm:flex-1 p-3 sm:p-4 bg-accent-blue dark:bg-accent-teal text-white rounded-lg 
              hover:opacity-90 transition-colors duration-200 flex items-center justify-center shadow-lg"
          >
            <Plus className="h-5 w-5 mr-2" />
            Add Another Position
          </button>
          <button
            className="w-full sm:flex-1 p-3 sm:p-4 bg-accent-green dark:bg-accent-green/90 text-white rounded-lg 
              hover:opacity-90 transition-colors duration-200 flex items-center justify-center shadow-lg"
            onClick={handleExport}
            disabled={!hasCompletePosition}
          >
            <FileSpreadsheet className="h-5 w-5 mr-2" />
            Export to Spreadsheet
          </button>
        </div>
      </div>
      <UpgradeModal 
        isOpen={showUpgradeModal} 
        onClose={() => setShowUpgradeModal(false)} 
      />
    </div>
  );
}