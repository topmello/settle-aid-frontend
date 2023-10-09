import { useState, useRef, useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { router, useLocalSearchParams } from "expo-router";
import { SafeAreaView, Platform, View, TouchableOpacity } from "react-native";
import {
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
import { refreshHome, selectTheme } from "../../store/appSlice";
import { RequestOptions } from "../../api/fetch";
import useFetch from "../../hooks/useFetch";
import { useMapRegion, Coordinates } from "../../hooks/useMapRegion";
import useEventScheduler from "../../hooks/useEventScheduler";
import { usePrintMap } from "../../hooks/usePrintMap";
import { Route, RouteGetResult } from "../../types/route";
import { selectIsLoading } from "../../store/appSlice";
import { useNotification } from "../../hooks/useNotification";
import { useAppTheme } from "../../theme/theme";
import { AppDispatch } from "../../store";
import { useAchievement } from "../../hooks/useAchievement";

const MORE_ICON = Platform.OS === "ios" ? "dots-horizontal" : "dots-vertical";

const modes: Array<string> = [
  "Walk",
  "Local",
  "Cultural Enjoyment",
  "Greeting and Interaction",
  "Personal Safety",
];

export default function MapScreen() {
  const theme = useAppTheme();
  const currentTheme = useSelector(selectTheme);
  const routeState: RouteState = useSelector(selectRouteState);
  const loading = useSelector(selectIsLoading);
  const dispatch = useDispatch<AppDispatch>();
  const { pushNotification } = useNotification();
  const achieve = useAchievement();

  const routeId = useLocalSearchParams<{ routeId: string }>().routeId;
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
    route_image_name: "",
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
  const [isBottomSheetShow, setIsBottomSheetShow] = useState(true);
  const handleBottomSheetHide = (isHide: boolean) => {
    setIsBottomSheetShow(isHide);
  };

  const { checked, handlePress } = useCheckedList(data);

  const { map, printMap } = usePrintMap(data);
  const mapRef = useRef<MapView>(null);

  const tipList: Array<Tip> = getTipForMode(tips, modes);

  const {
    region,
    currentRoute,
    initialRegion,
    nextRoute,
    prevRoute,
    resetRoute,
    handleLocationSelect,
    handlePressRoute,
    handleMapDeltaChange,
    handleOverview,
    regionCalculating,
  } = useMapRegion({
    data,
    routeState,
    mapRef,
  });

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
        url: `/route/${routeId}`,
      },
      [routeId],
      { num_votes: 0, route: data },
      false
    );

  const fetchRoute = useCallback(async () => {
    if (typeof routeId === "string") {
      try {
        await fetchRouteDataFromHistory().then(() => {
          setUseHistory(true);
        });
      } catch (error) {
        console.error("Failed to fetch route:", error);
      }
    } else {
      try {
        await fetchData().then(() => {
          setUseHistory(false);
        });
        dispatch(refreshHome());
      } catch (error) {
        console.error("Failed to fetch route:", error);
        return;
      }
    }
  }, [routeId]);

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
    fetchRoute()
      .then(() => {
        achieve("routeGeneration");
      })
      .catch((error) => {
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
  if (loading || regionCalculating) {
    return (
      <SafeAreaView
        style={{
          backgroundColor: theme.colors.primaryContainer,
          justifyContent: "center",
          alignItems: "center",
          flex: 1,
        }}
      ></SafeAreaView>
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
        {!region || !region.latitude || !region.longitude ? (
          <ActivityIndicator size="large" />
        ) : (
          <>
            <Text variant="titleLarge">No route found</Text>
            <Text variant="bodyLarge">{routeId}</Text>
            <Button
              mode="contained"
              style={{
                width: "50%",
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
              }}
              onPress={() => {
                router.replace("/(tabs)");
              }}
            >
              Home
            </Button>
          </>
        )}
      </SafeAreaView>
    );
  }

  // main screen
  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: theme.colors.background,
      }}
    >
      {map}
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
        <TouchableOpacity
          onPress={() => router.back()}
          onLongPress={() => {
            router.replace("/(tabs)");
          }}
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
        </TouchableOpacity>
        <View>
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
            {typeof routeId !== "string" && (
              <Menu.Item onPress={fetchRoute} title="Re-plan" />
            )}
            <Menu.Item onPress={showDatePicker} title="Schedule" />
            <Menu.Item
              onPress={() => {
                printMap();
              }}
              title="Share"
            />
            <Menu.Item
              onPress={() => handleFavRoute(data.route_id)}
              title="Favourite"
            />
          </Menu>
          <IconButton
            icon="map-marker-path"
            style={{
              marginTop: 16,
            }}
            onPress={handleOverview}
            mode="contained"
            containerColor={theme.colors.tertiaryContainer}
            iconColor={theme.colors.onTertiaryContainer}
          />
          <IconButton
            icon="arrow-u-right-bottom"
            style={{
              marginTop: 2,
            }}
            disabled={currentRoute === 0}
            onPress={resetRoute}
            mode="contained"
            containerColor={theme.colors.tertiaryContainer}
            iconColor={theme.colors.onTertiaryContainer}
          />
          <IconButton
            icon="skip-previous-outline"
            style={{
              marginTop: 2,
            }}
            disabled={currentRoute === 0}
            onPress={prevRoute}
            mode="contained"
            containerColor={theme.colors.tertiaryContainer}
            iconColor={theme.colors.onTertiaryContainer}
          />
          <IconButton
            icon="skip-next-outline"
            style={{
              marginTop: 2,
            }}
            disabled={currentRoute === data.route.length - 2}
            onPress={nextRoute}
            mode="contained"
            containerColor={theme.colors.tertiaryContainer}
            iconColor={theme.colors.onTertiaryContainer}
          />
        </View>

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
        showsUserLocation={true}
        showsCompass={false}
        showsMyLocationButton={false}
        showsPointsOfInterest={false}
        onRegionChangeComplete={(region, { isGesture }) => {
          if (isGesture) {
            handleMapDeltaChange(region);
          }
        }}
        mapPadding={{
          top: 0,
          right: 0,
          bottom: isBottomSheetShow ? 440 : 160,
          left: 0,
        }}
        style={{
          height: "100%",
          width: "100%",
        }}
        region={initialRegion}
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
        <Marker
          coordinate={{
            latitude: region.userLatitude,
            longitude: region.userLongitude,
          }}
          pinColor="blue"
          title="Start Point"
        />
        <Polyline
          coordinates={data?.route}
          strokeWidth={3}
          strokeColor={theme.colors.onBackground}
          lineDashPattern={[1, 3]}
        />
        <Polyline
          coordinates={[
            {
              latitude: data?.route[currentRoute].latitude,
              longitude: data?.route[currentRoute].longitude,
            },
            {
              latitude: data?.route[currentRoute + 1].latitude,
              longitude: data?.route[currentRoute + 1].longitude,
            },
          ]}
          strokeWidth={5}
          strokeColor={theme.colors.primary}
        />
      </MapView>

      <ActivityIndicator animating={loading} size="large" />

      {data && (
        <ResultOverlay
          tipList={tipList}
          handleHide={handleBottomSheetHide}
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
  );
}
