import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { motion } from 'framer-motion';
import { cn, formatCurrency } from '@/lib/design-system';

export interface MonthlyExpense {
  month: string;
  amount: number;
  year?: number;
}

interface AnimatedBarChartProps {
  data: MonthlyExpense[];
  height?: number;
  className?: string;
  showAnimation?: boolean;
}

export function AnimatedBarChart({
  data,
  height = 300,
  className,
  showAnimation = true,
}: AnimatedBarChartProps) {
  return (
    <motion.div
      initial={showAnimation ? { opacity: 0, y: 20 } : { opacity: 1, y: 0 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className={cn('w-full', className)}
    >
      <ResponsiveContainer width="100%" height={height}>
        <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <XAxis
            dataKey="month"
            tick={{ fontSize: 12, fill: '#6B7280' }}
            axisLine={{ stroke: '#E5E7EB' }}
            tickLine={false}
          />
          <YAxis
            tickFormatter={(value) => `$${value}`}
            tick={{ fontSize: 12, fill: '#6B7280' }}
            axisLine={{ stroke: '#E5E7EB' }}
            tickLine={false}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'white',
              border: '1px solid #E5E7EB',
              borderRadius: '8px',
              boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
            }}
            formatter={(value: number) => [formatCurrency(value), 'Amount']}
            labelStyle={{ fontWeight: 600 }}
          />
          <Bar
            dataKey="amount"
            fill="#00A896"
            radius={[8, 8, 0, 0]}
            animationDuration={1500}
            animationEasing="ease-out"
          >
            {data.map((_, index) => (
              <Cell
                key={`cell-${index}`}
                fill={index === data.length - 1 ? '#008F80' : '#00A896'}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </motion.div>
  );
}

interface CategoryData {
  name: string;
  value: number;
  color: string;
}

interface CategoryDonutChartProps {
  data: CategoryData[];
  height?: number;
  className?: string;
}

export function CategoryDonutChart({
  data,
  height = 300,
  className,
}: CategoryDonutChartProps) {
  const total = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className={cn('w-full', className)}
    >
      <ResponsiveContainer width="100%" height={height}>
        <BarChart data={data} layout="vertical" margin={{ left: 80 }}>
          <XAxis type="number" hide />
          <YAxis
            dataKey="name"
            type="category"
            tick={{ fontSize: 12, fill: '#6B7280' }}
            axisLine={false}
            tickLine={false}
            width={80}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'white',
              border: '1px solid #E5E7EB',
              borderRadius: '8px',
              boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
            }}
            formatter={(value: number) => [
              `${formatCurrency(value)} (${((value / total) * 100).toFixed(1)}%)`,
              'Spending',
            ]}
          />
          <Bar dataKey="value" radius={[0, 4, 4, 0]}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </motion.div>
  );
}

interface TrendChartProps {
  data: MonthlyExpense[];
  height?: number;
  className?: string;
  showForecast?: boolean;
}

export function TrendChart({
  data,
  height = 250,
  className,
  showForecast = false,
}: TrendChartProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.4 }}
      className={cn('w-full', className)}
    >
      <ResponsiveContainer width="100%" height={height}>
        <BarChart data={data}>
          <XAxis
            dataKey="month"
            tick={{ fontSize: 12, fill: '#6B7280' }}
            axisLine={{ stroke: '#E5E7EB' }}
            tickLine={false}
          />
          <YAxis
            tickFormatter={(value) => `$${value}`}
            tick={{ fontSize: 12, fill: '#6B7280' }}
            axisLine={{ stroke: '#E5E7EB' }}
            tickLine={false}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'white',
              border: '1px solid #E5E7EB',
              borderRadius: '8px',
              boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
            }}
            formatter={(value: number) => [formatCurrency(value), 'Spending']}
          />
          <Bar
            dataKey="amount"
            fill="url(#gradient)"
            radius={[4, 4, 0, 0]}
            animationDuration={1500}
          >
            {data.map((_, index) => (
              <Cell
                key={`cell-${index}`}
                fill={
                  showForecast && index === data.length - 1
                    ? '#8B5CF6'
                    : index === data.length - 2
                    ? '#7C3AED'
                    : '#00A896'
                }
              />
            ))}
          </Bar>
          <defs>
            <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#00A896" stopOpacity={0.6} />
              <stop offset="100%" stopColor="#00A896" stopOpacity={0.1} />
            </linearGradient>
          </defs>
        </BarChart>
      </ResponsiveContainer>
    </motion.div>
  );
}
