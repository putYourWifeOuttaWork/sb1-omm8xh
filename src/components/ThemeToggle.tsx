import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';

export function ThemeToggle() {
  const { isDark, toggle } = useTheme();

  return (
    <button
      onClick={toggle}
      className="fixed top-4 right-4 p-2 rounded-full bg-white/10 dark:bg-dark-element/10 
        backdrop-blur-sm hover:bg-white/20 dark:hover:bg-dark-element/20 transition-colors z-[100]
        shadow-lg border border-gray-200 dark:border-dark-300"
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {isDark ? (
        <Sun className="w-5 h-5 text-accent-yellow" />
      ) : (
        <Moon className="w-5 h-5 text-accent-blue" />
      )}
    </button>
  );
}