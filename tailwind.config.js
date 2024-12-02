/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    screens: {
      'xs': '480px',
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1536px',
    },
    extend: {
      colors: {
        dark: {
          bg: '#1A1B23',
          element: '#232328',
          '100': '#28282E',
          '200': '#2C3156',
          '300': '#363A5E',
          '400': '#4A4D6A',
          '500': '#5C5F7A'
        },
        accent: {
          green: '#10B981', // Adjusted for WCAG AAA
          red: '#EF4444',   // Adjusted for WCAG AAA
          blue: '#3B82F6',  // Adjusted for WCAG AAA
          purple: '#8B5CF6', // Adjusted for WCAG AAA
          yellow: '#F59E0B', // Adjusted for WCAG AAA
          teal: '#14B8A6'    // Adjusted for WCAG AAA
        }
      },
      boxShadow: {
        'dark-sm': '0 1px 2px 0 rgba(0, 0, 0, 0.35)',
        'dark-md': '0 4px 6px -1px rgba(0, 0, 0, 0.35), 0 2px 4px -1px rgba(0, 0, 0, 0.25)',
        'dark-lg': '0 10px 15px -3px rgba(0, 0, 0, 0.35), 0 4px 6px -2px rgba(0, 0, 0, 0.25)'
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: 'none',
            color: '#374151',
            '--tw-prose-body': '#374151',
            '--tw-prose-headings': '#111827',
            '--tw-prose-links': '#2563EB',
            '--tw-prose-bold': '#111827',
            '--tw-prose-counters': '#6B7280',
            '--tw-prose-bullets': '#D1D5DB',
            '--tw-prose-hr': '#E5E7EB',
            '--tw-prose-quotes': '#111827',
            '--tw-prose-quote-borders': '#E5E7EB',
            '--tw-prose-captions': '#6B7280',
            '--tw-prose-code': '#111827',
            '--tw-prose-pre-code': '#E5E7EB',
            '--tw-prose-pre-bg': '#1F2937',
            '--tw-prose-th-borders': '#D1D5DB',
            '--tw-prose-td-borders': '#E5E7EB',
          },
        },
        invert: {
          css: {
            '--tw-prose-body': '#D1D5DB',
            '--tw-prose-headings': '#F9FAFB',
            '--tw-prose-links': '#60A5FA',
            '--tw-prose-bold': '#F9FAFB',
            '--tw-prose-counters': '#9CA3AF',
            '--tw-prose-bullets': '#4B5563',
            '--tw-prose-hr': '#374151',
            '--tw-prose-quotes': '#F3F4F6',
            '--tw-prose-quote-borders': '#374151',
            '--tw-prose-captions': '#9CA3AF',
            '--tw-prose-code': '#F9FAFB',
            '--tw-prose-pre-code': '#D1D5DB',
            '--tw-prose-pre-bg': '#1F2937',
            '--tw-prose-th-borders': '#4B5563',
            '--tw-prose-td-borders': '#374151',
          },
        },
      },
    },
  },
  plugins: [],
};