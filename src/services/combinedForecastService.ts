import { Stock, WizardFormData, ForecastResult, MonthlyData } from '../types/forecast';
import { fetchStockPrices } from './stockService';

const getOptionPremiumRate = (symbol: string) => symbol === 'MSTR' ? 0.09 : 0.07;
const TAX_RATE = 0.25;
const getStrategicReserveRate = (symbol: string) => symbol === 'MSTR' ? 0.15 : 0.10;

export const calculateCombinedForecast = async (formData: WizardFormData) => {
  const stockPrices = await fetchStockPrices();
  const capitalPerStock = formData.startingCapital / formData.selectedStocks.length;
  
  const stockForecasts = formData.selectedStocks.map(symbol => ({
    symbol,
    data: calculateStockForecast(
      { symbol, price: stockPrices[symbol] },
      formData,
      capitalPerStock
    )
  }));

  // Find the month where combined income reaches target
  let freedomMonth = 0;
  let freedomReached = false;

  while (!freedomReached && freedomMonth < 60) {
    const combinedIncome = stockForecasts.reduce((sum, forecast) => {
      const monthData = forecast.data.monthlyData[freedomMonth];
      return sum + (monthData ? monthData.netIncome : 0);
    }, 0);

    if (combinedIncome >= formData.monthlyIncome) {
      freedomReached = true;
    } else {
      freedomMonth++;
    }
  }

  const freedomDate = new Date();
  freedomDate.setMonth(freedomDate.getMonth() + freedomMonth);

  return {
    stockForecasts,
    freedomDate,
    freedomMonth
  };
};

const calculateStockForecast = (
  stock: Stock,
  formData: WizardFormData,
  availableCapital: number
) => {
  const leverageMultiplier = formData.strategy === 'tortoise' ? 1.25 : 1.50;
  const monthlyData: MonthlyData[] = [];
  let currentLiquidity = availableCapital;
  let currentYearTaxFund = 0;

  for (let month = 0; month < 60; month++) {
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
      formData.monthlyContribution / formData.selectedStocks.length,
      currentYearTaxFund,
      currentDate
    );

    currentYearTaxFund += monthData.taxReserve;
    monthlyData.push(monthData);
    currentLiquidity = monthData.totalLiquidity + 
      (formData.monthlyContribution / formData.selectedStocks.length);
  }

  return {
    monthlyData
  };
};

const calculateMonthlyData = (
  currentLiquidity: number,
  leverageMultiplier: number,
  stock: Stock,
  month: number,
  monthlyContribution: number,
  currentYearTaxFund: number,
  date: Date
): MonthlyData => {
  const buyingPower = currentLiquidity * leverageMultiplier;
  const contractValue = stock.price * 100;
  const availableContracts = Math.floor(buyingPower / contractValue);
  const premiumRate = getOptionPremiumRate(stock.symbol);
  const contractIncome = contractValue * premiumRate;
  const totalIncome = contractIncome * availableContracts;

  const taxReserve = totalIncome * TAX_RATE;
  const strategicReserve = totalIncome * getStrategicReserveRate(stock.symbol);
  const netIncome = totalIncome * (1 - TAX_RATE - getStrategicReserveRate(stock.symbol));

  return {
    month,
    date,
    income: totalIncome,
    totalLiquidity: currentLiquidity + netIncome + monthlyContribution,
    buyingPower,
    contracts: availableContracts,
    strategicReserve,
    taxReserve,
    netIncome,
    currentYearTaxFund: currentYearTaxFund + taxReserve,
    willSurvive: netIncome >= (stock.survivalThreshold || 0),
    willThrive: netIncome >= (stock.thrivingThreshold || 0),
    capitalNeededForSurvival: netIncome < (stock.survivalThreshold || 0) ?
      ((stock.survivalThreshold || 0) - netIncome) / (premiumRate * (1 - TAX_RATE - getStrategicReserveRate(stock.symbol))) : 0,
    capitalNeededForThriving: netIncome < (stock.thrivingThreshold || 0) ?
      ((stock.thrivingThreshold || 0) - netIncome) / (premiumRate * (1 - TAX_RATE - getStrategicReserveRate(stock.symbol))) : 0
  };
};