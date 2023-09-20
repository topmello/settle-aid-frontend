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
      await executeVote({ ...voteRequestOptions, url: `/vote/${route_id}` });
    } catch (error) {
      return;
    } finally {
      refetchRouteList();
    }
  };

  const {
    isDatePickerVisible,
    showDatePicker,
    hideDatePicker,
    handleDateConfirm,
  } = useEventScheduler();

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
              key={result.route.route_id}
              isSimplified={false}
              routeResult={result}
              handleFavRoute={handleFavRoute}
              voted={result.voted_by_user}
              isDatePickerVisible={isDatePickerVisible}
              showDatePicker={showDatePicker}
              hideDatePicker={hideDatePicker}
              handleDateConfirm={handleDateConfirm}
            />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
