import React from 'react';
import { MonthlyData } from '../types/forecast';
import { YearlyMetrics } from './YearlyMetrics';

interface YearlyTabsProps {
  data: MonthlyData[];
  symbol: string;
  targetIncome: number;
}

export function YearlyTabs({ data, symbol, targetIncome }: YearlyTabsProps) {
  const startYear = new Date().getFullYear();
  const years = Array.from(
    new Set(
      data.map(d => {
        const date = new Date();
        date.setMonth(date.getMonth() + d.month);
        return date.getFullYear();
      })
    )
  ).sort();

  const [activeYear, setActiveYear] = React.useState(startYear);

  return (
    <div className="space-y-6">
      <div className="border-b border-gray-200 dark:border-dark-300">
        <nav className="flex space-x-8" aria-label="Yearly metrics">
          {years.map(year => (
            <button
              key={year}
              onClick={() => setActiveYear(year)}
              className={`
                py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap
                ${activeYear === year
                  ? 'border-accent-blue dark:border-accent-teal text-accent-blue dark:text-accent-teal'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                }
              `}
            >
              {year}
            </button>
          ))}
        </nav>
      </div>

      <YearlyMetrics
        year={activeYear}
        data={data}
        symbol={symbol}
        targetIncome={targetIncome}
      />
    </div>
  );
}