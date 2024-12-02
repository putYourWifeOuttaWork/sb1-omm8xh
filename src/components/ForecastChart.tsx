import React, { useState, useEffect, useRef } from 'react';
import { format, addMonths } from 'date-fns';
import { JobType, JOB_THRESHOLDS } from '../types/forecast';
import { formatCurrency } from '../utils/formatters';

const MONTHS_TO_FORECAST = 73; // From now until December 2030
const MIN_CAPITAL = 26000;

export function ForecastChart() {
  const chartRef = useRef<HTMLDivElement>(null);
  const [startingCapital, setStartingCapital] = useState(MIN_CAPITAL);
  const [monthlyContribution, setMonthlyContribution] = useState(0);
  const [jobType, setJobType] = useState<JobType>('white-entry');
  const [householdIncome, setHouseholdIncome] = useState(9000);
  const [strategy, setStrategy] = useState<'tortoise' | 'hare'>('tortoise');
  const [hoverData, setHoverData] = useState<any>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Chart dimensions
  const width = 800;
  const height = 400;
  const padding = 60;

  useEffect(() => {
    // Set default household income based on job type
    const incomeDefaults: Record<JobType, number> = {
      'white-entry': 9000,
      'white-senior': 20000,
      'blue-rideshare': 10800,
      'blue-trucker': 17000,
      'blue-skilled': 20000
    };
    setHouseholdIncome(incomeDefaults[jobType]);
  }, [jobType]);

  const calculateMonthlyData = () => {
    const data = [];
    let currentCapital = startingCapital;
    const leverageMultiplier = strategy === 'tortoise' ? 1.25 : 1.5;
    const monthlyRate = strategy === 'tortoise' ? 0.045 : 0.04;

    for (let month = 0; month < MONTHS_TO_FORECAST; month++) {
      const monthlyIncome = currentCapital * leverageMultiplier * monthlyRate;
      currentCapital += monthlyIncome + monthlyContribution;

      const date = addMonths(new Date(), month);
      data.push({
        date,
        income: monthlyIncome,
        capital: currentCapital,
        strategy,
        willSurvive: monthlyIncome >= householdIncome * 0.75,
        willThrive: monthlyIncome >= householdIncome * 1.5,
        capitalNeededForSurvival: ((householdIncome * 0.75) / (leverageMultiplier * monthlyRate)) - currentCapital,
        capitalNeededForThriving: ((householdIncome * 1.5) / (leverageMultiplier * monthlyRate)) - currentCapital
      });
    }
    return data;
  };

  const data = calculateMonthlyData();
  const maxIncome = Math.max(...data.map(d => d.income), householdIncome * 1.5);

  const yScale = (value: number) => height - padding - ((value / maxIncome) * (height - 2 * padding));
  const xScale = (month: number) => padding + (month / (MONTHS_TO_FORECAST - 1)) * (width - 2 * padding);

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!chartRef.current) return;
    
    const svgRect = e.currentTarget.getBoundingClientRect();
    const chartRect = chartRef.current.getBoundingClientRect();
    const x = e.clientX - svgRect.left;
    const monthIndex = Math.floor((x - padding) / ((width - 2 * padding) / MONTHS_TO_FORECAST));
    
    if (monthIndex >= 0 && monthIndex < data.length) {
      setHoverData(data[monthIndex]);
      setMousePosition({
        x: e.clientX - chartRect.left,
        y: e.clientY - chartRect.top
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Job Type
          </label>
          <select
            value={jobType}
            onChange={(e) => setJobType(e.target.value as JobType)}
            className="w-full p-3 border border-gray-300 dark:border-dark-300 rounded-lg"
          >
            <option value="white-entry">White Collar - Entry Level</option>
            <option value="white-senior">White Collar - Senior Level</option>
            <option value="blue-rideshare">Blue Collar - Ride Share Driver</option>
            <option value="blue-trucker">Blue Collar - Professional Trucker</option>
            <option value="blue-skilled">Blue Collar - Professional Skilled</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Household Income to Replace
          </label>
          <div className="relative">
            <input
              type="number"
              value={householdIncome}
              onChange={(e) => setHouseholdIncome(Number(e.target.value))}
              className="w-full p-3 pl-8 border border-gray-300 dark:border-dark-300 rounded-lg"
            />
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</div>
          </div>
          <p className="mt-1 text-sm text-gray-500">
            Numbers are estimated based on known information and benchmark wage data, assuming a two income household with 2 children
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Starting Capital {startingCapital < MIN_CAPITAL && 
              <span className="text-red-500">(Pattern Day Trading Requirement: ${MIN_CAPITAL.toLocaleString()})</span>
            }
          </label>
          <div className="relative">
            <input
              type="number"
              value={startingCapital}
              onChange={(e) => setStartingCapital(Number(e.target.value))}
              min={0}
              className="w-full p-3 pl-8 border border-gray-300 dark:border-dark-300 rounded-lg"
            />
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Monthly Contribution
          </label>
          <div className="relative">
            <input
              type="number"
              value={monthlyContribution}
              onChange={(e) => setMonthlyContribution(Number(e.target.value))}
              className="w-full p-3 pl-8 border border-gray-300 dark:border-dark-300 rounded-lg"
            />
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</div>
          </div>
        </div>
      </div>

      <div className="flex gap-4">
        <button
          onClick={() => setStrategy('tortoise')}
          className={`flex-1 p-4 rounded-lg border ${
            strategy === 'tortoise'
              ? 'bg-cyan-50 border-cyan-500 text-cyan-700'
              : 'border-gray-300 hover:bg-gray-50'
          }`}
        >
          🐢 Tortoise Strategy
        </button>
        <button
          onClick={() => setStrategy('hare')}
          className={`flex-1 p-4 rounded-lg border ${
            strategy === 'hare'
              ? 'bg-pink-50 border-pink-500 text-pink-700'
              : 'border-gray-300 hover:bg-gray-50'
          }`}
        >
          🐰 Hare Strategy
        </button>
      </div>

      <div ref={chartRef} className="relative">
        {hoverData && (
          <div 
            className="absolute bg-white dark:bg-dark-element p-4 rounded-lg shadow-lg border border-gray-200 dark:border-dark-300 z-10 min-w-[280px]"
            style={{
              left: Math.min(mousePosition.x - 290, width - 300),
              top: Math.max(10, mousePosition.y - 200),
              transform: 'translate3d(0, 0, 0)',
              pointerEvents: 'none'
            }}
          >
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Monthly Income:</span>
                <span className="font-medium">{formatCurrency(hoverData.income)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Total Capital:</span>
                <span className="font-medium">{formatCurrency(hoverData.capital)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Date:</span>
                <span className="font-medium">
                  {format(hoverData.date, 'MMM yyyy')}
                </span>
              </div>
              <div className="pt-2 border-t">
                <div className="flex justify-between">
                  <span className="text-orange-600">Will Survive:</span>
                  <span className={hoverData.willSurvive ? 'text-green-600' : 'text-red-600'}>
                    {hoverData.willSurvive ? 'Yes' : 'No'}
                  </span>
                </div>
                {!hoverData.willSurvive && (
                  <div className="text-sm text-orange-600">
                    Need {formatCurrency(hoverData.capitalNeededForSurvival)} more capital
                  </div>
                )}
              </div>
              <div>
                <div className="flex justify-between">
                  <span className="text-green-600">Will Thrive:</span>
                  <span className={hoverData.willThrive ? 'text-green-600' : 'text-red-600'}>
                    {hoverData.willThrive ? 'Yes' : 'No'}
                  </span>
                </div>
                {!hoverData.willThrive && (
                  <div className="text-sm text-green-600">
                    Need {formatCurrency(hoverData.capitalNeededForThriving)} more capital
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        <svg
          width={width}
          height={height}
          className="mx-auto"
          onMouseMove={handleMouseMove}
          onMouseLeave={() => setHoverData(null)}
        >
          {/* Grid lines and Y-axis labels */}
          {Array.from({ length: 6 }).map((_, i) => {
            const value = (maxIncome * i) / 5;
            const y = yScale(value);
            return (
              <g key={i}>
                <line
                  x1={padding}
                  y1={y}
                  x2={width - padding}
                  y2={y}
                  stroke="#e2e8f0"
                  strokeWidth="1"
                  strokeDasharray="4"
                />
                <text
                  x={padding - 10}
                  y={y}
                  textAnchor="end"
                  alignmentBaseline="middle"
                  className="text-sm fill-gray-500"
                >
                  ${Math.round(value)}
                </text>
              </g>
            );
          })}

          {/* X-axis and labels */}
          <line
            x1={padding}
            y1={height - padding}
            x2={width - padding}
            y2={height - padding}
            stroke="#94a3b8"
            strokeWidth="1"
          />

          {/* Month labels every 6 months */}
          {Array.from({ length: Math.ceil(MONTHS_TO_FORECAST / 6) }).map((_, i) => {
            const month = i * 6;
            const x = xScale(month);
            return (
              <text
                key={month}
                x={x}
                y={height - padding + 20}
                textAnchor="middle"
                className="text-sm fill-gray-500"
              >
                {format(addMonths(new Date(), month), 'MM/yyyy')}
              </text>
            );
          })}

          {/* Survival threshold line */}
          <line
            x1={padding}
            y1={yScale(householdIncome * 0.75)}
            x2={width - padding}
            y2={yScale(householdIncome * 0.75)}
            stroke="#f97316"
            strokeWidth="2"
            strokeDasharray="4"
          />

          {/* Thriving threshold line */}
          <line
            x1={padding}
            y1={yScale(householdIncome * 1.5)}
            x2={width - padding}
            y2={yScale(householdIncome * 1.5)}
            stroke="#059669"
            strokeWidth="2"
            strokeDasharray="4"
          />

          {/* Job end date line */}
          {JOB_THRESHOLDS[jobType].endDate && (
            <line
              x1={xScale(Math.floor((JOB_THRESHOLDS[jobType].endDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24 * 30)))}
              y1={padding}
              x2={xScale(Math.floor((JOB_THRESHOLDS[jobType].endDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24 * 30)))}
              y2={height - padding}
              stroke="#dc2626"
              strokeWidth="2"
              strokeDasharray="4"
            />
          )}

          {/* Income line */}
          <path
            d={`M ${data.map((d, i) => `${xScale(i)},${yScale(d.income)}`).join(' L ')}`}
            stroke={strategy === 'tortoise' ? '#0891b2' : '#db2777'}
            strokeWidth="2"
            fill="none"
          />
        </svg>
      </div>

      <div className="flex justify-center space-x-6 text-sm">
        <div className="flex items-center">
          <div className="w-3 h-3 bg-orange-600 rounded-full mr-2"></div>
          <span>Survival Threshold (${formatCurrency(householdIncome * 0.75)}/mo)</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-green-600 rounded-full mr-2"></div>
          <span>Thriving Threshold (${formatCurrency(householdIncome * 1.5)}/mo)</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-red-600 rounded-full mr-2"></div>
          <span>Job End Date</span>
        </div>
      </div>
    </div>
  );
}