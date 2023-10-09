import { useCallback, useEffect, useState } from "react";
import { Route } from "../types/route";
import MapView from "react-native-maps";

export type SimpleMapRegion = {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
};

export type UserRegion = {
  userLongitude: number;
  userLatitude: number;
};

export type MapRegion = SimpleMapRegion & UserRegion;

export type Coordinates = {
  latitude: number;
  longitude: number;
};

function degreesToRadians(degrees: number): number {
  return (degrees * Math.PI) / 180;
}

function calculateBearing(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
) {
  const radianLat1 = (Math.PI * lat1) / 180;
  const radianLon1 = (Math.PI * lon1) / 180;
  const radianLat2 = (Math.PI * lat2) / 180;
  const radianLon2 = (Math.PI * lon2) / 180;

  const dLon = radianLon2 - radianLon1;
  const y = Math.sin(dLon) * Math.cos(radianLat2);
  const x =
    Math.cos(radianLat1) * Math.sin(radianLat2) -
    Math.sin(radianLat1) * Math.cos(radianLat2) * Math.cos(dLon);
  let brng = Math.atan2(y, x);
  brng = (brng * 180) / Math.PI;
  brng = (brng + 360) % 360;

  return brng;
}

export const useMapRegion = ({
  data,
  routeState,
  mapRef,
}: {
  data: Route | null;
  routeState: Coordinates;
  mapRef: React.RefObject<MapView>;
}) => {
  const [region, setRegion] = useState<MapRegion>({
    userLongitude: 0,
    userLatitude: 0,
    latitude: -37.8136,
    longitude: 144.9631,
    latitudeDelta: 0.03,
    longitudeDelta: 0.015,
  });

  const [initialRegion, setInitialRegion] = useState<MapRegion>({
    userLongitude: 0,
    userLatitude: 0,
    latitude: -37.8136,
    longitude: 144.9631,
    latitudeDelta: 0.03,
    longitudeDelta: 0.015,
  });

  const [currentRoute, setCurrentRoute] = useState<number>(0);
  const [firstPress, setFirstPress] = useState<boolean>(true);
  const [regionCalculating, setRegionCalculating] = useState<boolean>(false);

  const nextRoute = useCallback(() => {
    if (firstPress) {
      handlePressRoute(currentRoute);
      setFirstPress(false);
      return;
    } else if (data) {
      handlePressRoute((currentRoute + 1) % data.route.length);
    }
  }, [currentRoute, data, firstPress]);

  const prevRoute = useCallback(() => {
    if (data) {
      if (currentRoute === 1) {
        setFirstPress(true);
      }
      handlePressRoute(
        (currentRoute - 1 + data.route.length) % data.route.length,
        true
      );
    }
  }, [currentRoute, data]);

  useEffect(() => {
    setRegionCalculating(true);
    let centerLat = 0,
      centerLon = 0,
      minLat = Infinity,
      maxLat = -Infinity,
      minLon = Infinity,
      maxLon = -Infinity;

    if (data && Array.isArray(data["locations_coordinates"])) {
      data["locations_coordinates"].forEach((location) => {
        centerLat += location.latitude;
        centerLon += location.longitude;
        if (location.latitude < minLat) {
          minLat = location.latitude;
        }
        if (location.latitude > maxLat) {
          maxLat = location.latitude;
        }
        if (location.longitude < minLon) {
          minLon = location.longitude;
        }
        if (location.longitude > maxLon) {
          maxLon = location.longitude;
        }
      });

      centerLat /= data["locations_coordinates"].length;
      centerLon /= data["locations_coordinates"].length;
    }
    const latitudeDelta = maxLat - minLat;
    const longitudeDelta = maxLon - minLon;

    const newRegion = {
      userLatitude: routeState.latitude,
      userLongitude: routeState.longitude,
      latitude: centerLat,
      longitude: centerLon,
      latitudeDelta: latitudeDelta * 1.4,
      longitudeDelta: longitudeDelta * 1.4,
    };

    setRegion(newRegion);
    setInitialRegion(newRegion);
    setRegionCalculating(false);
  }, [data, routeState.latitude, routeState.longitude]);

  const handleMapDeltaChange = useCallback(
    (newRegion: SimpleMapRegion) => {
      setRegion({
        ...region,
        ...newRegion,
      });
    },
    [region]
  );

  const handleLocationSelect = useCallback(
    (location: Coordinates) => {
      if (
        location === undefined ||
        mapRef.current === undefined ||
        location === null ||
        location.latitude === undefined ||
        location.longitude === undefined
      ) {
        return;
      }
      const newRegion = {
        ...region,
        latitude: location?.latitude,
        longitude: location?.longitude,
      };

      mapRef.current?.animateCamera(
        {
          center: newRegion,
        },
        { duration: 1000 }
      );

      setRegion({
        ...region,
        ...newRegion,
      });
    },
    [mapRef, region]
  );

  const handleOverview = useCallback(() => {
    if (mapRef.current) {
      mapRef.current.animateToRegion(initialRegion, 1000);
    }
  }, [initialRegion]);

  const handlePressRoute = useCallback(
    (index: number, reverse: boolean = false) => {
      if (
        !data ||
        index < 0 ||
        index >= data.route.length ||
        data.route.length === 0
      ) {
        return;
      }
      setCurrentRoute(index);
      const lat1 = data.route[index]?.latitude;
      const lon1 = data.route[index]?.longitude;
      const lat2 = data.route[index + 1]?.latitude;
      const lon2 = data.route[index + 1]?.longitude;

      if (lat1 && lon1 && lat2 && lon2) {
        const bearing = reverse
          ? calculateBearing(lat2, lon2, lat1, lon1)
          : calculateBearing(lat1, lon1, lat2, lon2);
        const newRegion = {
          ...region,
          latitude: reverse ? lat2 : lat1,
          longitude: reverse ? lon2 : lon1,
        };

        /**
         * Animate camera to new region
         *
         * camera movement is not based on the center coordinate passed in
         * but rather somewhere in the map
         * event swapping the order of moving the camera and setting the region
         * does not work
         */
        // FIXME - camera animation is not working as expected
        if (mapRef.current) {
          mapRef.current?.animateCamera(
            {
              center: newRegion,
              heading: bearing,
              zoom: 18,
            },
            { duration: 500 }
          );
          setTimeout(() => {
            mapRef.current?.animateCamera(
              {
                center: newRegion,
                heading: bearing,
              },
              { duration: 500 }
            );
          }, 500);
        }
        setRegion({
          ...region,
          ...newRegion,
        });
      }
    },
    [data, region]
  );

  const resetRoute = useCallback(() => {
    handlePressRoute(0);
    setFirstPress(true);
  }, [handlePressRoute, setFirstPress]);

  return {
    region,
    initialRegion,
    currentRoute,
    nextRoute,
    prevRoute,
    resetRoute,
    handleLocationSelect,
    handlePressRoute,
    handleMapDeltaChange,
    handleOverview,
    regionCalculating,
  };
};
