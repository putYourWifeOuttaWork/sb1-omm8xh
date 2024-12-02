import { Stock, WizardFormData, ForecastResult, MonthlyData } from '../types/forecast';
import { format } from 'date-fns';

const OPTION_PREMIUM_RATE = 0.07;
const TAX_RATE = 0.25;
const STRATEGIC_RESERVE_RATE = 0.10;

export const calculateStockSpecificForecast = (
  stock: Stock,
  formData: WizardFormData,
  availableCapital: number
): { monthlyData: MonthlyData[], freedomDate: Date } => {
  const leverageMultiplier = formData.strategy === 'tortoise' ? 1.25 : 1.50;
  const chartData: MonthlyData[] = [];
  let currentLiquidity = availableCapital;
  let month = 0;
  let freedomReached = false;
  let currentYearTaxFund = 0;

  while (!freedomReached && month < 60) {
    const currentDate = new Date();
    currentDate.setMonth(currentDate.getMonth() + month);
    
    if (currentDate.getMonth() === 0 && month > 0) {
      currentYearTaxFund = 0;
    }

    const monthData = calculateMonthlyData(
      currentLiquidity,
      leverageMultiplier,
      stock,
      month,
      formData.monthlyContribution,
      currentYearTaxFund
    );

    currentYearTaxFund += monthData.taxReserve;
    chartData.push(monthData);
    currentLiquidity = monthData.totalLiquidity + formData.monthlyContribution;

    if (monthData.netIncome >= formData.monthlyIncome / 2) {
      freedomReached = true;
    }

    month++;
  }

  const freedomDate = new Date();
  freedomDate.setMonth(freedomDate.getMonth() + month);

  return {
    monthlyData: chartData,
    freedomDate
  };
};

const calculateMonthlyData = (
  currentLiquidity: number,
  leverageMultiplier: number,
  stock: Stock,
  month: number,
  monthlyContribution: number,
  currentYearTaxFund: number
): MonthlyData => {
  const buyingPower = currentLiquidity * leverageMultiplier;
  const contractValue = stock.price * 100;
  const availableContracts = Math.floor(buyingPower / contractValue);
  const contractIncome = contractValue * OPTION_PREMIUM_RATE;
  const totalIncome = contractIncome * availableContracts;

  const taxReserve = totalIncome * TAX_RATE;
  const strategicReserve = totalIncome * STRATEGIC_RESERVE_RATE;
  const netIncome = totalIncome * (1 - TAX_RATE - STRATEGIC_RESERVE_RATE);

  return {
    month,
    income: totalIncome,
    totalLiquidity: currentLiquidity + netIncome + monthlyContribution,
    buyingPower,
    contracts: availableContracts,
    strategicReserve,
    taxReserve,
    netIncome,
    currentYearTaxFund: currentYearTaxFund + taxReserve
  };
};