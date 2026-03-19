import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4"

console.log("Check-subscriptions function up and running!")

serve(async (req) => {
  try {
    // 1. Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '', // Service role to bypass RLS
    )

    // 2. Query subscriptions to find those nearing billing date within their `reminder_days`
    // Logic: next_billing_date <= (current_date + reminder_days) AND next_billing_date >= current_date
    const today = new Date();
    const formattedToday = today.toISOString().split('T')[0];
    
    // Note: We use raw RPC or query builder inside to calculate the valid subset
    // Since SQL is faster, ideally we'd have a view or RPC in Supabase, 
    // but here we demonstrate the Edge Function executing logic.
    const { data: activeSubs, error: subsError } = await supabaseClient
      .from('subscriptions')
      .select('id, user_id, next_billing_date, reminder_days, name, amount')
      .eq('is_active', true);

    if (subsError) throw subsError;

    const triggeredNotifications = [];

    // Process and filter in memory (for large datasets, push logic to DB via RPC)
    for (const sub of activeSubs) {
      const billingDate = new Date(sub.next_billing_date);
      const diffTime = Math.abs(billingDate.getTime() - today.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 

      if (diffDays === sub.reminder_days) {
        triggeredNotifications.push({
          user_id: sub.user_id,
          subscription_id: sub.id,
          type: 'email',
          trigger_days_before: diffDays,
          is_enabled: true
        });
      }
    }

    // 3. Batch insert notifications
    if (triggeredNotifications.length > 0) {
      const { error: insertError } = await supabaseClient
        .from('notifications')
        .insert(triggeredNotifications);
        
      if (insertError) throw insertError;
    }

    return new Response(
      JSON.stringify({
        message: 'Job completed.',
        processed: activeSubs.length,
        notifications_sent: triggeredNotifications.length
      }),
      { headers: { "Content-Type": "application/json" } },
    )
  } catch (err) {
    return new Response(String(err?.message ?? err), { status: 500 })
  }
})
