import { View, Pressable, StyleSheet, Image } from "react-native";
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
} from "react-native-paper";
import { useTranslation } from "react-i18next";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { mapDarkTheme } from "../../theme/map";
import { useSelector } from "react-redux";
import { selectTheme, setRoomId } from "../../store/appSlice";
import { selectLonLat } from "../../store/routeSlice";
import BottomSheet from "@gorhom/bottom-sheet";
import { useNotification } from "../../hooks/useNotification";

export default function TrackScreen() {
  const theme = useAppTheme();
  const { t } = useTranslation();
  const rootNativationState = useRootNavigationState();
  const { checkSession } = useSession();
  const [loading, setLoading] = useState(false);
  const currentTheme = useSelector(selectTheme);
  const mapRef = useRef<MapView>(null);
  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ["15%", "25%"], []);
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
            <Pressable
              onPress={() => {
                router.back();
              }}
            >
              <ArrowBackIcon
                fill={theme.colors.onPrimaryContainer}
                width={34}
                height={34}
              />
            </Pressable>
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
          {t("Let your children know", { ns: "acc" })}
        </Text>
        <Text
          variant="headlineLarge"
          style={{
            marginTop: 12,
            color: theme.colors.onPrimaryContainer,
          }}
        >
          {t("Where you are", { ns: "acc" })}
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
            Let other people track me
          </Button>
          <Button
            mode="outlined"
            style={{ width: 200 }}
            onPress={() => {
              setShowRoomIdInput(true);
            }}
          >
            Track other people
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
              mode="outlined"
              style={{
                margin: 20,
              }}
              label="Room ID"
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
                Join
              </Button>
              <Button
                style={{ marginBottom: 54 }}
                mode="contained-tonal"
                onPress={() => setShowRoomIdInput(false)}
              >
                Cancel
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
        <Pressable
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
        </Pressable>
      </View>
      <MapView
        provider={PROVIDER_GOOGLE}
        customMapStyle={currentTheme === "dark" ? mapDarkTheme : []}
        ref={mapRef}
        style={styles.map}
        initialRegion={{
          latitude: locationState?.latitude || 0,
          longitude: locationState?.longitude || 0,
          latitudeDelta: 0.006,
          longitudeDelta: 0.003,
        }}
        showsUserLocation={mode === "trackother"}
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
        pointerEvents="box-none"
        style={{
          flex: 1,
        }}
      >
        <BottomSheet
          ref={bottomSheetRef}
          index={1}
          snapPoints={snapPoints}
          style={{
            zIndex: 1,
            elevation: 5,
          }}
          animateOnMount={true}
          backgroundStyle={{
            backgroundColor: theme.colors.surface,
          }}
          handleIndicatorStyle={{
            backgroundColor: theme.colors.onSurfaceVariant,
          }}
        >
          <View
            style={{
              flex: 1,
              backgroundColor: theme.colors.surface,
              alignItems: "center",
            }}
          >
            <Text>{isConnected ? "Connected" : "Not Connected"}</Text>
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
                    Start tracking
                  </Button>
                )}
                {tracking && (
                  <View
                    style={{
                      alignItems: "center",
                    }}
                  >
                    <Text variant="bodyLarge">
                      Ask your children to type in
                    </Text>
                    <Chip icon="information">{roomId}</Chip>
                    <Text variant="bodyLarge">to track you</Text>
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
                  Tracking {roomId}
                </Text>
                {/* <ScrollView>
                  {messages.map((message, index) => {
                    return (
                      <View
                        key={index}
                        style={{
                          backgroundColor: theme.colors.surface,
                          padding: 16,
                          margin: 8,
                          borderRadius: 8,
                        }}
                      >
                        <Text>{JSON.stringify(message)}</Text>
                      </View>
                    );
                  })}
                </ScrollView> */}
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
        </BottomSheet>
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
