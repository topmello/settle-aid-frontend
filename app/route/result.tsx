import { useState, useMemo, useRef, useCallback, useEffect } from "react";
import { useSelector } from "react-redux";
import { router } from "expo-router";
import { StyleSheet, Dimensions, SafeAreaView } from "react-native";
import { View, Pressable } from "react-native";
import { Text, useTheme, Button, ActivityIndicator } from "react-native-paper";
import MapView, { Marker, Polyline } from "react-native-maps";

import ResultOverlay from "../../components/ResultOverlay";
import { RootState } from "../../store";

import useFetch from "../../hooks/useFetch";
import { MapRegion, getMapRegion, Coordinates } from "../../hooks/getMapRegion";
import useCheckedList from "../../hooks/useCheckList";

import { RequestOptions } from "../../api/fetch";

import { selectUserToken } from "../../store/authSlice";
import { RouteState, selectRouteState } from "../../store/routeSlice";

import ArrowBackIcon from "../../assets/images/icons/arrow_back.svg";

import tips, { Tip } from "../../tips/tipsTyped";
import findTipsForModes from "../../tips/tipFinder";

import { RouteResult } from "../../types/route";
import { locationIcons } from "../../constants/icons";
import { mapDarkTheme } from "../../theme/map";
import { selectTheme } from "../../store/appSlice";

import { fetch } from "../../api/fetch";
import { useSession } from "../../hooks/useSession";
import { useNotification } from "../../hooks/useNotification";
import { useTranslation } from "react-i18next";
import session from "redux-persist/lib/storage/session";

export default function MapScreen() {
  const theme = useTheme();
  const { t } = useTranslation();
  const { token, authenticated, refreshSession, sessionRefreshing } = useSession();
  const currentTheme = useSelector(selectTheme);
  const routeState: RouteState = useSelector(selectRouteState);
  const { pushNotification } = useNotification();

  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<RouteResult | null>(null);
  const [region, setRegion] = useState<MapRegion | undefined>(undefined);
  const [handleLocationSelect, setHandleLocationSelect] = useState<any>(null);
  const [handlePressRoute, setHandlePressRoute] = useState<any>(null);
  const mapRef = useRef<MapView>(null);
  const { checked, handlePress } = useCheckedList(data);

  const modes: Array<string> = [
    "Walk",
    "Local",
    "Cultural Enjoyment",
    "Greeting and Interaction",
    "Personal Safety",
  ];

  const tipList: Array<Tip> = findTipsForModes(tips, modes);

  const fetchRoute = useCallback(async () => {
    if (!authenticated && sessionRefreshing) {
      return;
    } else {
      setLoading(true);
      let res = null;
      try {
        res = await fetch({
          method: "POST",
          url: "/search/v2/route/",
          data: routeState,
          token: token,
        });
      } catch (err) {
        console.error("here", err);
      } finally {
        if (res !== null) {
          setData(res.data);
          const { region, handleLocationSelect, handlePressRoute } = getMapRegion(
            res.data,
            routeState,
            mapRef
          );
          setRegion(region);
          setHandleLocationSelect(handleLocationSelect);
          setHandlePressRoute(handlePressRoute);
        }
        setLoading(false);
      }
    }
  }, [routeState, authenticated, refreshSession, sessionRefreshing]);


  // authenication check
  useEffect(() => {
    if (!authenticated) {
      pushNotification({
        message: t("Login required", { ns: "acc" }),
      });
      router.replace("/auth/login");
    }
  }, [authenticated]);

  // fetch route
  useEffect(() => {
    refreshSession();
    fetchRoute();
  }, []);

  // loading screen
  if (loading) {
    return (
      <SafeAreaView
        style={[
          styles.container,
          {
            backgroundColor: theme.colors.primaryContainer,
            justifyContent: "center",
            alignItems: "center",
          },
        ]}
      >
        <ActivityIndicator size="large" />
      </SafeAreaView>
    );
  }

  // no location found screen
  if (
    data === null ||
    region === undefined ||
    handleLocationSelect === null ||
    handlePressRoute === null
  ) {
    return (
      <SafeAreaView style={[styles.container, {
        backgroundColor: theme.colors.primaryContainer,
        justifyContent: "center",
        alignItems: "center",
        gap: 16,
      },]}>
        <Text variant="titleLarge">No location found</Text>
        <Button
          mode="contained"
          style={[styles.button]}
          onPress={() => {
            router.back();
          }}
        >
          Back
        </Button>
        <Button
          mode="contained"
          style={[styles.button]}
          onPress={() => {
            router.replace("/(tabs)");
          }}
        >
          Home
        </Button>
      </SafeAreaView>
    );
  }

  // main screen
  return (
    <SafeAreaView style={styles.container}>
      <View
        style={{
          marginTop: 32,
          width: "100%",
          flexDirection: "row",
          justifyContent: "space-between",
          padding: 20,
        }}
      >
        {router.canGoBack() ? (
          <Pressable
            onPress={() => router.back()}
            style={[styles.above, {
              backgroundColor: theme.colors.primaryContainer,
              borderRadius: 20,
              width: 40,
              height: 40,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }]}
          >
            <ArrowBackIcon
              fill={theme.colors.onPrimaryContainer}
              width={34}
              height={34}
            />
          </Pressable>
        ) : (
          <View></View>
        )}
        <Button mode="contained" style={[styles.above, styles.button]} onPress={fetchRoute}>
          Re-plan
        </Button>
      </View>

      <MapView
        customMapStyle={currentTheme === "dark" ? mapDarkTheme : []}
        ref={mapRef}
        style={styles.map}
        initialRegion={region}
        scrollEnabled={true}
        pitchEnabled={true}
        rotateEnabled={true}
      >
        {data?.locations_coordinates
          .filter((_, index) => index !== 0)
          .map((location: Coordinates, index: number) => {
            return (
              <Marker
                key={index}
                coordinate={location}
                title={data.locations[index]}
                pinColor={"red"}
                description=""
              />
            );
          })}
        {region && (
          <Marker coordinate={region} pinColor="blue" title="You are here" />
        )}
        <Polyline
          coordinates={data?.route}
          strokeWidth={3}
          strokeColor="rgba(227, 66, 52, 0.7)"
          lineDashPattern={[1, 5]}
        />
      </MapView>

      <ActivityIndicator animating={loading} size="large" />

      <ResultOverlay
        tipList={tipList}
        data={data}
        body={routeState}
        handleLocationSelect={handleLocationSelect}
        handlePressRoute={handlePressRoute}
        handlePress={handlePress}
        checked={checked}
        styles={styles}
        locationIcons={locationIcons}
      />
    </SafeAreaView>
  );
}

const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  above: {
    zIndex: 1,
  },
  button: {
    width: width * 0.3,
    alignItems: "center",
  },
});
