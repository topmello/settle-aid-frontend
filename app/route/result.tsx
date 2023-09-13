import { useState, useMemo, useRef } from "react";
import { useSelector } from "react-redux";
import { router } from "expo-router";
import { StyleSheet, Dimensions, SafeAreaView } from "react-native";
import { View, Pressable } from "react-native";
import { Text, useTheme, Button, ActivityIndicator } from "react-native-paper";
import MapView, { Marker, Polyline } from "react-native-maps";

import ResultOverlay from "../../components/ResultOverlay";
import { RootState } from "../../store";

import useFetch from "../../hooks/useFetch";
import useMapRegion, { Coordinates } from "../../hooks/useMapRegion";
import useCheckedList from "../../hooks/useCheckList";

import { RequestOptions } from "../../api/fetch";

import { selectUserToken } from "../../store/authSlice";
import { RouteState, selectRouteState } from "../../store/routeSlice";

import ArrowBackIcon from "../../assets/images/icons/arrow_back.svg";

import tips, { Tip } from "../../tips/tipsTyped";
import findTipsForModes from "../../tips/tipFinder";

import { RouteResult } from "../../types/route";
import { locationIcons } from "../../constants/icons";

export default function MapScreen() {
  const theme = useTheme();
  const token = useSelector(selectUserToken);

  const { isLoading, isFail } = useSelector((state: RootState) => state.app);

  const routeState: RouteState = useSelector(selectRouteState);

  const modes: Array<string> = [
    "Walk",
    "Local",
    "Cultural Enjoyment",
    "Greeting and Interaction",
    "Personal Safety",
  ];

  const tipList: Array<Tip> = findTipsForModes(tips, modes);

  const [triggerFetch, setTriggerFetch] = useState(0);

  const handleTriggerFetch = () => {
    setTriggerFetch((prev) => prev + 1);
  };

  const req: RequestOptions = useMemo(() => {
    return {
      method: "POST",
      url: "/search/route/",
      data: routeState,
      token: token,
    };
  }, [JSON.stringify(routeState), triggerFetch]);

  const data: RouteResult = useFetch(req, [triggerFetch]);

  const mapRef = useRef<MapView>(null);

  const { region, handleLocationSelect, handlePressRoute } = useMapRegion(
    data,
    routeState,
    mapRef
  );

  const { checked, handlePress } = useCheckedList(data);

  if (isLoading && data === null) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" />
      </SafeAreaView>
    );
  }

  if (token === null) {
    return (
      <SafeAreaView style={styles.container}>
        <Text variant="titleLarge">Please login</Text>
        <Button
          mode="contained"
          style={[styles.button]}
          onPress={() => {
            router.replace("/auth/login");
          }}
        >
          Login
        </Button>
      </SafeAreaView>
    );
  }

  if (data === null) {
    return (
      <SafeAreaView style={styles.container}>
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

  return (
    <SafeAreaView style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={region}
        scrollEnabled={true}
        pitchEnabled={true}
        rotateEnabled={true}
        mapPadding={{ top: 0, left: 0, right: 0, bottom: 150 }}
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
          <Pressable onPress={() => router.back()} style={{
            backgroundColor: theme.colors.primaryContainer,
            borderRadius: 20,
            width: 40,
            height: 40,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}>
            <ArrowBackIcon
              fill={theme.colors.onPrimaryContainer}
              width={34}
              height={34}
            />
          </Pressable>
        ) : (
          <View></View>
        )}
        <Button
          mode="contained"
          style={styles.button}
          onPress={handleTriggerFetch}
        >
          Re-plan
        </Button>
      </View>
      <View style={{ flex: 1 }} />
      <ActivityIndicator animating={isLoading} size="large" />
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
    alignItems: "center",
    justifyContent: "center",
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  card: {
    width: width * 0.99,
    height: height * 0.5,
    padding: 0,
    margin: 0,
    borderRadius: 20,
  },
  flatListCard: {
    width: width * 0.7,
    marginTop: 10,
    marginBottom: 20,
    padding: 0,
    paddingRight: 20,
  },
  button: {
    width: width * 0.3,
    alignItems: "center",
  },
});
