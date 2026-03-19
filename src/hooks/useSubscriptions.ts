import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabaseClient';

export interface Subscription {
  id: string;
  name: string;
  amount: number;
  currency: string;
  billing_cycle: 'weekly' | 'monthly' | 'yearly';
  next_billing_date: string;
  is_active: boolean;
  logo_url: string;
  description?: string;
  category?: string;
  reminder_days?: number;
}

export function useSubscriptions() {
  return useQuery({
    queryKey: ['subscriptions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('subscriptions')
        .select('*')
        .order('next_billing_date', { ascending: true });

      if (error) throw error;
      return data as Subscription[];
    },
  });
}

export function useAddSubscription() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newSub: Partial<Subscription>) => {
      // In a real app we'd map standard icons over domains, etc 
      if(!newSub.logo_url && newSub.name) {
        newSub.logo_url = `https://logo.clearbit.com/${newSub.name.toLowerCase().replace(/\s+/g, '')}.com`;
      }
      
      const { data, error } = await supabase
        .from('subscriptions')
        .insert([newSub])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subscriptions'] });
    },
  });
}

export function useDeleteSubscription() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('subscriptions')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subscriptions'] });
    },
  });
}

export function useUpdateSubscription() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Subscription> & { id: string }) => {
      // Keep clearbit mapping or optionally handle it on server. 
      if(!updates.logo_url && updates.name) {
        updates.logo_url = `https://logo.clearbit.com/${updates.name.toLowerCase().replace(/\\s+/g, '')}.com`;
      }
      
      const { data, error } = await supabase
        .from('subscriptions')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subscriptions'] });
    },
  });
}
