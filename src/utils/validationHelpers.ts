export const validateCapital = (value: number): string | null => {
  if (!value || Number.isNaN(value)) {
    return 'Capital amount is required';
  }
  if (value < 26000) {
    return 'Capital must be at least $26,000 to meet Pattern Day Trading requirements';
  }
  return null;
};

export const validateMonthlyContribution = (value: number): string | null => {
  if (value < 0) {
    return 'Monthly contribution cannot be negative';
  }
  return null;
};