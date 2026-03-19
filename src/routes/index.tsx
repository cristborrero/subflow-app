import { createBrowserRouter } from 'react-router-dom';
import { DashboardPage } from '@/pages/DashboardPage';
import { SubscriptionsPage } from '@/pages/SubscriptionsPage';
import { CardsPage } from '@/pages/CardsPage';
import { AnalyticsPage } from '@/pages/AnalyticsPage';
import { AlertsPage } from '@/pages/AlertsPage';
import { SettingsPage } from '@/pages/SettingsPage';
import { LoginPage } from '@/pages/LoginPage';
import { RegisterPage } from '@/pages/RegisterPage';
import { LandingPage } from '@/pages/LandingPage';
import { AppShell } from '@/components/layout/AppShell';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

export const routes = createBrowserRouter([
  {
    path: '/',
    element: <LandingPage />,
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/register',
    element: <RegisterPage />,
  },
  {
    element: (
      <ProtectedRoute>
        <AppShell />
      </ProtectedRoute>
    ),
    children: [
      {
        path: '/dashboard',
        element: <DashboardPage />,
      },
      {
        path: '/subscriptions',
        element: <SubscriptionsPage />,
      },
      {
        path: '/cards',
        element: <CardsPage />,
      },
      {
        path: '/analytics',
        element: <AnalyticsPage />,
      },
      {
        path: '/alerts',
        element: <AlertsPage />,
      },
      {
        path: '/settings',
        element: <SettingsPage />,
      },
    ],
  },
]);
