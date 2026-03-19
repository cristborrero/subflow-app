import * as React from 'react';
import * as LabelPrimitive from '@radix-ui/react-label';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/design-system';

const labelVariants = cva(
  'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
);

const Label = React.forwardRef<
  React.ComponentRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root> &
    VariantProps<typeof labelVariants>
>(({ className, ...props }: React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root> & VariantProps<typeof labelVariants>, ref: React.ForwardedRef<React.ComponentRef<typeof LabelPrimitive.Root>>) => (
  <LabelPrimitive.Root
    ref={ref}
    className={cn(labelVariants(), className)}
    {...props}
  />
));
Label.displayName = LabelPrimitive.Root.displayName;

// Simple Form components (no full react-hook-form integration for simplicity)
interface FormProps {
  children: React.ReactNode;
  onSubmit?: (e: React.FormEvent) => void;
}

export function Form({ children, onSubmit }: FormProps) {
  return <form onSubmit={onSubmit}>{children}</form>;
}

interface FormFieldProps {
  control?: any; // For compatibility with react-hook-form
  name: string;
  render: (props: { field: any; fieldState: { error: string | null } }) => React.ReactNode;
}

export function FormField({ name, render }: FormFieldProps) {
  const [value, setValue] = React.useState('');
  const [error] = React.useState<string | null>(null);

  const field = {
    value,
    onChange: setValue,
    name,
  };

  return <>{render({ field, fieldState: { error } })}</>;
}

interface FormItemProps extends React.HTMLAttributes<HTMLDivElement> {}
export const FormItem = React.forwardRef<HTMLDivElement, FormItemProps>(
  ({ className, ...props }: FormItemProps, ref: React.ForwardedRef<HTMLDivElement>) => (
    <div ref={ref} className={cn('space-y-2', className)} {...props} />
  )
);
FormItem.displayName = 'FormItem';

export const FormLabel = React.forwardRef<
  React.ComponentRef<typeof Label>,
  React.ComponentPropsWithoutRef<typeof Label>
>(({ className, ...props }: React.ComponentPropsWithoutRef<typeof Label>, ref: React.ForwardedRef<React.ComponentRef<typeof Label>>) => (
  <Label
    ref={ref}
    className={cn('text-sm font-medium leading-none', className)}
    {...props}
  />
));
FormLabel.displayName = 'FormLabel';
FormLabel.displayName = 'FormLabel';

interface FormControlProps extends React.HTMLAttributes<HTMLDivElement> {}
export const FormControl = React.forwardRef<HTMLDivElement, FormControlProps>(
  ({ className, ...props }: FormControlProps, ref: React.ForwardedRef<HTMLDivElement>) => (
    <div ref={ref} className={cn('mt-1.5', className)} {...props} />
  )
);
FormControl.displayName = 'FormControl';

interface FormMessageProps extends React.HTMLAttributes<HTMLParagraphElement> {}
export const FormMessage = React.forwardRef<
  HTMLParagraphElement,
  FormMessageProps
>(({ className, ...props }: FormMessageProps, ref: React.ForwardedRef<HTMLParagraphElement>) => (
  <p
    ref={ref}
    className={cn('text-sm font-medium text-red-500 mt-1', className)}
    {...props}
  />
));
FormMessage.displayName = 'FormMessage';

export { Label };
