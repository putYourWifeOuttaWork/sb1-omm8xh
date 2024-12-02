import React from 'react';
import { useCallback, useEffect, useRef } from 'react';
import { formatCurrency } from '../../utils/formatters';
import { Rabbit, Turtle } from 'lucide-react';

interface ChartTooltipProps {
  data: {
    date: Date;
    income: number;
    totalLiquidity: number;
    strategicReserve: number;
    taxReserve: number;
    strategy: 'tortoise' | 'hare';
    capitalNeededForSurvival: number;
    capitalNeededForThriving: number;
  } | null;
  position: { x: number; y: number } | null;
}

export function ChartTooltip({ data, position }: ChartTooltipProps) {
  if (!data || !position) return null;
  const tooltipRef = useRef<HTMLDivElement>(null);

  const calculatePosition = useCallback(() => {
    if (!tooltipRef.current) return { left: 0, top: 0 };
    
    const OFFSET = 10;
    const tooltip = tooltipRef.current;
    const tooltipRect = tooltip.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    // Always try to position in upper-left quadrant first
    let left = position.x - tooltipRect.width - OFFSET;
    let top = position.y - tooltipRect.height - OFFSET;

    // Boundary detection
    if (left < OFFSET) {
      left = position.x + OFFSET; // Switch to right side if too close to left edge
    }
    if (top < OFFSET) {
      top = OFFSET; // Prevent going above viewport
    }

    return { left, top };
  }, [position]);

  useEffect(() => {
    const updatePosition = () => {
      if (tooltipRef.current) {
        const { left, top } = calculatePosition();
        tooltipRef.current.style.left = `${left}px`;
        tooltipRef.current.style.top = `${top}px`;
      }
    };

    requestAnimationFrame(updatePosition);
  }, [calculatePosition]);

  // Ensure date is properly instantiated
  const tooltipDate = data.date instanceof Date ? data.date : new Date(data.date);

  return (
    <div 
      ref={tooltipRef}
      className="absolute bg-white dark:bg-dark-element p-6 rounded-lg shadow-lg border 
                border-gray-200 dark:border-dark-300 z-50 min-w-[320px] 
                transition-all duration-200 ease-in-out pointer-events-none"
    >
      <div className="space-y-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-lg font-semibold text-gray-900 dark:text-white">
            {data.strategy === 'tortoise' ? 'Tortoise' : 'Hare'} Strategy
          </span>
          {data.strategy === 'tortoise' ? (
            <Turtle className="w-6 h-6 text-cyan-600 dark:text-cyan-400" />
          ) : (
            <Rabbit className="w-6 h-6 text-pink-600 dark:text-pink-400" />
          )}
        </div>

        <div className="flex justify-between items-center">
          <span className="text-gray-600 dark:text-gray-400">Monthly Income:</span>
          <span className="font-medium">{formatCurrency(data.income || 0, 0, false)}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-600 dark:text-gray-400">Total Capital:</span>
          <span className="font-medium">
            {formatCurrency((data.totalLiquidity || 0) + (data.strategicReserve || 0) + (data.taxReserve || 0), 0, false)}
          </span>
        </div>
        
       
        
        <div className="flex justify-between items-center">
          <span className="text-gray-600 dark:text-gray-400">Date:</span>
          <span className="font-medium">
            {tooltipDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
          </span>
        </div>
        
      </div>
    </div>
  );
}