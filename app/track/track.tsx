import {
  View,
  Pressable,
  StyleSheet,
  Image,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAppTheme } from "../../theme/theme";
import { useSession } from "../../hooks/useSession";
import { router, useRootNavigationState } from "expo-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { useTrack } from "../../hooks/useTrack";

import ArrowBackIcon from "../../assets/images/icons/arrow_back.svg";
import PersonPinIcon from "../../assets/images/icons/person_pin.svg";
import {
  ActivityIndicator,
  Button,
  Portal,
  Text,
  Modal,
  TextInput,
  Chip,
  IconButton,
} from "react-native-paper";
import { useTranslation } from "react-i18next";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { mapDarkTheme } from "../../theme/map";
import { useSelector } from "react-redux";
import { selectTheme, setRoomId } from "../../store/appSlice";
import { selectLonLat } from "../../store/routeSlice";
import { useNotification } from "../../hooks/useNotification";
import * as Clipboard from "expo-clipboard";

export default function TrackScreen() {
  const theme = useAppTheme();
  const { t } = useTranslation();
  const rootNativationState = useRootNavigationState();
  const { checkSession } = useSession();
  const [loading, setLoading] = useState(false);
  const currentTheme = useSelector(selectTheme);
  const mapRef = useRef<MapView>(null);
  const locationState = useSelector(selectLonLat);
  const [showRoomIdInput, setShowRoomIdInput] = useState(false);
  const [roomIdInput, setRoomIdInput] = useState("");

  const {
    roomId,
    isConnected,
    joinRoom,
    createRoom,
    exitRoom,
    startTrackMe,
    parentLocation,
  } = useTrack();
  const [mode, setMode] = useState<"trackme" | "trackother" | undefined>();
  const { pushNotification } = useNotification();
  const [tracking, setTracking] = useState(false);

  // authentication guard
  useEffect(() => {
    if (!rootNativationState?.key) return;
    checkSession().then((isSessionVaild) => {
      if (!isSessionVaild) {
        router.replace("/auth/login");
      }
    });
  }, [rootNativationState?.key]);

  useEffect(() => {
    if (mode === "trackme") {
      setLoading(true);
      createRoom()
        .then(() => {
          setLoading(false);
        })
        .catch(() => {
          pushNotification({
            message: t("Failed to create room", { ns: "acc" }),
            type: "error",
          });
        });
    }
  }, [mode]);

  useEffect(() => {
    if (mode === "trackme" && !tracking && roomId) {
      startTrackMe(roomId);
    }
  }, [roomId, mode, tracking]);

  useEffect(() => {
    return () => {
      exitRoom();
      setTracking(false);
    };
  }, []);

  // option screen
  if (!roomId || !mode) {
    return (
      <SafeAreaView
        style={{
          backgroundColor: theme.colors.primaryContainer,
          flex: 1,
          flexDirection: "column",
          padding: 20,
        }}
      >
        <View
          style={{
            marginTop: 32,
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          {router.canGoBack() ? (
            <TouchableOpacity
              onPress={() => {
                router.back();
              }}
            >
              <ArrowBackIcon
                fill={theme.colors.onPrimaryContainer}
                width={34}
                height={34}
              />
            </TouchableOpacity>
          ) : (
            <View></View>
          )}
          <PersonPinIcon
            fill={theme.colors.onPrimaryContainer}
            width={64}
            height={64}
          />
        </View>
        <Text
          variant="headlineLarge"
          style={{
            marginTop: 36,
            color: theme.colors.onPrimaryContainer,
            fontWeight: "bold",
          }}
        >
          {t("Let your children know", { ns: "track" })}
        </Text>
        <Text
          variant="headlineLarge"
          style={{
            marginTop: 12,
            color: theme.colors.onPrimaryContainer,
          }}
        >
          {t("Where you are", { ns: "track" })}
        </Text>
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Image
            source={require("../../assets/images/animation/abstract-location-access.gif")}
            style={{ width: 280, height: 170 }}
          />
        </View>
        <View
          style={{
            height: 180,
            justifyContent: "flex-start",
            alignItems: "center",
            gap: 38,
          }}
        >
          <Button
            mode="contained"
            style={{ width: 220 }}
            onPress={() => {
              setMode("trackme");
            }}
          >
            {t("Let other people track...", { ns: "track" })}
          </Button>
          <Button
            mode="outlined"
            style={{ width: 200 }}
            onPress={() => {
              setShowRoomIdInput(true);
            }}
          >
            {t("Track other people", { ns: "track" })}
          </Button>
        </View>
        <Portal>
          <Modal
            visible={showRoomIdInput}
            onDismiss={() => {
              setShowRoomIdInput(false);
            }}
            contentContainerStyle={{
              height: "100%",
              flex: 1,
              paddingTop: 100,
              justifyContent: "flex-start",
            }}
          >
            <TextInput
              keyboardType="number-pad"
              mode="outlined"
              style={{
                margin: 20,
              }}
              label={t("Room ID", { ns: "track" })}
              value={roomIdInput}
              onChangeText={(text) => {
                setRoomIdInput(text);
              }}
            />
            <View style={{ flex: 1 }}></View>
            <View
              style={{
                width: "100%",
                padding: 20,
                gap: 28,
                alignSelf: "flex-end",
              }}
            >
              <Button
                mode="contained"
                onPress={() => {
                  if (
                    Number.isSafeInteger(Number(roomIdInput)) &&
                    roomIdInput.length === 6
                  ) {
                    joinRoom(roomIdInput);
                    setShowRoomIdInput(false);
                    setMode("trackother");
                  } else {
                    pushNotification({
                      message: t("Invalid room ID", { ns: "acc" }),
                      type: "error",
                    });
                  }
                }}
              >
                {t("Join", { ns: "track" })}
              </Button>
              <Button
                style={{ marginBottom: 54 }}
                mode="contained-tonal"
                onPress={() => setShowRoomIdInput(false)}
              >
                {t("Cancel", { ns: "comm" })}
              </Button>
            </View>
          </Modal>
        </Portal>
      </SafeAreaView>
    );
  }

  // tracking
  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: theme.colors.primaryContainer,
      }}
    >
      <View
        style={{
          width: "100%",
          flexDirection: "row",
          justifyContent: "space-between",
          padding: 20,
          zIndex: 1,
        }}
      >
        <TouchableOpacity
          onPress={() => {
            setMode(undefined);
            exitRoom();
          }}
          style={[
            styles.above,
            {
              backgroundColor: theme.colors.primaryContainer,
              borderRadius: 20,
              width: 40,
              height: 40,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            },
          ]}
        >
          <ArrowBackIcon
            fill={theme.colors.onPrimaryContainer}
            width={34}
            height={34}
          />
        </TouchableOpacity>
        <View>
          <IconButton
            icon="crosshairs-gps"
            onPress={() => {
              mapRef.current?.animateToRegion({
                latitude: locationState.latitude,
                longitude: locationState.longitude,
                latitudeDelta: 0.004,
                longitudeDelta: 0.002,
              });
            }}
            mode="contained"
            containerColor={theme.colors.tertiaryContainer}
            iconColor={theme.colors.onTertiaryContainer}
          />
        </View>
      </View>
      <MapView
        provider={PROVIDER_GOOGLE}
        customMapStyle={currentTheme === "dark" ? mapDarkTheme : []}
        showsUserLocation={mode !== "trackme"}
        showsMyLocationButton={false}
        mapPadding={{
          top: 0,
          right: 0,
          bottom: 200,
          left: 0,
        }}
        ref={mapRef}
        style={styles.map}
        initialRegion={{
          latitude: locationState?.latitude || 0,
          longitude: locationState?.longitude || 0,
          latitudeDelta: 0.006,
          longitudeDelta: 0.003,
        }}
        scrollEnabled={true}
        pitchEnabled={true}
        rotateEnabled={true}
      >
        {mode === "trackme" && (
          <Marker
            coordinate={{
              latitude: locationState?.latitude || 0,
              longitude: locationState?.longitude || 0,
            }}
            pinColor="blue"
            title="You"
          />
        )}
        {mode === "trackother" && parentLocation && (
          <Marker
            coordinate={{
              latitude: parentLocation?.latitude || 0,
              longitude: parentLocation?.longitude || 0,
            }}
            pinColor="red"
            title="Parent"
          />
        )}
      </MapView>

      <View
        style={{
          zIndex: 1,
          elevation: 5,
          position: "absolute",
          height: 200,
          width: "100%",
          bottom: 0,
          paddingTop: 20,
          paddingHorizontal: 16,
          backgroundColor: theme.colors.surface,
          borderTopLeftRadius: 16,
          borderTopRightRadius: 16,
        }}
      >
        <View
          style={{
            flex: 1,
            alignItems: "center",
          }}
        >
          <Text>
            {isConnected
              ? t("Connected", { ns: "track" })
              : t("Not Connected", { ns: "track" })}
          </Text>
          {loading && <ActivityIndicator animating={loading} size="large" />}
          {!loading && mode === "trackme" && (
            <View
              style={{
                flex: 1,
                width: "100%",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
              }}
            >
              {!tracking && (
                <Button
                  mode="contained"
                  onPress={() => {
                    setTracking(true);
                  }}
                  style={{ width: 200, height: 40 }}
                >
                  {t("Start sharing", { ns: "track" })}
                </Button>
              )}
              {tracking && (
                <View
                  style={{
                    alignItems: "center",
                    gap: 4,
                  }}
                >
                  <Text variant="bodyLarge" style={{ fontWeight: "bold" }}>
                    {t("Ask your family to type in", { ns: "track" })}
                  </Text>
                  <Button
                    mode="outlined"
                    icon="information"
                    style={{
                      marginVertical: 4,
                    }}
                    labelStyle={{
                      fontSize: 18,
                    }}
                    onPress={async () => {
                      await Clipboard.setStringAsync(roomId);
                      pushNotification({
                        message: t("Room ID Copied to clipboard", {
                          ns: "acc",
                        }),
                        type: "success",
                      });
                    }}
                  >
                    {roomId}
                  </Button>
                  <Text variant="bodyLarge" style={{ fontWeight: "bold" }}>
                    {t("locate you on their device", { ns: "track" })}
                  </Text>
                </View>
              )}
            </View>
          )}
          {!loading && mode === "trackother" && (
            <View
              style={{
                flex: 1,
                width: "100%",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text variant="bodyLarge" style={{ fontWeight: "bold" }}>
                {t("You are tracking", { ns: "track" })}
              </Text>
              <Text variant="headlineSmall" style={{ fontWeight: "bold" }}>
                {roomId}
              </Text>
            </View>
          )}
          {/* <Button
              onPress={() => {
                sendLocation(
                  locationState.latitude,
                  locationState.longitude,
                  roomId
                );
              }}
            >
              test
            </Button> */}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  above: {
    zIndex: 1,
  },
});
