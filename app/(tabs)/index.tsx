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
} from "react-native";
import { Button, Text } from "react-native-paper";
import { useTranslation } from "react-i18next"; // <-- Import the hook
import { FONTS } from "../../assets/constant/constant";
import AccountCircleIcon from "../../assets/images/icons/account_circle.svg";
import RouteIcon from "../../assets/images/icons/route.svg";
import ArrowIcon from "../../assets/images/icons/navigate_next.svg";
import RestaurantIcon from "../../assets/images/icons/restaurant_menu.svg";
import { AnimatedButton } from "../../components/AnimatedButton";
import { useTheme } from "react-native-paper";
import LightCloudyIcon from "../../assets/images/weather/light_cloudy.svg";
import { router } from "expo-router";
import { selectUserToken } from "../../store/authSlice";
import { useSelector } from "react-redux";

export default function HomeScreen() {
  const { t } = useTranslation();
  const theme = useTheme();
  const token = useSelector(selectUserToken);
  //onclick for startCard
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

  // remove the login restriction for now
  useEffect(() => {
    if (!token) {
      setTimeout(() => {
        router.replace("/common/language");
      }, 1000);
    }
  }, [token]);

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
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
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
                  <Text
                    variant="titleLarge"
                    style={{
                      color: theme.colors.onPurpleContainer,
                      fontWeight: "bold",
                    }}
                  >
                    {t("Embrace Melbourne", { ns: "home" })}
                  </Text>
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
              <View
                style={[
                  styles.flexRow,
                  { alignItems: "center", marginRight: 30, marginTop: 10 },
                ]}
              >
                <Text
                  style={{ color: theme.colors.primary, fontWeight: "bold" }}
                >
                  {t("comm:More")}
                </Text>
                <ArrowIcon width={22} height={22} fill={theme.colors.primary} />
              </View>
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
            <AnimatedButton
              height={100}
              color={theme.colors.successContainer}
              onPress={handleStartClick}
            >
              <View
                style={{
                  flex: 1,
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <View
                  style={{
                    width: 46,
                    height: 46,
                    borderRadius: 25,
                    backgroundColor: theme.colors.onSuccessContainer,
                    alignItems: "center",
                    justifyContent: "center",
                    marginLeft: 20,
                  }}
                >
                  <RestaurantIcon
                    width={36}
                    height={36}
                    style={{
                      fill: theme.colors.successContainer,
                    }}
                  />
                </View>
                <View
                  style={{
                    flexDirection: "column",
                    flex: 1,
                    alignItems: "flex-start",
                    paddingHorizontal: 20,
                  }}
                >
                  <Text
                    variant="titleLarge"
                    style={{
                      color: theme.colors.onSuccessContainer,
                      fontWeight: "bold",
                    }}
                  >
                    {/* {t("Dining", {ns: "home"})} */}
                    {t("History Function Coming Soon", { ns: "home" })}
                  </Text>
                  <Text
                    style={{
                      color: theme.colors.onSuccessContainer,
                    }}
                  >
                    {/* #india #relax #culture */}
                  </Text>
                </View>
              </View>
            </AnimatedButton>
          </View>
        </View>

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
                style={[
                  styles.flexRow,
                  { alignItems: "center", marginRight: 30, marginTop: 10 },
                ]}
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

const styles = StyleSheet.create({
  scrollViewContent: {
    flexGrow: 1,
    flexDirection: "column",
  },
  title: {
    marginTop: 30,
    marginLeft: 30,
    marginBottom: 0,
    flex: 3,
    fontSize: FONTS.Large,
    fontWeight: "bold",
    margin: 10,
  },
  iconAccount: {
    marginTop: 30,
    marginRight: 30,
    marginLeft: 20,
    marginBottom: 18,
    width: 40,
    height: 40,
  },
  titleSecond: {
    marginTop: 20,
    marginLeft: 20,
    marginBottom: 0,
    height: 30,
    fontSize: FONTS.Mid,
    fontWeight: "bold",
    margin: 10,
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
  rowHistory: {
    marginVertical: 10,
  },
  colorViolet: {
    backgroundColor: "#DEE1FF",
  },
  colorYellow: {
    backgroundColor: "#FFEB3B",
  },
  flexRow: {
    flexDirection: "row",
  },
  flexColumn: {
    flexDirection: "column",
  },
  iconNav: {
    width: 50,
    height: 50,
    fill: "#5B4E77",
    marginLeft: 20,
  },
  iconHistory: {
    width: 35,
    height: 35,
    fill: "#5B4E77",
  },

  // Text Styles
  title: {
    marginTop: 30,
    marginLeft: 30,
    marginBottom: 0,
    flex: 3,
    fontSize: FONTS.Large,
    fontWeight: "bold",
    margin: 10,
  },
  titleSecond: {
    marginTop: 20,
    marginLeft: 20,
    marginBottom: 0,
    height: 30,
    fontSize: FONTS.Mid,
    fontWeight: "bold",
    margin: 10,
  },
  textStartCard: {
    marginTop: 40,
    marginLeft: 20,
    height: 30,
    fontSize: FONTS.Large,
    flex: 3,
    fontWeight: "bold",
  },
  textBelovedCard: {
    marginTop: 20,
    marginLeft: 20,
    height: 30,
    fontSize: FONTS.Large,
    fontWeight: "bold",
  },
  textStartCardInfo: {
    marginBottom: 30,
    marginLeft: 20,
    color: "#5B4E77",
  },
  textDate: {
    marginTop: 0,
    marginLeft: 20,
    marginBottom: 5,
    height: 20,
    fontSize: FONTS.Mid,
    fontWeight: "bold",
    color: "#46464F",
  },
  textMore: {
    color: "#1436B8",
    marginTop: 12,
    textAlign: "right",
    height: 30,
    fontSize: FONTS.Small,
    fontWeight: "bold",
  },

  // Icon Styles
  iconAccount: {
    marginTop: 30,
    marginRight: 30,
    marginLeft: 20,
    marginBottom: 18,
    width: 40,
    height: 40,
  },
  iconNav: {
    width: 50,
    height: 50,
    fill: "#5B4E77",
    marginLeft: 20,
  },
  iconHistory: {
    width: 35,
    height: 35,
    fill: "#5B4E77",
  },
  iconArrow: {
    alignSelf: "top",
    marginTop: 10,
    width: 20,
    height: 20,
    fill: "#1436B8",
    resizeMode: "contain",
  },
  iconHistoryWrapper: {
    width: 40,
    height: 40,
    borderRadius: 25,
    backgroundColor: "#FFFFCC",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 30,
  },

  // Color Styles
  colorViolet: {
    backgroundColor: "#DEE1FF",
  },
  colorYellow: {
    backgroundColor: "#FFEB3B",
  },
});
