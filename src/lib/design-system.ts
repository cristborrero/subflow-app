/**
 * SubFlow Design System - Tokens & Constants
 * Centralized design tokens for consistency across the application
 */

import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export const designTokens = {
  colors: {
    primary: {
      50: '#E6F7F5',
      100: '#B3E6E1',
      200: '#80D4CD',
      300: '#4DC2B8',
      400: '#26B3A6',
      500: '#00A896',
      600: '#008F80',
      700: '#007669',
      800: '#005D52',
      900: '#00443D',
    },
    accent: {
      50: '#F5F3FF',
      100: '#EDE9FE',
      200: '#DDD6FE',
      300: '#C4B5FD',
      400: '#A78BFA',
      500: '#8B5CF6',
      600: '#7C3AED',
      700: '#6D28D9',
      800: '#5B21B6',
      900: '#4C1D95',
    },
    semantic: {
      success: {
        500: '#10B981',
        600: '#059669',
        700: '#047857',
      },
      warning: {
        500: '#F59E0B',
        600: '#D97706',
        700: '#B45309',
      },
      danger: {
        500: '#EF4444',
        600: '#DC2626',
        700: '#B91C1C',
      },
      info: {
        500: '#3B82F6',
        600: '#2563EB',
        700: '#1D4ED8',
      },
    },
    gray: {
      50: '#F9FAFB',
      100: '#F3F4F6',
      200: '#E5E7EB',
      300: '#D1D5DB',
      400: '#9CA3AF',
      500: '#6B7280',
      600: '#4B5563',
      700: '#374151',
      800: '#1F2937',
      900: '#111827',
    },
  } as const,

  spacing: {
    1: '0.25rem',   // 4px
    2: '0.5rem',    // 8px
    3: '0.75rem',   // 12px
    4: '1rem',      // 16px
    5: '1.25rem',   // 20px
    6: '1.5rem',    // 24px
    7: '1.75rem',   // 28px
    8: '2rem',      // 32px
    10: '2.5rem',   // 40px
    12: '3rem',     // 48px
    16: '4rem',     // 64px
    20: '5rem',     // 80px
    24: '6rem',     // 96px
    32: '8rem',     // 128px
  } as const,

  typography: {
    fontFamily: {
      sans: ['Inter', 'system-ui', 'sans-serif'],
      mono: ['JetBrains Mono', 'monospace'],
    },
    fontSize: {
      'display-6xl': { size: '4.5rem', lineHeight: '1.1', weight: 800 },
      'display-5xl': { size: '3.75rem', lineHeight: '1.2', weight: 700 },
      'display-4xl': { size: '3rem', lineHeight: '1.2', weight: 700 },
      h1: { size: '2.25rem', lineHeight: '1.25', weight: 700 },
      h2: { size: '1.875rem', lineHeight: '1.3', weight: 600 },
      h3: { size: '1.5rem', lineHeight: '1.4', weight: 600 },
      h4: { size: '1.25rem', lineHeight: '1.5', weight: 500 },
      'body-lg': { size: '1.125rem', lineHeight: '1.6', weight: 400 },
      'body-base': { size: '1rem', lineHeight: '1.6', weight: 400 },
      'body-sm': { size: '0.875rem', lineHeight: '1.6', weight: 400 },
      'text-xs': { size: '0.75rem', lineHeight: '1.5', weight: 400 },
      'text-sm': { size: '0.875rem', lineHeight: '1.5', weight: 400 },
    } as const,
  } as const,

  animation: {
    duration: {
      fast: 200,
      normal: 300,
      slow: 500,
    },
    easing: {
      out: 'cubic-bezier(0, 0, 0.2, 1)',
      inOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
      bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    },
  } as const,

  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  } as const,

  radii: {
    sm: '0.25rem',
    md: '0.5rem',
    lg: '0.75rem',
    xl: '1rem',
    '2xl': '1.5rem',
    full: '9999px',
  } as const,

  shadows: {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
    xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
  } as const,
} as const;

// Type exports
export type ColorToken = typeof designTokens.colors;
export type SpacingToken = typeof designTokens.spacing;
export type TypographyToken = typeof designTokens.typography;
export type BreakpointToken = typeof designTokens.breakpoints;

// Convenience functions
export const formatCurrency = (amount: number, currency = 'USD'): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

export const formatDate = (date: Date | string): string => {
  const d = new Date(date);
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(d);
};

export const formatDateRelative = (date: Date | string): string => {
  const now = new Date();
  const target = new Date(date);
  const diffDays = Math.ceil((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Tomorrow';
  if (diffDays < 0) return `Overdue by ${Math.abs(diffDays)} days`;
  if (diffDays <= 7) return `In ${diffDays} days`;
  return formatDate(date);
};

export const getCardBrand = (lastFour: string): string => {
  // Dummy implementation - real would check first digits
  const firstDigit = lastFour[0];
  switch (firstDigit) {
    case '4': return 'visa';
    case '5': return 'mastercard';
    case '3': return 'amex';
    default: return 'unknown';
  }
};

// Re-exported from utils/cn for convenience — single source of truth
export const cn = (...inputs: ClassValue[]): string => {
  return twMerge(clsx(inputs));
};
