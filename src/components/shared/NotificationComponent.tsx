// src/components/shared/NotificationComponent.tsx
import React from 'react';
import { useNotification } from '../../context/NotificationContext';
import { XCircle, CheckCircle, AlertCircle, Info } from 'lucide-react';

const NotificationComponent: React.FC = () => {
  const { notifications, removeNotification } = useNotification();

  const getIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-5 w-5" />;
      case 'error':
        return <XCircle className="h-5 w-5" />;
      case 'warning':
        return <AlertCircle className="h-5 w-5" />;
      case 'info':
        return <Info className="h-5 w-5" />;
      default:
        return null;
    }
  };

  const getBackgroundColor = (type: string) => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-200';
      case 'error':
        return 'bg-red-50 border-red-200';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200';
      case 'info':
        return 'bg-blue-50 border-blue-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  const getTextColor = (type: string) => {
    switch (type) {
      case 'success':
        return 'text-green-800';
      case 'error':
        return 'text-red-800';
      case 'warning':
        return 'text-yellow-800';
      case 'info':
        return 'text-blue-800';
      default:
        return 'text-gray-800';
    }
  };

  if (notifications.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {notifications.map(notification => (
        <div
          key={notification.id}
          className={`flex items-center p-4 rounded-lg border ${getBackgroundColor(
            notification.type
          )} shadow-lg max-w-md transition-all duration-500 ease-in-out`}
          role="alert"
        >
          <div className={`flex-shrink-0 ${getTextColor(notification.type)}`}>
            {getIcon(notification.type)}
          </div>
          <div className={`ml-3 ${getTextColor(notification.type)}`}>
            <p className="text-sm font-medium">{notification.message}</p>
          </div>
          <button
            onClick={() => removeNotification(notification.id)}
            className={`ml-auto -mx-1.5 -my-1.5 rounded-lg p-1.5 inline-flex h-8 w-8 ${getTextColor(
              notification.type
            )} hover:bg-opacity-20 focus:outline-none`}
          >
            <span className="sr-only">Close</span>
            <XCircle className="h-5 w-5" />
          </button>
        </div>
      ))}
    </div>
  );
};

export default NotificationComponent;