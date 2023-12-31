import { router } from "expo-router";
import { View, TouchableOpacity } from "react-native";
import { Text } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import ArrowBackIcon from "../../assets/images/icons/arrow_back.svg";
import { AppTheme, useAppTheme } from "../../theme/theme";
import useFetch from "../../hooks/useFetch";
import { AnimatedButton } from "../../components/AnimatedButton";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { ProgressBar } from "react-native-paper";
import { ChallengeType, allChallenges } from "../../constants/challenges";
import { ScrollView } from "react-native-gesture-handler";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
export type Achievement = {
  challenge: {
    name: string;
    type: string;
    goal: number;
    grade: number;
    score: number;
  };
  year: number;
  month: number;
  day: number;
  current_progress: number;
  progress: number;
};

export default function AchievementListPage() {
  const theme = useAppTheme();
  const { t } = useTranslation();

  const [achievementToday, fetchAchievementToday] = useFetch<Achievement[]>(
    {
      method: "GET",
      url: "/challenge/today-history",
    },
    [],
    [],
    false
  );

  const [challengeList, setChallengeList] = useState<ChallengeType[]>([]);

  useEffect(() => {
    setChallengeList([]);
    if (achievementToday && achievementToday.length > 0) {
      allChallenges.forEach((challenge) => {
        for (let i = 0; i < achievementToday.length; i++) {
          if (challenge.name === achievementToday[i].challenge.name) {
            challenge.progress = achievementToday[i].progress;
            challenge.day = achievementToday[i].day;
            challenge.month = achievementToday[i].month;
            challenge.year = achievementToday[i].year;
            challenge.goal = achievementToday[i].challenge.goal;
            challenge.currentProgress = achievementToday[i].current_progress;
            achievementToday.splice(i, 1);
            break;
          }
        }
        setChallengeList((prev) => [
          ...prev,
          {
            ...challenge,
          },
        ]);
      });
    } else {
      setChallengeList([]);
      allChallenges.forEach((challenge) => {
        setChallengeList((prev) => [
          ...prev,
          {
            ...challenge,
          },
        ]);
      });
    }
  }, [achievementToday]);

  const transChallengeName = (title: string) => {
    if (title === "Daily Log In" || title === "Access Global Feed") {
      return t(title, { ns: "achievements" });
    }
    const words = title.split(" ");
    let result = `${t(words[0], { ns: "achievements" })} ${words[1]} ${t(
      words[2],
      {
        ns: "achievements",
      }
    )}`;
    return result;
  };

  useEffect(() => {
    fetchAchievementToday();
  }, []);

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
            {t("Achievements", { ns: "home" })}
          </Text>
        </View>
        <View style={{ width: 34, height: 34 }}>
          <TouchableOpacity onPress={() => router.push("/achievement/ranking")}>
            <MaterialCommunityIcons
              name="podium-gold"
              size={28}
              color={theme.colors.onBackground}
            />
          </TouchableOpacity>
        </View>
      </View>
      <ScrollView
        style={{
          paddingHorizontal: 16,
          paddingVertical: 8,
        }}
      >
        <View
          style={{
            gap: 8,
            paddingBottom: 32,
          }}
        >
          {challengeList.map((challenge, index) => {
            return (
              <AnimatedButton
                key={index}
                color={theme.colors[`${challenge.containerColor}`] + ""}
                style={{
                  padding: 0,
                  overflow: "hidden",
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 8,
                    padding: 16,
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      flex: 1,
                      alignItems: "center",
                      gap: 8,
                    }}
                  >
                    <MaterialCommunityIcons
                      name={challenge.icon as any}
                      size={32}
                      color={theme.colors[`${challenge.color}`] as string}
                    />
                    <Text
                      variant="titleLarge"
                      style={{
                        color: theme.colors[`${challenge.color}`] as string,
                        fontWeight: "bold",
                        fontSize: 20,
                        marginLeft: 6,
                      }}
                    >
                      {transChallengeName(challenge.name)}
                    </Text>
                  </View>
                  <View
                    style={{
                      flexDirection: "column",
                      flex: 1,
                      alignItems: "flex-end",
                      gap: 8,
                    }}
                  >
                    <Text
                      style={{
                        color: theme.colors[`${challenge.color}`] as string,
                        fontWeight: "bold",
                        fontSize: 20,
                        marginRight: 8,
                      }}
                    >
                      {challenge.currentProgress || "0"}/{challenge.goal}
                    </Text>
                  </View>
                </View>
                {challenge.progress && (
                  <ProgressBar
                    progress={challenge.progress}
                    color={theme.colors[`${challenge.progressColor}`] as string}
                  />
                )}
              </AnimatedButton>
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
