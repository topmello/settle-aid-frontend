import { useState, useEffect, useRef } from "react";
import {
  SafeAreaView,
  StyleSheet,
  View,
  ScrollView,
  StatusBar,
  Platform,
  TouchableOpacity,
  Share,
} from "react-native";
import { Text, ActivityIndicator } from "react-native-paper";
import { useTranslation } from "react-i18next";
import { useTheme } from "react-native-paper";
import { router } from "expo-router";
import ArrowBackIcon from "../../assets/images/icons/arrow_back.svg";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../store";
import { selectUserId } from "../../store/authSlice";
import { selectIsLoading } from "../../store/appSlice";
import RouteCard from "../../components/RouteCard";
import useFetch from "../../hooks/useFetch";
import { RouteHistory } from "../../types/route";
import * as Linking from "expo-linking";
import usePaginateRoute from "../../hooks/usePaginateRoute";
import { useAchievement } from "../../hooks/useAchievement";
import { setRouteHistory } from "../../store/routeHistorySlice";

export default function SharedOverviewScreen() {
  useTranslation();
  const theme = useTheme();
  const loading = useSelector(selectIsLoading);
  const achieve = useAchievement();
  const { t } = useTranslation();

  const dispatch = useDispatch<AppDispatch>();

  const [accumulatedRouteList, handleScroll, handleFavRoute] = usePaginateRoute(
    `/route/feed/top_routes/`,
    6
  );

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

  const shareUrl = async (route_id: number): Promise<void> => {
    try {
      await Share.share({
        message: Linking.createURL("/route/result", {
          queryParams: { routeId: route_id + "" },
        }),
      });
      achieve("routeShared");
    } catch (error) {
      console.log(error);
      return;
    }
  };

  useEffect(() => {
    achieve("accessedGlobalFeed");
  }, []);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
    },
    row_text: {
      paddingHorizontal: 16,
      paddingVertical: 8,
      marginTop: 16,
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      height: 56,
    },
    text_title: {
      fontSize: 24,
    },
    card: {
      backgroundColor: (theme.colors as any).infoContainer,
      // height: 200,
      borderRadius: 15,
      marginHorizontal: 20,
    },
    card_title: {
      fontWeight: "bold",
      fontSize: 28,
      marginTop: 20,
      marginLeft: 20,
      color: (theme.colors as any).info,
    },
    card_description: {
      fontSize: 20,
      marginLeft: 20,
      marginRight: 20,
      marginTop: 8,
      marginBottom: 8,
      overflow: "hidden",
      whiteSpace: "nowrap",
      textOverflow: "ellipsis",
    },
    tags_container: {
      flexDirection: "row",
      marginLeft: 20,
      marginBottom: 16,
      marginTop: 2,
    },
    tag: {
      fontSize: 18,
      marginRight: 8,
    },
    button_container: {
      flexDirection: "row",
      marginLeft: 20,
      marginRight: 16,
      marginTop: 16,
      marginBottom: 20,
    },
    circle: {
      marginRight: 10,
      width: 44,
      height: 44,
      borderRadius: 42,
      backgroundColor: (theme.colors as any).info,
    },
    button: {
      marginLeft: 8,
      marginRight: 8,
      width: 110,
    },
  });

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: theme.colors.background,
        paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
      }}
    >
      <View style={styles.row_text}>
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowBackIcon
            fill={theme.colors.onBackground}
            width={28}
            height={28}
          />
        </TouchableOpacity>
        <View style={{ flex: 1, marginLeft: 12 }}>
          <Text style={styles.text_title}>
            {t("Community Routes", { ns: "home" })}
          </Text>
        </View>
        <View style={{ width: 34, height: 34 }}></View>
      </View>
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          flexDirection: "column",
        }}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        <View
          style={{
            gap: 10,
            marginBottom: 20,
            paddingHorizontal: 16,
          }}
        >
          {accumulatedRouteList?.map((result, index) => (
            <RouteCard
              index={index}
              key={result.route.route_id}
              isSimplified={false}
              routeResult={result}
              onPressCard={() => {
                handlePressCard(result);
              }}
              handleFavRoute={handleFavRoute}
              voted={result.voted_by_user}
              shareUrl={shareUrl}
            />
          ))}
        </View>
        <ActivityIndicator
          animating={loading}
          size="large"
          style={{
            marginTop: 20,
            marginBottom: 36,
          }}
        />
      </ScrollView>
    </SafeAreaView>
  );
}
