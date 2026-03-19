import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { SubscriptionCard } from '@/components/subscriptions/SubscriptionCard';
import { SubscriptionForm } from '@/components/subscriptions/SubscriptionForm';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Search, Filter, Grid, List, Loader2, Plus } from 'lucide-react';
import { motion } from 'framer-motion';
import { useSubscriptions, useDeleteSubscription } from '@/hooks/useSubscriptions';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
};

export function SubscriptionsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingSubscription, setEditingSubscription] = useState<string | null>(null);

  const { data: subscriptions, isLoading, isError } = useSubscriptions();
  const deleteMutation = useDeleteSubscription();

  const filteredSubscriptions = subscriptions?.filter((sub) =>
    sub.name.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  const handleEdit = (id: string) => {
    setEditingSubscription(id);
    setIsAddModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if(window.confirm('Are you sure you want to delete this subscription?')) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <div className="space-y-8 pb-8 font-sans">
      {/* Page Header */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }} 
        animate={{ opacity: 1, y: 0 }} 
        className="flex flex-col md:flex-row md:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
            Subscriptions
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Manage all your recurring payments
          </p>
        </div>

        <Button 
          onClick={() => setIsAddModalOpen(true)}
          className="bg-[#635bff] hover:bg-[#4f46e5] text-white shadow-md transition-all font-semibold rounded-lg"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Subscription
        </Button>
      </motion.div>

      {/* Filters */}
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        transition={{ delay: 0.1 }}
        className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between"
      >
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Search subscriptions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-white dark:bg-[#112d4e] border-slate-200 dark:border-slate-800 rounded-lg shadow-sm focus:ring-[#635bff] focus:border-[#635bff] transition-colors"
          />
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="bg-white dark:bg-[#112d4e] border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <div className="flex border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden bg-white dark:bg-[#112d4e]">
            <Button variant="ghost" size="icon" className="h-9 w-9 rounded-none text-[#635bff] bg-slate-50 dark:bg-slate-800/50">
              <List className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 rounded-none border-l border-slate-200 dark:border-slate-800 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
            >
              <Grid className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Subscriptions Grid */}
      {isLoading ? (
        <div className="flex justify-center items-center py-24">
          <Loader2 className="h-8 w-8 text-[#635bff] animate-spin" />
        </div>
      ) : isError ? (
        <div className="text-center py-12">
          <p className="text-red-500">Failed to load subscriptions. Please check your connection.</p>
        </div>
      ) : filteredSubscriptions.length === 0 ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16 bg-white dark:bg-[#112d4e] rounded-xl border border-slate-200 dark:border-slate-800 border-dashed">
          <p className="text-slate-500 dark:text-slate-400 mb-4">
            No subscriptions found. Start tracking!
          </p>
          <Button onClick={() => setIsAddModalOpen(true)} className="bg-[#635bff] hover:bg-[#4f46e5]">
            <Plus className="h-4 w-4 mr-2" /> Track First Subscription
          </Button>
        </motion.div>
      ) : (
        <motion.div 
          variants={container}
          initial="hidden"
          animate="show"
          className="space-y-4"
        >
          {filteredSubscriptions.map((subscription) => (
            <motion.div key={subscription.id} variants={item}>
              <SubscriptionCard
                {...subscription}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Add/Edit Modal */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="max-w-xl bg-white dark:bg-[#112d4e] border-0 shadow-2xl rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl">
              {editingSubscription ? 'Edit Subscription' : 'Add Subscription'}
            </DialogTitle>
            <DialogDescription className="text-slate-500">
              {editingSubscription
                ? 'Update your recurring payment details'
                : 'Enter details for the new subscription to track'}
            </DialogDescription>
          </DialogHeader>
          <SubscriptionForm
            subscriptionId={editingSubscription || undefined}
            onSuccess={() => {
              setIsAddModalOpen(false);
              setEditingSubscription(null);
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
