import { useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../store";
import useLogin from "../../hooks/useLogin";
import useFetch from "../../hooks/useFetch";

import { StyleSheet, Dimensions, ScrollView } from "react-native";

import { Text, View } from "../../components/Themed";
import MapView, { Marker, Polyline } from "react-native-maps";
import { Card, List } from "react-native-paper";

const body: {
  query: string[];
  location_type: string[];
  longitude: number;
  latitude: number;
  distance_threshold: number;
  similarity_threshold: number;
  route_type: string;
} = {
  query: ["Museum", "Indian", "Spicy", "Park"],
  location_type: ["landmark", "restaurant", "restaurant", "landmark"],
  longitude: 144.9549,
  latitude: -37.81803,
  distance_threshold: 1000,
  similarity_threshold: 0,
  route_type: "walking",
};

export default function MapScreen() {
  const count = useSelector((state: RootState) => state.counter.count);
  const dispatch = useDispatch();

  const { isLoadingLogin, token, errorLogin } = useSelector(
    (state: RootState) => state.login
  );
  useLogin("admin", "admin");

  const { isLoadingFetch, data, errorFetch } = useSelector(
    (state: RootState) => state.fetchData
  );
  useFetch("search/route/", "POST", token, body);
  //console.log(data);

  const route = useMemo(() => {
    if (data) {
      return data.route.map((coord: Array<number>) => {
        return { latitude: coord[1], longitude: coord[0] };
      });
    }
  }, [data]);

  if (isLoadingLogin || isLoadingFetch) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: body.latitude,
          longitude: body.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      >
        <Marker
          coordinate={{ latitude: body.latitude, longitude: body.longitude }}
          title="My Marker"
          description="This is my marker"
        />
        <Polyline coordinates={route} strokeWidth={5} />
      </MapView>
      <View
        style={styles.separator}
        lightColor="#eee"
        darkColor="rgba(255,255,255,0.1)"
      />
      <View style={{ flex: 1 }} />
      <Card style={styles.card}>
        <ScrollView>
          <List.Section>
            <List.Subheader>My List</List.Subheader>
            {data?.locations.map((location: string) => {
              return (
                <List.Item
                  title={location}
                  description="Item description"
                  left={(props) => <List.Icon {...props} icon="folder" />}
                />
              );
            })}
          </List.Section>
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
    height: height * 0.3,
    marginBottom: 10,
    padding: 0,
    margin: 0,
    borderRadius: 20,
  },
});
