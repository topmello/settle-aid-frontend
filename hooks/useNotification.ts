import { useState } from "react";

export type Notification = {
  message: string;
  type: "success" | "error" | "warning" | "info";
  timeout?: number;
  onDismiss?: () => void;
};

export const useNotification = () => {
  const [notification, setNotification] = useState<Notification>({
    message: "",
    type: "success",

  });
  const pushNotification = (message: Notification, onDismiss?: () => void) => {
    setNotification(message);
    setTimeout(() => {
      setNotification({
        message: "",
        type: "success",
        onDismiss,
      });
    }, message.timeout || 4000);
  };
  const clearNotificaiton = () => {
    setNotification({
      message: "",
      type: "success",
      onDismiss: () => {
        clearNotificaiton();
      },
    });
  };
  return { notification, pushNotification, clearNotificaiton };
};
