import React from 'react';
import { WizardFormData, JobType, JOB_THRESHOLDS } from '../../types/forecast';

interface StepOneProps {
  data: WizardFormData;
  onUpdate: (data: Partial<WizardFormData>) => void;
}

export function StepOne({ data, onUpdate }: StepOneProps) {
  const handleJobTypeChange = (jobType: JobType) => {
    onUpdate({
      jobType,
      monthlyIncome: JOB_THRESHOLDS[jobType].survival
    });
  };

  const jobTypeLabels: Record<JobType, string> = {
    'white-entry': 'White Collar - Entry Level',
    'white-senior': 'White Collar - Senior Level',
    'blue-rideshare': 'Blue Collar - Driving/Delivery',
    'blue-trucker': 'Blue Collar - Professional Trucking',
    'blue-skilled': 'Blue Collar - Basic Pro',
    'blue-senior': 'Blue Collar - Senior Pro'
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Monthly Income Goal</h2>
        <p className="mt-2 text-gray-600 dark:text-gray-300">
          Select similar job type and adjust your monthly income if needed
        </p>
      </div>

      <div className="max-w-md mx-auto space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
            Job Type
          </label>
          <select
            value={data.jobType}
            onChange={(e) => handleJobTypeChange(e.target.value as JobType)}
            className="w-full p-3 border border-gray-300 dark:border-dark-300 rounded-lg 
              focus:ring-2 focus:ring-accent-blue dark:focus:ring-accent-teal focus:border-transparent
              bg-white dark:bg-dark-element text-gray-900 dark:text-white"
            tabIndex={1}
          >
            <option value="">Select Job Type</option>
            {Object.entries(jobTypeLabels).map(([type, label]) => (
              <option key={type} value={type}>{label}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
            Monthly Income (after taxes)
          </label>
          <div className="relative rounded-lg shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <span className="text-gray-500 dark:text-gray-400 sm:text-lg font-medium">$</span>
            </div>
            <input
              type="number"
              value={data.monthlyIncome || ''}
              onChange={(e) => onUpdate({ monthlyIncome: Math.min(Number(e.target.value), 100000) })}
              className="block w-full pl-8 pr-16 py-4 text-lg border-2 border-gray-200 dark:border-dark-300 
                rounded-lg focus:ring-2 focus:ring-accent-blue dark:focus:ring-accent-teal focus:border-transparent 
                bg-white dark:bg-dark-element text-gray-900 dark:text-white transition-colors"
              placeholder="0.00"
              max="100000"
              tabIndex={2}
            />
            <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
              <span className="text-gray-500 dark:text-gray-400 sm:text-sm font-medium">/month</span>
            </div>
          </div>
          {data.monthlyIncome > 100000 && (
            <p className="mt-2 text-sm text-red-600 dark:text-red-400">
              Maximum monthly income cannot exceed $100,000
            </p>
          )}
        </div>

        <div className="text-center text-sm text-gray-500 dark:text-gray-400">
          <p>This will help us calculate your path to financial freedom</p>
        </div>
      </div>
    </div>
  );
}