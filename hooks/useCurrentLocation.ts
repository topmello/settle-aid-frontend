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
      dispatch(loaded());
      return;
    }

    let location = await Location.getCurrentPositionAsync({});
    const { longitude, latitude } = location.coords;
    dispatch(setLonLat({ longitude, latitude }));
    setTimeout(() => {
      dispatch(loaded());
    }, 1000);
  }, [dispatch]);

  return fetchLocation;
};

export default useCurrentLocation;
