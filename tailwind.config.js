/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Primary Colors
        'primary': '#2563EB', // Professional blue (blue-600)
        'primary-50': '#EFF6FF', // Very light blue (blue-50)
        'primary-100': '#DBEAFE', // Light blue (blue-100)
        'primary-500': '#3B82F6', // Medium blue (blue-500)
        'primary-600': '#2563EB', // Primary blue (blue-600)
        'primary-700': '#1D4ED8', // Dark blue (blue-700)
        
        // Secondary Colors
        'secondary': '#64748B', // Sophisticated slate (slate-500)
        'secondary-100': '#F1F5F9', // Light slate (slate-100)
        'secondary-200': '#E2E8F0', // Medium light slate (slate-200)
        'secondary-300': '#CBD5E1', // Medium slate (slate-300)
        'secondary-400': '#94A3B8', // Medium dark slate (slate-400)
        'secondary-500': '#64748B', // Secondary slate (slate-500)
        'secondary-600': '#475569', // Dark slate (slate-600)
        'secondary-700': '#334155', // Very dark slate (slate-700)
        
        // Accent Colors
        'accent': '#F59E0B', // Warm amber (amber-500)
        'accent-50': '#FFFBEB', // Very light amber (amber-50)
        'accent-100': '#FEF3C7', // Light amber (amber-100)
        'accent-400': '#FBBF24', // Medium amber (amber-400)
        'accent-500': '#F59E0B', // Accent amber (amber-500)
        'accent-600': '#D97706', // Dark amber (amber-600)
        
        // Background Colors
        'background': '#FAFAFA', // Soft off-white (gray-50)
        'surface': '#FFFFFF', // Pure white (white)
        
        // Dark Theme Background Colors
        'dark-background': '#0F172A', // Dark slate (slate-900)
        'dark-surface': '#1E293B', // Dark slate (slate-800)
        'dark-surface-secondary': '#334155', // Medium dark slate (slate-700)
        
        // Text Colors
        'text-primary': '#1E293B', // Deep charcoal (slate-800)
        'text-secondary': '#64748B', // Medium gray (slate-500)
        'text-muted': '#94A3B8', // Light gray (slate-400)
        
        // Dark Theme Text Colors
        'dark-text-primary': '#F8FAFC', // Very light slate (slate-50)
        'dark-text-secondary': '#CBD5E1', // Light slate (slate-300)
        'dark-text-muted': '#94A3B8', // Medium slate (slate-400)
        
        // Status Colors
        'success': '#10B981', // Confident green (emerald-500)
        'success-50': '#ECFDF5', // Very light green (emerald-50)
        'success-100': '#D1FAE5', // Light green (emerald-100)
        'success-500': '#10B981', // Success green (emerald-500)
        'success-600': '#059669', // Dark green (emerald-600)
        
        'warning': '#F59E0B', // Consistent amber (amber-500)
        'warning-50': '#FFFBEB', // Very light amber (amber-50)
        'warning-100': '#FEF3C7', // Light amber (amber-100)
        'warning-500': '#F59E0B', // Warning amber (amber-500)
        'warning-600': '#D97706', // Dark amber (amber-600)
        
        'error': '#EF4444', // Clear red (red-500)
        'error-50': '#FEF2F2', // Very light red (red-50)
        'error-100': '#FEE2E2', // Light red (red-100)
        'error-500': '#EF4444', // Error red (red-500)
        'error-600': '#DC2626', // Dark red (red-600)
        
        // Border Colors
        'border': '#E2E8F0', // Light slate border (slate-200)
        'border-light': '#F1F5F9', // Very light border (slate-100)
        'dark-border': '#475569', // Dark border (slate-600)
        'dark-border-light': '#64748B', // Light dark border (slate-500)
      },
      fontFamily: {
        'heading': ['Inter', 'system-ui', 'sans-serif'],
        'body': ['Inter', 'system-ui', 'sans-serif'],
        'caption': ['Inter', 'system-ui', 'sans-serif'],
        'data': ['JetBrains Mono', 'Consolas', 'monospace'],
      },
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1rem' }],
        'sm': ['0.875rem', { lineHeight: '1.25rem' }],
        'base': ['1rem', { lineHeight: '1.5rem' }],
        'lg': ['1.125rem', { lineHeight: '1.75rem' }],
        'xl': ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
      },
      fontWeight: {
        'normal': '400',
        'medium': '500',
        'semibold': '600',
      },
      borderRadius: {
        'sm': '4px',
        'DEFAULT': '6px',
        'md': '6px',
        'lg': '8px',
        'xl': '12px',
      },
      boxShadow: {
        'sm': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        'base': '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        'md': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        'elevated': '0 1px 3px rgba(0,0,0,0.1), 0 1px 2px rgba(0,0,0,0.06)',
        'floating': '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)',
        'dark-sm': '0 1px 2px 0 rgba(0, 0, 0, 0.2)',
        'dark-base': '0 1px 3px 0 rgba(0, 0, 0, 0.3), 0 1px 2px 0 rgba(0, 0, 0, 0.2)',
        'dark-md': '0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.2)',
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      },
      animation: {
        'fade-in': 'fadeIn 0.25s ease-out',
        'slide-in': 'slideIn 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        'scale-in': 'scaleIn 0.2s ease-out',
        'shimmer': 'shimmer 1.5s linear infinite',
        'gentle-bounce': 'gentleBounce 2s ease-in-out infinite',
        'theme-transition': 'themeTransition 0.3s ease-in-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideIn: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        gentleBounce: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-4px)' },
        },
        themeTransition: {
          '0%': { opacity: '0.8' },
          '100%': { opacity: '1' },
        },
      },
      transitionTimingFunction: {
        'ease-out-custom': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
      transitionDuration: {
        '150': '150ms',
        '200': '200ms',
        '250': '250ms',
        '300': '300ms',
        '400': '400ms',
      },
      zIndex: {
        '900': '900',
        '1000': '1000',
        '1100': '1100',
        '1200': '1200',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
}