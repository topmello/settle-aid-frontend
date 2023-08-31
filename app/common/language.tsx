import { View, Image } from "react-native";
import { useTheme } from "react-native-paper";
import TranslateIcon from "../../assets/images/icons/translate.svg";

export default function LanguageScreen() {
  const theme = useTheme();
  return (
    <View style={{ 
      backgroundColor: theme.colors.primaryContainer, 
      flex: 1, 
      flexDirection: 'column'}}>
        <TranslateIcon width={200} height={200} fill={theme.colors.onPrimaryContainer} />
    </View>
  );
}