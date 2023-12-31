import { ScrollView } from "react-native";
import { View } from "react-native";
import { Button, List, Text, useTheme } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

import { Ionicons } from "@expo/vector-icons";
import { useTip } from "../../store/TipContext";
import { router } from "expo-router";
import { useAppTheme } from "../../theme/theme";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { SupportedLanguage, selectLanguage } from "../../store/appSlice";
import { tips } from "../../tips/tipsTyped";

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
  const { t } = useTranslation();
  const theme = useAppTheme();
  const { setCategory } = useTip();
  const lang = useSelector(selectLanguage);

  let currentTips;
  if (lang) {
    currentTips = tips[lang];
  }

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
          paddingTop: 32,
          color: theme.colors.onBackground,
        }}
      >
        {t("Cultural Tips", { ns: "tip" })}
      </Text>
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{
          paddingHorizontal: 16,
          paddingBottom: 24,
        }}
      >
        {currentTips?.map((category, cateIndex) => {
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
                title={t(category.title, { ns: "tip" })}
                key={`${cateIndex}`}
                style={{
                  flex: 1,
                }}
                titleStyle={{
                  fontSize: 20,
                  color: theme.colors.primary,
                  fontWeight: "bold",
                }}
              >
                {category.tips.map((subcate, subcateIndex) => {
                  return (
                    <List.Item
                      key={`${cateIndex}-${subcateIndex}`}
                      title={t(subcate.mode, { ns: "tip" })}
                      titleStyle={{
                        fontSize: 18,
                        color: theme.colors.onBackground,
                      }}
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
