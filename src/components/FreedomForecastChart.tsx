import React, { useState, useCallback } from 'react';
import { format, addMonths } from 'date-fns';
import { MonthlyData } from '../types/forecast';

interface FreedomForecastChartProps {
  data: MonthlyData[];
  targetIncome: number;
  freedomDate: Date;
}

export function FreedomForecastChart({ data, targetIncome, freedomDate }: FreedomForecastChartProps) {
  const [hoveredData, setHoveredData] = useState<MonthlyData | null>(null);
  
  // Chart dimensions
  const width = 800;
  const height = 400;
  const padding = 60;
  const rightPadding = 80;

  // Calculate scales
  const maxIncome = Math.max(...data.map(d => d.netIncome));
  const maxLiquidity = Math.max(...data.map(d => d.totalLiquidity));

  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  // Calculate cumulative strategic reserve
  const calculateCumulativeStrategicReserve = useCallback((currentMonth: number) => {
    return data
      .slice(0, currentMonth + 1)
      .reduce((sum, month) => sum + month.strategicReserve, 0);
  }, [data]);

  // Scale helpers
  const yScaleIncome = (value: number) => {
    if (typeof value !== 'number' || isNaN(value)) return padding;
    return height - padding - ((value / (maxIncome * 1.2)) * (height - 2 * padding));
  };

  const yScaleLiquidity = (value: number) => {
    if (typeof value !== 'number' || isNaN(value)) return padding;
    return height - padding - ((value / (maxLiquidity * 1.2)) * (height - 2 * padding));
  };

  const xScale = (month: number) => 
    padding + (month / Math.max(36, data.length - 1)) * (width - padding - rightPadding);

  // Handle mouse movement
  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    const svgRect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - svgRect.left;
    const monthIndex = Math.floor((x - padding) / ((width - padding - rightPadding) / Math.max(36, data.length - 1)));
    
    if (monthIndex >= 0 && monthIndex < data.length) {
      setHoveredData(data[monthIndex]);
    }
  };

  // Create step-up line data
  const createStepLine = () => {
    let path = '';
    let prevIncome = 0;
    
    data.forEach((d, i) => {
      const x = xScale(i);
      const y = yScaleIncome(d.netIncome);
      
      if (i === 0) {
        path += `M ${x},${y}`;
      } else if (d.netIncome !== prevIncome) {
        path += ` L ${x},${yScaleIncome(prevIncome)}`;
        path += ` L ${x},${y}`;
      } else {
        path += ` L ${x},${y}`;
      }
      
      prevIncome = d.netIncome;
    });
    
    return path;
  };

  // Find freedom point
  const freedomPoint = data.findIndex(d => d.netIncome >= targetIncome);
  const freedomX = freedomPoint >= 0 ? xScale(freedomPoint) : null;
  const freedomY = freedomPoint >= 0 ? yScaleIncome(targetIncome) : null;

  return (
    <div className="relative overflow-x-auto">
      {hoveredData && (
        <div className="absolute top-4 left-4 bg-white p-4 rounded-lg shadow-lg border border-gray-200 z-10 min-w-[280px]">
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Monthly Income:</span>
              <span className="font-medium">{formatCurrency(hoveredData.netIncome)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Account Liquidity:</span>
              <span className="font-medium">{formatCurrency(hoveredData.totalLiquidity)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Strategic Reserve (Total):</span>
              <span className="font-medium">
                {formatCurrency(calculateCumulativeStrategicReserve(hoveredData.month))}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Tax Fund (This Year):</span>
              <span className="font-medium">
                {formatCurrency(hoveredData.currentYearTaxFund)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Contracts:</span>
              <span className="font-medium">{hoveredData.contracts}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Days Till Freedom:</span>
              <span className="font-medium">
                {Math.max(0, Math.floor(
                  (freedomDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
                ))} days
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Date:</span>
              <span className="font-medium">
                {format(addMonths(new Date(), hoveredData.month), 'MM/dd/yyyy')}
              </span>
            </div>
          </div>
        </div>
      )}

      <svg 
        width={width} 
        height={height} 
        className="mx-auto"
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setHoveredData(null)}
      >
        {/* Left Y-axis grid lines (Income) */}
        {Array.from({ length: 6 }).map((_, i) => {
          const value = maxIncome * 1.2 * (i / 5);
          const y = yScaleIncome(value);
          return (
            <g key={`income-${i}`}>
              <line
                x1={padding}
                y1={y}
                x2={width - rightPadding}
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
                {formatCurrency(value)}
              </text>
            </g>
          );
        })}

        {/* Right Y-axis grid lines (Liquidity) */}
        {Array.from({ length: 6 }).map((_, i) => {
          const value = maxLiquidity * 1.2 * (i / 5);
          const y = yScaleLiquidity(value);
          return (
            <g key={`liquidity-${i}`}>
              <text
                x={width - rightPadding + 10}
                y={y}
                textAnchor="start"
                alignmentBaseline="middle"
                className="text-sm fill-blue-500"
              >
                {formatCurrency(value)}
              </text>
            </g>
          );
        })}

        {/* X-axis */}
        <line
          x1={padding}
          y1={height - padding}
          x2={width - rightPadding}
          y2={height - padding}
          stroke="#94a3b8"
          strokeWidth="1"
        />

        {/* Month labels */}
        {[0, 6, 12, 18, 24, 30, 36].map(month => (
          <text
            key={month}
            x={xScale(month)}
            y={height - padding + 20}
            textAnchor="middle"
            className="text-sm fill-gray-500"
          >
            {format(addMonths(new Date(), month), 'MM/yyyy')}
          </text>
        ))}

        {/* Account Liquidity line */}
        <path
          d={`M ${data.map((d, i) => 
            `${xScale(i)},${yScaleLiquidity(d.totalLiquidity)}`
          ).join(' L ')}`}
          stroke="#2563eb"
          strokeWidth="2"
          fill="none"
        />

        {/* Monthly Income step line */}
        <path
          d={createStepLine()}
          stroke="#ec4899"
          strokeWidth="2"
          fill="none"
        />

        {/* Target Income line */}
        <line
          x1={padding}
          y1={yScaleIncome(targetIncome)}
          x2={width - rightPadding}
          y2={yScaleIncome(targetIncome)}
          stroke="#dc2626"
          strokeWidth="2"
          strokeDasharray="4"
        />

        {/* Freedom Point Marker */}
        {freedomX && freedomY && (
          <>
            <line
              x1={freedomX}
              y1={padding}
              x2={freedomX}
              y2={height - padding}
              stroke="#dc2626"
              strokeWidth="2"
              strokeDasharray="4"
            />
            <circle
              cx={freedomX}
              cy={freedomY}
              r="6"
              fill="#dc2626"
              className="animate-pulse"
            />
            <text
              x={freedomX}
              y={padding - 10}
              textAnchor="middle"
              className="text-sm font-medium fill-red-600"
            >
              Freedom Day!
            </text>
          </>
        )}

        {/* Legend */}
        &nbsp; <g  transform={`translate(${padding}, 10)`}>
          <circle cx="0" cy="0" r="4" fill="#2563eb" />
          <text x="15" y="4" className="text-sm fill-gray-700">&nbsp;&nbsp;&nbsp;Account Liquidity</text>
          &nbsp;
          &nbsp;<circle cx="145" cy="0" r="4" fill="#ec4899" />
          <text x="160" y="4" className="text-sm fill-gray-700"> Monthly Income</text>
        <circle cx="290" cy="0" r="4" fill="#dc2626" strokeWidth="2" strokeDasharray="4" />
          <text x="305" y="4" className="text-sm fill-gray-700">Target Income</text>
        </g>
      </svg>
    </div>
  );
}