import { useCallback } from "react";
import * as Location from "expo-location";

type Coords = {
  longitude: number;
  latitude: number;
};

const useCurrentLocation = (onLocationObtained: (coords: Coords) => void) => {
  const fetchLocation = useCallback(async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      return;
    }

    let location = await Location.getCurrentPositionAsync({});
    onLocationObtained(location.coords);
  }, [onLocationObtained]);

  return fetchLocation;
};

export default useCurrentLocation;
