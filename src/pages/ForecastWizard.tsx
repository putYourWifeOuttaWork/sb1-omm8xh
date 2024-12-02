import React, { useState } from 'react';
import { WizardFormData, JobType } from '../types/forecast';
import { StepOne } from '../components/WizardSteps/StepOne';
import { StepTwo } from '../components/WizardSteps/StepTwo';
import { StepThree } from '../components/WizardSteps/StepThree';
import { StepFour } from '../components/WizardSteps/StepFour';
import { Results } from '../components/WizardSteps/Results';
import { WizardNavigation } from '../components/WizardNavigation';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { scrollToTop } from '../utils/scrollHelpers';
import { validateCapital } from '../utils/validationHelpers';

const initialFormData: WizardFormData = {
  jobType: 'white-entry',
  monthlyIncome: 6000,
  startingCapital: 0,
  monthlyContribution: 0,
  strategy: 'tortoise',
  selectedStocks: []
};

export function ForecastWizard() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<WizardFormData>(initialFormData);

  const updateFormData = (data: Partial<WizardFormData>) => {
    setFormData(prev => ({ ...prev, ...data }));
  };

  const canProceed = () => {
    if (currentStep === 2) {
      return !validateCapital(formData.startingCapital);
    }
    return true;
  };

  const handleNext = () => {
    if (!canProceed()) return;
    setCurrentStep(prev => Math.min(prev + 1, 5));
    scrollToTop();
  };

  const handleBack = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
    scrollToTop();
  };

  const handleStepClick = (step: number) => {
    if (step > currentStep && !canProceed()) return;
    setCurrentStep(step);
    scrollToTop();
  };

  const handleReset = () => {
    setCurrentStep(1);
    setFormData(initialFormData);
    scrollToTop();
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <StepOne data={formData} onUpdate={updateFormData} />;
      case 2:
        return <StepTwo data={formData} onUpdate={updateFormData} />;
      case 3:
        return <StepThree data={formData} onUpdate={updateFormData} />;
      case 4:
        return <StepFour data={formData} onUpdate={updateFormData} />;
      case 5:
        return <Results data={formData} />;
      default:
        return null;
    }
  };

  const isFirstStep = currentStep === 1;
  const isLastStep = currentStep === 5;

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6">
      <div className="bg-white dark:bg-dark-element rounded-xl shadow-lg overflow-hidden min-h-[600px]" data-calculator>
        <div className="p-6 md:p-8">
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                Free Your Future Calculator
              </h1>
              <span className="text-sm text-gray-500 dark:text-accent-teal">
                Step {currentStep} of 5
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-dark-200 rounded-full h-2">
              <div
                className="bg-accent-blue dark:bg-accent-teal h-2 rounded-full transition-all duration-300"
                style={{ width: `${(currentStep / 5) * 100}%` }}
              />
            </div>
          </div>

          <WizardNavigation 
            currentStep={currentStep}
            onStepClick={handleStepClick}
            onReset={handleReset}
          />

          <div className="mt-8 min-h-[400px]">
            {renderStep()}
          </div>

          <div className="mt-8 flex justify-between items-center">
            {!isFirstStep && (
              <button
                onClick={handleBack}
                className="flex items-center px-4 py-2 text-gray-600 dark:text-accent-teal hover:text-gray-900 dark:hover:text-white"
                tabIndex={9}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </button>
            )}
            {!isLastStep && (
              <button
                onClick={handleNext}
                className={`ml-auto flex items-center px-6 py-2 bg-accent-blue dark:bg-accent-teal text-white rounded-lg
                  hover:opacity-90 transition-opacity ${!canProceed() ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={!canProceed()}
                tabIndex={0}
                data-next-button
              >
                Next
                <ArrowRight className="w-4 h-4 ml-2" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}