import { View } from "react-native";
import { useTheme } from "react-native-paper"

export default function LanguageScreen() {
  const theme = useTheme();
  return (
    <View style={{ backgroundColor: theme.colors.primaryContainer, flex: 1}}>
      
    </View>
  )
}