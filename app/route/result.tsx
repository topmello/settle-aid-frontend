import { useState, useMemo, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";

import ResultOverlay from "../../components/ResultOverlay";
import { RootState } from "../../store";

import useFetch from "../../hooks/useFetch";
import useMapRegion, { Coordinates } from "../../hooks/useMapRegion";
import useCheckedList from "../../hooks/useCheckList";

import { RequestOptions } from "../../api/fetch";

import { selectUserToken } from "../../store/authSlice";
import { RouteState, selectRouteState } from "../../store/routeSlice";

import { StyleSheet, Dimensions, TouchableOpacity } from "react-native";
import { View } from "react-native";
import { Text } from "react-native-paper";

import MapView, { Marker, Polyline } from "react-native-maps";

import ShoppingCartIcon from "../../assets/images/icons/shopping_cart.svg";
import FastfoodIcon from "../../assets/images/icons/fastfood.svg";
import ParkBirdsIcon from "../../assets/images/icons/park_birds.svg";
import PharmacyIcon from "../../assets/images/icons/pharmacy.svg";

import tips, { Tip } from "../../tips/tipsTyped";
import findTipsForModes from "../../tips/tipFinder";

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

const location_type_icon: { [key: string]: any } = {
  landmark: ShoppingCartIcon,
  restaurant: FastfoodIcon,
  grocery: ParkBirdsIcon,
  pharmacy: PharmacyIcon,
};

export default function MapScreen() {
  const token = useSelector(selectUserToken);

  const { isLoading, isFail } = useSelector((state: RootState) => state.app);

  const routeState: RouteState = useSelector(selectRouteState);

  console.log(routeState);

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

  if (isLoading || token === null || data === null) {
    return (
      <View style={styles.container}>
        <Text>
          Loading... Please login
          {isLoading}
        </Text>
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
      <View style={{ flex: 1 }} />
      <ResultOverlay
        tipList={tipList}
        data={data}
        body={routeState}
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
