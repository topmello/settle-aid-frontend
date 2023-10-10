import { Image, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAppTheme } from "../../theme/theme";
import { Divider, List, Text } from "react-native-paper";
import { router } from "expo-router";
import ArrowBackIcon from "../../assets/images/icons/arrow_back.svg";
import PodiumIcon from "../../assets/images/achievement/podium.svg";
import useFetch from "../../hooks/useFetch";
import { useEffect } from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export type UserRank = {
  username: string;
  score: number;
};

export default function AchievementRankingPage() {
  const theme = useAppTheme();
  const [rankingList, fetchRankingList] = useFetch<UserRank[]>({
    method: "GET",
    url: `/challenge/leaderboard/?limit=10`,
  });

  useEffect(() => {
    fetchRankingList();
  }, []);
  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: theme.colors.amberContainer,
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
            fill={theme.colors.onAmberContainer}
            width={28}
            height={28}
          />
        </TouchableOpacity>
        <View style={{ flex: 1, marginLeft: 12 }}>
          <Text
            style={{
              fontSize: 24,
              color: theme.colors.onAmberContainer,
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
          <View
            style={{
              width: "100%",
              height: 180,
              overflow: "hidden",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <PodiumIcon width="100%" height="280" />
          </View>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
              width: "100%",
            }}
          >
            <View
              style={{
                width: "32%",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text
                variant="titleMedium"
                style={{
                  color: theme.colors.onAmberContainer,
                }}
              >
                {rankingList?.[1].username}
              </Text>
            </View>
            <View
              style={{
                width: "28%",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text
                variant="titleMedium"
                style={{
                  fontWeight: "bold",
                  color: theme.colors.onAmberContainer,
                }}
              >
                {rankingList?.[0].username}
              </Text>
            </View>
            <View
              style={{
                width: "32%",
                justifyContent: "flex-start",
                alignItems: "center",
              }}
            >
              <Text
                variant="titleMedium"
                style={{
                  color: theme.colors.onAmberContainer,
                }}
              >
                {rankingList?.[2].username}
              </Text>
            </View>
          </View>
        </View>
        <View
          style={{
            flex: 1,
            marginTop: 16,
          }}
        >
          {rankingList?.map((userRank, index) => {
            return (
              <View key={index}>
                <View
                  style={{
                    width: "100%",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    height: 56,
                  }}
                >
                  <MaterialCommunityIcons
                    name={
                      index === 0
                        ? "crown"
                        : index === 1
                        ? "medal"
                        : index === 2
                        ? "trophy-award"
                        : (`numeric-${index + 1}-box-multiple` as any)
                    }
                    size={32}
                    color={
                      index === 0
                        ? "#f9a11f"
                        : index === 1
                        ? "#90a4ae"
                        : index === 2
                        ? "#c77b30"
                        : theme.colors.onBackground
                    }
                  />
                  <Text variant="titleMedium">{userRank.username}</Text>
                  <Text variant="titleMedium">{userRank.score}</Text>
                </View>
                <Divider />
              </View>
            );
          })}
        </View>
      </View>
    </SafeAreaView>
  );
}
