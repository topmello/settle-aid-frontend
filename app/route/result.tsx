import { useState, useRef, useCallback, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { router, useLocalSearchParams } from "expo-router";
import { SafeAreaView, Platform, View, TouchableOpacity } from "react-native";
import {
  Menu,
  Text,
  Button,
  ActivityIndicator,
  IconButton,
} from "react-native-paper";
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from "react-native-maps";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import ResultOverlay from "../../components/ResultOverlay";
import useCheckedList from "../../hooks/useCheckList";
import {
  RouteState,
  selectRouteState,
  setRouteLanguage,
} from "../../store/routeSlice";
import tips, { TipArray } from "../../tips/tipsTyped";
import getTipForMode from "../../tips/getTip";
import { locationIcons } from "../../constants/icons";
import { mapDarkTheme } from "../../theme/map";
import {
  SupportedLanguage,
  refreshHome,
  selectTheme,
} from "../../store/appSlice";
import { RequestOptions } from "../../api/fetch";
import useFetch from "../../hooks/useFetch";
import { useMapRegion, Coordinates } from "../../hooks/useMapRegion";
import useEventScheduler from "../../hooks/useEventScheduler";
import { usePrintMap } from "../../hooks/usePrintMap";
import { Route, RouteGetResult, initialRoute } from "../../types/route";
import { selectIsLoading, selectLanguage } from "../../store/appSlice";
import {
  selectHistoryRoute,
  selectUseHistory,
  selectFromUrl,
  selectRouteId,
  setRouteHistory,
  setInstructions,
  Instructions,
} from "../../store/routeHistorySlice";
import { useAppTheme } from "../../theme/theme";
import { AppDispatch } from "../../store";
import { useAchievement } from "../../hooks/useAchievement";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";

const MORE_ICON = Platform.OS === "ios" ? "dots-horizontal" : "dots-vertical";

const modes: Array<string> = [
  "Walk",
  "Local",
  "Cultural Enjoyment",
  "Greeting and Interaction",
  "Personal Safety",
];

export default function MapScreen() {
  const { t } = useTranslation();
  const language = useSelector<SupportedLanguage>(
    selectLanguage
  ) as SupportedLanguage;
  const theme = useAppTheme();
  const currentTheme = useSelector(selectTheme);
  const routeState: RouteState = useSelector(selectRouteState);
  const loading = useSelector(selectIsLoading);
  const useHistory = useSelector(selectUseHistory);
  const routeIdFromUrl = useSelector<number>(selectRouteId);
  const fromUrl = useSelector(selectFromUrl);
  const data = useSelector<Route>(selectHistoryRoute) as Route;

  const dispatch = useDispatch<AppDispatch>();
  const achieve = useAchievement();

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

  const lang = useSelector(selectLanguage);

  const tipList = useMemo(() => {
    if (lang && tips[lang]) {
      return getTipForMode(tips[lang]);
    }
  }, [lang, tips]);

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
      url: "/search/v3/route/",
      data: routeState,
    },
    [routeState],
    initialRoute,
    false
  );

  const [dataFromGet, fetchGet] = useFetch<RouteGetResult>(
    {
      method: "GET",
      url: `/route/${routeIdFromUrl}/`,
      data: routeState,
    },
    [routeIdFromUrl],
    { num_votes: 0, route: initialRoute },
    false
  );

  const [translatedInstructions, fetchTranslatedInstructions] =
    useFetch<Instructions>(
      {
        method: "GET",
        url: `search/route/instructions/${data.route_id}/${language}/`,
      },
      [data.route_id, language],
      { instructions: [] },
      false
    );
  useEffect(() => {
    if (language !== "en-AU") {
      fetchTranslatedInstructions();
    }
  }, [language, data.route_id]);

  const fetchRoute = useCallback(async () => {
    if (useHistory && !fromUrl) {
      return;
    } else if (useHistory && fromUrl) {
      try {
        dispatch(setRouteLanguage({ language }));
        await fetchGet();
      } catch (error) {
        console.log(error);
      }
    } else {
      try {
        dispatch(setRouteLanguage({ language }));
        await fetchData().then(() => {
          achieve("routeGeneration");
        });

        dispatch(refreshHome());
      } catch (error) {
        console.error("Failed to fetch route:", error);
        return;
      }
    }
  }, [useHistory, fromUrl, routeIdFromUrl, language]);

  useEffect(() => {
    let routeData: Route | undefined;
    let historyFlag = false;
    let fromUrlFlag = false;

    if (!useHistory && !fromUrl && dataFromFetch) {
      routeData = dataFromFetch as Route;
    } else if (useHistory && fromUrl && dataFromGet) {
      routeData = dataFromGet.route as Route;
      historyFlag = true;
      fromUrlFlag = true;
    }

    if (routeData) {
      dispatch(
        setRouteHistory({
          route: routeData,
          history: historyFlag,
          fromUrl: fromUrlFlag,
        })
      );
    }
    if (
      language !== "en-AU" &&
      translatedInstructions &&
      translatedInstructions.instructions.length > 0
    ) {
      dispatch(setInstructions(translatedInstructions as Instructions));
    } else {
      console.log("Skipped dispatching instructions");
    }
  }, [
    useHistory,
    dataFromFetch,
    dataFromGet,
    fromUrl,
    translatedInstructions,
    language,
  ]);

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
      >
        <ActivityIndicator size="large" />
        <Text
          variant="titleLarge"
          style={{
            marginTop: 16,
            color: theme.colors.onPrimaryContainer,
          }}
        >
          {useHistory
            ? t("Route is being loaded", { ns: "route" })
            : t("Route is being generated", { ns: "route" })}
        </Text>
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
        {
          <>
            <Text variant="titleLarge">
              {t("No route found", { ns: "route" })}
            </Text>
            <Text
              variant="titleMedium"
              style={{
                color: theme.colors.primary,
                marginTop: 12,
                padding: 20,
              }}
            >
              {t(
                "At the moment, we only support CBD. Thanks for understanding! 😊",
                { ns: "route" }
              )}
            </Text>

            <Button
              mode="contained"
              style={{
                width: "50%",
              }}
              onPress={() => {
                router.back();
              }}
            >
              {t("Back", { ns: "comm" })}
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
              {t("Home", { ns: "comm" })}
            </Button>
          </>
        }
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
      {map && data && <View style={{ opacity: 0 }}>{map}</View>}
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
          onPress={() => {
            dispatch(
              setRouteHistory({
                route: initialRoute,
                history: true,
                fromUrl: true,
              })
            ); // reset route history
            router.push("/(tabs)");
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
          <MaterialCommunityIcons
            name="home-variant-outline"
            color={theme.colors.onPrimaryContainer}
            size={30}
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
            {!useHistory && (
              <Menu.Item
                onPress={fetchRoute}
                title={t("Replan", { ns: "comm" })}
              />
            )}
            <Menu.Item
              onPress={showDatePicker}
              title={t("Schedule", { ns: "comm" })}
            />
            <Menu.Item
              onPress={() => {
                printMap();
              }}
              title={t("Share", { ns: "comm" })}
            />
            <Menu.Item
              onPress={() => handleFavRoute(data.route_id)}
              title={t("Favourite", { ns: "comm" })}
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
          mode="datetime"
          onConfirm={async (date) => {
            if (handleDateConfirm) {
              handleDateConfirm(date, data);
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
