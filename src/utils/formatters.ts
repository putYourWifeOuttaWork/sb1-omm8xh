export const formatCurrency = (value: number, decimals: number = 0, useGrouping: boolean = true) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
    useGrouping: useGrouping
  }).format(value);
};

export const calculateCumulativeStrategicReserve = (data: MonthlyData[], currentMonth: number) => {
  return data
    .slice(0, currentMonth + 1)
    .reduce((sum, month) => sum + month.strategicReserve, 0);
};