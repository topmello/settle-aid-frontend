import { useCallback } from "react";
import * as Location from "expo-location";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../store";
import { loading, loaded, fail } from "../store/appSlice";
import { setLonLat } from "../store/routeSlice";

const useCurrentLocation = () => {
  const dispatch = useDispatch<AppDispatch>();

  const fetchLocation = useCallback(async () => {
    dispatch(loading());
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      dispatch(fail({ message: "not granted" }));
      return;
    }

    let location = await Location.getLastKnownPositionAsync({});
    if (location) {
      const { longitude, latitude } = location.coords;
      dispatch(setLonLat({ longitude, latitude }));
      dispatch(loaded());
    }
    setTimeout(() => {
      dispatch(fail({ message: "timeout" }));
    }, 3000);
  }, [dispatch]);

  return fetchLocation;
};

export default useCurrentLocation;
