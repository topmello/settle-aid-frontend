// NotificationContext.tsx
import React, { createContext, useCallback, useContext, useState } from 'react';

export type Notification = {
  message: string;
  type: "success" | "error" | "warning" | "info";
  timeout?: number;
  onDismiss?: () => void;
};

type NotificationContextType = {
  notification: Notification;
  pushNotification: (notification: Notification) => void;
  clearNotification: () => void;
};

export const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }:{ children: React.ReactNode }){
  const [notification, setNotification] = useState<Notification>({
    message: "",
    type: "info",
    timeout:4000,
    onDismiss: () => {},
  });

  const pushNotification = useCallback((newNotification: Notification) => {
    setNotification(newNotification);
    const timerId = setTimeout(() => setNotification({
      message: "",
      type: "info",
      timeout:4000,
      onDismiss: () => {},
    }), newNotification.timeout || 4000)
    return () => clearTimeout(timerId);
  }, []);

  const clearNotification = () => setNotification({
    message: "",
    type: "info",
  });

  return (
    <NotificationContext.Provider value={{ notification, pushNotification, clearNotification }}>
      {children}
    </NotificationContext.Provider>
  )
};