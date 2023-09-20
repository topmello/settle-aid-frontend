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
} from "react-native";
import { Button, Text } from "react-native-paper";
import { useTranslation } from "react-i18next"; // <-- Import the hook
import { useTheme } from "react-native-paper";
import { router, useLocalSearchParams, useRouter } from "expo-router";
import ArrowBackIcon from "../../assets/images/icons/arrow_back.svg";
import { useSelector } from "react-redux";
import { selectUserId, selectToken } from "../../store/authSlice";
import RouteCard from "../../components/RouteCard";
import { RequestOptions } from "../../api/fetch";
import useFetch from "../../hooks/useFetch";
import { RouteHistory } from "../../types/route";
import { ErrorResponse, CustomError } from "../../types/errorResponse";

export default function HistoryOverviewScreen() {
  const { t } = useTranslation();
  const theme = useTheme();
  const userID = useSelector(selectUserId);
  const token = useSelector(selectToken);

  const [favRouteList, refetchFavRouteList] = useFetch<RouteHistory[]>(
    {
      method: "GET",
      url: `/route/user/fav/${userID}/?limit=10`,
      token: token,
    },
    [token]
  );

  const voteRequestOptions: RequestOptions = {
    method: "POST",
    url: `/vote/`,
    token: token,
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
      await executeVote({ ...voteRequestOptions, url: `/vote/${route_id}` });
    } catch (error) {
    } finally {
      refetchFavRouteList();
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
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          flexDirection: "column",
        }}
      >
        <View style={styles.row_text}>
          <Pressable onPress={() => router.back()}>
            <ArrowBackIcon
              fill={theme.colors.onPrimaryContainer}
              width={28}
              height={28}
            />
          </Pressable>
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={styles.text_title}>Favorite Routes</Text>
          </View>
        </View>

        <View
          style={{
            gap: 12,
            marginHorizontal: 16,
            marginBottom: 20,
          }}
        >
          {favRouteList?.map((result, index) => (
            <RouteCard
              index={index}
              key={result.route.route_id}
              routeResult={result}
              isSimplified={false}
              handleFavRoute={handleFavRoute}
              voted={result.voted_by_user}
            />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
