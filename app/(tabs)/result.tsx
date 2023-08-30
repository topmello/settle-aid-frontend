import { useState, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../store";
import useFetch from "../../hooks/useFetch";
import { RequestOptions } from "../../api/fetch";

import { loginUser } from "../../store/authSlice";
import { selectAuthStatus } from "../../store/authSlice";
import { AppDispatch } from "../../store";
import { RouteState } from "../../store/routeSlice";

import FontAwesome from "@expo/vector-icons/FontAwesome";

import {
  StyleSheet,
  Dimensions,
  ScrollView,
  FlatList,
  TouchableOpacity,
} from "react-native";

import { Text, View } from "../../components/Themed";
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
  const dispatch = useDispatch<AppDispatch>();
  const authStatus = useSelector(selectAuthStatus);

  const { isLoading, error } = useSelector((state: RootState) => state.app);

  const [triggerFetch, setTriggerFetch] = useState(0);

  const req: RequestOptions = useMemo(() => {
    return {
      method: "POST",
      url: "/search/route/",
      data: body,
    };
  }, [body, triggerFetch]);

  const requestData: RouteState = req.data as RouteState;

  const data = useFetch(req, [triggerFetch]);

  const [region, setRegion] = useState({
    latitude: body.latitude - 0.005,
    longitude: body.longitude,
    latitudeDelta: 0.05,
    longitudeDelta: 0.03,
  });

  const handleLocationSelect = (location: Coordinates) => {
    setRegion({
      ...region,
      latitude: location.latitude - 0.005,
      longitude: location.longitude,
    });
  };

  if (isLoading || !data) {
    return (
      <View style={styles.container}>
        <Text>Loading...{authStatus}</Text>
        <TouchableOpacity
          style={{
            backgroundColor: "blue",
            padding: 10,
            borderRadius: 5,
            alignItems: "center",
          }}
          onPress={() =>
            dispatch(loginUser({ username: "admin", password: "admin" }))
          }
        >
          <Text style={{ color: "white", fontSize: 16 }}>Login</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        region={region}
        initialRegion={{
          latitude: body.latitude,
          longitude: body.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      >
        {data?.locations_coordinates.map(
          (location: Coordinates, index: number) => {
            return (
              <Marker
                key={location.latitude}
                coordinate={location}
                title={index === 0 ? "You are here" : data.locations[index - 1]}
                pinColor={index === 0 ? "blue" : "red"}
                description=""
              />
            );
          }
        )}
        <Polyline
          coordinates={data?.route}
          strokeWidth={3}
          strokeColor="rgba(227, 66, 52, 0.7)"
          lineDashPattern={[1, 5]}
        />
      </MapView>
      <View
        style={styles.separator}
        lightColor="#eee"
        darkColor="rgba(255,255,255,0.1)"
      />
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
                        location_type_icon[requestData?.location_type[index]] ||
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
                return <List.Item key={index} title={instruction} />;
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
