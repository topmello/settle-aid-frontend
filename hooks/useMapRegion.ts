import { useCallback, useEffect, useMemo, useRef, useState } from "react";
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
): number {
  lat1 = degreesToRadians(lat1);
  lon1 = degreesToRadians(lon1);
  lat2 = degreesToRadians(lat2);
  lon2 = degreesToRadians(lon2);

  const dLon = lon2 - lon1;
  const x = Math.cos(lat2) * Math.sin(dLon);
  const y =
    Math.cos(lat1) * Math.sin(lat2) -
    Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLon);
  const bearing = (Math.atan2(x, y) * 180) / Math.PI;
  return (bearing + 360) % 360;
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

  const resetRoute = useCallback(() => {
    handlePressRoute(0);
  }, []);

  const nextRoute = useCallback(() => {
    if (data) {
      handlePressRoute((currentRoute + 1) % data.route.length);
    }
  }, [currentRoute, data]);

  const prevRoute = useCallback(() => {
    if (data) {
      handlePressRoute(
        (currentRoute - 1 + data.route.length) % data.route.length,
        true
      );
    }
  }, [currentRoute, data]);

  useEffect(() => {
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
      latitude: centerLat - 0.002,
      longitude: centerLon,
      latitudeDelta: latitudeDelta * 1.4,
      longitudeDelta: longitudeDelta * 1.4,
    };

    setRegion(newRegion);
    setInitialRegion(newRegion);
  }, [data, routeState.latitude, routeState.longitude]);

  const handleMapDeltaChange = (newRegion: SimpleMapRegion) => {
    setRegion({
      ...region,
      ...newRegion,
    });
  };

  const handleLocationSelect = (location: Coordinates) => {
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
  };

  const handleOverview = () => {
    if (mapRef.current) {
      mapRef.current.animateToRegion(initialRegion, 1000);
    }
  };

  const handlePressRoute = (index: number, reverse: boolean = false) => {
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

      if (mapRef.current) {
        mapRef.current.animateCamera({
          center: newRegion,
          heading: bearing,
          zoom: 18,
        });
      }
      setRegion({
        ...region,
        ...newRegion,
      });
    }
  };

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
  };
};
