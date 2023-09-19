import React, { useRef, useState, useEffect } from "react";

import {
  SafeAreaView,
  StyleSheet,
  View,
  ScrollView,
  Animated,
  TouchableOpacity,
  Image,
  StatusBar,
  Platform,
  Pressable,
} from "react-native";
import { Button, Text } from "react-native-paper";
import { useTranslation } from "react-i18next";
import AccountCircleIcon from "../../assets/images/icons/account_circle.svg";
import RouteIcon from "../../assets/images/icons/route.svg";
import ArrowIcon from "../../assets/images/icons/navigate_next.svg";
import { AnimatedButton } from "../../components/AnimatedButton";
import LightCloudyIcon from "../../assets/images/weather/light_cloudy.svg";
import PersonPinIcon from "../../assets/images/icons/person_pin.svg";

import { router } from "expo-router";
import { useSelector } from "react-redux";
import { selectToken, selectUserId } from "../../store/authSlice";
import RouteCard from "../../components/RouteCard";
import useFetch from "../../hooks/useFetch";
import { RouteHistory } from "../../types/route";
import { useAppTheme } from "../../theme/theme";

export default function HomeScreen() {
  const { t } = useTranslation();
  const theme = useAppTheme();
  const userID = useSelector(selectUserId);
  const token = useSelector(selectToken);

  const [currentDate, setCurrentDate] = useState(new Date());
  const [translatedDate, setTranslatedDate] = useState("");

  const getTranslatedDate = (date: Date) => {
    const dayName = t(date.toLocaleDateString("en-US", { weekday: "long" }), {
      ns: "home",
    });
    const day = date.getDate();
    const monthName = t(date.toLocaleDateString("en-US", { month: "long" }), {
      ns: "home",
    });

    return `${dayName} ${day} ${monthName}`;
  };

    const [routeList, refetchRouteList] = useFetch<RouteHistory[]>(
        {
            method: "GET",
            url: `/route/user/${userID}/?limit=5`,
            token: token,
        },
        [token]
    );

    const [favRouteList, refetchFavRouteList] = useFetch<RouteHistory[]>(
        {
            method: "GET",
            url: `/route/user/fav/${userID}/?limit=5`,
            token: token,
        },
        [token]
    );

  useEffect(() => {
    const updateDate = () => {
      setCurrentDate(new Date());
      setTranslatedDate(getTranslatedDate(currentDate)); // Update the translated date
    };

    // Update the date initially
    updateDate();

    // Schedule the next update for the next day
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    const timeUntilTomorrow = tomorrow.getTime() - new Date().getTime();
    const timerId = setTimeout(updateDate, timeUntilTomorrow);
    // Clean up the timer when the component unmounts
    return () => {
      clearTimeout(timerId);
    };
  }, []);

  const handlePressCard = (result: RouteHistory) => {
    if (result && result.route) {
      router.push({
        pathname: "/route/result",
        params: {
          routeJSON: JSON.stringify(result.route),
        },
      });
    }
  };

  const handlePressMoreHistory = () => {
    router.push({
      pathname: "/history/overview",
      params: {
        routeJSON: JSON.stringify(routeList),
      },
    });
  };

  const handlePressMoreFavorite = () => {
    router.push({
      pathname: "/history/favourite",
      params: {
        favRouteJSON: JSON.stringify(favRouteList),
      },
    });
  };

  return (
    <SafeAreaView
      style={[
        {
          flex: 1,
          paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
        },
        { backgroundColor: theme.colors.background },
      ]}
    >
      <ScrollView contentContainerStyle={styles.scrollView}>
        <View style={[styles.headerView, styles.containerView]}>
          <Text variant="headlineSmall" style={styles.headerText}>
            {t("Discover Melbourne", { ns: "home" })}
          </Text>
        </View>
        <View style={[styles.containerView]}>
          <AnimatedButton
            color={theme.colors.amberContainer}
            style={{
              paddingVertical: 12
            }}
            onPress={() => {}}
          >
            <LightCloudyIcon
              style={{
                position: "absolute",
                top: -36,
                left: -36,
              }}
              height={200}
              width={200}
            />
            <View style={styles.weatherView}>
              <Text variant="headlineLarge" style={styles.headerText}>
                17 C°
              </Text>
              <Text variant="bodySmall" style={styles.headerText}>
                {t("Cloudy", { ns: "home" })}
              </Text>
            </View>
          </AnimatedButton>
        </View>
        <View style={{
          paddingTop: 8
        }}>
          <Text variant="titleLarge" style={styles.titleLarge}>
            {t("Start Here", { ns: "home" })}
          </Text>
          <View style={[styles.containerView, {
            gap: 12
          }]}>
            <AnimatedButton
              color={theme.colors.purpleContainer}
              style={{
                paddingVertical: 24
              }}
              onPress={() => {
                router.push("/route/activity");
              }}
            >
              <View style={styles.animatedButtonInner}>
                <RouteIcon
                  style={styles.iconStyle}
                  height={40}
                  width={40}
                  fill={theme.colors.onPurpleContainer}
                />
                <View style={styles.columnFlexStart}>
                  <View style={styles.rowSpaceBetween}>
                    <Text variant="headlineSmall" style={styles.headerText}>
                      {t("Plan my route", { ns: "home" })}
                    </Text>
                    <ArrowIcon
                      style={styles.moreIcon}
                      fill={theme.colors.onPurpleContainer}
                    />
                  </View>
                  <Text
                    style={{ color: theme.colors.onPurpleContainer }}
                  >
                    {t("Plan your trip", { ns: "home" })}
                  </Text>
                </View>
              </View>
            </AnimatedButton>
            <AnimatedButton
              height={76}
              color={theme.colors.amberContainer}
              style={{
                paddingVertical: 24
              }}
              onPress={() => {
                router.push("/track/track");
              }}
            >
              <View style={styles.animatedButtonInner}>
                <PersonPinIcon
                  height={40}
                  width={40}
                  fill={theme.colors.onAmberContainer}
                />
                <View style={styles.columnFlexStart}>
                  <View style={styles.rowSpaceBetween}>
                    <Text
                      variant="titleLarge"
                      style={[
                        styles.headerText,
                        { color: theme.colors.onAmberContainer },
                      ]}
                    >
                      {t("Location Sharing", { ns: "home" })}
                    </Text>
                    <ArrowIcon
                      style={styles.moreIcon}
                      fill={theme.colors.onAmberContainer}
                    />
                  </View>
                </View>
              </View>
            </AnimatedButton>
          </View>
        </View>
        {routeList && (
          <View>
            <View style={styles.historySection}>
              <Text variant="titleLarge" style={styles.titleLarge}>
                {t("Route History", { ns: "home" })}
              </Text>
              <TouchableOpacity
                activeOpacity={0.6}
                onPress={() => {
                  /* handle action */
                }}
              >
                <Pressable
                  onPress={() => {
                    handlePressMoreHistory();
                  }}
                >
                  <View
                    style={{
                      alignItems: "center",
                      marginRight: 30,
                      marginTop: 10,
                      flexDirection: "row",
                    }}
                  >
                    <Text
                      style={{
                        color: theme.colors.primary,
                        fontWeight: "bold",
                      }}
                    >
                      {t("comm:More")}
                    </Text>
                    <ArrowIcon
                      width={22}
                      height={22}
                      fill={theme.colors.primary}
                    />
                  </View>
                </Pressable>
              </TouchableOpacity>
            </View>

            <View>
              <View
                style={{
                  gap: 12,
                  marginVertical: 16,
                  marginHorizontal: 16,
                }}
              >
                {routeList.slice(0, 2).map((result, index) => (
                  <RouteCard
                    key={index}
                    routeResult={result}
                    isSimplified={true}
                    onPressCard={() => {
                      handlePressCard(result);
                    }}
                  />
                ))}
              </View>
            </View>
          </View>
        )}

        {favRouteList && Array.isArray(favRouteList) && (
          <View>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                marginTop: 12,
              }}
            >
              <Text
                variant="titleLarge"
                style={{
                  marginHorizontal: 16,
                }}
              >
                {t("Favorite Route", { ns: "home" })}
              </Text>
              <Pressable onPress={() => handlePressMoreFavorite()}>
                  <View
                    style={{
                      alignItems: "center",
                      marginRight: 30,
                      marginTop: 10,
                      flexDirection: "row",
                    }}
                  >
                    <Text
                      style={{
                        color: theme.colors.primary,
                        fontWeight: "bold",
                      }}
                    >
                      {t("comm:More")}
                    </Text>
                    <ArrowIcon
                      width={22}
                      height={22}
                      fill={theme.colors.primary}
                    />
                  </View>
                </Pressable>
            </View>

            <View
              style={{
                gap: 12,
                marginVertical: 16,
                marginHorizontal: 16,
              }}
            >
              {favRouteList.map((result, index) => (
                <RouteCard
                  key={index}
                  routeResult={result}
                  isSimplified={true}
                  onPressCard={() => {
                    handlePressCard(result);
                  }}
                />
              ))}
            </View>
          </View>
        )}
        <View style={{
          width: "100%",
          flexDirection: "row",
          justifyContent: "center",
          marginVertical: 24
        }}>
          <Text variant="bodyLarge" style={{
            color: theme.colors.outline,
          }}>
            More features coming soon...
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flexGrow: 1,
    flexDirection: "column",
  },
  containerView: {
    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: 10,
  },
  headerView: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    flex: 1,
    paddingTop: 24,
    paddingBottom: 8
  },
  headerText: {
    fontWeight: "bold",
  },
  weatherView: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "flex-end",
  },
  titleLarge: {
    marginHorizontal: 16,
    marginVertical: 4,
    marginTop: 12,
  },
  animatedButtonContainer: {
    marginTop: 16,
  },
  animatedButtonInner: {
    flexDirection: "row",
    flex: 1,
    alignItems: "center",
    gap: 8
  },
  iconStyle: {
    // marginHorizontal: 18,
  },
  columnFlexStart: {
    flexDirection: "column",
    flex: 1,
    alignItems: "flex-start",
  },
  rowSpaceBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 8
  },
  moreIcon: {
    marginTop: 2,
  },
  historySection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 12
  },
  dateText: {
    marginHorizontal: 16,
    marginTop: 12,
    marginBottom: 16,
    fontWeight: "bold",
  },
  favoriteSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 24,
  },
});
