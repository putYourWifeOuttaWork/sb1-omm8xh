import { Stock, WizardFormData, ForecastResult, MonthlyData } from '../types/forecast';
import { fetchStockPrices } from './stockService';
import { format } from 'date-fns';

const OPTION_PREMIUM_RATE = 0.07;
const TAX_RATE = 0.25;
const STRATEGIC_RESERVE_RATE = 0.10;

export const calculateForecast = async (formData: WizardFormData): Promise<ForecastResult> => {
  const stockPrices = await fetchStockPrices();
  const selectedStockData = formData.selectedStocks.map(symbol => ({
    symbol,
    price: stockPrices[symbol]
  }));

  const leverageMultiplier = formData.strategy === 'tortoise' ? 1.25 : 1.50;
  const chartData: MonthlyData[] = [];
  let currentLiquidity = formData.startingCapital;
  let month = 0;
  let freedomReached = false;
  let currentYearTaxFund = 0;

  while (!freedomReached && month < 60) {
    const currentDate = new Date();
    currentDate.setMonth(currentDate.getMonth() + month);
    
    // Reset tax fund in January
    if (currentDate.getMonth() === 0 && month > 0) {
      currentYearTaxFund = 0;
    }

    const monthData = calculateMonthlyData(
      currentLiquidity,
      leverageMultiplier,
      selectedStockData,
      month,
      formData.monthlyContribution,
      currentYearTaxFund
    );

    currentYearTaxFund += monthData.taxReserve;
    chartData.push(monthData);
    currentLiquidity = monthData.totalLiquidity + formData.monthlyContribution;

    if (monthData.netIncome >= formData.monthlyIncome) {
      freedomReached = true;
    }

    month++;
  }

  const lastMonth = chartData[chartData.length - 1];
  const freedomDate = new Date();
  freedomDate.setMonth(freedomDate.getMonth() + month);

  return {
    freedomDate,
    monthlyIncomeAtFreedom: lastMonth.netIncome,
    totalLiquidityAtFreedom: lastMonth.totalLiquidity,
    strategicReserveAtFreedom: lastMonth.strategicReserve,
    monthsToFreedom: month,
    chartData
  };
};

const calculateMonthlyData = (
  currentLiquidity: number,
  leverageMultiplier: number,
  stocks: Stock[],
  month: number,
  monthlyContribution: number,
  currentYearTaxFund: number
): MonthlyData => {
  const buyingPower = currentLiquidity * leverageMultiplier;
  let totalContracts = 0;
  let totalIncome = 0;

  stocks.forEach(stock => {
    const contractValue = stock.price * 100;
    const availableContracts = Math.floor(buyingPower / contractValue);
    const contractIncome = contractValue * OPTION_PREMIUM_RATE;
    
    totalContracts += availableContracts;
    totalIncome += contractIncome * availableContracts;
  });

  const taxReserve = totalIncome * TAX_RATE;
  const strategicReserve = totalIncome * STRATEGIC_RESERVE_RATE;
  const netIncome = totalIncome * (1 - TAX_RATE - STRATEGIC_RESERVE_RATE);

  return {
    month,
    income: totalIncome,
    totalLiquidity: currentLiquidity + netIncome + monthlyContribution,
    buyingPower,
    contracts: totalContracts,
    strategicReserve,
    taxReserve,
    netIncome,
    currentYearTaxFund: currentYearTaxFund + taxReserve
  };
};