import { useEffect, useState } from "react";
import { router } from "expo-router";
import { useTranslation } from "react-i18next";
import {
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { ActivityIndicator, Text } from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../store";
import ForumIcon from "../../assets/images/icons/forum.svg";
import ArrowIcon from "../../assets/images/icons/navigate_next.svg";
import PersonPinIcon from "../../assets/images/icons/person_pin.svg";
import RouteIcon from "../../assets/images/icons/route.svg";
import RouteCard from "../../components/RouteCard";
import { WeatherWidget } from "../../components/WeatherWidget";
import useFetch from "../../hooks/useFetch";
import {
  selectIsLoading,
  selectTriggerRefreshHome,
} from "../../store/appSlice";
import { selectUserId } from "../../store/authSlice";
import {
  setRouteHistory,
  setFromUrl,
  selectHistoryRoute,
} from "../../store/routeHistorySlice";
import { useAppTheme } from "../../theme/theme";
import { RouteHistory } from "../../types/route";

import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as Linking from "expo-linking";
import { FunctionButton } from "../../components/FunctionButton";

export default function HomeScreen() {
  const { t } = useTranslation();
  const theme = useAppTheme();
  const dispatch = useDispatch<AppDispatch>();
  const userId = useSelector(selectUserId);
  const loading = useSelector(selectIsLoading);
  const triggerRefreshHome = useSelector(selectTriggerRefreshHome);
  const url = Linking.useURL();
  const historyRoute = useSelector(selectHistoryRoute);

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
      url: `/route/feed/user/fav/${userId}/?limit=5`,
    },
    [userId]
  );

  useEffect(() => {
    refetchRouteList();
    refetchFavRouteList();
  }, [triggerRefreshHome]);

  useEffect(() => {
    if (url) {
      const { path, queryParams } = Linking.parse(url);
      if (queryParams && queryParams.routeId) {
        dispatch(
          setFromUrl({
            routeId: parseInt(queryParams.routeId as string),
            fromUrl: true,
            history: true,
          })
        );
        router.push({
          pathname: "/route/result",
        });
      }
    }
  }, [url]);

  const handlePressCard = (result: RouteHistory) => {
    if (result && result.route) {
      dispatch(
        setRouteHistory({ route: result.route, history: true, fromUrl: false })
      );
      router.push({
        pathname: "/route/result",
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
              color={theme.colors.onSuccessContainer}
              containerColor={theme.colors.successContainer}
              title={t("Plan my route", { ns: "home" })}
              subtitle={t("Plan your trip", { ns: "home" })}
            />
            <FunctionButton
              destination="/track/track"
              icon={<PersonPinIcon />}
              color={theme.colors.onPrimaryContainer}
              containerColor={theme.colors.primaryContainer}
              title={t("Location Sharing", { ns: "home" })}
              subtitle={t("Share your location in realtime", {
                ns: "home",
              })}
            />
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <FunctionButton
                destination="/history/sharedroute"
                icon={<ForumIcon />}
                color={theme.colors.onPurpleContainer}
                containerColor={theme.colors.purpleContainer}
                title={t("Community Routes", { ns: "home" })}
                vertical
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
                vertical
              />
            </View>
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
                    {t("No route history", { ns: "home" })}
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
                {t("Favourite Route", { ns: "home" })}
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
                  <Text
                    variant="bodyLarge"
                    style={[
                      styles.emptyStateText,
                      {
                        color: theme.colors.outline,
                      },
                    ]}
                  >
                    {t("No favourite route", { ns: "home" })}
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
            {t("More features coming soon", { ns: "home" })}...
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
    gap: 10,
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
