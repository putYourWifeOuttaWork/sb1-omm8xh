import React from 'react';

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function Spinner({ size = 'md', className = '' }: SpinnerProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  return (
    <div className={`relative ${sizeClasses[size]} ${className}`}>
      <div className="absolute w-full h-full rounded-full border-2 border-t-accent-blue dark:border-t-accent-teal border-r-accent-blue/30 dark:border-r-accent-teal/30 border-b-accent-blue/10 dark:border-b-accent-teal/10 border-l-accent-blue/30 dark:border-l-accent-teal/30 animate-spin"></div>
    </div>
  );
}