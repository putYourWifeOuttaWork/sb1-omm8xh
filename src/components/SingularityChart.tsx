import React from 'react';

export function SingularityChart() {
  const width = 600;
  const height = 300;
  const padding = 40;
  
  // Data points
  const thresholds = [
    { year: 2027, amount: 20000, label: 'WC Thriving', color: 'rgb(22 163 74)' },
    { year: 2028, amount: 12000, label: 'WC Survival', color: 'rgb(234 88 12)' },
    { year: 2029, amount: 16000, label: 'BC Thriving', color: 'rgb(22 163 74)' },
    { year: 2030, amount: 10000, label: 'BC Survival', color: 'rgb(234 88 12)' }
  ];

  // Scale helpers
  const yearScale = (year: number) => 
    ((year - 2025) / 7) * (width - 2 * padding) + padding;
  
  const amountScale = (amount: number) =>
    height - (amount / 25000) * (height - 2 * padding) - padding;

  return (
    <div className="w-full overflow-x-auto bg-white p-3 sm:p-4 rounded-lg">
      <svg
        width={width}
        height={height}
        className="mx-auto min-w-[600px]"
        viewBox={`0 0 ${width} ${height}`}
      >
        {/* Y-axis */}
        <line
          x1={padding}
          y1={padding}
          x2={padding}
          y2={height - padding}
          stroke="#94a3b8"
          strokeWidth="1"
        />
        
        {/* X-axis */}
        <line
          x1={padding}
          y1={height - padding}
          x2={width - padding}
          y2={height - padding}
          stroke="#94a3b8"
          strokeWidth="1"
        />

        {/* Y-axis labels */}
        {[0, 5000, 10000, 15000, 20000, 25000].map((amount, i) => (
          <g key={amount}>
            <text
              x={padding - 5}
              y={amountScale(amount)}
              textAnchor="end"
              alignmentBaseline="middle"
              className="text-xs fill-gray-500"
            >
              ${amount/1000}k
            </text>
            <line
              x1={padding}
              y1={amountScale(amount)}
              x2={width - padding}
              y2={amountScale(amount)}
              stroke="#e2e8f0"
              strokeWidth="1"
              strokeDasharray="4"
            />
          </g>
        ))}

        {/* X-axis labels */}
        {[2025, 2026, 2027, 2028, 2029, 2030, 2031, 2032].map(year => (
          <text
            key={year}
            x={yearScale(year)}
            y={height - padding + 20}
            textAnchor="middle"
            className="text-xs fill-gray-500"
          >
            {year}
          </text>
        ))}

        {/* Threshold points */}
        {thresholds.map((point, i) => (
          <g key={i}>
            <circle
              cx={yearScale(point.year)}
              cy={amountScale(point.amount)}
              r="6"
              fill={point.color}
              className="drop-shadow-md"
            />
            <text
              x={yearScale(point.year)}
              y={amountScale(point.amount) - 10}
              textAnchor="middle"
              className="text-xs font-medium fill-gray-700"
            >
              {point.label}
            </text>
          </g>
        ))}

        {/* Trend lines */}
        <path
          d={`M ${yearScale(2025)} ${amountScale(5000)} 
              L ${yearScale(2028)} ${amountScale(12000)}
              L ${yearScale(2032)} ${amountScale(1000)}`}
          stroke="#ef4444"
          strokeWidth="2"
          fill="none"
          strokeDasharray="4"
        />
      </svg>
      <div className="flex flex-col sm:flex-row justify-center items-center mt-4 space-y-2 sm:space-y-0 sm:space-x-6 text-xs sm:text-sm">
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full bg-orange-600 mr-2"></div>
          <span>Survival Threshold</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full bg-green-600 mr-2"></div>
          <span>Thriving Threshold</span>
        </div>
      </div>
    </div>
  );
}