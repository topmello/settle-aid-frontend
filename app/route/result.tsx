import { useState, useRef, useCallback, useEffect } from "react";
import { useSelector } from "react-redux";
import { router, useLocalSearchParams } from "expo-router";
import {
  SafeAreaView,
  Platform,
  View,
  Pressable,
  TouchableOpacity,
} from "react-native";
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
  const [isBottomSheetShow, setIsBottomSheetShow] = useState(true);
  const handleBottomSheetHide = (isHide: boolean) => {
    setIsBottomSheetShow(isHide);
  };

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
          <View>
            <Text variant="titleLarge">No route found</Text>
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
          </View>
        )}
      </SafeAreaView>
    );
  }

  // main screen
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: theme.colors.background,
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
          <TouchableOpacity
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
    </GestureHandlerRootView>
  );
}
