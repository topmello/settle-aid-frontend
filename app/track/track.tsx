import { View, Text } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context";
import { useAppTheme } from "../../theme/theme";

export default function TrackScreen() {
  const theme = useAppTheme();
  return (
    <SafeAreaView
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: theme.colors.primaryContainer,
      }}>
      <Text>Track Screen</Text>
    </SafeAreaView>
  );
}