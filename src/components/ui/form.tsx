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
>(({ className, ...props }, ref) => (
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
  control?: any; // In real app, use React Hook Form control
  name: string;
  render: (props: { field: any; fieldState: any }) => React.ReactNode;
}

export function FormField({ control, name, render }: FormFieldProps) {
  const [value, setValue] = React.useState('');
  const [error, setError] = React.useState<string | null>(null);

  const field = {
    value,
    onChange: setValue,
    name,
  };

  return <>{render({ field, fieldState: { error } })}</>;
}

interface FormItemProps extends React.HTMLAttributes<HTMLDivElement> {}
export const FormItem = React.forwardRef<HTMLDivElement, FormItemProps>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('space-y-2', className)} {...props} />
  )
);
FormItem.displayName = 'FormItem';

interface FormLabelProps extends React.HTMLAttributes<HTMLParagraphElement> {}
export const FormLabel = React.forwardRef<HTMLParagraphElement, FormLabelProps>(
  ({ className, ...props }, ref) => (
    <Label
      ref={ref}
      className={cn('text-sm font-medium leading-none', className)}
      {...props}
    />
  )
);
FormLabel.displayName = 'FormLabel';

interface FormControlProps extends React.HTMLAttributes<HTMLDivElement> {}
export const FormControl = React.forwardRef<HTMLDivElement, FormControlProps>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('mt-1.5', className)} {...props} />
  )
);
FormControl.displayName = 'FormControl';

interface FormMessageProps extends React.HTMLAttributes<HTMLParagraphElement> {}
export const FormMessage = React.forwardRef<
  HTMLParagraphElement,
  FormMessageProps
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn('text-sm font-medium text-red-500 mt-1', className)}
    {...props}
  />
));
FormMessage.displayName = 'FormMessage';

export { Label };
