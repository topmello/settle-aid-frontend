import { useCallback, useState, useEffect } from "react";
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
  Share,
} from "react-native";
import { Button, Text, ActivityIndicator } from "react-native-paper";
import { useTranslation } from "react-i18next"; // <-- Import the hook
import { useTheme } from "react-native-paper";
import { router } from "expo-router";
import ArrowBackIcon from "../../assets/images/icons/arrow_back.svg";
import { useDispatch, useSelector } from "react-redux";
import { selectUserId, selectToken } from "../../store/authSlice";
import { refreshHome, selectIsLoading } from "../../store/appSlice";
import RouteCard from "../../components/RouteCard";
import { RequestOptions } from "../../api/fetch";
import useFetch from "../../hooks/useFetch";
import { RouteHistory } from "../../types/route";
import { AppDispatch } from "../../store";
import * as Linking from "expo-linking";
import { useAchievement } from "../../hooks/useAchievement";
import { setRouteHistory } from "../../store/routeHistorySlice";

export default function HistoryOverviewScreen() {
  const theme = useTheme();
  const dispatch = useDispatch<AppDispatch>();
  const userID = useSelector(selectUserId);
  const loading = useSelector(selectIsLoading);
  const achieve = useAchievement();
  const { t } = useTranslation();

  const [favRouteList, refetchFavRouteList] = useFetch<RouteHistory[]>(
    {
      method: "GET",
      url: `/route/feed/user/fav/${userID}/?limit=10`,
    },
    [userID]
  );

  const voteRequestOptions: RequestOptions = {
    method: "POST",
    url: `/vote/`,
  };

  const [, executeVote] = useFetch(
    voteRequestOptions,
    [],
    null,
    false,
    "Added to favourites"
  );

  const handleFavRoute = async (route_id: number) => {
    try {
      await executeVote({ ...voteRequestOptions, url: `/vote/${route_id}/` });
    } catch (error) {
    } finally {
      dispatch(refreshHome());
      refetchFavRouteList();
    }
  };

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
      <ActivityIndicator
        style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}
        animating={loading}
        size="large"
      />
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
            {t("Favourite Routes", { ns: "favourite" })}
          </Text>
        </View>
      </View>
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          flexDirection: "column",
        }}
      >
        <View
          style={{
            gap: 10,
            marginHorizontal: 16,
            marginBottom: 20,
          }}
        >
          {favRouteList?.map((result, index) => (
            <RouteCard
              index={index}
              isSimplified={false}
              key={result.route.route_id}
              routeResult={result}
              handleFavRoute={handleFavRoute}
              voted={result.voted_by_user}
              shareUrl={shareUrl}
              onPressCard={() => handlePressCard(result)}
            />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
