export type JobType = 
  | 'white-entry' 
  | 'white-senior' 
  | 'blue-rideshare' 
  | 'blue-trucker' 
  | 'blue-skilled' 
  | 'blue-senior';

export interface JobThresholds {
  survival: number;
  thriving: number;
  endDate: Date;
}

export const JOB_THRESHOLDS: Record<JobType, JobThresholds> = {
  'white-entry': {
    survival: 6000,
    thriving: 9000,
    endDate: new Date('2025-12-31')
  },
  'white-senior': {
    survival: 18000,
    thriving: 27000,
    endDate: new Date('2026-12-31')
  },
  'blue-rideshare': {
    survival: 7500,
    thriving: 11250,
    endDate: new Date('2026-12-31')
  },
  'blue-trucker': {
    survival: 15000,
    thriving: 22500,
    endDate: new Date('2028-12-31')
  },
  'blue-skilled': {
    survival: 9000,
    thriving: 13500,
    endDate: new Date('2030-12-31')
  },
  'blue-senior': {
    survival: 20000,
    thriving: 30000,
    endDate: new Date('2030-12-31')
  }
};

export interface Stock {
  symbol: string;
  price: number;
}

export interface WizardFormData {
  jobType: JobType;
  monthlyIncome: number;
  startingCapital: number;
  monthlyContribution: number;
  strategy: 'tortoise' | 'hare';
  selectedStocks: string[];
}

export interface ForecastResult {
  freedomDate: Date;
  monthlyIncomeAtFreedom: number;
  totalLiquidityAtFreedom: number;
  strategicReserveAtFreedom: number;
  monthsToFreedom: number;
  chartData: MonthlyData[];
}

export interface MonthlyData {
  month: number;
  income: number;
  totalLiquidity: number;
  buyingPower: number;
  contracts: number;
  strategicReserve: number;
  taxReserve: number;
  netIncome: number;
  currentYearTaxFund: number;
}

export interface ContactFormData {
  name: string;
  email: string;
}