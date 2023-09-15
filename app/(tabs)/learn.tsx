import { ScrollView } from "react-native";
import { View } from "react-native";
import { Button, List, Text, useTheme } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { tips } from "../../tips/tips.json";
import { Ionicons } from "@expo/vector-icons";
import { useTip } from "../../store/TipContext";
import { router } from "expo-router";

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
  const theme = useTheme();
  const { setCategory } = useTip();
  return (
    <SafeAreaView
      style={{
        flex: 1,
        flexDirection: "column",
        padding: 20,
      }}
      
    >
      <Text variant="titleLarge">Cultural Tips</Text>
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{
          paddingTop: 20,
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
