import React from 'react';
import { StatCard, statPresets } from '@/components/dashboard/StatCard';
import { TrendChart } from '@/components/charts/ExpenseChart';
import { CategoryDonutChart } from '@/components/charts/ExpenseChart';

export function AnalyticsPage() {
  // Mock data for analytics
  const mockMonthlyTrend = [
    { month: 'Jan', amount: 234.5 },
    { month: 'Feb', amount: 267.8 },
    { month: 'Mar', amount: 245.2 },
    { month: 'Apr', amount: 289.9 },
    { month: 'May', amount: 312.4 },
    { month: 'Jun', amount: 298.7 },
    { month: 'Jul', amount: 324.1 },
  ];

  const mockCategoryBreakdown = [
    { name: 'Entertainment', amount: 85.99, color: '#EC4899' },
    { name: 'Music', amount: 20.98, color: '#F97316' },
    { name: 'Productivity', amount: 114.98, color: '#3B82F6' },
    { name: 'Development', amount: 49.99, color: '#10B981' },
    { name: 'Health', amount: 49.99, color: '#F59E0B' },
    { name: 'Other', amount: 20.0, color: '#6B7280' },
  ];

  const totalSpending = mockMonthlyTrend.reduce((sum, month) => sum + month.amount, 0);
  const activeSubscriptions = 6;
  const nextPayment = { amount: 54.99, daysUntil: 2 };
  const potentialSavings = 45.99;

  const stats = [
    statPresets.totalSpending(totalSpending, 8.2),
    statPresets.activeSubscriptions(activeSubscriptions, -2),
    ...(nextPayment
      ? [
          statPresets.nextPayment(
            nextPayment.amount,
            nextPayment.daysUntil
          ),
        ]
      : []),
    statPresets.potentialSavings(potentialSavings),
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
          <TrendChart data={mockMonthlyTrend} showForecast={false} />
        </div>

        {/* Category Breakdown */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
            Spending by Category
          </h2>
          <CategoryDonutChart data={mockCategoryBreakdown} />
        </div>
      </div>

      {/* Insights */}
      <div className="grid grid-cols-1 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
            Key Insights
          </h2>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 h-8 w-8 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center text-primary-600 dark:text-primary-400">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div>
                <h3 className="font-medium text-gray-900 dark:text-gray-100">
                  You're spending most on productivity tools
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Consider reviewing your development subscriptions for potential savings
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 mt-4">
              <div className="flex-shrink-0 h-8 w-8 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center text-primary-600 dark:text-primary-400">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 1118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="font-medium text-gray-900 dark:text-gray-100">
                  Your spending has increased this month
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Up 8.2% from last month - consider setting a budget alert
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 mt-4">
              <div className="flex-shrink-0 h-8 w-8 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center text-primary-600 dark:text-primary-400">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 12c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
                </svg>
              </div>
              <div>
                <h3 className="font-medium text-gray-900 dark:text-gray-100">
                  You have unused subscriptions
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Consider cancelling 2 subscriptions to save $45.99/month
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
