import { useSelector, useDispatch } from "react-redux";
import { router } from "expo-router";
import MapView, { Marker } from "react-native-maps";
import { StyleSheet, View, ActivityIndicator, Pressable } from "react-native";
import { Text, Card, Button, useTheme, Banner } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import Slider from "@react-native-community/slider";
import { Link } from "expo-router";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import ArrowBackIcon from "../../assets/images/icons/arrow_back.svg";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";

import { useTranslation } from "react-i18next";

import { AppDispatch, RootState } from "../../store";
import {
  setPrivacyChecked,
  setPrivacyUnchecked,
  selectPrivacyChecked,
} from "../../store/appSlice";
import {
  setLonLat,
  setDistanceThreshold,
  selectLonLat,
  selectDistanceThres,
  RouteState,
} from "../../store/routeSlice";

import useCurrentLocation from "../../hooks/useCurrentLocation";
import useCurrentLocationRealtime from "../../hooks/useCurrentLocationRealtime";

export default function RouteGenLocation() {
  const theme = useTheme();
  const dispatch = useDispatch<AppDispatch>();

  const privacyChecked = useSelector(selectPrivacyChecked);

  const { isLoading, isFail } = useSelector((state: RootState) => state.app);

  const locationState = useSelector(selectLonLat);

  const distanceThres = useSelector(selectDistanceThres);

  const fetchLocation = useCurrentLocation();

  const routeState: RouteState = useSelector((state: RootState) => state.route);

  const location = useCurrentLocationRealtime();

  //console.log("location", Date.now(), location);

  const melbCBD = {
    description: "City",
    geometry: { location: { lat: -37.840935, lng: 144.946457 } },
  };

  return (
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
        visible={!privacyChecked}
        actions={[
          {
            label: "Not Allow",
            onPress: () => {
              dispatch(setPrivacyUnchecked());
              router.replace("/route/prompt");
            },
          },
          {
            label: "Understood",
            onPress: () => dispatch(setPrivacyChecked()),
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
        <GooglePlacesAutocomplete
          placeholder="Search"
          fetchDetails={true}
          GooglePlacesDetailsQuery={{ fields: "geometry" }}
          onPress={(data, details = null) => {
            // 'details' is provided when fetchDetails = true
            console.log("data", data);
            console.log("details", details);
            console.log(JSON.stringify(details?.geometry?.location));
          }}
          query={{
            key: "AIzaSyDRCFeHN0Z_yftUs5FKP6nv3XAm_Ex8cbc",
            language: "en",
            location: "-37.840935, 144.946457",
            radius: "20000",
            components: "country:aus",
            strictbounds: true,
          }}
        />
        <Card
          style={{
            height: 330,
            width: "100%",
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
                latitude: locationState.latitude,
                longitude: locationState.longitude,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
              }}
              showsUserLocation={false}
            >
              <Marker
                coordinate={{
                  latitude: locationState.latitude,
                  longitude: locationState.longitude,
                }}
                title="Search Location"
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
              height: 70,
              padding: 10,
            }}
          >
            <Text variant="titleLarge">Searching Area</Text>
            <Text variant="titleSmall">Drag the pin to change location</Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              paddingRight: 10,
            }}
          >
            <Button mode="contained" onPress={fetchLocation}>
              Get current location
            </Button>
          </View>
        </Card>
        {isLoading && (
          <View
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <ActivityIndicator size="large" />
          </View>
        )}
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
            {new Intl.NumberFormat().format(
              parseFloat((distanceThres / 1000).toFixed(2))
            )}{" "}
            KM
          </Text>
        </Card>
        {privacyChecked && (
          <Link href={"/route/result"} style={{ margin: 10 }}>
            <Button mode="contained">
              Done <FontAwesome name="check" size={15} color="black" />
            </Button>
          </Link>
        )}
      </View>
    </SafeAreaView>
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
