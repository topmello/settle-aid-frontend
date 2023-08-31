import { useState, useMemo, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";

import ResultOverlay from "../../components/ResultOverlay";
import { RootState } from "../../store";
import useFetch from "../../hooks/useFetch";
import useMapRegion, { Coordinates } from "../../hooks/useMapRegion";
import useCheckedList from "../../hooks/useCheckList";
import { RequestOptions } from "../../api/fetch";

import { AppDispatch } from "../../store";
import { selectUserToken, loginUser } from "../../store/authSlice";
import { RouteState } from "../../store/routeSlice";
import { StyleSheet, Dimensions, TouchableOpacity } from "react-native";

import { View } from "react-native";
import { Button, Text } from "react-native-paper";
import MapView, { Marker, Polyline } from "react-native-maps";

//Mock data
const body: RouteState = {
  query: ["Museum", "Indian", "Spicy", "Park"],
  location_type: ["landmark", "restaurant", "restaurant", "landmark"],
  longitude: 144.9549,
  latitude: -37.81803,
  distance_threshold: 1000,
  similarity_threshold: 0,
  route_type: "walking",
};

interface RouteResult {
  locations: string[];
  locations_coordinates: {
    latitude: number;
    longitude: number;
  }[];
  route: {
    latitude: number;
    longitude: number;
  }[];
  instructions: string[];
  duration: number;
}

const location_type_icon: { [key: string]: string } = {
  landmark: "city-variant",
  restaurant: "silverware-fork-knife",
  grocery: "cart",
  pharmacy: "medical-bag",
};

export default function MapScreen() {
  const dispatch = useDispatch<AppDispatch>();

  const token = useSelector(selectUserToken);

  const routeState: RouteState = useSelector((state: RootState) => state.route);

  const { isLoading, isFail } = useSelector((state: RootState) => state.app);

  const [triggerFetch, setTriggerFetch] = useState(0);

  const handleTriggerFetch = () => {
    setTriggerFetch((prev) => prev + 1);
  };

  const req: RequestOptions = useMemo(() => {
    return {
      method: "POST",
      url: "/search/route/",
      data: body,
      token: token,
    };
  }, [body, triggerFetch]);

  const data: RouteResult = useFetch(req, [triggerFetch]);

  const mapRef = useRef<MapView>(null);

  const { region, handleLocationSelect, handlePressRoute } = useMapRegion(
    data,
    body,
    mapRef
  );

  const { checked, handlePress } = useCheckedList(data);

  const tempFunc = () => {
    dispatch(loginUser({ username: "admin", password: "admin" }));
    setTriggerFetch((prev) => prev + 1);
  };

  if (isLoading || token === null) {
    return (
      <View style={styles.container}>
        <Text>
          Loading...
          {isLoading}
        </Text>
        <TouchableOpacity
          style={{
            backgroundColor: "blue",
            padding: 10,
            borderRadius: 5,
            alignItems: "center",
          }}
          onPress={tempFunc}
        >
          <Text>Login</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={region}
        scrollEnabled={true}
        pitchEnabled={true}
        rotateEnabled={true}
        mapPadding={{ top: 0, left: 0, right: 0, bottom: 150 }}
      >
        {data?.locations_coordinates.map(
          (location: Coordinates, index: number) => {
            return (
              <Marker
                key={index}
                coordinate={location}
                title={index === 0 ? "You are here" : data.locations[index - 1]}
                pinColor={index === 0 ? "blue" : "red"}
                description=""
              />
            );
          }
        )}
        {region && <Marker coordinate={region} />}
        <Polyline
          coordinates={data?.route}
          strokeWidth={3}
          strokeColor="rgba(227, 66, 52, 0.7)"
          lineDashPattern={[1, 5]}
        />
      </MapView>
      <View style={{ flex: 1 }} />
      <ResultOverlay
        data={data}
        body={body}
        handleTriggerFetch={handleTriggerFetch}
        handleLocationSelect={handleLocationSelect}
        handlePressRoute={handlePressRoute}
        handlePress={handlePress}
        checked={checked}
        styles={styles}
        location_type_icon={location_type_icon}
      />
    </View>
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
    height: height * 0.4,
    marginBottom: 10,
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
