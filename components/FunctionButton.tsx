import { router } from "expo-router";
import { useAppTheme } from "../theme/theme";
import { AnimatedButton } from "./AnimatedButton";
import { StyleSheet, View } from "react-native";
import React from "react";
import { Text } from "react-native-paper";
import ArrowIcon from "../assets/images/icons/navigate_next.svg";

export function FunctionButton({
  destination,
  icon,
  color,
  containerColor,
  title,
  subtitle = "",
  vertical = false,
}: {
  destination: any;
  icon: React.ReactElement;
  color: string;
  containerColor: string;
  title: string;
  subtitle?: string;
  vertical?: boolean;
}) {
  const theme = useAppTheme();
  return (
    <AnimatedButton
      color={containerColor}
      style={{
        paddingVertical: 22,
        width: vertical ? "49%" : "100%",
      }}
      onPress={() => {
        router.push(destination);
      }}
    >
      <View
        style={
          vertical
            ? styles.animatedButtonInnerVertical
            : styles.animatedButtonInner
        }
      >
        {React.cloneElement(icon, {
          height: vertical ? 32 : 40,
          width: vertical ? 32 : 40,
          fill: color,
        })}
        <View style={styles.columnFlexStart}>
          <View style={styles.rowSpaceBetween}>
            <Text
              style={{
                color: color,
                fontWeight: "bold",
                fontSize: vertical ? 18 : 24,
              }}
            >
              {title}
            </Text>
          </View>
          {subtitle && <Text style={{ color: color }}>{subtitle}</Text>}
        </View>
        {!vertical && <ArrowIcon style={styles.moreIcon} fill={color} />}
      </View>
    </AnimatedButton>
  );
}

const styles = StyleSheet.create({
  titleLarge: {
    marginHorizontal: 16,
    marginVertical: 4,
    marginTop: 12,
  },
  animatedButtonInner: {
    flexDirection: "row",
    flex: 1,
    alignItems: "center",
    gap: 8,
  },
  animatedButtonInnerVertical: {
    flexDirection: "column",
    flex: 1,
    gap: 4,
  },
  columnFlexStart: {
    flexDirection: "column",
    flex: 1,
    alignItems: "flex-start",
  },
  rowSpaceBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 8,
  },
  moreIcon: {
    marginTop: 2,
  },
});
