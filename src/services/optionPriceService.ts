interface OptionPriceParams {
  strikePrice: number;
  currentPrice: number;
  expirationDate: string;
  initialPremium?: number;
}

interface PriceBreakdown {
  finalPrice: number;
  daysToExpiration: number;
  daysSinceOpen: number;
  moneynessPercent: number;
  dailyBaseTheta: number;
  remainingTheta: number;
  adjustedTheta: number;
  intrinsicValue: number;
}

export function calculateOptionPrice(params: OptionPriceParams): PriceBreakdown {
  const { strikePrice, currentPrice, expirationDate, initialPremium } = params;
  
  // Time calculations
  const expDate = new Date(expirationDate);
  const today = new Date();
  const openDate = new Date(expDate);
  openDate.setDate(openDate.getDate() - 32);
  
  const daysToExpiration = Math.max(0, Math.ceil((expDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)));
  const daysSinceOpen = Math.max(0, Math.ceil((today.getTime() - openDate.getTime()) / (1000 * 60 * 60 * 24)));

  // Base calculations
  const premium = initialPremium || strikePrice * 0.06;
  const dailyBaseTheta = premium / 32;
  
  // Calculate remaining theta based on DTE
  let remainingTheta = 0;
  if (daysToExpiration <= 7) {
    remainingTheta = daysToExpiration * (dailyBaseTheta * 1.05);
  } else if (daysToExpiration <= 12) {
    remainingTheta = (7 * (dailyBaseTheta * 1.05)) + 
                     ((daysToExpiration - 7) * (dailyBaseTheta * 1.65));
  } else if (daysToExpiration <= 22) {
    remainingTheta = (7 * (dailyBaseTheta * 1.05)) + 
                     (5 * (dailyBaseTheta * 1.65)) + 
                     ((daysToExpiration - 12) * dailyBaseTheta);
  } else {
    remainingTheta = (7 * (dailyBaseTheta * 1.05)) + 
                     (5 * (dailyBaseTheta * 1.65)) + 
                     (10 * dailyBaseTheta) + 
                     ((daysToExpiration - 22) * (dailyBaseTheta * 0.30));
  }

  // Moneyness calculations
  const moneynessPercent = ((currentPrice - strikePrice) / strikePrice) * 100;
  const moneynessBuckets = Math.floor(Math.abs(moneynessPercent) / 2);
  
  // Adjust theta based on moneyness
  let adjustedTheta = remainingTheta;
  let intrinsicValue = 0;

  if (Math.abs(moneynessPercent) <= 0.1) {
    // ATM - no adjustment needed
  } else if (moneynessPercent > 0) {
    // OTM
    adjustedTheta *= Math.pow(0.6, moneynessBuckets);
  } else {
    // ITM
    adjustedTheta *= Math.pow(0.3, moneynessBuckets);
    intrinsicValue = strikePrice - currentPrice;
  }

  const finalPrice = Number((Math.max(0, adjustedTheta + intrinsicValue)).toFixed(2));

  return {
    finalPrice,
    daysToExpiration,
    daysSinceOpen,
    moneynessPercent,
    dailyBaseTheta,
    remainingTheta,
    adjustedTheta,
    intrinsicValue
  };
}