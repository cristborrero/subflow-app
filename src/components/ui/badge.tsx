import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/design-system';

const badgeVariants = cva(
  'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2',
  {
    variants: {
      variant: {
        default:
          'border border-primary-200 bg-primary-50 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400 dark:border-primary-800',
        secondary:
          'border border-gray-200 bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700',
        outline:
          'border border-gray-300 bg-transparent text-gray-700 dark:border-gray-600 dark:text-gray-300',
        muted:
          'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400',
        success:
          'border border-green-200 bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800',
        warning:
          'border border-yellow-200 bg-yellow-50 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-800',
        danger:
          'border border-red-200 bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800',
      },
      size: {
        sm: 'px-2 py-0.5 text-[10px]',
        md: 'px-2.5 py-0.5 text-xs',
        lg: 'px-3 py-1 text-sm',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, size, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant, size, className }))} {...props} />
  );
}

export { Badge, badgeVariants };
