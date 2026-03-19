import * as React from 'react';
import { cn } from '@/lib/design-system';

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    variant?: 'default' | 'elevated' | 'bordered' | 'flat';
    padding?: 'sm' | 'md' | 'lg' | 'none';
  }
>(({ className, variant = 'default', padding = 'md', ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        'rounded-lg border transition-all duration-200',
        {
          // Variants
          'bg-white shadow-sm dark:bg-gray-800': variant === 'default',
          'bg-white shadow-lg dark:bg-gray-800': variant === 'elevated',
          'bg-transparent border-2 shadow-none dark:bg-transparent': variant === 'bordered',
          'bg-gray-50 shadow-none dark:bg-gray-900': variant === 'flat',
          // Padding
          'p-3': padding === 'sm',
          'p-4': padding === 'md',
          'p-6': padding === 'lg',
          'p-0': padding === 'none',
        },
        'border-gray-200 dark:border-gray-700',
        className
      )}
      {...props}
    />
  );
});
Card.displayName = 'Card';

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex flex-col space-y-1.5 pb-4 border-b border-gray-200 dark:border-gray-700', className)}
    {...props}
  />
));
CardHeader.displayName = 'CardHeader';

const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn('text-lg font-semibold leading-none tracking-tight', className)}
    {...props}
  />
));
CardTitle.displayName = 'CardTitle';

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn('text-sm text-gray-500 dark:text-gray-400', className)}
    {...props}
  />
));
CardDescription.displayName = 'CardDescription';

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('pt-4', className)} {...props} />
));
CardContent.displayName = 'CardContent';

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex items-center pt-4 mt-auto border-t border-gray-200 dark:border-gray-700', className)}
    {...props}
  />
));
CardFooter.displayName = 'CardFooter';

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent };
