import React from 'react';
import { NavLink } from 'react-router-dom';
import { cn } from '@/lib/design-system';
import {
  LayoutDashboard,
  Package,
  CreditCard,
  TrendingUp,
  Bell,
  Settings,
} from 'lucide-react';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard' },
  { icon: Package, label: 'Subscriptions', href: '/subscriptions' },
  { icon: CreditCard, label: 'Cards', href: '/cards' },
  { icon: TrendingUp, label: 'Analytics', href: '/analytics' },
  { icon: Bell, label: 'Alerts', href: '/alerts' },
  { icon: Settings, label: 'Settings', href: '/settings' },
];

export function MobileNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 md:hidden">
      <div className="flex items-center justify-around h-16">
        {navItems.map((item) => (
          <NavLink
            key={item.href}
            to={item.href}
            className={({ isActive }) =>
              cn(
                'flex flex-col items-center gap-1 px-3 py-2 text-xs font-medium transition-colors',
                isActive
                  ? 'text-primary-600 dark:text-primary-400'
                  : 'text-gray-500 dark:text-gray-400'
              )
            }
          >
            {({ isActive }) => (
              <>
                <div
                  className={cn(
                    'p-1.5 rounded-lg',
                    isActive && 'bg-primary-100 dark:bg-primary-900/30'
                  )}
                >
                  <item.icon className="h-5 w-5" />
                </div>
                <span className="mt-1">{item.label}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
