import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, CreditCard } from 'lucide-react';

import { useCards } from '@/hooks/useCards';

export function CardsPage() {
  const { data: cards, isLoading } = useCards();

  if (isLoading) {
    return <div className="p-8 text-center text-gray-500">Loading cards...</div>;
  }

  const safeCards = cards || [];

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

      {safeCards.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <CreditCard className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">No payment methods added</h3>
          <p className="mt-1 text-gray-500">Add a credit or debit card to manage your subscriptions.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {safeCards.map((card) => (
            <Card
              key={card.id}
              className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
            >
              <div
                className="h-32 p-6 flex items-start justify-between"
                style={{ backgroundColor: card.color || '#1A1F71' }}
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
      )}

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
