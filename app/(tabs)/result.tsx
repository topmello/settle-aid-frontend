import { useState, useMemo, useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../store";
import useFetch from "../../hooks/useFetch";
import { RequestOptions } from "../../api/fetch";

import { selectUserToken } from "../../store/authSlice";
import { RouteState } from "../../store/routeSlice";

import FontAwesome from "@expo/vector-icons/FontAwesome";

import {
  StyleSheet,
  Dimensions,
  ScrollView,
  FlatList,
  TouchableOpacity,
} from "react-native";

import { Text, View } from "react-native";
import MapView, { Marker, Polyline } from "react-native-maps";
import { Card, List } from "react-native-paper";

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

interface Coordinates {
  latitude: number;
  longitude: number;
}

const location_type_icon: { [key: string]: string } = {
  landmark: "city-variant",
  restaurant: "silverware-fork-knife",
  grocery: "cart",
  pharmacy: "medical-bag",
};

export default function MapScreen() {
  const token = useSelector(selectUserToken);

  const { isLoading, isFail } = useSelector((state: RootState) => state.app);

  const [triggerFetch, setTriggerFetch] = useState(0);

  const req: RequestOptions = useMemo(() => {
    return {
      method: "POST",
      url: "/search/route/",
      data: body,
      token: token,
    };
  }, [body, triggerFetch]);

  const data: RouteResult = useFetch(req, [triggerFetch]);

  const [region, setRegion] = useState({
    latitude: body.latitude - 0.005,
    longitude: body.longitude,
    latitudeDelta: 0.01,
    longitudeDelta: 0.03,
  });

  const handleLocationSelect = (location: Coordinates) => {
    setRegion({
      ...region,
      latitude: location.latitude - 0.005,
      longitude: location.longitude,
    });
  };

  const mapRef = useRef<MapView>(null);
  const [selectedLocationInstruc, setSelectedLocationInstruc] = useState<{
    latitude: number;
    longitude: number;
    latitudeDelta: number;
    longitudeDelta: number;
  } | null>(null);

  const handlePressRoute = (index: number) => {
    if (index < 0 || index >= data.route.length) {
      return;
    }
    const lat1 = data.route[index].latitude;
    const lon1 = data.route[index].longitude;
    const lat2 = data.route[index + 1]?.latitude;
    const lon2 = data.route[index + 1]?.longitude;

    const bearing = lat2 && lon2 ? calculateBearing(lat1, lon1, lat2, lon2) : 0;
    const newRegion = {
      latitude: lat1,
      longitude: lon1,
      latitudeDelta: 0.001,
      longitudeDelta: 0.005,
    };

    mapRef.current!.animateCamera(
      { center: newRegion, heading: bearing },
      { duration: 1000 }
    );
    setSelectedLocationInstruc(newRegion);
  };

  const [checked, setChecked] = useState<boolean[]>([]);

  useEffect(() => {
    if (data && data.instructions) {
      setChecked(Array(data.instructions.length).fill(false));
    }
  }, [data]);

  const handlePress = (index: number) => {
    const newChecked = [...checked];
    newChecked[index] = !newChecked[index];
    setChecked(newChecked);
  };

  if (isLoading || isFail) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView ref={mapRef} style={styles.map} region={region}>
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
        {selectedLocationInstruc && (
          <Marker coordinate={selectedLocationInstruc} />
        )}
        <Polyline
          coordinates={data?.route}
          strokeWidth={3}
          strokeColor="rgba(227, 66, 52, 0.7)"
          lineDashPattern={[1, 5]}
        />
      </MapView>
      <View style={styles.separator} />
      <View style={{ flex: 1 }} />
      <Card style={styles.card}>
        <FlatList
          data={[1, 2, 3]}
          renderItem={({ item }) => (
            <Card style={styles.flatListCard}>
              <Card.Title
                title={`Tips ${item}`}
                subtitle="Subtitle"
                right={(props) => (
                  <TouchableOpacity>
                    <Text>Learn</Text>
                  </TouchableOpacity>
                )}
              />
            </Card>
          )}
          keyExtractor={(item) => item?.toString()}
          contentContainerStyle={{
            columnGap: 10,
            margin: 14,
            marginBottom: 30,
          }}
          horizontal={true}
        />
        <ScrollView>
          <List.Section>
            {data?.locations.map((location: string, index: number) => {
              return (
                <List.Item
                  key={location}
                  title={location}
                  description="Item description"
                  left={(props) => (
                    <List.Icon
                      {...props}
                      icon={
                        location_type_icon[body?.location_type[index]] ||
                        "folder"
                      }
                    />
                  )}
                  right={() => (
                    <TouchableOpacity
                      style={{
                        backgroundColor: "#000",
                        borderRadius: 24,
                        height: 48,
                        width: 48,
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                      onPress={() =>
                        handleLocationSelect(
                          data.locations_coordinates[index + 1]
                        )
                      }
                    >
                      <FontAwesome
                        name="location-arrow"
                        size={32}
                        color="white"
                      />
                    </TouchableOpacity>
                  )}
                />
              );
            })}
          </List.Section>
          <List.Section>
            <List.Accordion
              title="Instructions"
              left={(props) => <List.Icon {...props} icon="map-legend" />}
            >
              {data?.instructions.map((instruction: string, index: number) => {
                return (
                  <List.Item
                    key={index}
                    title={instruction}
                    onPress={() => handlePressRoute(index)}
                    left={(props) => (
                      <TouchableOpacity
                        key={index}
                        onPress={() => handlePress(index)}
                        style={{
                          backgroundColor: "transparent",
                          paddingLeft: 20,
                        }}
                      >
                        <List.Icon
                          icon={
                            checked[index] ? "check" : "checkbox-blank-outline"
                          }
                        />
                      </TouchableOpacity>
                    )}
                  />
                );
              })}
            </List.Accordion>
          </List.Section>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-evenly",
              alignItems: "center",
              flex: 1,
              backgroundColor: "transparent",
              padding: 10,
            }}
          >
            <TouchableOpacity style={styles.button}>
              <Text>Back</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.button}
              onPress={() => setTriggerFetch((prev) => prev + 1)}
            >
              <Text>Reroute</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </Card>
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
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  card: {
    width: width * 0.99,
    height: height * 0.35,
    marginBottom: 10,
    padding: 0,
    margin: 0,
    borderRadius: 20,
  },
  flatListCard: {
    width: width * 0.7,
    marginBottom: 10,
    padding: 0,
    paddingRight: 20,
  },
  button: {
    width: width * 0.35,
    backgroundColor: "blue",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
  },
});

function degreesToRadians(degrees: number): number {
  return (degrees * Math.PI) / 180;
}

function calculateBearing(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  lat1 = degreesToRadians(lat1);
  lon1 = degreesToRadians(lon1);
  lat2 = degreesToRadians(lat2);
  lon2 = degreesToRadians(lon2);

  const dLon = lon2 - lon1;
  const x = Math.cos(lat2) * Math.sin(dLon);
  const y =
    Math.cos(lat1) * Math.sin(lat2) -
    Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLon);
  const bearing = (Math.atan2(x, y) * 180) / Math.PI;
  return (bearing + 360) % 360;
}
