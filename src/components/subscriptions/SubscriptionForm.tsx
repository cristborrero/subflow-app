import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Calendar } from 'lucide-react';
import { useAddSubscription, useUpdateSubscription, useSubscriptions } from '@/hooks/useSubscriptions';
import { useAuthStore } from '@/store/authStore';

// Form schema
const subscriptionSchema = z.object({
  name: z.string().min(1, 'Service name is required').max(100),
  description: z.string().max(500).optional(),
  amount: z.number().min(0, 'Amount cannot be negative'),
  currency: z.string(),
  billingCycle: z.enum(['weekly', 'monthly', 'yearly']),
  startDate: z.string(),
  category: z.string().optional(),
  cardId: z.string().optional(),
  reminderDays: z.number().min(0).max(30),
});

type SubscriptionFormValues = z.infer<typeof subscriptionSchema>;

interface SubscriptionFormProps {
  subscriptionId?: string;
  onSuccess: () => void;
}

// Mock data for selects
const categories = [
  'Entertainment',
  'Music',
  'Productivity',
  'Development',
  'Health',
  'Education',
  'Social',
  'Utilities',
  'Gaming',
  'Other',
];

const currencies = ['USD', 'EUR', 'GBP', 'JPY', 'CAD', 'AUD'];

const billingCycles = [
  { value: 'weekly', label: 'Weekly' },
  { value: 'monthly', label: 'Monthly' },
  { value: 'yearly', label: 'Yearly' },
];

export function SubscriptionForm({ subscriptionId, onSuccess }: SubscriptionFormProps) {
  const addSubscription = useAddSubscription();
  const updateSubscription = useUpdateSubscription();
  const { data: subscriptions } = useSubscriptions();
  const { user } = useAuthStore();
  const [submitError, setSubmitError] = React.useState<string | null>(null);

  const form = useForm<SubscriptionFormValues>({
    resolver: zodResolver(subscriptionSchema),
    defaultValues: {
      name: '',
      description: '',
      amount: 0,
      currency: 'USD',
      billingCycle: 'monthly',
      startDate: new Date().toISOString().slice(0, 16), // YYYY-MM-DDTHH:MM
      category: undefined,
      cardId: undefined,
      reminderDays: 3,
    },
  });

  React.useEffect(() => {
    if (subscriptionId && subscriptions) {
      const existing = subscriptions.find(s => s.id === subscriptionId);
      if (existing) {
        form.reset({
          name: existing.name,
          description: existing.description || '',
          amount: existing.amount,
          currency: existing.currency,
          billingCycle: existing.billing_cycle,
          startDate: existing.next_billing_date ? new Date(existing.next_billing_date).toISOString().slice(0, 16) : new Date().toISOString().slice(0, 16),
          category: existing.category,
          cardId: undefined,
          reminderDays: existing.reminder_days ?? 3,
        });
      }
    } else {
      form.reset({
        name: '',
        description: '',
        amount: 0,
        currency: 'USD',
        billingCycle: 'monthly',
        startDate: new Date().toISOString().slice(0, 16),
        category: undefined,
        cardId: undefined,
        reminderDays: 3,
      });
    }
  }, [subscriptionId, subscriptions, form]);

  const onSubmit = async (data: SubscriptionFormValues) => {
    setSubmitError(null);
    try {
      if (!user) throw new Error('You must be logged in to add subscriptions.');
      
      const payload = {
        name: data.name,
        description: data.description,
        amount: data.amount,
        currency: data.currency,
        billing_cycle: data.billingCycle,
        next_billing_date: new Date(data.startDate).toISOString(), // Map startDate to next_billing_date for initial sync
        category: data.category,
        reminder_days: data.reminderDays,
        user_id: user.id,
        is_active: true
      };

      if (subscriptionId) {
        await updateSubscription.mutateAsync({ id: subscriptionId, ...payload });
      } else {
        await addSubscription.mutateAsync(payload);
      }
      form.reset();
      onSuccess();
    } catch (error: any) {
      console.error('Error submitting subscription:', error);
      setSubmitError(error.message || 'Failed to add subscription.');
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {submitError && (
          <div className="p-3 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-sm rounded-lg border border-red-200 dark:border-red-800">
            {submitError}
          </div>
        )}
        {/* Service Name */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Service Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Netflix, Spotify, Adobe CC" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Description */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description (optional)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Brief description of the subscription"
                  {...field}
                  value={field.value || ''}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Amount & Currency */}
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="amount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Amount</FormLabel>
                <FormControl>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                      $
                    </span>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      className="pl-8"
                      {...field}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => field.onChange(parseFloat(e.target.value) || 0)}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="currency"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Currency</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select currency" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {currencies.map((curr) => (
                      <SelectItem key={curr} value={curr}>
                        {curr}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Billing Cycle & Start Date */}
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="billingCycle"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Billing Cycle</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select cycle" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {billingCycles.map((cycle) => (
                      <SelectItem key={cycle.value} value={cycle.value}>
                        {cycle.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="startDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Start Date</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input type="datetime-local" className="pl-10" {...field} />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Category & Reminder Days */}
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category (optional)</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="reminderDays"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Reminder (days before)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min={0}
                    max={30}
                    {...field}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => field.onChange(parseInt(e.target.value) || 0)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
          <Button
            type="button"
            variant="outline"
            onClick={() => onSuccess()}
            disabled={addSubscription.isPending || updateSubscription.isPending}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={addSubscription.isPending || updateSubscription.isPending}>
            {(addSubscription.isPending || updateSubscription.isPending) ? 'Saving...' : (subscriptionId ? 'Update Subscription' : 'Add Subscription')}
          </Button>
        </div>
      </form>
    </Form>
  );
}
