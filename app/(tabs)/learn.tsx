import { ScrollView } from "react-native";
import { View } from "react-native";
import { Button, List, Text, useTheme } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { tips } from "../../tips/tips.json";
import { Ionicons } from "@expo/vector-icons";
import { useTip } from "../../store/TipContext";
import { router } from "expo-router";
import { useAppTheme } from "../../theme/theme";
import { useTranslation } from "react-i18next";

type IconName =
  | "airplane-outline"
  | "flag-outline"
  | "restaurant-outline"
  | "cart-outline"
  | "sunny-outline"
  | "call-outline"
  | "medkit-outline"
  | "wallet-outline"
  | "people-outline";
const iconList: IconName[] = [
  "airplane-outline",
  "flag-outline",
  "restaurant-outline",
  "cart-outline",
  "sunny-outline",
  "call-outline",
  "medkit-outline",
  "wallet-outline",
  "people-outline",
];

export default function LearnScreen() {
  const {t} = useTranslation();
  const theme = useAppTheme();
  const { setCategory } = useTip();

  return (
    <SafeAreaView
      style={{
        flex: 1,
        flexDirection: "column",
        backgroundColor: theme.colors.background,
      }}
    >
      <Text
          style={{
            fontSize: 24,
            fontWeight: "bold",
            width: "100%",
            padding: 16,
            paddingTop: 48,
            color: theme.colors.onBackground,
          }}
        >
          {t("Cultural Tips", { ns: "settings" })}
        </Text>
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{
          paddingHorizontal: 16,
          paddingBottom: 24,
        }}
      >
        {tips.map((category, cateIndex) => {
          return (
            <View
              key={cateIndex}
              style={{
                flex: 1,
                flexDirection: "row",
              }}
            >
              <Ionicons
                size={24}
                style={{ marginTop: 20 }}
                color={theme.colors.primary}
                name={iconList[cateIndex]}
              />
              <List.Section
                title={category.title}
                key={`${cateIndex}`}
                style={{
                  flex: 1,
                }}
              >
                {category.tips.map((subcate, subcateIndex) => {
                  return (
                    <List.Item
                      key={`${cateIndex}-${subcateIndex}`}
                      title={subcate.mode}
                      onPress={() => {
                        setCategory(subcate);
                        router.push("/learn/detail");
                      }}
                    />
                  );
                })}
              </List.Section>
            </View>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}
