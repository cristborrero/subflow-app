import { motion } from 'framer-motion';
import { StatCard, statPresets } from '@/components/dashboard/StatCard';
import { AnimatedBarChart } from '@/components/charts/ExpenseChart';
import { SubscriptionCard } from '@/components/subscriptions/SubscriptionCard';
import { Button } from '@/components/ui/button';
import { Plus, Loader2 } from 'lucide-react';
import { useSubscriptions } from '@/hooks/useSubscriptions';
import { Link } from 'react-router-dom';

// Projected monthly cost calculation is built inside the component

export function DashboardPage() {
  const { data: subscriptions, isLoading, isError } = useSubscriptions();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-24 min-h-screen">
        <Loader2 className="h-8 w-8 text-[#635bff] animate-spin" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500">Failed to load dashboard data. Please check your connection.</p>
      </div>
    );
  }

  const safeSubscriptions = subscriptions || [];

  // Calculate derived data
  const activeSubs = safeSubscriptions.filter(s => s.is_active);
  const totalSpending = activeSubs.reduce((sum, sub) => sum + sub.amount, 0);
  
  const upcomingSubscriptions = [...activeSubs]
    .sort((a, b) => new Date(a.next_billing_date).getTime() - new Date(b.next_billing_date).getTime());

  const nextPayment = upcomingSubscriptions[0];

  const dynamicMonthlyData = Array.from({ length: 6 }).map((_, i) => {
    const d = new Date();
    d.setMonth(d.getMonth() + i);
    return { month: d.toLocaleString('default', { month: 'short' }), amount: 0, date: d };
  });

  activeSubs.forEach(sub => {
    const subDate = new Date(sub.next_billing_date);
    dynamicMonthlyData.forEach(m => {
      if (sub.billing_cycle === 'monthly') {
        m.amount += Number(sub.amount);
      } else if (sub.billing_cycle === 'yearly' && subDate.getMonth() === m.date.getMonth() && subDate.getFullYear() === m.date.getFullYear()) {
        m.amount += Number(sub.amount);
      } else if (sub.billing_cycle === 'weekly') {
        m.amount += Number(sub.amount) * 4.33;
      }
    });
  });

  const stats = [
    statPresets.totalSpending(totalSpending), 
    statPresets.activeSubscriptions(activeSubs.length),
    ...(nextPayment
      ? [
          statPresets.nextPayment(
            nextPayment.amount,
            Math.max(0, Math.ceil((new Date(nextPayment.next_billing_date).getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
          ),
        ]
      : []),
    statPresets.potentialSavings(0),
  ];

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } },
  };

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-8 pb-8 font-sans"
    >
      {/* Page Header */}
      <motion.div variants={item} className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
            Dashboard
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Overview of your subscriptions and spending
          </p>
        </div>

        <Link to="/subscriptions">
          <Button className="bg-[#635bff] hover:bg-[#4f46e5] text-white shadow-md transition-all font-semibold rounded-lg">
            <Plus className="h-4 w-4 mr-2" />
            Add Subscription
          </Button>
        </Link>
      </motion.div>

      {/* Stats Grid */}
      <motion.div variants={item} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </motion.div>

      {/* Charts Row */}
      <motion.div variants={item} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Monthly Spending Chart */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-[#112d4e] rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-800 transition-colors duration-300">
            <h2 className="text-xl font-semibold mb-4 text-slate-900 dark:text-white">
              Monthly Spending
            </h2>
            <AnimatedBarChart data={dynamicMonthlyData} />
          </div>
        </div>

        {/* Quick Actions / Info Panel */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-[#112d4e] rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-800 transition-colors duration-300">
            <h2 className="text-xl font-semibold mb-4 text-slate-900 dark:text-white">
              Upcoming Payments
            </h2>
            <div className="space-y-4">
              {upcomingSubscriptions.slice(0, 4).length === 0 ? (
                 <p className="text-sm text-slate-500 text-center py-4">No upcoming payments.</p>
              ) : upcomingSubscriptions.slice(0, 4).map((sub) => (
                <div
                  key={sub.id}
                  className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-800 last:border-0"
                >
                  <div className="min-w-0 pr-4">
                    <p className="font-medium text-slate-900 dark:text-slate-100 truncate">
                      {sub.name}
                    </p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      {new Date(sub.next_billing_date).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                      })}
                    </p>
                  </div>
                  <p className="font-semibold text-slate-900 dark:text-slate-100 shrink-0">
                    {sub.currency === 'USD' ? '$' : sub.currency}{sub.amount.toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-br from-[#635bff] to-[#4f46e5] rounded-xl p-6 text-white shadow-md">
            <h2 className="text-xl font-semibold mb-2">💰 Save More</h2>
            <p className="text-indigo-100 mb-4 opacity-90">
              Review your subscriptions, there might be options to cancel unused ones and save more money.
            </p>
            <Link to="/subscriptions">
              <Button className="w-full bg-white text-[#635bff] hover:bg-slate-50 border-0 font-semibold transition-colors">
                Review Subscriptions
              </Button>
            </Link>
          </div>
        </div>
      </motion.div>

      {/* Recent Subscriptions */}
      <motion.div variants={item} className="bg-white dark:bg-[#112d4e] rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-800 transition-colors duration-300">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
            Active Subscriptions
          </h2>
          <Link to="/subscriptions">
            <Button variant="outline" size="sm" className="bg-white dark:bg-[#112d4e] border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300">
              View All
            </Button>
          </Link>
        </div>

        <div className="space-y-4">
          {safeSubscriptions.filter(s => s.is_active).slice(0, 3).length === 0 ? (
            <p className="text-sm text-slate-500 text-center py-4">You have no active subscriptions yet.</p>
          ) : safeSubscriptions.filter(s => s.is_active).slice(0, 3).map((sub) => (
            <SubscriptionCard key={sub.id} {...sub} />
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}
