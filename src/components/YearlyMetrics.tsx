import React from 'react';
import { MonthlyData } from '../types/forecast';
import { formatCurrency } from '../utils/formatters';
import { ProgressVisualization } from './charts/ProgressVisualization';

interface YearlyMetricsProps {
  year: number;
  data: MonthlyData[];
  symbol: string;
  targetIncome: number;
}

export function YearlyMetrics({ year, data, symbol, targetIncome }: YearlyMetricsProps) {
  const startMonth = (year - new Date().getFullYear()) * 12;
  const endMonth = startMonth + 11;
  const yearData = data.slice(startMonth, endMonth + 1).filter(Boolean);

  if (!yearData.length) return null;

  const minContracts = Math.min(...yearData.map(d => d.contracts));
  const maxContracts = Math.max(...yearData.map(d => d.contracts));
  const totalIncome = yearData.reduce((sum, d) => sum + d.netIncome, 0);
  const yearTaxFund = yearData[yearData.length - 1]?.currentYearTaxFund || 0;
  const yearReserve = yearData.reduce((sum, d) => sum + d.strategicReserve, 0);

  const startProgress = (yearData[0]?.netIncome / targetIncome) * 100;
  const endProgress = (yearData[yearData.length - 1]?.netIncome / targetIncome) * 100;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {/* Progress Visualization - Moved to top */}
      <div className="bg-white dark:bg-dark-element p-6 rounded-xl shadow-md col-span-full">
        <div className="flex justify-center">
          <ProgressVisualization
            startProgress={startProgress}
            endProgress={endProgress}
          />
        </div>
      </div>

      <div className="bg-white dark:bg-dark-element p-6 rounded-xl shadow-md">
        <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Contract Growth
        </h4>
        <p className="text-gray-600 dark:text-gray-300">
          Went from {minContracts} to {maxContracts} Contracts
        </p>
      </div>

      <div className="bg-white dark:bg-dark-element p-6 rounded-xl shadow-md">
        <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Income Summary
        </h4>
        <p className="text-gray-600 dark:text-gray-300">
          Total Income from {symbol}: {formatCurrency(totalIncome, 2)}
        </p>
      </div>

      <div className="bg-white dark:bg-dark-element p-6 rounded-xl shadow-md">
        <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Tax Fund
        </h4>
        <p className="text-gray-600 dark:text-gray-300">
          Tax Fund Max: {formatCurrency(yearTaxFund, 2)}
        </p>
      </div>

      <div className="bg-white dark:bg-dark-element p-6 rounded-xl shadow-md">
        <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Strategic Reserve
        </h4>
        <p className="text-gray-600 dark:text-gray-300">
          Reserve Collected: {formatCurrency(yearReserve, 2)}
        </p>
      </div>
    </div>
  );
}