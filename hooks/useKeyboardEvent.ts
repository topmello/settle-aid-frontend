import { useEffect, useState } from "react";
import { Keyboard } from "react-native";

export const useKeyboardEvent = () => {
  const [keyboardShow, setKeyboardShow] = useState(false);

  useEffect(() => {
    const showSubscription = Keyboard.addListener("keyboardDidShow", () => {
      setKeyboardShow(true);
    });
    const hideSubscription = Keyboard.addListener("keyboardDidHide", () => {
      setKeyboardShow(false);
    });
    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  return {
    keyboardShow,
  };
};
