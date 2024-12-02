import React, { useState, useCallback } from 'react';
import { format, addMonths } from 'date-fns';
import { MonthlyData } from '../../types/forecast';
import { ChartTooltip } from './ChartTooltip';
import { ChartLegend } from './ChartLegend';
import { YearlyTabs } from '../YearlyTabs';
import { COMPANY_LOGOS } from '../../constants/stockData';
import { calculateCumulativeStrategicReserve } from '../../utils/formatters';

interface StockChartProps {
  data: MonthlyData[];
  symbol: string;
  targetIncome: number;
  freedomDate: Date;
  jobEndDate: Date;
  survivalThreshold: number;
  thrivingThreshold: number;
}

export function StockChart({ 
  data, 
  symbol, 
  targetIncome, 
  freedomDate,
  jobEndDate,
  survivalThreshold,
  thrivingThreshold
}: StockChartProps) {
  const [hoveredData, setHoveredData] = useState<MonthlyData | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState<{ x: number; y: number } | null>(null);

  // Chart dimensions
  const width = 800;
  const height = 400;
  const padding = 60;
  const rightPadding = 80;

  // Calculate scales
  const maxIncome = Math.max(
    ...data.map(d => d.netIncome || 0), 
    targetIncome,
    survivalThreshold,
    thrivingThreshold
  );
  const maxLiquidity = Math.max(...data.map(d => d.totalLiquidity || 0));

  const yScaleIncome = useCallback((value: number): number => {
    if (!value || isNaN(value)) return height - padding;
    return height - padding - ((value / (maxIncome * 1.2)) * (height - 2 * padding));
  }, [maxIncome, height, padding]);

  const yScaleLiquidity = useCallback((value: number): number => {
    if (!value || isNaN(value)) return height - padding;
    return height - padding - ((value / (maxLiquidity * 1.2)) * (height - 2 * padding));
  }, [maxLiquidity, height, padding]);

  const xScale = useCallback((month: number): number => {
    return padding + (month / Math.max(data.length - 1, 1)) * (width - padding - rightPadding);
  }, [width, padding, rightPadding, data.length]);

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    const svgRect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - svgRect.left;
    const monthIndex = Math.floor((x - padding) / ((width - padding - rightPadding) / Math.max(data.length - 1, 1)));
    
    if (monthIndex >= 0 && monthIndex < data.length) {
      setHoveredData(data[monthIndex]);
      setTooltipPosition({ x: e.clientX - svgRect.left, y: e.clientY - svgRect.top });
    }
  };

  const handleMouseLeave = () => {
    setHoveredData(null);
    setTooltipPosition(null);
  };

  const createStepLine = useCallback(() => {
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
  }, [data, xScale, yScaleIncome]);

  const freedomPoint = data.findIndex(d => d.netIncome >= targetIncome);
  const freedomX = freedomPoint >= 0 ? xScale(freedomPoint) : null;
  const freedomY = freedomPoint >= 0 ? yScaleIncome(targetIncome) : null;

  // Calculate job end date position
  const jobEndMonth = Math.floor((jobEndDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24 * 30));
  const jobEndX = xScale(jobEndMonth);

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <img
          src={COMPANY_LOGOS[symbol].logo}
          alt={`${COMPANY_LOGOS[symbol].name} logo`}
          className="w-8 h-8 object-contain"
          onError={(e) => {
            e.currentTarget.src = `https://via.placeholder.com/32?text=${symbol}`;
          }}
        />
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
          {symbol} Growth Forecast
        </h3>
      </div>

      <div className="relative overflow-x-auto">
        {hoveredData && (
          <ChartTooltip
            data={hoveredData}
            position={tooltipPosition}
          />
        )}

        <svg
          width={width}
          height={height}
          className="mx-auto"
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          <ChartLegend padding={padding} />

          {/* Grid lines and axes */}
          {Array.from({ length: 6 }).map((_, i) => {
            const incomeValue = maxIncome * 1.2 * (i / 5);
            const liquidityValue = maxLiquidity * 1.2 * (i / 5);
            const y = yScaleIncome(incomeValue);
            
            return (
              <g key={i}>
                <line
                  x1={padding}
                  y1={y}
                  x2={width - rightPadding}
                  y2={y}
                  stroke="#e2e8f0"
                  strokeWidth="1"
                  strokeDasharray="4"
                  className="dark:stroke-dark-300"
                />
                <text
                  x={padding - 10}
                  y={y}
                  textAnchor="end"
                  alignmentBaseline="middle"
                  className="text-sm fill-gray-500 dark:fill-gray-400"
                >
                  ${Math.round(incomeValue).toLocaleString()}
                </text>
                <text
                  x={width - rightPadding + 10}
                  y={yScaleLiquidity(liquidityValue)}
                  textAnchor="start"
                  alignmentBaseline="middle"
                  className="text-sm fill-blue-500 dark:fill-blue-400"
                >
                  ${Math.round(liquidityValue).toLocaleString()}
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
            className="dark:stroke-dark-300"
          />

          {/* Month labels */}
          {data.filter((_, i) => i % 6 === 0).map((_, i) => (
            <text
              key={i * 6}
              x={xScale(i * 6)}
              y={height - padding + 20}
              textAnchor="middle"
              className="text-sm fill-gray-500 dark:fill-gray-400"
            >
              {format(addMonths(new Date(), i * 6), 'MM/yyyy')}
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
            className="dark:stroke-accent-blue"
          />

          {/* Monthly Income step line */}
          <path
            d={createStepLine()}
            stroke="#ec4899"
            strokeWidth="2"
            fill="none"
            className="dark:stroke-accent-teal"
          />

          {/* Survival Threshold line */}
          <line
            x1={padding}
            y1={yScaleIncome(survivalThreshold)}
            x2={width - rightPadding}
            y2={yScaleIncome(survivalThreshold)}
            stroke="#f97316"
            strokeWidth="2"
            strokeDasharray="4"
            className="dark:stroke-orange-500"
          />

          {/* Thriving Threshold line */}
          <line
            x1={padding}
            y1={yScaleIncome(thrivingThreshold)}
            x2={width - rightPadding}
            y2={yScaleIncome(thrivingThreshold)}
            stroke="#059669"
            strokeWidth="2"
            strokeDasharray="4"
            className="dark:stroke-green-500"
          />

          {/* Job End Date line */}
          <line
            x1={jobEndX}
            y1={padding}
            x2={jobEndX}
            y2={height - padding}
            stroke="#dc2626"
            strokeWidth="2"
            strokeDasharray="4"
            className="dark:stroke-red-500"
          />
          <text
            x={jobEndX}
            y={padding - 20}
            textAnchor="middle"
            className="text-sm font-medium fill-red-600 dark:fill-red-400"
          >
            Job End Date
          </text>

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
                className="dark:stroke-accent-red"
              />
              <circle
                cx={freedomX}
                cy={freedomY}
                r="6"
                fill="#dc2626"
                className="animate-pulse dark:fill-accent-red"
              />
              <text
                x={freedomX}
                y={padding - 10}
                textAnchor="middle"
                className="text-sm font-medium fill-red-600 dark:fill-accent-red"
              >
                Freedom Day!
              </text>
            </>
          )}
        </svg>
      </div>

      <YearlyTabs
        data={data}
        symbol={symbol}
        targetIncome={targetIncome}
      />
    </div>
  );
}