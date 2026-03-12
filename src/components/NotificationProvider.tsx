import React, { createContext, useContext, useState, useCallback } from 'react';
import { Check, X, Info } from 'lucide-react';

type NotificationType = 'success' | 'error' | 'info';

interface Notification {
  id: number;
  type: NotificationType;
  message: string;
}

interface NotificationContextType {
  notify: (type: NotificationType, message: string) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) throw new Error('useNotification must be used within NotificationProvider');
  return context;
};

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const notify = useCallback((type: NotificationType, message: string) => {
    const id = Date.now();
    setNotifications((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, 3200);
  }, []);

  return (
    <NotificationContext.Provider value={{ notify }}>
      {children}
      <div className="fixed bottom-[22px] right-[22px] z-[600] flex flex-col gap-[7px] pointer-events-none">
        {notifications.map((n) => (
          <div
            key={n.id}
            className={`bg-surface border p-[11px_16px] flex gap-[10px] items-center text-[11px] pointer-events-auto min-w-[240px] max-w-[340px] animate-in slide-in-from-right-full duration-300 ${
              n.type === 'success' ? 'border-accent' : n.type === 'error' ? 'border-accent2' : 'border-accent3'
            }`}
          >
            <span className="flex-shrink-0">
              {n.type === 'success' && <Check size={15} className="text-accent" />}
              {n.type === 'error' && <X size={15} className="text-accent2" />}
              {n.type === 'info' && <Info size={15} className="text-accent3" />}
            </span>
            <span className="text-text">{n.message}</span>
          </div>
        ))}
      </div>
    </NotificationContext.Provider>
  );
};
