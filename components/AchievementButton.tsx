import { Text } from "react-native";
import { Achievement } from "../hooks/useAchievement";
import { useAppTheme } from "../theme/theme";
import { AnimatedButton } from "./AnimatedButton";

export function AchievementButton({
  achievement,
}: {
  achievement: Achievement;
}) {
  const theme = useAppTheme();
  return (
    <AnimatedButton color={theme.colors.primaryContainer}>
      <Text>{"hello"}</Text>
    </AnimatedButton>
  );
}
