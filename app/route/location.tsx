import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import MapView, { Marker } from "react-native-maps";
import {
  StyleSheet,
  View,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { Text, Card, List, Button, useTheme } from "react-native-paper";
import Slider from "@react-native-community/slider";
import { Link } from "expo-router";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useTranslation } from "react-i18next";

import { AppDispatch, RootState } from "../../store";
import { loading, loaded, fail } from "../../store/appSlice";
import {
  setLonLat,
  setDistanceThreshold,
  RouteState,
} from "../../store/routeSlice";

import useCurrentLocation from "../../hooks/useCurrentLocation";

export default function RouteGenLocation() {
  const theme = useTheme();
  const dispatch = useDispatch<AppDispatch>();

  const { isLoading, isFail } = useSelector((state: RootState) => state.app);

  const routeState: RouteState = useSelector((state: RootState) => state.route);

  const fetchLocation = useCurrentLocation((coords) => {
    dispatch(
      setLonLat({
        longitude: coords.longitude,
        latitude: coords.latitude,
      })
    );
    dispatch(loaded());
  });

  useEffect(() => {
    dispatch(loading());
  }, [dispatch]);

  return (
    <View style={styles.container}>
      {isLoading ? ( // Render a loading indicator while obtaining location
        <ActivityIndicator style={styles.loading} size="large" />
      ) : (
        <View
          style={[
            styles.container,
            { backgroundColor: theme.colors.secondaryContainer },
          ]}
        >
          <Card
            style={{
              height: 300,
              width: "80%",
              borderRadius: 20,
              backgroundColor: theme.colors.surfaceVariant,
              margin: 10,
            }}
          >
            <View
              style={{
                height: 200,
                width: "100%",
                borderTopLeftRadius: 20,
                borderTopRightRadius: 20,
                overflow: "hidden",
              }}
            >
              <MapView
                style={styles.map}
                initialRegion={{
                  latitude: routeState.latitude,
                  longitude: routeState.longitude,
                  latitudeDelta: 0.0922,
                  longitudeDelta: 0.0421,
                }}
                showsUserLocation={true}
                onUserLocationChange={(e) => {
                  if (e.nativeEvent.coordinate) {
                    dispatch(
                      setLonLat({
                        longitude: e.nativeEvent.coordinate.longitude,
                        latitude: e.nativeEvent.coordinate.latitude,
                      })
                    );
                  }
                }}
              >
                <Marker
                  coordinate={{
                    latitude: routeState.latitude,
                    longitude: routeState.longitude,
                  }}
                  title="Your Location"
                  draggable={true}
                  onDragEnd={(e) => {
                    if (e.nativeEvent.coordinate) {
                      dispatch(
                        setLonLat({
                          longitude: e.nativeEvent.coordinate.longitude,
                          latitude: e.nativeEvent.coordinate.latitude,
                        })
                      );
                    }
                  }}
                />
              </MapView>
            </View>
            <View
              style={{
                height: 50,
                padding: 10,
              }}
            >
              <Text variant="titleLarge">Your current location</Text>
            </View>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "flex-end",
                paddingRight: 10,
              }}
            >
              <TouchableOpacity
                style={{
                  padding: 10,
                  justifyContent: "center",
                  alignItems: "center",
                }}
                onPress={fetchLocation}
              >
                <Text variant="bodyLarge">Relocate</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  padding: 10,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text variant="bodyLarge">Edit</Text>
              </TouchableOpacity>
            </View>
          </Card>
          <Card
            style={{
              height: 150,
              width: "80%",
              borderRadius: 20,
              backgroundColor: theme.colors.surfaceVariant,
              margin: 10,
              padding: 10,
            }}
          >
            <View
              style={{
                width: "80%",
                marginTop: 10,
                marginBottom: 10,
              }}
            >
              <Text variant="titleMedium">
                Distance you want to travel between each location
              </Text>
            </View>

            <Slider
              style={{ width: "100%", height: 40 }}
              minimumValue={0}
              maximumValue={2000}
              value={routeState.distance_threshold}
              onValueChange={(value) => {
                dispatch(setDistanceThreshold({ distance_threshold: value }));
              }}
              minimumTrackTintColor={theme.colors.primary}
              maximumTrackTintColor={theme.colors.surfaceVariant}
              tapToSeek={true}
            />
            <Text variant="bodyLarge">
              {new Intl.NumberFormat().format(
                Math.round(routeState.distance_threshold)
              )}{" "}
              Meters
            </Text>
          </Card>
          <Link href={"/route/result"} style={{ margin: 10 }}>
            <Button mode="contained">
              Done <FontAwesome name="check" size={15} color="black" />
            </Button>
          </Link>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  map: {
    width: "100%",
    height: "100%",
  },
  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
