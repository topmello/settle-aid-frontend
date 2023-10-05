import { useCallback, useState, useEffect } from "react";
import {
  SafeAreaView,
  StyleSheet,
  View,
  ScrollView,
  StatusBar,
  Platform,
  Pressable,
} from "react-native";
import { Button, Text, ActivityIndicator } from "react-native-paper";
import { useTranslation } from "react-i18next"; // <-- Import the hook
import { useTheme } from "react-native-paper";
import { router, useLocalSearchParams } from "expo-router";
import ArrowBackIcon from "../../assets/images/icons/arrow_back.svg";
import { useSelector } from "react-redux";
import { selectUserId, selectToken } from "../../store/authSlice";
import { selectIsLoading } from "../../store/appSlice";
import RouteCard from "../../components/RouteCard";
import { RequestOptions } from "../../api/fetch";
import useFetch from "../../hooks/useFetch";
import { RouteHistory } from "../../types/route";
import useEventScheduler from "../../hooks/useEventScheduler";

import * as Linking from "expo-linking";
import * as Sharing from "expo-sharing";

export default function HistoryOverviewScreen() {
  const { t } = useTranslation();
  const theme = useTheme();
  const userID = useSelector(selectUserId);
  const loading = useSelector(selectIsLoading);

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

  const handleFavRoute = async (route_id: number) => {
    try {
      await executeVote({ ...voteRequestOptions, url: `/vote/${route_id}/` });
    } catch (error) {
      return;
    } finally {
      refetchRouteList();
    }
  };

  // get the initial url and share
  const shareUrl = async (route_id: number) => {
    const initialUrl = await Linking.getInitialURL();
    console.log(initialUrl + "/?routeid=" + route_id);
    const url = initialUrl + "/?routeid=" + route_id;

    try {
      await Sharing.shareAsync(url);
      console.log("Shared successfully");
    } catch (error) {
      console.error("Error while sharing:", error);
    }
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

  const handlePublishRoute = async (route_id: number) => {
    try {
      await executePublish({ ...publishRequestOptions, url: `/route/publish/${route_id}/` });
    } catch (error) {
      console.error("Error publishing the route:", error);
    } finally {
      refetchRouteList(); // Optional: You can refetch the routes if necessary
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
        <Pressable onPress={() => router.back()}>
          <ArrowBackIcon
            fill={theme.colors.onPrimaryContainer}
            width={28}
            height={28}
          />
        </Pressable>
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
            gap: 12,
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
