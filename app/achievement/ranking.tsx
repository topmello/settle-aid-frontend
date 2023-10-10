import { Image, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAppTheme } from "../../theme/theme";
import { Text } from "react-native-paper";
import { router } from "expo-router";
import ArrowBackIcon from "../../assets/images/icons/arrow_back.svg";
import PodiumIcon from "../../assets/images/achievement/podium.svg";
import useFetch from "../../hooks/useFetch";

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
          <View
            style={{
              position: "absolute",
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
              paddingTop: 16,
              width: "100%",
            }}
          >
            <Text
              variant="titleMedium"
              style={{
                fontSize: 24,
                color: theme.colors.onBackground,
                textAlign: "center",
                fontWeight: "bold",
                marginRight: 24,
                paddingTop: 48,
              }}
            >
              guy
            </Text>
            <Text
              variant="titleMedium"
              style={{
                fontSize: 24,
                color: theme.colors.onBackground,
                textAlign: "center",
                fontWeight: "bold",
                marginHorizontal: 16,
              }}
            >
              admin
            </Text>
            <Text
              variant="titleMedium"
              style={{
                fontSize: 24,
                color: theme.colors.onBackground,
                textAlign: "center",
                fontWeight: "bold",
                marginLeft: 24,
                paddingTop: 72,
              }}
            >
              cam
            </Text>
          </View>
          <PodiumIcon width="100%" height={300} />
        </View>
        <View
          style={{
            flex: 1,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-around",
              gap: 8,
              marginTop: 16,
            }}
          >
            <Text
              variant="titleMedium"
              style={{
                fontSize: 24,
                color: theme.colors.onAmberContainer,
                textAlign: "center",
                fontWeight: "bold",
              }}
            >
              1
            </Text>
            <Text
              variant="titleMedium"
              style={{
                fontSize: 24,
                color: theme.colors.onBackground,
                textAlign: "center",
              }}
            >
              admin
            </Text>
            <Text variant="titleMedium" style={{ fontSize: 24 }}>
              97
            </Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-around",
              gap: 8,
              marginTop: 16,
            }}
          >
            <Text
              variant="titleMedium"
              style={{
                fontSize: 24,
                color: theme.colors.onAmberContainer,
                textAlign: "center",
                fontWeight: "bold",
              }}
            >
              2
            </Text>
            <Text
              variant="titleMedium"
              style={{
                fontSize: 24,
                color: theme.colors.onBackground,
                textAlign: "center",
              }}
            >
              guy
            </Text>
            <Text variant="titleMedium" style={{ fontSize: 24 }}>
              82
            </Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-around",
              gap: 8,
              marginTop: 16,
            }}
          >
            <Text
              variant="titleMedium"
              style={{
                fontSize: 24,
                color: theme.colors.onAmberContainer,
                textAlign: "center",
                fontWeight: "bold",
              }}
            >
              1
            </Text>
            <Text
              variant="titleMedium"
              style={{
                fontSize: 24,
                color: theme.colors.onBackground,
                textAlign: "center",
              }}
            >
              cam
            </Text>
            <Text variant="titleMedium" style={{ fontSize: 24 }}>
              48
            </Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
