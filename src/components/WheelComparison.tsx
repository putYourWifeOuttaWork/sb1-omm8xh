import React from 'react';
import { ArrowDown, ArrowUp } from 'lucide-react';

export function WheelComparison() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6 bg-white dark:bg-dark-element rounded-lg shadow-lg">
      {/* Conventional Wheel */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold text-red-600 dark:text-red-400">Conventional Wheel</h3>
          <ArrowDown className="w-6 h-6 text-red-600 dark:text-red-400" />
        </div>
        <ul className="space-y-3 text-gray-700 dark:text-gray-300">
          <li className="flex items-start space-x-2">
            <span className="text-red-600 dark:text-red-400">•</span>
            <span>Holds positions until expiration</span>
          </li>
          <li className="flex items-start space-x-2">
            <span className="text-red-600 dark:text-red-400">•</span>
            <span>Takes assignment when stock moves against position</span>
          </li>
          <li className="flex items-start space-x-2">
            <span className="text-red-600 dark:text-red-400">•</span>
            <span>Ties up capital in stock ownership</span>
          </li>
          <li className="flex items-start space-x-2">
            <span className="text-red-600 dark:text-red-400">•</span>
            <span>Profits decrease over time due to losses from assignments</span>
          </li>
          <li className="flex items-start space-x-2">
            <span className="text-red-600 dark:text-red-400">•</span>
            <span>Higher risk of significant drawdowns</span>
          </li>
        </ul>
      </div>

      {/* Rolling Wheel */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold text-green-600 dark:text-green-400">Rolling Wheel</h3>
          <ArrowUp className="w-6 h-6 text-green-600 dark:text-green-400" />
        </div>
        <ul className="space-y-3 text-gray-700 dark:text-gray-300">
          <li className="flex items-start space-x-2">
            <span className="text-green-600 dark:text-green-400">•</span>
            <span>Actively manages positions before expiration</span>
          </li>
          <li className="flex items-start space-x-2">
            <span className="text-green-600 dark:text-green-400">•</span>
            <span>Rolls positions to avoid assignment</span>
          </li>
          <li className="flex items-start space-x-2">
            <span className="text-green-600 dark:text-green-400">•</span>
            <span>Maintains consistent buying power</span>
          </li>
          <li className="flex items-start space-x-2">
            <span className="text-green-600 dark:text-green-400">•</span>
            <span>Compounds gains through strategic rolling</span>
          </li>
          <li className="flex items-start space-x-2">
            <span className="text-green-600 dark:text-green-400">•</span>
            <span>Lower risk through active management</span>
          </li>
        </ul>
      </div>
    </div>
  );
}