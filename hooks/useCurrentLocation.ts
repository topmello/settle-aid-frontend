import { useEffect } from "react";
import * as Location from "expo-location";

type Coords = {
  longitude: number;
  latitude: number;
};

const useCurrentLocation = (onLocationObtained: (coords: Coords) => void) => {
  const fetchLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      return;
    }

    let location = await Location.getCurrentPositionAsync({});
    onLocationObtained(location.coords);
  };

  useEffect(() => {
    fetchLocation();
  }, [onLocationObtained]);

  return fetchLocation;
};

export default useCurrentLocation;
