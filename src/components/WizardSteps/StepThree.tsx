import React from 'react';
import { WizardFormData } from '../../types/forecast';

interface StepThreeProps {
  data: WizardFormData;
  onUpdate: (data: Partial<WizardFormData>) => void;
}

export function StepThree({ data, onUpdate }: StepThreeProps) {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-blue-900">Choose Your Strategy</h2>
        <p className="mt-2 text-white-600">Select the approach that best fits your goals</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <button
          onClick={() => onUpdate({ strategy: 'tortoise' })}
          className={`relative p-6 rounded-xl border-2 transition-all duration-300 text-left ${
            data.strategy === 'tortoise'
              ? 'border-cyan-500 bg-cyan-50'
              : 'border-gray-200 hover:border-cyan-200 hover:bg-cyan-50/50'
          }`}
        >
          <div className="flex flex-col space-y-4">
            <div className="flex items-center space-x-4">
              <span role="img" aria-label="tortoise" className="text-4xl">🐢</span>
              <div>
                <h3 className="font-semibold text-lg text-gray-900">Tortoise Strategy</h3>
                <p className="text-sm text-gray-600">0.25x Leverage maximum</p>
              </div>
            </div>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>• Goes fast enough for most</li>
              <li>• Wins the race plenty</li>
              <li>• Requires Tier one trading account</li>
              <li>• Lower risk profile</li>
            </ul>
          </div>
        </button>

        <button
          onClick={() => onUpdate({ strategy: 'hare' })}
          className={`relative p-6 rounded-xl border-2 transition-all duration-300 text-left ${
            data.strategy === 'hare'
              ? 'border-pink-500 bg-pink-50'
              : 'border-gray-200 hover:border-pink-200 hover:bg-pink-50/50'
          }`}
        >
          <div className="flex flex-col space-y-4">
            <div className="flex items-center space-x-4">
              <span role="img" aria-label="hare" className="text-4xl">🐰</span>
              <div>
                <h3 className="font-semibold text-lg text-gray-900">Hare Strategy</h3>
                <p className="text-sm text-gray-600">0.50x Leverage maximum</p>
              </div>
            </div>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>• Faster growth potential</li>
              <li>• Wins most of the time</li>
              <li>• Better for advanced users</li>
              <li>• Requires strict rule adherence</li>
            </ul>
          </div>
        </button>
      </div>
    </div>
  );
}