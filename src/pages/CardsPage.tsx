import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatCurrency } from '@/lib/design-system';
import { Plus, CreditCard } from 'lucide-react';

const mockCards = [
  {
    id: '1',
    name: 'Main Visa',
    lastFourDigits: '4242',
    brand: 'visa' as const,
    type: 'credit' as const,
    expiryMonth: 12,
    expiryYear: 2025,
    color: '#1A1F71',
    isDefault: true,
  },
  {
    id: '2',
    name: 'Travel Mastercard',
    lastFourDigits: '8888',
    brand: 'mastercard' as const,
    type: 'credit' as const,
    expiryMonth: 6,
    expiryYear: 2026,
    color: '#EB001B',
    isDefault: false,
  },
];

export function CardsPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Payment Methods
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Manage your credit and debit cards
          </p>
        </div>

        <Button leftIcon={<Plus className="h-4 w-4" />}>Add Card</Button>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockCards.map((card) => (
          <Card
            key={card.id}
            className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
          >
            <div
              className="h-32 p-6 flex items-start justify-between"
              style={{ backgroundColor: card.color }}
            >
              <div className="text-white">
                <p className="text-sm opacity-80 mb-2">{card.brand}</p>
                <p className="text-2xl font-bold tracking-wider">
                  •••• {card.lastFourDigits}
                </p>
                <p className="text-sm mt-3 opacity-80">
                  {card.expiryMonth.toString().padStart(2, '0')}/{card.expiryYear}
                </p>
              </div>
              {card.isDefault && (
                <Badge className="bg-white/20 hover:bg-white/30 text-white">
                  Default
                </Badge>
              )}
            </div>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-gray-900 dark:text-gray-100">
                    {card.name}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">
                    {card.type} card
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm">
                    Edit
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-red-600 dark:text-red-400"
                  >
                    Remove
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Security Notice */}
      <Card className="border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20">
        <CardContent className="p-4 flex items-start gap-3">
          <CreditCard className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
          <div>
            <p className="font-medium text-blue-900 dark:text-blue-100">
              Secure Card Storage
            </p>
            <p className="text-sm text-blue-800 dark:text-blue-200 mt-1">
              Your card details are encrypted and never stored on our servers. We
              use industry-standard security protocols.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
