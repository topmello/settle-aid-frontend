import { useState, useEffect, useCallback } from "react";

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
import { Button, Text, ActivityIndicator } from "react-native-paper";
import { useTranslation } from "react-i18next";
import RouteIcon from "../../assets/images/icons/route.svg";
import ArrowIcon from "../../assets/images/icons/navigate_next.svg";
import { AnimatedButton } from "../../components/AnimatedButton";
import PersonPinIcon from "../../assets/images/icons/person_pin.svg";

import { router } from "expo-router";
import { useSelector } from "react-redux";
import { selectToken, selectUserId } from "../../store/authSlice";
import { selectIsLoading } from "../../store/appSlice";
import RouteCard from "../../components/RouteCard";
import useFetch from "../../hooks/useFetch";
import { RouteHistory } from "../../types/route";
import { useAppTheme } from "../../theme/theme";
import { useFocusEffect } from "expo-router";
import { WeatherWidget } from "../../components/WeatherWidget";

import * as Linking from "expo-linking";

export default function HomeScreen() {
  const { t } = useTranslation();
  const theme = useAppTheme();
  const userID = useSelector(selectUserId);
  const loading = useSelector(selectIsLoading);

  const [routeList, refetchRouteList] = useFetch<RouteHistory[]>(
    {
      method: "GET",
      url: `/route/user/${userID}/?limit=2`,
    },
    [userID]
  );

  const [favRouteList, refetchFavRouteList] = useFetch<RouteHistory[]>(
    {
      method: "GET",
      url: `/route/user/fav/${userID}/?limit=5`,
    },
    [userID]
  );

  useEffect(() => {
    refetchRouteList();
    refetchFavRouteList();
  }, []);

  const [routeId, setRouteId] = useState<string | null>(null);

  useEffect(() => {
    // Handle the initial deep link
    const handleInitialDeepLink = async () => {
      const initialUrl = await Linking.getInitialURL();
      if (initialUrl) {
        const { queryParams } = Linking.parse(initialUrl);
        if (queryParams.routeid) {
          setRouteId(queryParams.routeid);
        }
      }
    };

    handleInitialDeepLink();

    // Add an event listener for deep links
    const handleDeepLink = (event: { url: string }) => {
      const { queryParams } = Linking.parse(event.url);
      if (queryParams.routeid) {
        setRouteId(queryParams.routeid);
      }
    };

    Linking.addEventListener("url", handleDeepLink);

    return () => {};
  }, []);

  // Navigate
  useEffect(() => {
    if (routeId) {
      router.push({
        pathname: "/route/result",
        params: {
          route_id_: routeId,
        },
      });
    }
  }, [routeId]);

  const handlePressCard = (result: RouteHistory) => {
    if (result && result.route) {
      router.push({
        pathname: "/route/result",
        params: {
          route_id: result.route.route_id,
        },
      });
    }
  };

  const handlePressMoreHistory = () => {
    router.push({
      pathname: "/history/overview",
    });
  };

  const handlePressMoreFavorite = () => {
    router.push({
      pathname: "/history/favourite",
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
      <ActivityIndicator
        style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}
        animating={loading}
        size="large"
      />
      <ScrollView contentContainerStyle={styles.scrollView}>
        <View style={[styles.headerView, styles.containerView]}>
          <Text variant="headlineSmall" style={styles.headerText}>
            {t("Discover Melbourne", { ns: "home" })}
          </Text>
        </View>
        <View style={[styles.containerView]}>
          <WeatherWidget />
        </View>
        <View
          style={{
            paddingTop: 8,
          }}
        >
          <Text variant="titleLarge" style={styles.titleLarge}>
            {t("Start Here", { ns: "home" })}
          </Text>
          <View
            style={[
              styles.containerView,
              {
                gap: 12,
              },
            ]}
          >
            <AnimatedButton
              color={theme.colors.purpleContainer}
              style={{
                paddingVertical: 24,
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
                  <Text style={{ color: theme.colors.onPurpleContainer }}>
                    {t("Plan your trip", { ns: "home" })}
                  </Text>
                </View>
              </View>
            </AnimatedButton>
            <AnimatedButton
              height={76}
              color={theme.colors.successContainer}
              style={{
                paddingVertical: 24,
              }}
              onPress={() => {
                router.push("/track/track");
              }}
            >
              <View style={styles.animatedButtonInner}>
                <PersonPinIcon
                  height={40}
                  width={40}
                  fill={theme.colors.onSuccessContainer}
                />
                <View style={styles.columnFlexStart}>
                  <View style={styles.rowSpaceBetween}>
                    <Text
                      variant="titleLarge"
                      style={[
                        styles.headerText,
                        { color: theme.colors.onSuccessContainer },
                      ]}
                    >
                      {t("Location Sharing", { ns: "home" })}
                    </Text>
                    <ArrowIcon
                      style={styles.moreIcon}
                      fill={theme.colors.onSuccessContainer}
                    />
                  </View>
                </View>
              </View>
            </AnimatedButton>
            <AnimatedButton
              height={76}
              color={theme.colors.secondaryContainer}
              style={{
                paddingVertical: 24,
              }}
              onPress={() => {
                router.push("/history/sharedroute");
              }}
            >
              <View style={styles.animatedButtonInner}>
                <PersonPinIcon
                  height={40}
                  width={40}
                  fill={theme.colors.onSuccessContainer}
                />
                <View style={styles.columnFlexStart}>
                  <View style={styles.rowSpaceBetween}>
                    <Text
                      variant="titleLarge"
                      style={[
                        styles.headerText,
                        { color: theme.colors.onSuccessContainer },
                      ]}
                    >
                      {t("Shared Route", { ns: "home" })}
                    </Text>
                    <ArrowIcon
                      style={styles.moreIcon}
                      fill={theme.colors.onSuccessContainer}
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
                onPress={() => {
                  handlePressMoreHistory();
                }}
              >
                <View
                  style={{
                    alignItems: "center",
                    marginRight: 16,
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
                {routeList.map((result, index) => (
                  <RouteCard
                    key={index}
                    routeResult={result}
                    isSimplified={true}
                    onPressCard={() => {
                      handlePressCard(result);
                    }}
                  />
                ))}
                {routeList.length === 0 && (
                  <View
                    style={{
                      alignItems: "center",
                      justifyContent: "center",
                      marginVertical: 8,
                    }}
                  >
                    <Text
                      variant="bodyLarge"
                      style={{
                        textAlign: "center",
                        color: theme.colors.outline,
                      }}
                    >
                      {t("Plan your route to see your history")}
                    </Text>
                  </View>
                )}
              </View>
            </View>
          </View>
        )}

        {favRouteList && (
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
              <TouchableOpacity onPress={() => handlePressMoreFavorite()}>
                <View
                  style={{
                    alignItems: "center",
                    marginRight: 16,
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
              </TouchableOpacity>
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
              {favRouteList.length === 0 && (
                <View
                  style={{
                    alignItems: "center",
                    justifyContent: "center",
                    marginVertical: 8,
                  }}
                >
                  <Text
                    variant="bodyLarge"
                    style={{
                      color: theme.colors.outline,
                      textAlign: "center",
                    }}
                  >
                    {t("Add your favorite route by tapping the bookmark icon")}
                  </Text>
                </View>
              )}
            </View>
          </View>
        )}
        <View
          style={{
            width: "100%",
            flexDirection: "row",
            justifyContent: "center",
            marginVertical: 24,
          }}
        >
          <Text
            variant="bodyLarge"
            style={{
              color: theme.colors.outline,
            }}
          >
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
    paddingTop: 24,
    paddingBottom: 8,
  },
  headerText: {
    fontWeight: "bold",
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
    gap: 8,
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
    gap: 8,
  },
  moreIcon: {
    marginTop: 2,
  },
  historySection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 12,
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
