/**
 * SubFlow Type Definitions
 * Shared types for subscriptions, cards, alerts, analytics
 */

export interface User {
  id: string;
  email: string;
  name?: string;
  avatarUrl?: string;
  emailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type BillingCycle = 'weekly' | 'monthly' | 'yearly';

export type SubscriptionStatus = 'active' | 'warning' | 'overdue' | 'cancelled';

export interface Subscription {
  id: string;
  userId: string;
  name: string;
  description?: string;
  amount: number;
  currency: string;
  billingCycle: BillingCycle;
  startDate: Date;
  nextBillingDate: Date;
  category?: string;
  logoUrl?: string;
  websiteUrl?: string;
  isActive: boolean;
  cardId?: string;
  reminderDays: number;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export type CardBrand = 'visa' | 'mastercard' | 'amex' | 'discover' | 'unknown';

export interface Card {
  id: string;
  userId: string;
  name: string;
  lastFourDigits: string;
  brand: CardBrand;
  type: 'credit' | 'debit';
  expiryMonth: number;
  expiryYear: number;
  color: string;
  isDefault: boolean;
  isVerified: boolean;
  createdAt: Date;
}

export type AlertType = 'email' | 'push' | 'sms';

export type AlertTrigger = 'days_before' | 'day_of' | 'overdue';

export interface Alert {
  id: string;
  userId: string;
  subscriptionId: string;
  type: AlertType;
  triggerDaysBefore: number;
  isEnabled: boolean;
  createdAt: Date;
}

export interface MonthlyStats {
  month: string;
  totalSpent: number;
  subscriptionCount: number;
}

export interface CategorySpending {
  category: string;
  amount: number;
  color: string;
  percentage: number;
}

export interface DashboardOverview {
  totalMonthlySpending: number;
  activeSubscriptions: number;
  nextPayment: {
    amount: number;
    date: Date;
    daysUntil: number;
  };
  potentialSavings: number; // if cancelling unused subscriptions
  monthlyTrend: MonthlyStats[];
  categoryBreakdown: CategorySpending[];
}

export interface SubscriptionFilters {
  search?: string;
  status?: SubscriptionStatus;
  category?: string;
  cardId?: string;
  sortBy?: 'name' | 'amount' | 'nextBillingDate' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: Record<string, string>;
  };
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
  };
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
