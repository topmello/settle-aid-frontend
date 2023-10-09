import { router } from "expo-router";
import { View, Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ArrowBackIcon from "../../assets/images/icons/arrow_back.svg";
import { useAppTheme } from "../../theme/theme";
import useFetch from "../../hooks/useFetch";

export default function AchievementListPage() {
  const theme = useAppTheme();

  // const [loggedInRes,] = useFetch(
  //   {
  //     method: "POST",
  //     url: "/challenge/logged_in/",
  //     data: { "logged_in": 1 }
  //   }
  // )

  // const [routeGenRes,] = useFetch(
  //   {
  //     method: "POST",
  //     url: "/challenge/route_generation/",
  //     data: { "routes_generated": 1 }
  //   }
  // )


  // console.log(loggedInRes)
  // console.log(routeGenRes)



export type Achievement = {
  challenge: {
    name: string;
    type: string;
  };
  year: number;
  month: number;
  day: number;
  progress: number;
};

export default function AchievementListPage() {
  const theme = useAppTheme();
  const [achievementToday, fetchAchievementToday] = useFetch<Achievement[]>(
    {
      method: "GET",
      url: "/challenge/today-history",
    },
    [],
    [],
    true
  );

  console.log(achievementToday);
  return (
    <SafeAreaView
      style={{
        flex: 1,
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
            Achievements
          </Text>
        </View>
        <View style={{ width: 34, height: 34 }}></View>
      </View>
      <View
        style={{
          paddingHorizontal: 16,
          paddingVertical: 8,
        }}
      >
        <Text>Achievement List</Text>
      </View>
    </SafeAreaView>
  );
}
