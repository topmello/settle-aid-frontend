import { useCallback, useEffect, useRef, useState } from "react";
import { RouteResult } from "../types/route";

export type MapRegion = {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
};

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
  data: RouteResult;
  routeState: Coordinates;
  mapRef: React.RefObject<any>;
}) => {
  const initialRender = useRef(true);

  const [region, setRegion] = useState<MapRegion>({
    latitude: -37.8136,
    longitude: 144.9631,
    latitudeDelta: 0,
    longitudeDelta: 0,
  });

  useEffect(() => {
    if (initialRender.current) {
      initialRender.current = false;
      return;
    }

    let centerLat = 0,
      centerLon = 0,
      deltaLat = 0,
      deltaLon = 0;

    if (data && Array.isArray(data["locations_coordinates"])) {
      data["locations_coordinates"].forEach((location) => {
        centerLat += location.latitude;
        centerLon += location.longitude;
        deltaLat = Math.max(
          deltaLat,
          Math.abs(location.latitude - routeState.latitude)
        );
        deltaLon = Math.max(
          deltaLon,
          Math.abs(location.longitude - routeState.longitude)
        );
      });

      centerLat /= data["locations_coordinates"].length;
      centerLon /= data["locations_coordinates"].length;
    }

    setRegion({
      latitude: routeState.latitude,
      longitude: routeState.longitude,
      latitudeDelta: deltaLat * 2,
      longitudeDelta: deltaLon * 2,
    });
  }, [data, routeState]);

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
    [region, mapRef]
  );

  const handlePressRoute = useCallback(
    async (index: number) => {
      if (index < 0 || index >= data.route.length || data.route.length === 0) {
        return;
      }
      const lat1 = data.route[index]?.latitude;
      const lon1 = data.route[index]?.longitude;
      const lat2 = data.route[index + 1]?.latitude;
      const lon2 = data.route[index + 1]?.longitude;

      const bearing =
        lat2 && lon2 ? calculateBearing(lat1, lon1, lat2, lon2) : 0;
      const newRegion = {
        ...region,
        latitude: lat1,
        longitude: lon1,
      };

      if (mapRef.current) {
        await mapRef.current.animateCamera(
          {
            center: region,
            heading: bearing,
          },
          { duration: 1000 }
        );
      }
      setRegion({
        ...region,
        ...newRegion,
      });
    },
    [region, mapRef]
  );

  return {
    region,
    handleLocationSelect,
    handlePressRoute,
  };
};
