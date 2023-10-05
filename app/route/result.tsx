import { useState, useRef, useCallback, useEffect } from "react";
import { useSelector } from "react-redux";
import { router, useLocalSearchParams } from "expo-router";
import { SafeAreaView, Platform, View, Pressable } from "react-native";
import {
  Appbar,
  Menu,
  Text,
  useTheme,
  Button,
  ActivityIndicator,
  IconButton,
} from "react-native-paper";
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from "react-native-maps";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import ResultOverlay from "../../components/ResultOverlay";
import useCheckedList from "../../hooks/useCheckList";
import { RouteState, selectRouteState } from "../../store/routeSlice";
import ArrowBackIcon from "../../assets/images/icons/arrow_back.svg";
import tips, { Tip } from "../../tips/tipsTyped";
import getTipForMode from "../../tips/getTip";

import { locationIcons } from "../../constants/icons";
import { mapDarkTheme } from "../../theme/map";
import { selectTheme } from "../../store/appSlice";
import { RequestOptions } from "../../api/fetch";
import useFetch from "../../hooks/useFetch";
import { useMapRegion, Coordinates } from "../../hooks/useMapRegion";
import useEventScheduler from "../../hooks/useEventScheduler";
import generatePDF from "../../utils/generatePDF";
import { Route, RouteGetResult } from "../../types/route";
import { selectIsLoading } from "../../store/appSlice";
import { GestureHandlerRootView } from "react-native-gesture-handler";

const MORE_ICON = Platform.OS === "ios" ? "dots-horizontal" : "dots-vertical";

