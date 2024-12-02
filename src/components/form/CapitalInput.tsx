import React, { useState, useEffect } from 'react';
import { Info } from 'lucide-react';

interface CapitalInputProps {
  value: number | null;
  onChange: (value: number) => void;
  error?: string | null;
  tabIndex?: number;
}

export function CapitalInput({ value, onChange, error, tabIndex = 0 }: CapitalInputProps) {
  const [inputValue, setInputValue] = useState<string>(value?.toString() || '');
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    // Update input value when prop changes
    if (value !== null) {
      setInputValue(value.toString());
    }
  }, [value]);

  const validateInput = (val: string): boolean => {
    if (!val) return false;
    const numValue = Number(val);
    return !isNaN(numValue) && numValue >= 26000;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Remove any non-numeric characters except decimal point
    const sanitizedValue = e.target.value.replace(/[^\d.]/g, '');
    
    // Ensure only one decimal point
    const parts = sanitizedValue.split('.');
    const cleanedValue = parts[0] + (parts.length > 1 ? '.' + parts[1] : '');
    
    setInputValue(cleanedValue);
    
    const numValue = Number(cleanedValue);
    const valid = validateInput(cleanedValue);
    setIsValid(valid);
    
    if (!isNaN(numValue)) {
      onChange(numValue);
    }
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
        Available Capital for Brokerage Account
      </label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <span className="text-gray-500 dark:text-gray-400 sm:text-sm">$</span>
        </div>
        <input
          type="text"
          value={inputValue}
          onChange={handleChange}
          className={`block w-full pl-8 pr-12 py-3 text-lg border-2 
            ${error 
              ? 'border-red-500 dark:border-red-400' 
              : isValid
                ? 'border-green-500 dark:border-green-400'
                : 'border-gray-300 dark:border-gray-600'
            } rounded-lg focus:ring-2 focus:ring-accent-blue dark:focus:ring-accent-teal 
            bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
          placeholder="Minimum $26,000"
          tabIndex={tabIndex}
        />
      </div>
      {error && (
        <div className="mt-2 flex items-start text-red-600 dark:text-red-400">
          <Info className="h-5 w-5 mr-2 flex-shrink-0" />
          <p className="text-sm">{error}</p>
        </div>
      )}
      {isValid && !error && (
        <p className="mt-2 text-sm text-green-600 dark:text-green-400">
          ✓ Capital requirement met
        </p>
      )}
    </div>
  );
}