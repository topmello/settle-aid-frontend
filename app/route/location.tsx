import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { router } from "expo-router";
import MapView, { Marker } from "react-native-maps";
import {
  StyleSheet,
  View,
  ActivityIndicator,
  Pressable,
  ScrollView,
  KeyboardAvoidingView,
} from "react-native";
import {
  Text,
  Card,
  Button,
  Banner,
  Portal,
  Modal,
  Surface,
} from "react-native-paper";
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
  selectTheme,
  loaded,
} from "../../store/appSlice";
import {
  setLonLat,
  setDistanceThreshold,
  selectLonLat,
  selectDistanceThres,
} from "../../store/routeSlice";

import useCurrentLocation from "../../hooks/useCurrentLocation";
import { useNotification } from "../../hooks/useNotification";
import { useAppTheme } from "../../theme/theme";
import { mapDarkTheme } from "../../theme/map";

export default function RouteGenLocation() {
  const theme = useAppTheme();
  const dispatch = useDispatch<AppDispatch>();

  const currentTheme = useSelector(selectTheme);

  const privacyChecked = useSelector(selectPrivacyChecked);

  const isLoading  = useSelector((state: RootState) => state.app.isLoading);
  const locationState = useSelector(selectLonLat);
  const distanceThres = useSelector(selectDistanceThres);
  const fetchLocation = useCurrentLocation();
  const [searchedLocation, setSearchedLocation] = useState<{
    description: string;
    geometry: { location: { lat: number; lng: number } };
  } | null>(null);
  const { t } = useTranslation();
  const { pushNotification } = useNotification();

  const [showLocationInput, setShowLocationInput] = useState(false);

  return (
    <ScrollView
      style={{
        backgroundColor: theme.colors.primaryContainer,
        flex: 1,
        padding: 20,
        flexDirection: "column",
        width: "100%",
      }}
    >
      <SafeAreaView>
        <Banner
          style={{
            borderRadius: 10,
            backgroundColor: theme.colors.errorContainer,
          }}
          theme={{
            colors: {
              onSurface: theme.colors.onErrorContainer,
            },
          }}
          visible={!privacyChecked}
          icon="shield-check-outline"
          actions={[
            {
              label: "Not Allow",
              onPress: () => {
                dispatch(setPrivacyUnchecked());
                router.back();
              },
              textColor: theme.colors.error,
            },
            {
              label: "Understood",
              onPress: () => dispatch(setPrivacyChecked()),
              mode: "contained",
              buttonColor: theme.colors.error,
              textColor: theme.colors.onError,
            },
          ]}
        >
          <Text variant="titleMedium">
            {t("Privacy Policy", { ns: "route" })}
          </Text>
        </Banner>

        <Portal>
          <Modal
            visible={showLocationInput}
            onDismiss={() => {
              setShowLocationInput(false);
            }}
            contentContainerStyle={{
              flex: 1,
              paddingTop: 100,
              justifyContent: "flex-start",
            }}
          >
            <View style={{
              position: "absolute",
              width: "100%",
              padding: 20,
              bottom: "5%",
            }}>
            <Button mode="contained-tonal" onPress={() => setShowLocationInput(false)}>
              Cancel
            </Button>
            </View>
               <GooglePlacesAutocomplete
              styles={{
                container:{
                  marginHorizontal: 20,
                },
                textInput: {
                  backgroundColor: theme.colors.surface,
                  color: theme.colors.onSurface,
                  borderRadius: 5,
                  fontSize: 16,
                  height: 54,
                  borderColor: theme.colors.primary,
                  borderWidth: 2,
                },
                listView: {
                  color: theme.colors.onSurface,
                  borderRadius: 5,
                  overflow: "hidden",
                  fontSize: 16,
                },
                row: {
                  backgroundColor: theme.colors.surface,
                  color: theme.colors.onSurface,
                },
                description: {
                  color: theme.colors.onSurface,
                  fontSize: 16,
                },
                predefinedPlacesDescription: {
                  color: theme.colors.onSurface,
                  fontSize: 16,
                },
                poweredContainer: {
                  backgroundColor: theme.colors.surface,
                  color: theme.colors.onSurface,
                }
              }}
              placeholder="Search"
              fetchDetails={true}
              GooglePlacesDetailsQuery={{ fields: "geometry" }}
              onPress={(data, details = null) => {
                if (details) {
                  setSearchedLocation({
                    description: data.description,
                    geometry: details.geometry,
                  });
                  dispatch(setLonLat({
                    longitude: details.geometry.location.lng,
                    latitude: details.geometry.location.lat,
                  }))
                  dispatch(loaded())
                } else {
                  pushNotification({
                    message: t("Location not found", { ns: "route" }),
                    type: "error",
                  })
                }
                setShowLocationInput(false);
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
          </Modal>
        </Portal>

        <View
          style={{
            marginTop: 16,
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <Pressable onPress={() => router.back()}>
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
        <View style={{ paddingStart: 8 }}>
          <Text variant="headlineMedium" style={{ marginTop: 12 }}>
            {t("Third", { ns: "route" })}
          </Text>
          <Text
            variant="headlineMedium"
            style={{
              color: theme.colors.onPrimaryContainer,
              fontWeight: "bold",
            }}
          >
            {t("Select your starting point and ideal travel range", {
              ns: "route",
            })}
          </Text>
        </View>

        <Card
          style={{
            width: "100%",
            borderRadius: 10,
            backgroundColor: theme.colors.surface,
            marginTop: 24,
            marginBottom: 16,
          }}
        >
          <View
            style={{
              height: 230,
              width: "100%",
              borderTopLeftRadius: 10,
              borderTopRightRadius: 10,
              overflow: "hidden",
            }}
          >
            <MapView
              customMapStyle={currentTheme === "dark" ? mapDarkTheme : []}
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
              padding: 16,
            }}
          >
            <Text variant="titleLarge">Set your starting point</Text>
            <Text
              variant="bodyMedium"
              style={{
                color: theme.colors.onSurfaceVariant,
              }}
            >
              Hint: Press and Drag the pin to change location
            </Text>
            {
              searchedLocation && (
                <Text
                  variant="bodyLarge"
                  style={{
                    marginTop: 12,
                  }}
                >
                  {searchedLocation.description}
                </Text>
              )
            }
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "flex-end",
              paddingRight: 16,
              paddingTop: 6,
              paddingBottom: 12,
              gap: 8,
            }}
          >
            <Button
              icon="map-search-outline"
              onPress={() => {
                setShowLocationInput(!showLocationInput);
              }}
            >
              Search
            </Button>
            <Button
              mode="contained"
              icon="map-marker"
              loading={isLoading}
              disabled={isLoading}
              onPress={() => {
                fetchLocation();
                setSearchedLocation(null);
              }}
            >
              Locate
            </Button>
          </View>
        </Card>

        <Card
          style={{
            width: "100%",
            borderRadius: 10,
            backgroundColor: theme.colors.surface,
            padding: 16,
            marginBottom: 32,
          }}
        >
          <View
            style={{
              marginTop: 4,
              marginBottom: 10,
            }}
          >
            <Text variant="titleLarge">Distance between destinations</Text>
            <Text
              variant="bodyLarge"
              style={{
                color: theme.colors.onSurfaceVariant,
              }}
            >
              Drag the slider to change the distance
            </Text>
          </View>

          <Text style={{
            fontSize: 20,
            textAlign: "center",
          }}>
            {new Intl.NumberFormat().format(
              parseFloat((distanceThres / 1000).toFixed(2))
            )}{" "}
            KM
          </Text>

          <Slider
            style={{ width: "100%", marginTop: 16, marginBottom: 8 }}
            minimumValue={100}
            maximumValue={3000}
            step={100}
            value={distanceThres}
            onValueChange={(value) => {
              dispatch(setDistanceThreshold({ distance_threshold: value }));
            }}
            minimumTrackTintColor={theme.colors.primary}
            maximumTrackTintColor={theme.colors.outline}
            thumbTintColor={theme.colors.primary}
            tapToSeek={true}
          />
        </Card>
        <View
          style={{
            height: 100,
            width: "100%",
            alignItems: "center",
          }}
        >
          <Button
            mode="contained"
            icon={isLoading ? undefined : "routes"}
            disabled={isLoading}
            style={{
              width: 150,
            }}
            onPress={() => {
              if (!privacyChecked) {
                pushNotification({
                  message: t("Please understood privacy policy first"),
                  type: "error",
                });
              } else {
                router.push("/route/result");
              }
            }}
          >
            {t("Get my route", { ns: "route" })}
          </Button>
        </View>
      </SafeAreaView>
    </ScrollView>
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
