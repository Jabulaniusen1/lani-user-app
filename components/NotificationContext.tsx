import React, { createContext, useContext, useState, ReactNode } from 'react';
import Notification, { NotificationType } from './Notification';

interface NotificationData {
  id: string;
  message: string;
  type: NotificationType;
  duration?: number;
}

interface NotificationContextType {
  showNotification: (message: string, type: NotificationType, duration?: number) => void;
  hideNotification: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};

interface NotificationProviderProps {
  children: ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  const [notification, setNotification] = useState<NotificationData | null>(null);

  const showNotification = (message: string, type: NotificationType, duration = 4000) => {
    const id = Date.now().toString();
    setNotification({
      id,
      message,
      type,
      duration,
    });
  };

  const hideNotification = () => {
    setNotification(null);
  };

  return (
    <NotificationContext.Provider value={{ showNotification, hideNotification }}>
      {children}
      {notification && (
        <Notification
          visible={!!notification}
          message={notification.message}
          type={notification.type}
          duration={notification.duration}
          onHide={hideNotification}
        />
      )}
    </NotificationContext.Provider>
  );
};
