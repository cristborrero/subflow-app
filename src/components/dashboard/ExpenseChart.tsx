import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';

const data = [
  { month: 'Jan', amount: 450, color: 'hsl(var(--primary-500))' },
  { month: 'Feb', amount: 520, color: 'hsl(var(--primary-400))' },
  { month: 'Mar', amount: 480, color: 'hsl(var(--primary-500))' },
  { month: 'Apr', amount: 610, color: 'hsl(var(--primary-600))' },
  { month: 'May', amount: 590, color: 'hsl(var(--primary-500))' },
  { month: 'Jun', amount: 680, color: 'hsl(var(--primary-600))' },
];

export function ExpenseChart() {
  return (
    <Card className="col-span-1 lg:col-span-2 shadow-sm border-gray-100 dark:border-gray-800">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Monthly Spending</CardTitle>
      </CardHeader>
      <CardContent className="h-[350px] p-6">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
            <XAxis 
              dataKey="month" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 12, fill: '#6B7280' }} 
              dy={10}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 12, fill: '#6B7280' }} 
              tickFormatter={(value) => `$${value}`}
            />
            <Tooltip 
              cursor={{ fill: 'transparent' }}
              contentStyle={{ 
                borderRadius: '12px', 
                border: 'none', 
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                padding: '12px'
              }}
            />
            <Bar dataKey="amount" radius={[6, 6, 0, 0]} barSize={32}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
