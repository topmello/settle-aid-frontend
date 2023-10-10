import * as Print from "expo-print";
import * as Sharing from "expo-sharing";
import { Route } from "../types/route";
import MapView, { Marker, PROVIDER_GOOGLE, Polyline } from "react-native-maps";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Coordinates, useMapRegion } from "./useMapRegion";
import { useNotification } from "./useNotification";
import * as Linking from "expo-linking";
import QRCode from "react-native-qrcode-svg";
import ViewShot from "react-native-view-shot";

const customPins = [
  require("../assets/images/pin/pin1.png"),
  require("../assets/images/pin/pin2.png"),
  require("../assets/images/pin/pin3.png"),
  require("../assets/images/pin/pin4.png"),
];

const usePrintMap = (route: Route) => {
  const qrCodeRef = useRef(null);
  const mapRef = useRef<MapView>(null);
  const [printing, setPrinting] = useState(false);
  const { pushNotification } = useNotification();
  const [initialUrl, setInitialUrl] = useState("");

  useEffect(() => {
    // Retrieve the initial url
    Linking.getInitialURL().then((url) => {
      setInitialUrl(
        url?.split("?")[0] + "/?routeid=" + route.route_id || "N/A"
      );
    });
  }, []);

  const { region, initialRegion } = useMapRegion({
    data: route,
    routeState: {
      latitude: route?.locations_coordinates[0].latitude,
      longitude: route?.locations_coordinates[0].longitude,
    },
    mapRef,
  });

  const locations = useMemo(() => {
    return route.locations
      .map(
        (location, index) =>
          `<span class="location"><span class="num">${
            index + 1
          }</span>${location} </span>`
      )
      .join("");
  }, [route.locations]);

  const printMap = useCallback(() => {
    setPrinting(true);

    // Capture the map as a base64 image
    mapRef.current
      ?.takeSnapshot({
        format: "png",
        quality: 1,
        result: "base64",
      })
      .then((image) => {
        // Use Linking.getInitialURL() to get the initial app URL
        Linking.getInitialURL().then((initialUrl) => {
          const appLink = initialUrl || "N/A"; // Use "N/A" if no initial URL is available

          // Generate the QR code
          const qrCode = (
            <QRCode
              value={appLink}
              size={100} // Adjust the size as needed
            />
          );

          // Capture the QR code as an image
          qrCodeRef.current.capture().then((qrCodeImage) => {
            const html = `
              <html>
                <head>${cssContent}</head>
                <body>
                  <div>
                    <h1>Route</h1>
                    <img class="map" src="data:image/png;base64,${image}" width="100%" />
                  </div>
                  <div>
                    <h2>Locations</h2>
                    <p>${locations}</p>
                  </div>
                  <div>
                    <h2>App Link QR Code</h2>
                    <img src="${qrCodeImage}" />
                  </div>
                </body>
              </html>
            `;

            return Print.printToFileAsync({
              html,
            }).then((result) => {
              return Sharing.shareAsync(result.uri, {
                mimeType: "application/pdf",
                dialogTitle: "Share PDF",
                UTI: "com.adobe.pdf",
              });
            });
          });
        });
      })
      .then(() => {
        setPrinting(false);
      });
  }, [mapRef, qrCodeRef, locations]);

  return {
    map: (
      <>
        <MapView
          provider={PROVIDER_GOOGLE}
          ref={mapRef}
          showsCompass={false}
          showsMyLocationButton={false}
          toolbarEnabled={false}
          style={{
            opacity: 0,
            height: 900,
            width: 900,
            position: "absolute",
            top: 0,
            left: 0,
          }}
          region={{
            latitude: initialRegion.latitude,
            longitude: initialRegion.longitude,
            latitudeDelta: initialRegion.latitudeDelta,
            longitudeDelta: initialRegion.longitudeDelta,
          }}
          scrollEnabled={true}
          pitchEnabled={true}
          rotateEnabled={true}
        >
          {route?.locations_coordinates
            .filter((_, index) => index !== 0)
            .map((location: Coordinates, index: number) => {
              return (
                <Marker
                  image={customPins[index % customPins.length]}
                  key={index}
                  coordinate={location}
                  title={route.locations[index]}
                  pinColor={"red"}
                  description=""
                />
              );
            })}
          <Marker
            coordinate={{
              latitude: region.userLatitude,
              longitude: region.userLongitude,
            }}
            pinColor="blue"
            title="Start Point"
          />
          <Polyline
            coordinates={route?.route}
            strokeWidth={5}
            strokeColor={"rgb(54, 81, 208)"}
            lineDashPattern={[1, 3]}
          />
        </MapView>
        <ViewShot
          ref={qrCodeRef}
          options={{ format: "jpg", quality: 1 }}
          captureMode="mount"
          onCapture={() => {}}
          style={{ position: "absolute", top: -1000, left: -1000 }}
        >
          <QRCode value={initialUrl || "N/A"} size={100} />
        </ViewShot>
      </>
    ),
    printMap,
    printing,
  };
};

const cssContent = `
<style>
  h2 {
    border-bottom: 2px solid #333;
    padding-bottom: 5px;
    margin-top: 30px;
  }
  p {
    margin: 10px 0;
    line-height: 1.6;
    font-size: 16px;
  }
  .num {
    font-size: 1.1rem;
    font-weight: bold;
    margin-right: 5px;
  }
  .location {
    font-size: 1.1rem;
    margin-right: 10px;
  }
  .map {
    border: 2px solid #888;
    border-radius: 12px;
  }
</style>
`;

export { usePrintMap };
