import React from 'react';
import { formatCurrency } from '../../utils/formatters';

interface ProgressVisualizationProps {
  startProgress: number;
  endProgress: number;
}

export function ProgressVisualization({ startProgress, endProgress }: ProgressVisualizationProps) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [width, setWidth] = React.useState(320);
  const height = 100;
  const padding = { left: 60, right: 60, top: 40, bottom: 30 };
  const barHeight = 24;

  React.useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        setWidth(Math.max(320, containerRef.current.offsetWidth));
      }
    };

    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  // Calculate scale multiplier based on maximum progress
  const maxProgress = Math.max(endProgress, 100);
  
  // Determine scale increment and max scale based on progress range
  let scaleIncrement: number;
  let maxScale: number;
  
  if (maxProgress > 1000) {
    scaleIncrement = 500;
    maxScale = Math.ceil(maxProgress / 500) * 500;
  } else if (maxProgress > 500) {
    scaleIncrement = 100;
    maxScale = Math.ceil(maxProgress / 100) * 100;
  } else if (maxProgress > 100) {
    scaleIncrement = 50;
    maxScale = Math.ceil(maxProgress / 50) * 50;
  } else {
    scaleIncrement = 25;
    maxScale = 100;
  }
  
  // Calculate number of markers needed
  const numMarkers = Math.floor(maxScale / scaleIncrement) + 1;
   
  // Adjust scale to handle values over 100%
  const xScale = (value: number) => {
    return padding.left + ((value / maxScale) * (width - padding.left - padding.right));
  };

  // Generate percentage markers based on scale multiplier
  const percentageMarkers = Array.from(
    { length: numMarkers },
    (_, i) => Math.min(i * scaleIncrement, maxScale)
  );

  return (
    <div ref={containerRef} className="w-full">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white text-center mb-4">
        Freedom Progress
      </h3>

      <div className="flex justify-center w-full overflow-x-auto">
        <svg width={width} height={height} className="min-w-[320px] w-full">
          {/* Percentage scale markers */}
          {percentageMarkers.map((percent) => {
            const x = xScale(percent);
            return (
              <g key={percent}>
                <line
                  x1={x}
                  y1={padding.top - 5}
                  x2={x}
                  y2={padding.top + barHeight + 5}
                  stroke="#e2e8f0"
                  strokeWidth="1"
                  className="dark:stroke-dark-300"
                />
                <text
                  x={x}
                  y={padding.top + barHeight + 25}
                  textAnchor="middle"
                  className="text-[10px] sm:text-xs fill-gray-600 dark:fill-gray-400 select-none"
                >
                  {percent}%
                </text>
              </g>
            );
          })}

          {/* Base segment */}
          <rect
            x={padding.left}
            y={padding.top}
            width={Math.max(0, xScale(startProgress) - padding.left)}
            height={barHeight}
            fill="#8884d8"
            className="dark:fill-accent-purple"
          />

          {/* Progress segment */}
          <rect
            x={xScale(startProgress)}
            y={padding.top}
            width={Math.max(0, xScale(endProgress) - xScale(startProgress))}
            height={barHeight}
            fill="#82ca9d"
            className="dark:fill-accent-green"
          />

          {/* Value labels */}
          <text
            x={xScale(startProgress)}
            y={padding.top - 8}
            textAnchor="middle"
            className="text-[10px] sm:text-xs fill-gray-600 dark:fill-gray-400"
          >
            {formatCurrency(startProgress, 2)}%
          </text>

          <text
            x={xScale(endProgress)}
            y={padding.top - 8}
            textAnchor="middle"
            className="text-[10px] sm:text-xs fill-gray-600 dark:fill-gray-400"
          >
            {formatCurrency(endProgress, 2)}%
          </text>
        </svg>
      </div>
    </div>
  );
}