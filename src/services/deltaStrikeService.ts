interface DeltaStrikeParams {
  currentPrice: number;
  desiredDelta: number;
  daysToExpiration: number;
  isCall?: boolean;
  impliedVolatility?: number;
}

export function estimateDeltaStrike({
  currentPrice,
  desiredDelta,
  daysToExpiration,
  isCall = false,
  impliedVolatility = 30
}: DeltaStrikeParams): number {
  // Base calculation using 16/Delta rule
  let percentageOTM = (16 * Math.sqrt(daysToExpiration)) / desiredDelta;
  
  // IV Adjustment
  if (impliedVolatility > 60) percentageOTM *= 1.2;
  else if (impliedVolatility > 40) percentageOTM *= 1.1;
  else if (impliedVolatility < 20) percentageOTM *= 0.9;
  
  // Time-based adjustments
  if (daysToExpiration < 7) {
    percentageOTM *= 0.7;
  } else if (daysToExpiration < 14) {
    percentageOTM *= 0.85;
  } else if (daysToExpiration > 45) {
    percentageOTM *= 1.3;
  }
  
  // Convert to decimal
  const adjustmentFactor = percentageOTM / 100;
  
  // Calculate strike price
  let strike = isCall ? 
    currentPrice * (1 + adjustmentFactor) : 
    currentPrice * (1 - adjustmentFactor);
  
  // Round to nearest $5 increment
  strike = Math.ceil(strike / 5) * 5;
  
  return strike;
}