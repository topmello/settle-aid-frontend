import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { router } from "expo-router";
import MapView, { Marker } from "react-native-maps";
import {
  StyleSheet,
  View,
  ActivityIndicator,
  TouchableOpacity,
  Pressable,
  Image,
} from "react-native";
import { Text, Card, Button, useTheme, Banner } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import Slider from "@react-native-community/slider";
import { Link } from "expo-router";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import ArrowBackIcon from "../../assets/images/icons/arrow_back.svg";

import { useTranslation } from "react-i18next";

import { AppDispatch, RootState } from "../../store";
import { loading, loaded, fail } from "../../store/appSlice";
import {
  setLonLat,
  setDistanceThreshold,
  selectLonLat,
  selectDistanceThres,
} from "../../store/routeSlice";

import useCurrentLocation from "../../hooks/useCurrentLocation";

export default function RouteGenLocation() {
  const theme = useTheme();
  const dispatch = useDispatch<AppDispatch>();

  const [bannerVisible, setBannerVisible] = useState(true);

  const { isLoading, isFail } = useSelector((state: RootState) => state.app);

  const locationState = useSelector(selectLonLat);
  console.log(locationState);

  const distanceThres = useSelector(selectDistanceThres);

  const fetchLocation = useCurrentLocation((coords) => {
    dispatch(
      setLonLat({
        longitude: coords.longitude,
        latitude: coords.latitude,
      })
    );
    dispatch(loaded());
  });

  return (
    <View style={styles.container}>
      {isLoading ? ( // Render a loading indicator while obtaining location
        <ActivityIndicator style={styles.loading} size="large" />
      ) : (
        <SafeAreaView
          style={{
            backgroundColor: theme.colors.primaryContainer,
            flex: 1,
            flexDirection: "column",
            padding: 20,
            width: "100%",
          }}
        >
          <Banner
            style={{
              borderRadius: 20,
            }}
            visible={bannerVisible}
            actions={[
              {
                label: "Not Allow",
                onPress: () => {
                  setBannerVisible(false);
                  router.replace("/route/prompt");
                },
              },
              {
                label: "Understand",
                onPress: () => setBannerVisible(false),
              },
            ]}
          >
            <Text variant="titleMedium">
              Your privacy matters: We store your information and location data
              securely and confidentially.
            </Text>
          </Banner>
          <View
            style={{
              marginTop: 32,
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <Pressable onPress={() => router.replace("/route/prompt")}>
              <ArrowBackIcon
                fill={theme.colors.onPrimaryContainer}
                width={34}
                height={34}
              />
            </Pressable>
            <View style={{ flexDirection: "row", paddingEnd: 8 }}>
              <Text variant="headlineMedium" style={{ fontWeight: "900" }}>
                3
              </Text>
              <Text variant="headlineMedium">/3</Text>
            </View>
          </View>
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              marginTop: 32,
              padding: 8,
              gap: 16,
              flexWrap: "wrap",
              flexDirection: "row",
            }}
          >
            <Card
              style={{
                height: 250,
                width: "100%",
                borderRadius: 20,
                backgroundColor: theme.colors.surfaceVariant,
                margin: 10,
              }}
            >
              <View
                style={{
                  height: 150,
                  width: "100%",
                  borderTopLeftRadius: 20,
                  borderTopRightRadius: 20,
                  overflow: "hidden",
                }}
              >
                <MapView
                  style={styles.map}
                  initialRegion={{
                    latitude: locationState.latitude,
                    longitude: locationState.longitude,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421,
                  }}
                  showsUserLocation={true}
                >
                  <Marker
                    coordinate={{
                      latitude: locationState.latitude,
                      longitude: locationState.longitude,
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
                  <Text variant="bodyLarge">Get current location</Text>
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
                width: "100%",
                borderRadius: 20,
                backgroundColor: theme.colors.surfaceVariant,
                margin: 10,
                padding: 10,
              }}
            >
              <View
                style={{
                  width: "90%",
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
                value={distanceThres}
                onValueChange={(value) => {
                  dispatch(setDistanceThreshold({ distance_threshold: value }));
                }}
                minimumTrackTintColor={theme.colors.primary}
                maximumTrackTintColor={theme.colors.surfaceVariant}
                tapToSeek={true}
              />
              <Text variant="bodyLarge">
                {new Intl.NumberFormat().format(Math.round(distanceThres))}{" "}
                Meters
              </Text>
            </Card>
            {!bannerVisible && (
              <Link href={"/route/result"} style={{ margin: 10 }}>
                <Button mode="contained">
                  Done <FontAwesome name="check" size={15} color="black" />
                </Button>
              </Link>
            )}
          </View>
        </SafeAreaView>
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
