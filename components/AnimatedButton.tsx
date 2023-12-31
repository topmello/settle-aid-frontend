import React, { useRef, forwardRef } from "react";
import { StyleSheet, Animated, TouchableOpacity } from "react-native";

export const AnimatedButton = ({
  color,
  children,
  onPress,
  style,
}: {
  height?: number;
  color?: string;
  children: React.ReactNode;
  onPress?: () => void;
  style?: any;
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const onPressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const onPressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Animated.View
      style={[
        styles.roundedRectangle,
        {
          backgroundColor: color,
          transform: [{ scale: scaleAnim }],
        },
        style,
      ]}
    >
      <TouchableOpacity
        activeOpacity={0.8}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        onPress={onPress}
      >
        {children}
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  roundedRectangle: {
    borderRadius: 12,
    padding: 16,
  },
});
