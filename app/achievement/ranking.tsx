import { Image, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAppTheme } from "../../theme/theme";
import { Text } from "react-native-paper";
import { router } from "expo-router";
import ArrowBackIcon from "../../assets/images/icons/arrow_back.svg";
import PodiumIcon from "../../assets/images/achievement/podium.svg";

export default function AchievementRankingPage() {
  const theme = useAppTheme();
  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: theme.colors.background,
      }}
    >
      <View
        style={{
          paddingHorizontal: 16,
          paddingVertical: 8,
          marginTop: 16,
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          height: 56,
        }}
      >
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowBackIcon
            fill={theme.colors.onBackground}
            width={28}
            height={28}
          />
        </TouchableOpacity>
        <View style={{ flex: 1, marginLeft: 12 }}>
          <Text
            style={{
              fontSize: 24,
            }}
          >
            Leaderboard
          </Text>
        </View>
      </View>
      <View
        style={{
          paddingHorizontal: 16,
          paddingVertical: 8,
          width: "100%",
          alignContent: "center",
          justifyContent: "space-between",
          flex: 1,
        }}
      >
        <View
          style={{
            width: "100%",
          }}
        >
          <PodiumIcon width="100%" height={300} />
        </View>
        {/* <Image
          source={require("../../assets/images/animation/success.gif")}
          style={{
            width: 180,
            height: 180,
          }}
        /> */}
      </View>
    </SafeAreaView>
  );
}
