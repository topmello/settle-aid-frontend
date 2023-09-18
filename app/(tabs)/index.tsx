//@ts-nocheck
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
import RestaurantIcon from "../../assets/images/icons/restaurant_menu.svg";
import { AnimatedButton } from "../../components/AnimatedButton";
import { useTheme } from "react-native-paper";
import LightCloudyIcon from "../../assets/images/weather/light_cloudy.svg";
import { Link, router } from "expo-router";
import { useSelector } from "react-redux";
import { selectToken, selectUserId } from "../../store/authSlice";
import RouteCard from "../../components/RouteCard";
import useFetch from "../../hooks/useFetch";
import { RouteHistoryList } from "../../types/route";

export default function HomeScreen() {
  const { t } = useTranslation();
  const theme = useTheme();
  const userID = useSelector(selectUserId);
  const token = useSelector(selectToken);

  const handleStartClick = () => {
    console.log("Rectangle clicked!");
  };
  const [currentDate, setCurrentDate] = useState(new Date());
  const [translatedDate, setTranslatedDate] = useState("");

  const getTranslatedDate = (date) => {
    const dayName = t(date.toLocaleDateString("en-US", { weekday: "long" }), {
      ns: "home",
    });
    const day = date.getDate();
    const monthName = t(date.toLocaleDateString("en-US", { month: "long" }), {
      ns: "home",
    });

    return `${dayName} ${day} ${monthName}`;
  };

  const routeList: RouteHistoryList = useFetch({
    method: "GET",
    url: `/route/user/${userID}/?limit=5`,
    token: token,
  });

  const favRouteList: RouteHistoryList = useFetch({
    method: "GET",
    url: `/route/user/fav/${userID}/?limit=5`,
    token: token,
  });

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
    const timeUntilTomorrow = tomorrow - new Date();
    const timerId = setTimeout(updateDate, timeUntilTomorrow);
    // Clean up the timer when the component unmounts
    return () => {
      clearTimeout(timerId);
    };
  }, []);

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: theme.colors.background,
        paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
      }}
    >
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          flexDirection: "column",
        }}
      >
        <View
          style={{
            paddingHorizontal: 16,
            marginTop: 24,
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            height: 80,
          }}
        >
          <Text
            variant="headlineSmall"
            style={{
              fontWeight: "bold",
            }}
          >
            {t("Discover Melbourne", { ns: "home" })}
          </Text>
          <AccountCircleIcon
            fill={theme.colors.onBackground}
            height={40}
            width={40}
          />
        </View>
        <View>
          <AnimatedButton
            color={theme.colors.amberContainer}
            height={80}
            style={{
              marginHorizontal: 16,
              paddingHorizontal: 20,
              alignItems: "flex-end",
            }}
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
            <View
              style={{
                flex: 1,
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "flex-end",
              }}
            >
              <Text
                variant="headlineLarge"
                style={{
                  fontWeight: "bold",
                }}
              >
                17 C°
              </Text>
              <Text
                variant="bodySmall"
                style={{
                  fontWeight: "bold",
                }}
              >
                {t("Cloudy", { ns: "home" })}
              </Text>
            </View>
          </AnimatedButton>
        </View>
        <View>
          <Text
            variant="titleLarge"
            style={{
              fontWeight: "bold",
              marginHorizontal: 16,
              marginTop: 24,
            }}
          >
            {t("Start Here", { ns: "home" })}
          </Text>
          <View
            style={{
              marginTop: 16,
            }}
          >
            <AnimatedButton
              color={theme.colors.purpleContainer}
              onPress={() => {
                router.push("/route/activity");
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  flex: 1,
                  alignItems: "center",
                }}
              >
                <RouteIcon
                  style={{
                    marginHorizontal: 18,
                  }}
                  height={40}
                  width={40}
                  fill={theme.colors.onPurpleContainer}
                />
                <View
                  style={{
                    flexDirection: "column",
                    flex: 1,
                    alignItems: "flex-start",
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                    }}
                  >
                    <Text
                      variant="titleLarge"
                      style={{
                        color: theme.colors.onPurpleContainer,
                        fontWeight: "bold",
                      }}
                    >
                      {t("Plan my route", { ns: "home" })}
                    </Text>
                    <ArrowIcon
                      style={{
                        marginLeft: 8,
                      }}
                      fill={theme.colors.onPurpleContainer}
                    />
                  </View>
                  <Text
                    style={{
                      color: theme.colors.onPurpleContainer,
                    }}
                  >
                    {t("Plan your trip", { ns: "home" })}
                  </Text>
                </View>
              </View>
            </AnimatedButton>
          </View>
        </View>
        {routeList && Array.isArray(routeList) && (
          <View>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                marginTop: 24,
              }}
            >
              <Text
                variant="titleLarge"
                style={{
                  fontWeight: "bold",
                  marginHorizontal: 16,
                }}
              >
                {t("Route History", { ns: "home" })}
              </Text>
              <TouchableOpacity
                activeOpacity={0.6}
                onPress={() => {
                  /* handle action */
                }}
              >
                <Pressable>
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
                      onPress={() => {
                        router.push({
                          pathname: "/history/overview",
                          params: { routeJSON: JSON.stringify(routeList) },
                        });
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
              <Text
                variant="titleMedium"
                style={{
                  marginHorizontal: 16,
                  marginTop: 12,
                  marginBottom: 16,
                  fontWeight: "bold",
                  color: theme.colors.onSurfaceVariant,
                  // }}>{t("Wednesday", {ns: "home"})} 13 {t("July", {ns:"home"})}</Text>
                }}
              >
                {translatedDate}
              </Text>
              {routeList.map((result, index) => (
                <RouteCard
                  key={index}
                  routeResult={result}
                  isSimplified={true}
                />
              ))}
            </View>
          </View>
        )}

        {favRouteList && Array.isArray(routeList) && (
          <View>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                marginTop: 24,
              }}
            >
              <Text
                variant="titleLarge"
                style={{
                  fontWeight: "bold",
                  marginHorizontal: 16,
                }}
              >
                {t("Favorite Route", { ns: "home" })}
              </Text>
              <TouchableOpacity
                activeOpacity={0.6}
                onPress={() => {
                  /* handle action */
                }}
              >
                <Pressable>
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
                      onPress={() => {
                        router.push({
                          pathname: "/history/favourite",
                          params: {
                            favRouteJSON: JSON.stringify(favRouteList),
                          },
                        });
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
              {favRouteList.map((result, index) => (
                <RouteCard
                  key={index}
                  routeResult={result}
                  isSimplified={true}
                />
              ))}
            </View>
          </View>
        )}

        <View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginTop: 24,
            }}
          >
            <Text
              variant="titleLarge"
              style={{
                fontWeight: "bold",
                marginHorizontal: 16,
              }}
            >
              {/* {t("Beloved Routes", { ns: "home" })} */}
            </Text>
            <TouchableOpacity
              activeOpacity={0.6}
              onPress={() => {
                /* handle action */
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
                  style={{ color: theme.colors.primary, fontWeight: "bold" }}
                >
                  {/* {t("comm:More")} */}
                </Text>
                {/* <ArrowIcon width={22} height={22} fill={theme.colors.primary} /> */}
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
