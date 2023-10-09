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
}: {
  destination: any;
  icon: React.ReactElement;
  color: string;
  containerColor: string;
  title: string;
  subtitle?: string;
}) {
  const theme = useAppTheme();
  return (
    <AnimatedButton
      height={76}
      color={containerColor}
      style={{
        paddingVertical: 24,
      }}
      onPress={() => {
        router.push(destination);
      }}
    >
      <View style={styles.animatedButtonInner}>
        {React.cloneElement(icon, {
          height: 40,
          width: 40,
          fill: color,
        })}
        <View style={styles.columnFlexStart}>
          <View style={styles.rowSpaceBetween}>
            <Text
              variant="titleLarge"
              style={{ color: color, fontWeight: "bold" }}
            >
              {title}
            </Text>
          </View>
          {subtitle && <Text style={{ color: color }}>{subtitle}</Text>}
        </View>
        <ArrowIcon
          style={styles.moreIcon}
          fill={theme.colors.onSecondaryContainer}
        />
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
