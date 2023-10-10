import { useCallback, useState, useEffect } from "react";
import {
  SafeAreaView,
  StyleSheet,
  View,
  ScrollView,
  StatusBar,
  Platform,
  Pressable,
  TouchableOpacity,
  Share,
} from "react-native";
import { Button, Text, ActivityIndicator } from "react-native-paper";
import { useTranslation } from "react-i18next"; // <-- Import the hook
import { useTheme } from "react-native-paper";
import { router, useLocalSearchParams } from "expo-router";
import ArrowBackIcon from "../../assets/images/icons/arrow_back.svg";
import { useDispatch, useSelector } from "react-redux";
import { selectUserId, selectToken } from "../../store/authSlice";
import { refreshHome, selectIsLoading } from "../../store/appSlice";
import RouteCard from "../../components/RouteCard";
import { RequestOptions } from "../../api/fetch";
import useFetch from "../../hooks/useFetch";
import { RouteHistory } from "../../types/route";
import useEventScheduler from "../../hooks/useEventScheduler";

import * as Linking from "expo-linking";
import * as Sharing from "expo-sharing";
import { usePrintMap } from "../../hooks/usePrintMap";
import { AppDispatch } from "../../store";
import { useNotification } from "../../hooks/useNotification";

export default function HistoryOverviewScreen() {
  const theme = useTheme();
  const userID = useSelector(selectUserId);
  const loading = useSelector(selectIsLoading);
  const dispatch = useDispatch<AppDispatch>();
  const { pushNotification } = useNotification();

  const [routeList, refetchRouteList] = useFetch<RouteHistory[]>(
    {
      method: "GET",
      url: `/route/user/${userID}/?limit=10`,
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

  const handleFavRoute = async (route_id: number) => {
    try {
      await executeVote({ ...voteRequestOptions, url: `/vote/${route_id}/` });
    } catch (error) {
      return;
    } finally {
      dispatch(refreshHome());
      refetchRouteList();
    }
  };

  // get the initial url and share
  const shareUrl = async (route_id: number) => {
    Share.share({
      message: Linking.createURL("/", {
        queryParams: { routeid: route_id + "" },
      }),
    });
  };

  //publish
  const publishRequestOptions: RequestOptions = {
    method: "POST",
    url: `/route/publish/`,
  };

  const [, executePublish] = useFetch(
    publishRequestOptions,
    [],
    null,
    false,
    "Route Published"
  );

  const handlePublishRoute = (route_id: number) => {
    pushNotification({
      message: "Publishing...",
      type: "info",
    });
    executePublish({
      ...publishRequestOptions,
      url: `/route/publish/${route_id}/`,
    })
      .then(() => {
        refetchRouteList();
      })
      .catch((err) => {
        console.error("Error publishing the route:", err);
      });
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
          <Text style={styles.text_title}>Route History</Text>
        </View>
        <View style={{ width: 34, height: 34 }}></View>
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
            marginBottom: 20,
            paddingHorizontal: 16,
          }}
        >
          {routeList?.map((result, index) => (
            <RouteCard
              index={index}
              key={result.route.route_id}
              isSimplified={false}
              routeResult={result}
              onPressCard={() => handlePressCard(result)}
              handleFavRoute={handleFavRoute}
              voted={result.voted_by_user}
              shareUrl={shareUrl}
              handlePublishRoute={handlePublishRoute}
            />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
