import { useState, useEffect } from "react";

import {
  SafeAreaView,
  StyleSheet,
  View,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Platform,
} from "react-native";
import { Button, Text, ActivityIndicator } from "react-native-paper";
import { useTranslation } from "react-i18next";
import RouteIcon from "../../assets/images/icons/route.svg";
import ArrowIcon from "../../assets/images/icons/navigate_next.svg";
import ForumIcon from "../../assets/images/icons/forum.svg";
import PersonPinIcon from "../../assets/images/icons/person_pin.svg";
import { router } from "expo-router";
import { useSelector } from "react-redux";
import { selectToken, selectUserId } from "../../store/authSlice";
import {
  selectIsLoading,
  selectTriggerRefreshHome,
} from "../../store/appSlice";
import RouteCard from "../../components/RouteCard";
import useFetch from "../../hooks/useFetch";
import { RouteHistory } from "../../types/route";
import { useAppTheme } from "../../theme/theme";
import { WeatherWidget } from "../../components/WeatherWidget";

import * as Linking from "expo-linking";
import { isString } from "lodash";
import { FunctionButton } from "../../components/FunctionButton";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function HomeScreen() {
  const { t } = useTranslation();
  const theme = useAppTheme();
  const userId = useSelector(selectUserId);
  const loading = useSelector(selectIsLoading);
  const triggerRefreshHome = useSelector(selectTriggerRefreshHome);

  const [routeList, refetchRouteList] = useFetch<RouteHistory[]>(
    {
      method: "GET",
      url: `/route/user/${userId}/?limit=2`,
    },
    [userId]
  );

  const [favRouteList, refetchFavRouteList] = useFetch<RouteHistory[]>(
    {
      method: "GET",
      url: `/route/user/fav/${userId}/?limit=5`,
    },
    [userId]
  );

  useEffect(() => {
    refetchRouteList();
    refetchFavRouteList();
  }, [triggerRefreshHome]);

  const [routeId, setRouteId] = useState<string | null>(null);

  useEffect(() => {
    // Handle the initial deep link
    const handleInitialDeepLink = async () => {
      const initialUrl = await Linking.getInitialURL();
      if (initialUrl) {
        const { queryParams } = Linking.parse(initialUrl);
        if (queryParams?.routeid && isString(queryParams?.routeid)) {
          setRouteId(queryParams?.routeid);
        }
      }
    };

    handleInitialDeepLink();

    // Add an event listener for deep links
    const handleDeepLink = (event: { url: string }) => {
      const { queryParams } = Linking.parse(event.url);
      if (queryParams?.routeid && isString(queryParams?.routeid)) {
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
          routeId: result.route.route_id + "",
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
                gap: 6,
              },
            ]}
          >
            <FunctionButton
              destination="/route/activity"
              icon={<RouteIcon />}
              color={theme.colors.onPurpleContainer}
              containerColor={theme.colors.purpleContainer}
              title={t("Plan my route", { ns: "home" })}
              subtitle={t("Plan your trip", { ns: "home" })}
            />
            <FunctionButton
              destination="/track/track"
              icon={<PersonPinIcon />}
              color={theme.colors.onSuccessContainer}
              containerColor={theme.colors.successContainer}
              title={t("Location Sharing", { ns: "home" })}
              subtitle={t("Share your location in realtime with ease", {
                ns: "home",
              })}
            />
            <FunctionButton
              destination="/history/sharedroute"
              icon={<ForumIcon />}
              color={theme.colors.onPrimaryContainer}
              containerColor={theme.colors.primaryContainer}
              title={t("Community Routes", { ns: "home" })}
              subtitle={t("Follow beloved routes by community", { ns: "home" })}
            />
            <FunctionButton
              destination="/achievement/list"
              icon={
                <MaterialCommunityIcons
                  name="trophy"
                  color={theme.colors.onAmberContainer}
                  size={36}
                />
              }
              color={theme.colors.onAmberContainer}
              containerColor={theme.colors.amberContainer}
              title={t("Achievements", { ns: "home" })}
            />
          </View>
        </View>
        {routeList && (
          <View>
            <View style={styles.sectionWrapper}>
              <Text variant="titleLarge" style={styles.titleWithMargin}>
                {t("Route History", { ns: "home" })}
              </Text>
              <TouchableOpacity onPress={handlePressMoreHistory}>
                <View style={styles.moreWrapper}>
                  <Text
                    style={[styles.moreText, { color: theme.colors.primary }]}
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
            <View style={styles.cardsWrapper}>
              {routeList.map((result, index) => (
                <RouteCard
                  key={index}
                  routeResult={result}
                  isSimplified={true}
                  onPressCard={() => handlePressCard(result)}
                />
              ))}
              {routeList.length === 0 && (
                <View style={styles.emptyStateWrapper}>
                  <Text
                    variant="bodyLarge"
                    style={[
                      styles.emptyStateText,
                      {
                        color: theme.colors.outline,
                      },
                    ]}
                  >
                    {t("Plan your route to see your history")}
                  </Text>
                </View>
              )}
            </View>
          </View>
        )}

        {favRouteList && (
          <View>
            <View style={styles.sectionWrapper}>
              <Text variant="titleLarge" style={styles.titleWithMargin}>
                {t("Favorite Route", { ns: "home" })}
              </Text>
              <TouchableOpacity onPress={handlePressMoreFavorite}>
                <View style={styles.moreWrapper}>
                  <Text
                    style={[styles.moreText, { color: theme.colors.primary }]}
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
            <View style={styles.cardsWrapper}>
              {favRouteList.map((result, index) => (
                <RouteCard
                  key={index}
                  routeResult={result}
                  isSimplified={true}
                  onPressCard={() => handlePressCard(result)}
                />
              ))}
              {favRouteList.length === 0 && (
                <View style={styles.emptyStateWrapper}>
                  <Text variant="bodyLarge" style={styles.emptyStateText}>
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
  historySection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 12,
  },
  sectionWrapper: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 12,
  },
  titleWithMargin: {
    marginHorizontal: 16,
  },
  moreWrapper: {
    alignItems: "center",
    marginRight: 16,
    marginTop: 10,
    flexDirection: "row",
  },
  moreText: {
    fontWeight: "bold",
  },
  cardsWrapper: {
    gap: 6,
    marginVertical: 16,
    marginHorizontal: 16,
  },
  emptyStateWrapper: {
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 8,
  },
  emptyStateText: {
    textAlign: "center",
  },
});
