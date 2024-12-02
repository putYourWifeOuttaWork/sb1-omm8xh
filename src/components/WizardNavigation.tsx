import React from 'react';
import { RotateCcw } from 'lucide-react';
import { scrollToTop } from '../utils/scrollHelpers';
import { Circle } from 'lucide-react';

interface WizardNavigationProps {
  currentStep: number;
  onStepClick: (step: number) => void;
  onReset: () => void;
}

export function WizardNavigation({ currentStep, onStepClick, onReset }: WizardNavigationProps) {
  const steps = [1, 2, 3, 4, 5];

  return (
    <div className="space-y-4" data-wizard-navigation>
      <div className="flex items-center justify-center space-x-4 md:space-x-4">
        {steps.map((step, index) => {
          const isActive = step === currentStep;
          const isPast = step < currentStep;
          const isClickable = step <= currentStep;

          const baseClass = "flex items-center justify-center transition-all duration-200";
          const mobileClass = "w-12 h-12 text-lg font-bold md:hidden";
          const desktopClass = "hidden md:flex w-10 h-10 rounded-full";
          const stateClass = isActive
            ? "bg-accent-blue dark:bg-accent-teal text-white scale-110 shadow-lg"
            : isPast
              ? "bg-accent-blue/20 dark:bg-accent-teal/20 text-accent-blue dark:text-accent-teal"
              : "bg-gray-100 dark:bg-dark-300 text-gray-400 dark:text-gray-500";

          return (
            <React.Fragment key={step}>
              {index > 0 && (
                <div 
                  className={`h-0.5 w-12 transition-colors ${
                    isPast ? 'bg-accent-blue dark:bg-accent-teal' : 'bg-gray-200 dark:bg-dark-300'
                  }`} 
                />
              )}
              <div className="relative">
                {/* Mobile number display */}
                <button
                  onClick={() => isClickable && onStepClick(step)}
                  disabled={!isClickable}
                  className={`${baseClass} ${mobileClass} ${
                    isActive
                      ? 'text-accent-blue dark:text-accent-teal'
                      : isPast
                        ? 'text-accent-blue/70 dark:text-accent-teal/70'
                        : 'text-gray-400 dark:text-gray-500'
                  }`}
                  aria-label={`Step ${step}`}
                >
                  {step}
                </button>
                
                {/* Desktop circular display */}
                <button
                  onClick={() => isClickable && onStepClick(step)}
                  disabled={!isClickable}
                  className={`${baseClass} ${desktopClass} ${stateClass} ${
                    !isClickable ? 'cursor-not-allowed' : 'hover:opacity-90'
                  }`}
                  aria-label={`Step ${step}`}
                >
                  <span className="text-sm">{step}</span>
                </button>
              </div>
            </React.Fragment>
          );
        })}
      </div>

      <div className="flex justify-center">
        <button
          onClick={onReset}
          className="flex items-center space-x-2 px-4 py-2 text-gray-600 dark:text-gray-300 
            hover:text-gray-900 dark:hover:text-white transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Start Over</span>
        </button>
      </div>
    </div>
  );
}