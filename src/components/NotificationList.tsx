import React from 'react';
import { Notification } from '../types';
import { Bell, AlertTriangle, Clock } from 'lucide-react';

interface NotificationListProps {
  notifications: Notification[];
  onUpdateNotification: (id: string) => void;
}

export function NotificationList({
  notifications,
  onUpdateNotification
}: NotificationListProps) {
  const getIcon = (type: Notification['type']) => {
    switch (type) {
      case 'alert':
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
      case 'reminder':
        return <Clock className="h-5 w-5 text-blue-500" />;
      case 'overspending':
        return <Bell className="h-5 w-5 text-yellow-500" />;
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-xl font-bold mb-4">Notifications</h2>
      <div className="space-y-4">
        {notifications.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No notifications</p>
        ) : (
          notifications.map((notification) => (
            <div
              key={notification.id}
              className={`
                flex items-start p-4 rounded-lg border
                ${notification.read ? 'bg-gray-50' : 'bg-white'}
              `}
              onClick={() => !notification.read && onUpdateNotification(notification.id)}
            >
              <div className="flex-shrink-0">
                {getIcon(notification.type)}
              </div>
              <div className="ml-3 flex-1">
                <p className="text-sm font-medium text-gray-900">
                  {notification.title}
                </p>
                <p className="mt-1 text-sm text-gray-500">
                  {notification.message}
                </p>
                <p className="mt-1 text-xs text-gray-400">
                  {new Date(notification.date).toLocaleString()}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}