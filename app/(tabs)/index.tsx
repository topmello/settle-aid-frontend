import React, {useRef, useState, useEffect} from "react";

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
import {Button, Text} from "react-native-paper";
import {useTranslation} from "react-i18next";
import AccountCircleIcon from "../../assets/images/icons/account_circle.svg";
import RouteIcon from "../../assets/images/icons/route.svg";
import ArrowIcon from "../../assets/images/icons/navigate_next.svg";
import RestaurantIcon from "../../assets/images/icons/restaurant_menu.svg";
import {AnimatedButton} from "../../components/AnimatedButton";
import {useTheme} from "react-native-paper";
import LightCloudyIcon from "../../assets/images/weather/light_cloudy.svg";
import PersonPinIcon from "../../assets/images/icons/person_pin.svg";

import {router} from "expo-router";
import {useSelector} from "react-redux";
import {selectToken, selectUserId} from "../../store/authSlice";
import RouteCard from "../../components/RouteCard";
import useFetch from "../../hooks/useFetch";
import {RouteHistory} from "../../types/route";
import {useAppTheme} from "../../theme/theme";

export default function HomeScreen() {
    const {t} = useTranslation();
    const theme = useAppTheme();
    const userID = useSelector(selectUserId);
    const token = useSelector(selectToken);

    const [currentDate, setCurrentDate] = useState(new Date());
    const [translatedDate, setTranslatedDate] = useState("");

    const getTranslatedDate = (date: Date) => {
        const dayName = t(date.toLocaleDateString("en-US", {weekday: "long"}), {
            ns: "home",
        });
        const day = date.getDate();
        const monthName = t(date.toLocaleDateString("en-US", {month: "long"}), {
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
        []
    );

    const [favRouteList, refetchFavRouteList] = useFetch<RouteHistory[]>(
        {
            method: "GET",
            url: `/route/user/fav/${userID}/?limit=5`,
            token: token,
        },
        []
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

    const styles = StyleSheet.create({
        safeAreaView: {
            flex: 1,
            paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
        },
        scrollView: {
            flexGrow: 1,
            flexDirection: 'column',
        },
        containerView:{
            marginRight:20,
            marginLeft:20,
            marginTop:10,
            marginBottom:10,
        },
        headerView: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            flex:1,
        },
        headerText: {
            fontWeight: 'bold',
        },
        animatedButton: {
            marginTop: 16,
            paddingHorizontal: 20,
            alignItems: 'flex-end',
        },
        weatherView: {
            flex: 1,
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'flex-end',
        },
        titleLarge: {
            fontWeight: 'bold',
            marginHorizontal: 20,
            marginTop: 24,
        },
        animatedButtonContainer: {
            marginTop: 16,
        },
        animatedButtonInner: {
            flexDirection: 'row',
            flex: 1,
            alignItems: 'center',
        },
        iconStyle: {
            // marginHorizontal: 18,
        },
        columnFlexStart: {
            flexDirection: 'column',
            flex: 1,
            alignItems: 'flex-start',
        },
        rowSpaceBetween: {
            flexDirection: 'row',
            justifyContent: 'space-between',
        },
        moreText: {
            color: theme.colors.primary,
            fontWeight: 'bold',
        },
        moreIcon: {
            marginTop: 2,
        },
        historySection: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: 24,
        },
        dateText: {
            marginHorizontal: 16,
            marginTop: 12,
            marginBottom: 16,
            fontWeight: 'bold',
        },
        favoriteSection: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: 24,
        },
    });


    return (
        <SafeAreaView style={[styles.safeAreaView, {backgroundColor: theme.colors.background}]}>
            <ScrollView contentContainerStyle={styles.scrollView}>
                <View style={[styles.headerView, styles.containerView]}>
                    <Text variant="headlineSmall" style={styles.headerText}>
                        {t("Discover Melbourne", { ns: "home" })}
                    </Text>
                    <AccountCircleIcon
                        fill={theme.colors.onBackground}
                        height={40}
                        width={40}
                    />
                </View>
                <View style={styles.containerView}>
                    <AnimatedButton
                        color={(theme.colors as any).amberContainer}
                        height={80}
                        style={styles.animatedButton}
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
                            <Text variant="headlineLarge"style={styles.headerText}>
                                17 C°
                            </Text>
                            <Text variant="bodySmall" style={styles.headerText}>
                                {t("Cloudy", { ns: "home" })}
                            </Text>
                        </View>
                    </AnimatedButton>
                </View>
                <View>
                    <Text variant="headlineSmall" style={styles.titleLarge}>
                        {t("Start Here", { ns: "home" })}
                    </Text>
                    <View style={styles.containerView}>
                        <AnimatedButton
                            color={(theme.colors as any).purpleContainer}
                            style={styles.animatedButton}
                            onPress={() => {
                                router.push("/route/activity");
                            }}
                        >
                            <View style={styles.animatedButtonInner}>
                                <RouteIcon
                                    style={styles.iconStyle}
                                    height={40}
                                    width={40}
                                    fill={(theme.colors as any).onPurpleContainer}
                                />
                                <View style={styles.columnFlexStart}>
                                    <View style={styles.rowSpaceBetween}>
                                        <Text variant="headlineMedium" style={styles.headerText}>
                                            {t("Plan my route", { ns: "home" })}
                                        </Text>
                                        <ArrowIcon style={styles.moreIcon} fill={(theme.colors as any).onPurpleContainer} />
                                    </View>
                                    <Text style={{color: (theme.colors as any).onPurpleContainer}}>
                                        {t("Plan your trip", { ns: "home" })}
                                    </Text>
                                </View>
                            </View>
                        </AnimatedButton>
                        <AnimatedButton
                            height={76}
                            color={(theme.colors as any).amberContainer}
                            onPress={() => {router.push("/track/track");}}
                            style={styles.animatedButton}
                        >
                            <View style={styles.animatedButtonInner}>
                                <PersonPinIcon
                                    height={40}
                                    width={40}
                                    fill={(theme.colors as any).onAmberContainer}
                                />
                                <View style={styles.columnFlexStart}>
                                    <View style={styles.rowSpaceBetween}>
                                        <Text variant="titleLarge" style={[styles.headerText, {color: theme.colors.onAmberContainer}]}>
                                            {t("Location Sharing", { ns: "home" })}
                                        </Text>
                                        <ArrowIcon style={styles.moreIcon} fill={(theme.colors as any).onAmberContainer} />
                                    </View>
                                </View>
                            </View>
                        </AnimatedButton>
                    </View>
                </View>
                {routeList && Array.isArray(routeList) && (
                    <View>
                        <View style={styles.historySection}>
                            <Text style={styles.titleLarge}>
                                {t("Route History", { ns: "home" })}
                            </Text>
                            <TouchableOpacity
                                activeOpacity={0.6}
                                onPress={() => {
                                    /* handle action */
                                }}
                            >
                                <Pressable>
                                    <View style={{
                                        alignItems: "center",
                                        marginRight: 30,
                                        marginTop: 10,
                                        flexDirection: "row",
                                    }}>
                                        <Text style={styles.moreText}>
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
                  gap: 8,
                  marginVertical: 16,
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

            <View style={{
              marginVertical: 16,
            }}>
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
