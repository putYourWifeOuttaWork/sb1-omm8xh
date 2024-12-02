import React, { useState } from 'react';
import { ValidationTooltip } from './ValidationTooltip';

interface FormFieldProps {
  label: string;
  type: 'text' | 'number' | 'date' | 'select';
  value: string | number;
  onChange: (value: any) => void;
  onBlur?: () => void;
  validation?: {
    required?: boolean;
    min?: number;
    max?: number;
    pattern?: RegExp;
    message?: string;
  };
  options?: Array<{ value: string; label: string }>;
  highlightRef?: string;
  isHighlighted?: boolean;
  onFocus?: () => void;
}

export function FormField({
  label,
  type,
  value,
  onChange,
  onBlur,
  validation,
  options,
  highlightRef,
  isHighlighted,
  onFocus
}: FormFieldProps) {
  const [showTooltip, setShowTooltip] = useState(false);
  const [error, setError] = useState<string>('');

  const validate = () => {
    if (!validation) return true;

    if (validation.required && !value) {
      setError(`${label} is required`);
      return false;
    }

    if (type === 'number') {
      const numValue = Number(value);
      if (validation.min !== undefined && numValue < validation.min) {
        setError(`Minimum value is ${validation.min}`);
        return false;
      }
      if (validation.max !== undefined && numValue > validation.max) {
        setError(`Maximum value is ${validation.max}`);
        return false;
      }
    }

    if (validation.pattern && typeof value === 'string' && !validation.pattern.test(value)) {
      setError(validation.message || 'Invalid format');
      return false;
    }

    setError('');
    return true;
  };

  const handleBlur = () => {
    const isValid = validate();
    setShowTooltip(!isValid);
    if (onBlur) onBlur();
  };

  const handleFocus = () => {
    if (onFocus) onFocus();
    setShowTooltip(!!error);
  };

  const baseClasses = `w-full p-3 border border-gray-300 dark:border-dark-300 rounded-lg 
    focus:ring-2 focus:ring-accent-blue dark:focus:ring-accent-teal focus:border-transparent
    ${isHighlighted ? 'ring-2 ring-accent-blue dark:ring-accent-teal animate-pulse' : ''}
    bg-white dark:bg-dark-element text-gray-900 dark:text-white`;

  return (
    <div className="relative">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        {label}
      </label>
      <div className="relative">
        {type === 'select' ? (
          <select
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onBlur={handleBlur}
            onFocus={handleFocus}
            data-highlight={highlightRef}
            className={baseClasses}
          >
            {options?.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        ) : (
          <input
            type={type}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onBlur={handleBlur}
            onFocus={handleFocus}
            data-highlight={highlightRef}
            className={baseClasses}
          />
        )}
        <ValidationTooltip
          message={error}
          show={showTooltip}
          type="error"
        />
      </div>
    </div>
  );
}