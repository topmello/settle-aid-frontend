import { useState, useRef, useCallback, useEffect } from "react";
import { useSelector } from "react-redux";
import { router, useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native";
import { View, Pressable } from "react-native";
import { Text, useTheme, Button, ActivityIndicator } from "react-native-paper";
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from "react-native-maps";

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
import { useSession } from "../../hooks/useSession";
import {
  useMapRegion,
  RouteResult,
  Coordinates,
} from "../../hooks/useMapRegion";
import * as Calendar from "expo-calendar";
import { Route } from "../../types/route";
import { selectIsLoading } from "../../store/appSlice";

export default function MapScreen() {
  const theme = useTheme();
  const { token, checkSession } = useSession();
  const currentTheme = useSelector(selectTheme);
  const routeState: RouteState = useSelector(selectRouteState);
  const loading = useSelector(selectIsLoading);

  const routeJSON = useLocalSearchParams().routeJSON;

  const [data, setData] = useState<RouteResult>({
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

  //calendar permission
  const [calendarPermission, setCalendarPermission] = useState(false);

  const requestCalendarPermission = async () => {
    const { status } = await Calendar.requestCalendarPermissionsAsync();
    setCalendarPermission(status === "granted");
  };

  useEffect(() => {
    requestCalendarPermission();
  }, []);

 


  //date picker

  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date: Date) => {
    console.warn("A date has been picked: ", date);
    hideDatePicker();
    setSelectedDate(date);
    addToCalendar(date);
  };

  // add event to calendar

  const addToCalendar = async (date: Date) => {
    if (calendarPermission) {
      // Get the default calendar
      const defaultCalendar = await Calendar.getDefaultCalendarAsync();

        const eventDetails = {
          title: "My Event",
          startDate: date.toISOString(),
          endDate: date.toISOString(),
          timeZone: "GMT", // Set the timezone as needed
          location: "Event Location",
          notes: "Event Description",
        };

      const event = await Calendar.createEventAsync(
        defaultCalendar.id,
        eventDetails
      );

      console.log(`Event added to calendar with ID: ${event}`);
    } else {
      console.warn("Calendar permissions not granted.");
    }
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

  const requestOptions: RequestOptions = {
    method: "POST",
    url: "/search/v2/route/",
    data: routeState,
    token: token,
  };
  
  const [dataFromFetch, fetchData] = useFetch<RouteResult | null>(requestOptions, [routeState, token], null, false);

  const mapRef = useRef<MapView>(null);

  const { region, handleLocationSelect, handlePressRoute } = useMapRegion({
    data,
    routeState,
    mapRef,
  });
  

  const fetchRoute = useCallback(async () => {


    if (typeof routeJSON === 'string') {
      try {
        const routeData: Route = JSON.parse(routeJSON);
  
        if (routeData && routeData.route_id && routeData.locations && routeData.route) {
          const { route_id, ...routeDataWithoutID } = routeData;
          setData(routeDataWithoutID);
          return; // return early so the fetch call is not made
        }
      } catch (error) {
        console.error("Failed to parse routeJSON:", error);

      }
    }
    await fetchData().catch((error) => {
      console.error("Failed to fetch route:", error);
      return;
    })
    
  }, [routeState, token, mapRef, setData]);
  
  useEffect(() => {
    if (dataFromFetch) {
      setData(dataFromFetch as RouteResult);
    }
  }, [dataFromFetch]);

   // fetch route
   useEffect(() => {
    checkSession().then((isSessionVaild) => {
      if (!isSessionVaild) {
        router.replace("/auth/login");
      }
    });
    fetchRoute().catch((error) => {
      console.error("Failed to fetch route:", error);
    });
  }, [fetchRoute]);

  
  // loading screen
  if (loading) {
    return (
      <SafeAreaView
        style={
          {
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
        style={
          {
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
            width: '50%',
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
            width: '50%',
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
    <SafeAreaView style={{
      flex: 1,
    }}>
      <View
        style={{
          marginTop: 32,
          width: "100%",
          flexDirection: "row",
          justifyContent: "space-between",
          padding: 20,
          zIndex: 1,
        }}
      >
        {router.canGoBack() ? (
          <Pressable
            onPress={() => router.back()}
            style={
              {
                backgroundColor: theme.colors.primaryContainer,
                borderRadius: 20,
                width: 40,
                height: 40,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                zIndex: 1,
              }}
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
        {typeof routeJSON === 'string' ? null:<Button
          mode="contained"
          style={{ width: '30%', zIndex: 1, alignItems: "center",}}
          onPress={fetchRoute}
        >
          Re-plan
        </Button>}
      </View>

      <MapView
        provider={PROVIDER_GOOGLE}
        customMapStyle={currentTheme === "dark" ? mapDarkTheme : []}
        ref={mapRef}
        mapPadding={{top: 0, right: 0, bottom: 150, left: 0}}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
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
  );
}
