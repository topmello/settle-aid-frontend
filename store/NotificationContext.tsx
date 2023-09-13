// NotificationContext.tsx
import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { PaperProvider, Portal, Snackbar, useTheme } from "react-native-paper";
import { useAppTheme } from '../theme/theme';

export type Notification = {
  message: string;
  type?: "success" | "error" | "warning" | "info";
  timeout?: number;
  onDismiss?: () => void;
  action?: {
    label: string;
    onPress: () => void;
  }
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
    timeout:4000,
    onDismiss: () => {},
  });

  const theme = useAppTheme();

  const NotificationColors = useMemo(() => {
    return {
      success: {
        inverseSurface: theme.colors.success,
        inverseOnSurface: theme.colors.onSuccess,
      },
      error: {
        inverseSurface: theme.colors.error,
        inverseOnSurface: theme.colors.onError,
      },
      warning: {
        inverseSurface: theme.colors.amber,
        inverseOnSurface: theme.colors.onAmber,
      },
      info: {
        inverseSurface: theme.colors.teal,
        inverseOnSurface: theme.colors.onTeal,
      }
    }
  }, [theme.colors]);

  const pushNotification = useCallback((newNotification: Notification) => {
    setNotification(newNotification);
    const timerId = setTimeout(() => setNotification({
      message: "",
      timeout:4000,
      onDismiss: () => {},
    }), newNotification.timeout || 4000)
    return () => clearTimeout(timerId);
  }, []);

  const clearNotification = () => setNotification({
    message: "",
  });

  return (
    <NotificationContext.Provider value={{ notification, pushNotification, clearNotification }}>
      <Portal>
        <Snackbar
          style={{ marginBottom: 20 }}
          visible={!!notification.message}
          onDismiss={() => notification.onDismiss?.()}
          action={notification.action}
          theme={{
            colors: {
              inverseSurface: notification.type?NotificationColors[notification.type].inverseSurface:undefined,
              inverseOnSurface: notification.type?NotificationColors[notification.type].inverseOnSurface:undefined,
            }
          }}
        >
          {notification.message}
        </Snackbar>
      </Portal>
      {children}
    </NotificationContext.Provider>
  )
};