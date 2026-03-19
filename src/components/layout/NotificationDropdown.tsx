import React from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Bell } from 'lucide-react';
import { useNotifications, useMarkNotificationAsRead } from '@/hooks/useNotifications';

export function NotificationDropdown() {
  const { data: notifications, isLoading } = useNotifications();
  const markAsRead = useMarkNotificationAsRead();

  const unreadCount = notifications?.filter((n) => !n.is_read).length || 0;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative h-9 w-9 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 focus-visible:ring-0">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute top-1.5 right-1.5 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500 border-2 border-white dark:border-gray-800"></span>
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80 bg-white dark:bg-[#112d4e] overflow-hidden border-slate-200 dark:border-slate-700 shadow-xl rounded-xl">
        <DropdownMenuLabel className="font-semibold text-slate-900 dark:text-white px-4 py-3">
          Notifications
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-slate-100 dark:bg-slate-700/50" />
        
        <div className="max-h-[350px] overflow-y-auto custom-scrollbar">
          {isLoading ? (
            <div className="p-6 text-center text-sm text-slate-500 dark:text-slate-400">Loading...</div>
          ) : notifications && notifications.length > 0 ? (
            notifications.map((notif) => (
              <DropdownMenuItem
                key={notif.id}
                className={`flex flex-col items-start px-4 py-3 cursor-pointer outline-none transition-colors border-b border-slate-50 dark:border-slate-800/50 last:border-0 ${
                  !notif.is_read ? 'bg-slate-50/80 dark:bg-slate-800/40' : 'bg-transparent hover:bg-slate-50 dark:hover:bg-slate-800/50'
                }`}
                onClick={() => {
                  if (!notif.is_read) {
                    markAsRead.mutate(notif.id);
                  }
                }}
              >
                <div className="flex w-full justify-between items-start gap-3">
                  <span className={`text-sm ${!notif.is_read ? 'font-semibold text-slate-900 dark:text-white' : 'font-medium text-slate-700 dark:text-slate-300'}`}>
                    {notif.title}
                  </span>
                  {!notif.is_read && (
                    <span className="h-2 w-2 bg-[#635bff] rounded-full flex-shrink-0 mt-1.5 shadow-[0_0_8px_rgba(99,91,255,0.6)]"></span>
                  )}
                </div>
                <p className={`text-xs mt-1 leading-relaxed ${!notif.is_read ? 'text-slate-600 dark:text-slate-300' : 'text-slate-500 dark:text-slate-400'}`}>
                  {notif.message}
                </p>
                <span className="text-[10px] text-slate-400 dark:text-slate-500 mt-2 font-medium">
                  {new Date(notif.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                </span>
              </DropdownMenuItem>
            ))
          ) : (
            <div className="p-8 text-center text-sm text-slate-500 dark:text-slate-400 flex flex-col items-center gap-2">
              <Bell className="h-8 w-8 text-slate-300 dark:text-slate-600 mb-1" />
              <p>No notifications yet</p>
              <p className="text-xs text-slate-400 dark:text-slate-500">You're all caught up!</p>
            </div>
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
