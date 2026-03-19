import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatCurrency } from '@/lib/design-system';

const subscriptions = [
  { id: '1', name: 'Netflix', date: 'Oct 15, 2023', amount: 15.99, status: 'paid', category: 'Entertainment' },
  { id: '2', name: 'Spotify Premium', date: 'Oct 12, 2023', amount: 9.99, status: 'paid', category: 'Music' },
  { id: '3', name: 'Adobe Creative Cloud', date: 'Oct 10, 2023', amount: 54.99, status: 'pending', category: 'Design' },
  { id: '4', name: 'Vercel Pro', date: 'Oct 08, 2023', amount: 20.00, status: 'paid', category: 'Development' },
];

export function RecentSubscriptions() {
  return (
    <Card className="col-span-1 shadow-sm border-gray-100 dark:border-gray-800">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Recent Transactions</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="text-xs uppercase bg-gray-50/50 dark:bg-gray-800/50 text-gray-400 font-medium">
              <tr>
                <th className="px-6 py-4 font-normal">Subscription</th>
                <th className="px-6 py-4 font-normal text-right">Amount</th>
                <th className="px-6 py-4 font-normal text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {subscriptions.map((sub) => (
                <tr key={sub.id} className="group hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors duration-200">
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="font-semibold text-gray-900 dark:text-gray-100">{sub.name}</span>
                      <span className="text-xs text-gray-400 uppercase tracking-wider">{sub.category}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right font-medium text-gray-700 dark:text-gray-300">
                    {formatCurrency(sub.amount)}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Badge variant={sub.status === 'paid' ? 'success' : 'warning'} className="capitalize">
                      {sub.status}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="p-4 flex justify-center">
          <Button variant="ghost" className="text-primary-600 dark:text-primary-400 text-sm font-semibold hover:bg-primary-50/50 dark:hover:bg-primary-900/10">
            View all transactions
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// Internal Button component since it might not be exported from ui/button correctly if not found
function Button({ children, variant = 'primary', className = '', ...props }: any) {
  const variants: any = {
    primary: 'bg-primary-600 text-white hover:bg-primary-700',
    ghost: 'text-primary-600 hover:bg-primary-50 dark:text-primary-400 dark:hover:bg-primary-900/20',
  };
  return (
    <button className={`px-4 py-2 rounded-lg transition-all ${variants[variant] || variants.primary} ${className}`} {...props}>
      {children}
    </button>
  );
}
