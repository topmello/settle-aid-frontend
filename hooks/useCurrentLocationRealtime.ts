import { useState, useEffect } from "react";
import * as Location from "expo-location";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../store";
import { loading, loaded, fail } from "../store/appSlice";
import { setLonLat } from "../store/routeSlice";

type LocationType = {
  longitude: number;
  latitude: number;
} | null;

const useCurrentLocationRealtime = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [currentLocation, setCurrentLocation] = useState<LocationType>(null);

  useEffect(() => {
    const fetchLocation = async () => {
      dispatch(loading());
      let { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        dispatch(fail({ message: "not granted" }));
        return;
      }

      // Watch for location updates
      const watcher = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 100,
          distanceInterval: 10,
        },
        (location) => {
          const { longitude, latitude } = location.coords;
          setCurrentLocation({ longitude, latitude });
          dispatch(setLonLat({ longitude, latitude }));
          dispatch(loaded());
        }
      );

      return () => {
        // Stop watching for location updates when the hook is no longer used
        watcher.remove();
      };
    };

    let cleanupFunction: (() => void) | undefined;

    fetchLocation().then((cleanup) => {
      cleanupFunction = cleanup;
    });

    return () => {
      if (cleanupFunction) cleanupFunction();
    };
  }, [dispatch]);

  return currentLocation;
};

export default useCurrentLocationRealtime;