export default function MapScreen() {
  const theme = useTheme();
  const currentTheme = useSelector(selectTheme);
  const routeState: RouteState = useSelector(selectRouteState);
  const loading = useSelector(selectIsLoading);

  const route_id_ = useLocalSearchParams().route_id;
  const [useHistory, setUseHistory] = useState(true);

  const [data, setData] = useState<Route>({
    route_id: 0,
    locations: [],
    locations_coordinates: [
      {
        latitude: 0,
        longitude: 0,
      },
    ],
    route: [
      {
        latitude: 0,
        longitude: 0,
      },
    ],
    instructions: [],
    duration: 0,
  });

  const {
    isDatePickerVisible,
    showDatePicker,
    hideDatePicker,
    handleDateConfirm,
  } = useEventScheduler();

  const [menuVisible, setMenuVisible] = useState(false);
  const openMenu = () => setMenuVisible(true);
  const closeMenu = () => setMenuVisible(false);

  const { checked, handlePress } = useCheckedList(data);

  const modes: Array<string> = [
    "Walk",
    "Local",
    "Cultural Enjoyment",
    "Greeting and Interaction",
    "Personal Safety",
  ];

  const tipList: Array<Tip> = getTipForMode(tips, modes);

  const [dataFromFetch, fetchData] = useFetch<Route>(
    {
      method: "POST",
      url: "/search/v2/route/",
      data: routeState,
    },
    [routeState],
    data,
    false
  );

  const [routeDataFromHistory, fetchRouteDataFromHistory] =
    useFetch<RouteGetResult>(
      {
        method: "GET",
        url: `/route/${route_id_}`,
      },
      [route_id_],
      { num_votes: 0, route: data },
      false
    );

  const mapRef = useRef<MapView>(null);

  const { region, handleLocationSelect, handlePressRoute } = useMapRegion({
    data,
    routeState,
    mapRef,
  });

  const fetchRoute = useCallback(async () => {
    if (typeof route_id_ === "string") {
      try {
        await fetchRouteDataFromHistory().then(() => {
          setUseHistory(true);
        });
        return;
      } catch (error) {
        console.error("Failed to fetch route:", error);
        return;
      }
    }

    try {
      await fetchData().then(() => {
        setUseHistory(false);
      });
    } catch (error) {
      console.error("Failed to fetch route:", error);
      return;
    }
  }, [routeState, mapRef, setData, route_id_]);

  useEffect(() => {
    if (!useHistory && dataFromFetch && dataFromFetch.locations.length > 0) {
      setData(dataFromFetch as Route);
    } else if (
      useHistory &&
      routeDataFromHistory &&
      routeDataFromHistory.route
    ) {
      setData(routeDataFromHistory.route as Route);
    }
  }, [useHistory, dataFromFetch, routeDataFromHistory]);

  // fetch route
  useEffect(() => {
    fetchRoute().catch((error) => {
      console.error("Failed to fetch route:", error);
    });
  }, [fetchRoute]);

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
    }
  };

  // loading screen
  if (loading) {
    return (
      <SafeAreaView
        style={{
          backgroundColor: theme.colors.primaryContainer,
          justifyContent: "center",
          alignItems: "center",
          flex: 1,
        }}
      >
        <ActivityIndicator size="large" />
      </SafeAreaView>
    );
  } else if (
    !data ||
    !data.locations_coordinates ||
    data.locations_coordinates.length < 2 ||
    !region ||
    !region.latitude ||
    !region.longitude
  ) {
    return (
      <SafeAreaView
        style={{
          backgroundColor: theme.colors.primaryContainer,
          justifyContent: "center",
          alignItems: "center",
          gap: 16,
          flex: 1,
        }}
      >
        <Text variant="titleLarge">No location found</Text>
        <Button
          mode="contained"
          style={{
            width: "50%",
            alignItems: "center",
          }}
          onPress={() => {
            router.back();
          }}
        >
          Back
        </Button>
        <Button
          mode="contained"
          style={{
            width: "50%",
            alignItems: "center",
          }}
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
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView
        style={{
          flex: 1,
        }}
      >
        <View
          pointerEvents="box-none"
          style={{
            marginTop: 32,
            width: "100%",
            position: "absolute",
            flexDirection: "row",
            justifyContent: "space-between",
            padding: 20,
            zIndex: 1,
          }}
        >
          <Pressable
            onPress={() => router.back()}
            style={{
              backgroundColor: theme.colors.primaryContainer,
              borderRadius: 20,
              width: 40,
              height: 40,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <ArrowBackIcon
              fill={theme.colors.onPrimaryContainer}
              width={34}
              height={34}
            />
          </Pressable>
          <Menu
            visible={menuVisible}
            onDismiss={closeMenu}
            anchor={
              <IconButton
                icon={MORE_ICON}
                onPress={openMenu}
                mode="contained"
                style={{
                  backgroundColor: theme.colors.primaryContainer,
                }}
              />
            }
          >
            {typeof route_id_ !== "string" && (
              <Menu.Item onPress={fetchRoute} title="Re-plan" />
            )}
            <Menu.Item onPress={showDatePicker} title="Schedule" />
            <Menu.Item
              onPress={() => {
                generatePDF(data);
              }}
              title="Share"
            />
            <Menu.Item
              onPress={() => handleFavRoute(data.route_id)}
              title="Favourite"
            />
          </Menu>

          <DateTimePickerModal
            isVisible={isDatePickerVisible}
            mode="date"
            onConfirm={async (date) => {
              if (handleDateConfirm) {
                await handleDateConfirm(date, data);
              }
            }}
            onCancel={hideDatePicker}
          />
        </View>

        <MapView
          provider={PROVIDER_GOOGLE}
          customMapStyle={currentTheme === "dark" ? mapDarkTheme : []}
          ref={mapRef}
          mapPadding={{ top: 0, right: 0, bottom: 150, left: 0 }}
          style={{
            flex: 1,
          }}
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
          <Marker coordinate={region} pinColor="blue" title="You are here" />
          <Polyline
            coordinates={data?.route}
            strokeWidth={3}
            strokeColor="rgba(227, 66, 52, 0.7)"
            lineDashPattern={[1, 5]}
          />
        </MapView>

        <ActivityIndicator animating={loading} size="large" />

        {data && (
          <ResultOverlay
            tipList={tipList}
            data={data}
            body={routeState}
            handleLocationSelect={handleLocationSelect}
            handlePressRoute={handlePressRoute}
            handlePress={handlePress}
            checked={checked}
            locationIcons={locationIcons}
          />
        )}
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}
