import React from 'react';

interface StockCardProps {
  symbol: string;
  name: string;
  logo: string;
  price: number;
  isSelected: boolean;
  onSelect: () => void;
  tabIndex: number;
}

export function StockCard({
  symbol,
  name,
  logo,
  price,
  isSelected,
  onSelect,
  tabIndex
}: StockCardProps) {
  return (
    <button
      onClick={onSelect}
      className={`p-6 rounded-lg border-2 transition-all duration-300 w-full relative ${
        isSelected
          ? 'border-accent-blue dark:border-accent-teal bg-blue-50 dark:bg-dark-200'
          : 'border-gray-200 dark:border-dark-300 hover:border-blue-200 dark:hover:border-dark-200'
      }`}
      tabIndex={tabIndex}
    >
      {symbol === 'MSTR' && (
        <div className="absolute top-2 right-2 bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-200 text-xs px-2 py-1 rounded">
          High IV
        </div>
      )}
      <div className="flex flex-col items-center space-y-4">
        <img
          src={logo}
          alt={`${name} logo`}
          className="w-12 h-12 object-contain"
          onError={(e) => {
            e.currentTarget.src = `https://via.placeholder.com/48?text=${symbol}`;
          }}
        />
        <div className="text-center">
          <h3 className="font-semibold text-gray-900 dark:text-white">{symbol}</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">{name}</p>
          <p className="text-sm font-medium text-accent-blue dark:text-accent-teal mt-1">
            ${price.toFixed(2)}
          </p>
        </div>
      </div>
    </button>
  );
}