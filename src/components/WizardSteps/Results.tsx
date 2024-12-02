import React, { useState, useEffect } from 'react';
import { WizardFormData, JOB_THRESHOLDS } from '../../types/forecast';
import { calculateCombinedForecast } from '../../services/combinedForecastService';
import { StockChart } from '../charts/StockChart';
import { Spinner } from '../ui/Spinner';
import { formatCurrency } from '../../utils/formatters';
import { COMPANY_LOGOS } from '../../constants/stockData';

interface ResultsProps {
  data: WizardFormData;
}

export function Results({ data }: ResultsProps) {
  const [loading, setLoading] = useState(true);
  const [forecastData, setForecastData] = useState<any>(null);
  const [contactForm, setContactForm] = useState({ name: '', email: '' });

  useEffect(() => {
    const loadForecast = async () => {
      try {
        const forecast = await calculateCombinedForecast(data);
        setForecastData(forecast);
      } catch (error) {
        console.error('Failed to calculate forecast:', error);
      } finally {
        setLoading(false);
      }
    };

    loadForecast();
  }, [data]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <Spinner size="lg" />
        <p className="mt-4 text-gray-600 dark:text-gray-300">
          Calculating your freedom forecast...
        </p>
      </div>
    );
  }

  if (!forecastData) {
    return (
      <div className="text-center text-red-600 dark:text-red-400">
        Failed to calculate forecast. Please try again.
      </div>
    );
  }

  const jobThresholds = JOB_THRESHOLDS[data.jobType];
  const daysUntilFreedom = Math.max(0, Math.floor(
    (forecastData.freedomDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
  ));

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Your Freedom Forecast
        </h2>
        <p className="mt-2 text-gray-600 dark:text-gray-300">
          Here's your path to financial independence with {data.selectedStocks.join(' & ')}
        </p>
      </div>

      {/* Summary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-dark-element p-6 rounded-xl shadow-md border border-blue-100 dark:border-dark-300">
          <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-4">
            Freedom Timeline
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-300">Days until freedom:</span>
              <span className="font-bold text-accent-blue dark:text-accent-teal">
                {daysUntilFreedom} days
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-300">Freedom date:</span>
              <span className="font-medium text-gray-900 dark:text-gray-100">
                {forecastData.freedomDate.toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-dark-element p-6 rounded-xl shadow-md border border-green-100 dark:border-dark-300">
          <h3 className="text-lg font-semibold text-green-900 dark:text-green-100 mb-4">
            Financial Metrics
          </h3>
          <div className="space-y-3">
            {forecastData.stockForecasts.map((forecast: any) => {
              const lastMonth = forecast.data.monthlyData[forecastData.freedomMonth - 1];
              return (
                <div key={forecast.symbol} className="flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <img
                      src={COMPANY_LOGOS[forecast.symbol].logo}
                      alt={`${COMPANY_LOGOS[forecast.symbol].name} logo`}
                      className="w-5 h-5 object-contain"
                      onError={(e) => {
                        e.currentTarget.src = `https://via.placeholder.com/20?text=${forecast.symbol}`;
                      }}
                    />
                    <span className="text-gray-600 dark:text-gray-300">
                      {forecast.symbol} Income:
                    </span>
                  </div>
                  <span className="font-medium text-gray-900 dark:text-gray-100">
                    {formatCurrency(lastMonth?.netIncome || 0, 2)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Stock Charts */}
      <div className="mt-8 space-y-12">
        {forecastData.stockForecasts.map((forecast: any) => (
          <div key={forecast.symbol}>
            {forecast.symbol === 'MSTR' && (
              <div className="mb-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 p-4 rounded-lg">
                <p className="text-yellow-800 dark:text-yellow-200">
                  Note: Due to high volatility and implied volatility, MSTR positions require more frequent rolling activity 
                  and maintain a higher strategic reserve of 15% vs the standard 10%.
                </p>
              </div>
            )}
            <StockChart
              data={forecast.data.monthlyData}
              symbol={forecast.symbol}
              targetIncome={data.monthlyIncome / data.selectedStocks.length}
              freedomDate={forecastData.freedomDate}
              jobEndDate={jobThresholds.endDate}
              survivalThreshold={jobThresholds.survival / data.selectedStocks.length}
              thrivingThreshold={jobThresholds.thriving / data.selectedStocks.length}
            />
          </div>
        ))}
      </div>

      {/* Contact Form */}
      <div className="bg-blue-50 dark:bg-dark-element p-6 rounded-xl">
        <h3 className="text-xl font-bold text-center text-blue-900 dark:text-blue-100 mb-6">
          Want to share this with your Wife?
        </h3>
        <form className="max-w-md mx-auto space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
              Name
            </label>
            <input
              type="text"
              id="name"
              value={contactForm.name}
              onChange={(e) => setContactForm(prev => ({ ...prev, name: e.target.value }))}
              className="w-full px-4 py-2 border border-gray-300 dark:border-dark-300 rounded-lg 
                focus:ring-2 focus:ring-accent-blue dark:focus:ring-accent-teal focus:border-transparent
                bg-white dark:bg-dark-element text-gray-900 dark:text-white"
              tabIndex={3}
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={contactForm.email}
              onChange={(e) => setContactForm(prev => ({ ...prev, email: e.target.value }))}
              className="w-full px-4 py-2 border border-gray-300 dark:border-dark-300 rounded-lg 
                focus:ring-2 focus:ring-accent-blue dark:focus:ring-accent-teal focus:border-transparent
                bg-white dark:bg-dark-element text-gray-900 dark:text-white"
              tabIndex={4}
            />
          </div>
          <button
            type="submit"
            className="w-full bg-accent-blue dark:bg-accent-teal text-white py-3 rounded-lg 
              hover:opacity-90 transition-opacity"
            tabIndex={5}
          >
            Send Pitch-Packet
          </button>
        </form>
        <p className="mt-4 text-sm text-center text-gray-600 dark:text-gray-400">
          We'll send you a Pitch-Packet with information on the strategy for you and your wife to decide. 
          We provide all free tools to execute, and an introduction to our family community.
        </p>
      </div>
    </div>
  );
}