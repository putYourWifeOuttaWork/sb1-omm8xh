import React from 'react';

interface ValidationTooltipProps {
  message: string;
  show: boolean;
  type?: 'error' | 'info';
}

export function ValidationTooltip({ message, show, type = 'info' }: ValidationTooltipProps) {
  if (!show) return null;

  return (
    <div className="absolute -right-4 top-1/2 transform translate-x-full -translate-y-1/2">
      <div className={`relative flex items-center px-3 py-1 rounded-lg text-sm font-bold shadow-lg
        ${type === 'error' 
          ? 'bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400' 
          : 'bg-blue-50 text-[#3B82F6] dark:bg-blue-900/20 dark:text-blue-400'}`}
      >
        <div className="absolute left-0 top-1/2 transform -translate-x-1 -translate-y-1/2 
          border-8 border-transparent border-r-current opacity-20">
        </div>
        {message}
      </div>
    </div>
  );
}