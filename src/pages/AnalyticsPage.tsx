import { StatCard, statPresets } from '@/components/dashboard/StatCard';
import { TrendChart } from '@/components/charts/ExpenseChart';
import { CategoryDonutChart } from '@/components/charts/ExpenseChart';

import { useSubscriptions } from '@/hooks/useSubscriptions';

export function AnalyticsPage() {
  const { data: subscriptions } = useSubscriptions();
  const safeSubscriptions = subscriptions || [];
  const activeSubs = safeSubscriptions.filter((s) => s.is_active);

  // Dynamic Monthly Data Projection based on active subscriptions
  const dynamicMonthlyData = Array.from({ length: 6 }).map((_, i) => {
    const d = new Date();
    d.setMonth(d.getMonth() + i);
    return { month: d.toLocaleString('default', { month: 'short' }), amount: 0, date: d };
  });

  const categoryTotals: Record<string, number> = {};

  activeSubs.forEach((sub) => {
    const subDate = new Date(sub.next_billing_date);
    
    // Accumulate total by category
    const cat = sub.category || 'Other';
    const amount = Number(sub.amount);
    
    let monthlyEquivalent = amount;
    if (sub.billing_cycle === 'yearly') monthlyEquivalent = amount / 12;
    if (sub.billing_cycle === 'weekly') monthlyEquivalent = amount * 4.33;

    categoryTotals[cat] = (categoryTotals[cat] || 0) + monthlyEquivalent;

    // Monthly projection
    dynamicMonthlyData.forEach((m) => {
      if (sub.billing_cycle === 'monthly') {
        m.amount += amount;
      } else if (
        sub.billing_cycle === 'yearly' &&
        subDate.getMonth() === m.date.getMonth() &&
        subDate.getFullYear() === m.date.getFullYear()
      ) {
        m.amount += amount;
      } else if (sub.billing_cycle === 'weekly') {
        m.amount += amount * 4.33;
      }
    });
  });

  const CATEGORY_COLORS: Record<string, string> = {
    Entertainment: '#EC4899',
    Visual: '#F97316',
    Productivity: '#3B82F6',
    Development: '#10B981',
    Health: '#F59E0B',
    Other: '#6B7280',
    Utility: '#8B5CF6',
  };

  const dynamicCategoryBreakdown = Object.entries(categoryTotals)
    .map(([name, value]) => ({
      name,
      value,
      color: CATEGORY_COLORS[name as string] || CATEGORY_COLORS['Other'],
    }))
    .filter((c) => c.value > 0);

  const totalSpending = activeSubs.reduce((sum, sub) => sum + sub.amount, 0);
  
  const upcomingSubscriptions = [...activeSubs].sort(
    (a, b) => new Date(a.next_billing_date).getTime() - new Date(b.next_billing_date).getTime()
  );

  const nextPayment = upcomingSubscriptions[0];

  const stats = [
    statPresets.totalSpending(totalSpending, 0),
    statPresets.activeSubscriptions(activeSubs.length, 0),
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

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Analytics
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Understand your spending patterns
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid gap-6">
        {/* Monthly Trend */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
            Spending Trend
          </h2>
          <TrendChart data={dynamicMonthlyData} showForecast={false} />
        </div>

        {/* Category Breakdown */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
            Spending by Category
          </h2>
          <CategoryDonutChart data={dynamicCategoryBreakdown} />
        </div>
      </div>

      {/* Insights */}
      <div className="grid grid-cols-1 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
            Key Insights
          </h2>
          <div className="space-y-4">
            {activeSubs.length === 0 ? (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                You have no active subscriptions. Add some to get personalized insights!
              </p>
            ) : null}
            
            {dynamicCategoryBreakdown.length > 0 && (
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 h-8 w-8 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center text-primary-600 dark:text-primary-400">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-gray-100">
                    You're spending most on {dynamicCategoryBreakdown.sort((a, b) => b.value - a.value)[0]?.name}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Consider reviewing these subscriptions for potential savings
                  </p>
                </div>
              </div>
            )}
            
            {safeSubscriptions.filter(s => !s.is_active).length > 0 && (
              <div className="flex items-start gap-3 mt-4">
                <div className="flex-shrink-0 h-8 w-8 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center text-primary-600 dark:text-primary-400">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 12c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-gray-100">
                    Good job cutting costs
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    You have successfully cancelled {safeSubscriptions.filter(s => !s.is_active).length} subscriptions.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
