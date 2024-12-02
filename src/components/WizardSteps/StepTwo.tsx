import React from 'react';
import { WizardFormData } from '../../types/forecast';
import { validateCapital, validateMonthlyContribution } from '../../utils/validationHelpers';
import { CapitalInput } from '../form/CapitalInput';
import { scrollToNextButton } from '../../utils/scrollHelpers';

interface StepTwoProps {
  data: WizardFormData;
  onUpdate: (data: Partial<WizardFormData>) => void;
}

export function StepTwo({ data, onUpdate }: StepTwoProps) {
  const [capitalError, setCapitalError] = React.useState<string | null>(null);
  const [capital, setCapital] = React.useState<number | null>(null);

  const handleCapitalChange = (value: number) => {
    setCapital(value || null);
    const error = validateCapital(value);
    setCapitalError(error);
    if (!error) {
      onUpdate({ startingCapital: value });
      if (value >= 26000) {
        scrollToNextButton();
      }
    }
  };

  const handleContributionChange = (value: number) => {
    const error = validateMonthlyContribution(value);
    if (!error) {
      onUpdate({ monthlyContribution: value });
      scrollToNextButton();
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white-900">Capital Requirements</h2>
        <p className="mt-2 text-white-600">Let's understand your investment capacity</p>
      </div>

      <div className="max-w-md mx-auto space-y-4">
        <CapitalInput
          value={capital}
          onChange={handleCapitalChange}
          error={capitalError}
          tabIndex={1}
        />

        <div>
          <label className="block text-sm font-medium text-white-700">
            Monthly Contribution
          </label>
          <div className="mt-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-white-500 sm:text-sm">$</span>
            </div>
            <input
              type="number"
              value={data.monthlyContribution || ''}
              onChange={(e) => handleContributionChange(Number(e.target.value))}
              className="block w-full pl-7 pr-12 py-3 text-lg border-white-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              placeholder="0.00"
              tabIndex={2}
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <span className="text-white-500 sm:text-sm">/month</span>
            </div>
          </div>
          <p className="mt-2 text-sm text-[#32C08E]">
            We recommend adding as much as you possibly can
          </p>
        </div>
      </div>
    </div>
  );
}