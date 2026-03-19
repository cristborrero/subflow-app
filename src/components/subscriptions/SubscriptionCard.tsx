import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatCurrency, formatDateRelative } from '@/lib/design-system';
import {
  Calendar,
  MoreVertical,
  Edit,
  Trash2,
  CreditCard,
  Bell,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { motion } from 'framer-motion';
import { cn } from '@/lib/design-system';

export interface SubscriptionCardProps {
  id: string;
  name: string;
  description?: string;
  amount: number;
  currency: string;
  billing_cycle: 'weekly' | 'monthly' | 'yearly';
  next_billing_date: string | Date;
  is_active: boolean;
  category?: string;
  logoUrl?: string;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  className?: string;
}

export function SubscriptionCard({
  id,
  name,
  description,
  amount,
  currency = 'USD',
  billing_cycle,
  next_billing_date,
  is_active,
  category,
  logoUrl,
  onEdit,
  onDelete,
  className,
}: SubscriptionCardProps) {
  const calculateStatus = (): 'active' | 'warning' | 'overdue' | 'cancelled' => {
    if (!is_active) return 'cancelled';
    const nextDate = new Date(next_billing_date);
    const today = new Date();
    const diffDays = Math.ceil((nextDate.getTime() - today.getTime()) / (1000 * 3600 * 24));
    
    if (diffDays < 0) return 'overdue';
    if (diffDays <= 3) return 'warning';
    return 'active';
  };

  const currentStatus = calculateStatus();

  const statusConfig = {
    active: {
      variant: 'success' as const,
      label: 'Active',
      icon: null,
    },
    warning: {
      variant: 'warning' as const,
      label: `Upcoming ${formatDateRelative(new Date(next_billing_date))}`,
      icon: <Bell className="h-3 w-3 mr-1" />,
    },
    overdue: {
      variant: 'danger' as const,
      label: `Overdue ${formatDateRelative(new Date(next_billing_date))}`,
      icon: null,
    },
    cancelled: {
      variant: 'muted' as const,
      label: 'Cancelled',
      icon: null,
    },
  };

  const config = statusConfig[currentStatus];
  const cycleLabel = {
    weekly: '/week',
    monthly: '/mo',
    yearly: '/yr',
  };

  return (
    <motion.div whileHover={{ y: -2 }} transition={{ duration: 0.2 }}>
      <Card
        className={cn(
          'group bg-white dark:bg-[#112d4e] border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-card-hover transition-all duration-300 rounded-xl overflow-hidden cursor-pointer',
          className
        )}
      >
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          {/* Left: Logo + Name */}
          <div className="flex items-start gap-3 flex-1 min-w-0">
            {/* Logo placeholder */}
            <div className="w-12 h-12 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center shrink-0">
              {logoUrl ? (
                <img
                  src={logoUrl}
                  alt={name}
                  className="w-8 h-8 object-contain"
                />
              ) : (
                <CreditCard className="h-6 w-6 text-gray-400" />
              )}
            </div>
            
            <div className="min-w-0 flex-1">
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 truncate">
                {name}
              </h3>
              {description && (
                <p className="text-sm text-gray-500 dark:text-gray-400 truncate mt-0.5">
                  {description}
                </p>
              )}
              {category && (
                <Badge variant="secondary" size="sm" className="mt-2">
                  {category}
                </Badge>
              )}
            </div>
          </div>

          {/* Right: Amount + Actions */}
          <div className="flex items-center gap-3 ml-4">
            <div className="text-right shrink-0">
              <p className="text-lg font-bold text-gray-900 dark:text-gray-100">
                {formatCurrency(amount, currency)}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {billing_cycle}{cycleLabel[billing_cycle]}
              </p>
            </div>

            {/* Kebab menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onEdit?.(id)}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => onDelete?.(id)}
                  className="text-red-600 dark:text-red-400"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Bottom: Next billing + status */}
        <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100 dark:border-gray-800">
          <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
            <Calendar className="h-3 w-3 mr-1.5" />
            <span>Next: {formatDate(next_billing_date)}</span>
          </div>
          <Badge variant={config.variant} size="sm">
            {config.icon}
            {config.label}
          </Badge>
        </div>
      </CardContent>
    </Card>
    </motion.div>
  );
}

// Helper function for date formatting
function formatDate(date: Date | string): string {
  const d = new Date(date);
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
}
