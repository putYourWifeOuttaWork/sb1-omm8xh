import React, { useEffect, useState } from 'react';
import { Spinner } from './ui/Spinner';

interface LoadingOverlayProps {
  loading: boolean;
  children: React.ReactNode;
  delay?: number;
  message?: string;
}

export function LoadingOverlay({ 
  loading, 
  children, 
  delay = 300,
  message = 'We are fetching the top-picks for the Rolling Wheel strategy'
}: LoadingOverlayProps) {
  const [showSpinner, setShowSpinner] = useState(false);

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (loading) {
      timeout = setTimeout(() => setShowSpinner(true), delay);
    } else {
      setShowSpinner(false);
    }
    return () => clearTimeout(timeout);
  }, [loading, delay]);

  if (!loading) return <>{children}</>;

  return (
    <div className="relative">
      {showSpinner && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/80 dark:bg-dark-bg/80 backdrop-blur-sm z-50">
          <Spinner size="lg" />
          <p className="mt-4 text-lg font-medium text-gray-900 dark:text-gray-100 text-center max-w-md px-4">
            {message}
          </p>
        </div>
      )}
      <div className={loading ? 'opacity-50' : ''}>
        {children}
      </div>
    </div>
  );
}