import { useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../store";
import useLogin from "../../hooks/useLogin";
import useFetch from "../../hooks/useFetch";

import { StyleSheet } from "react-native";

import EditScreenInfo from "../../components/EditScreenInfo";
import { Text, View } from "../../components/Themed";
import MapView, { Marker } from "react-native-maps";

export default function TabTwoScreen() {
  const count = useSelector((state: RootState) => state.counter.count);
  const dispatch = useDispatch();

  const { isLoadingLogin, token, errorLogin } = useSelector(
    (state: RootState) => state.login
  );
  useLogin("admin", "admin");

  const { isLoadingFetch, data, errorFetch } = useSelector(
    (state: RootState) => state.fetchData
  );

  const body = useMemo(() => {
    return {
      query: "Chinese",
      location_type: "restaurant",
      longitude: 144.9549,
      latitude: -37.81803,
      distance_threshold: 10000,
      similarity_threshold: 0.1,
    };
  }, []);
  //useFetch("user/generate/", "GET", token, {});
  //console.log(data);
  console.log("Fetching data");
  useFetch("search/", "POST", token, body);
  console.log(data);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tab Two {count}</Text>
      <Text onPress={() => dispatch({ type: "counter/increment" })}>
        Increment
      </Text>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: 37.78825,
          longitude: -122.4324,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      >
        <Marker
          coordinate={{ latitude: 37.78825, longitude: -122.4324 }}
          title="My Marker"
          description="This is my marker"
        />
      </MapView>
      <View
        style={styles.separator}
        lightColor="#eee"
        darkColor="rgba(255,255,255,0.1)"
      />
      <EditScreenInfo path="app/(tabs)/two.tsx" />
    </View>
  );
}

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
});
