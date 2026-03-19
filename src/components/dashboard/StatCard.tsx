import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { cn, formatCurrency } from '@/lib/design-system';
import {
  TrendingUp,
  TrendingDown,
  Calendar,
  CreditCard,
  Bell,
} from 'lucide-react';

export interface StatCardProps {
  title: string;
  value: string | number;
  change?: number; // percentage change from last period
  changeLabel?: string;
  icon: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'danger';
  className?: string;
}

export function StatCard({
  title,
  value,
  change,
  changeLabel = 'vs last month',
  icon,
  variant = 'default',
  className,
}: StatCardProps) {
  const isPositive = change && change > 0;
  const isNegative = change && change < 0;

  // Variant styling for border/background accent
  const variantStyles = {
    default: '',
    success: 'border-l-4 border-l-green-500',
    warning: 'border-l-4 border-l-yellow-500',
    danger: 'border-l-4 border-l-red-500',
  };

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
    >
      <Card
        className={cn(
          'relative overflow-hidden bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm transition-shadow duration-300 hover:shadow-card-hover rounded-xl',
          variantStyles[variant],
          className
        )}
      >
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          {/* Content */}
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
              {title}
            </p>
            <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              {value}
            </p>

            {/* Change indicator */}
            {change !== undefined && (
              <div className="flex items-center mt-2 text-sm">
                {isPositive && (
                  <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                )}
                {isNegative && (
                  <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
                )}
                <span
                  className={cn(
                    'font-medium',
                    isPositive && 'text-green-600 dark:text-green-400',
                    isNegative && 'text-red-600 dark:text-red-400',
                    !isPositive && !isNegative && 'text-gray-600 dark:text-gray-400'
                  )}
                >
                  {isPositive && '+'}
                  {Math.round(change || 0)}%
                </span>
                <span className="text-gray-500 dark:text-gray-400 ml-1">
                  {changeLabel}
                </span>
              </div>
            )}
          </div>

          {/* Icon */}
          <div className="ml-4 p-3 bg-primary-100 dark:bg-primary-900/30 rounded-xl text-primary-600 dark:text-primary-400">
            {icon}
          </div>
        </div>
      </CardContent>

      {/* Subtle decorative element */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-primary-500/5 to-transparent rounded-bl-full pointer-events-none" />
      </Card>
    </motion.div>
  );
}

// Preset configurations for common stats
export const statPresets = {
  totalSpending: (value: number, change?: number) => ({
    title: 'Total Monthly Spending',
    value: formatCurrency(value),
    change,
    icon: <TrendingUp className="h-5 w-5" />,
    variant: 'default' as const,
  }),

  activeSubscriptions: (count: number, change?: number) => ({
    title: 'Active Subscriptions',
    value: count.toString(),
    change,
    icon: <CreditCard className="h-5 w-5" />,
    variant: 'success' as const,
  }),

  nextPayment: (amount: number, days: number): StatCardProps => ({
    title: 'Next Payment',
    value: formatCurrency(amount),
    changeLabel: `in ${days} days`,
    icon: <Calendar className="h-5 w-5" />,
    variant: days <= 3 ? 'warning' : 'default',
  }),

  potentialSavings: (amount: number) => ({
    title: 'Potential Monthly Savings',
    value: formatCurrency(amount),
    icon: <Bell className="h-5 w-5" />,
    variant: 'success' as const,
  }),
};
