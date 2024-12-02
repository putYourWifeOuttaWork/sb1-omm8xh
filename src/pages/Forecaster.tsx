import React from 'react';
import { ForecastChart } from '../components/ForecastChart';

export function Forecaster() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-4 md:p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <header className="text-center space-y-4">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800">Income Forecaster</h1>
          <p className="text-lg text-gray-600">
            Project your potential income growth based on different strategies
          </p>
        </header>
        
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <ForecastChart />
        </div>
      </div>
    </div>
  );
}