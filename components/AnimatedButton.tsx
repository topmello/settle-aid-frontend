import React, { useRef } from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  ScrollView,
  Animated,
  TouchableOpacity,
  Image,
} from "react-native";

export const AnimatedButton = ({ height = 120, color, children, onPress, style }: {
  height?: number;
  color: string;
  children: React.ReactNode;
  onPress: () => void;
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
    <TouchableOpacity
      activeOpacity={0.8}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      onPress={onPress}
    >
      <Animated.View
        style={[
          styles.roundedRectangle,
          {
            height: height,
            backgroundColor: color,
            transform: [{ scale: scaleAnim }],
          },
          style,
        ]}
      >
        {children}
      </Animated.View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  roundedRectangle: {
    height: 120,
    borderRadius: 15,
    marginHorizontal: 20,
  },
});