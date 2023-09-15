import { useState, useRef } from "react";
import { get } from "react-native/Libraries/TurboModule/TurboModuleRegistry";

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

interface RouteResult {
  locations: string[];
  locations_coordinates: {
    latitude: number;
    longitude: number;
  }[];
  route: {
    latitude: number;
    longitude: number;
  }[];
  instructions: string[];
  duration: number;
}

export function getMapRegion(data: RouteResult, body: any, mapRef: any) {
  let centerLat = 0, centerLon = 0, deltaLat = 0, deltaLon = 0;
  data["locations_coordinates"].forEach((location) => {
    centerLat += location.latitude;
    centerLon += location.longitude;
    deltaLat = Math.max(deltaLat, Math.abs(location.latitude - body.latitude));
    deltaLon = Math.max(deltaLon, Math.abs(location.longitude - body.longitude));
  });
  centerLat /= data["locations_coordinates"].length;
  centerLon /= data["locations_coordinates"].length;
  let region = {
    latitude: body.latitude,
    longitude: body.longitude,
    latitudeDelta: deltaLat * 2,
    longitudeDelta: deltaLon * 2,
  };

  const handleLocationSelect = (location: Coordinates) => {
    if (location === undefined || mapRef.current === undefined || location === null ||
      location.latitude === undefined || location.longitude === undefined) {
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

    region = {
      ...region,
      ...newRegion,
    }
  };

  const handlePressRoute = async (index: number) => {
    if (index < 0 || index >= data.route.length || data.route.length === 0) {
      return;
    }
    const lat1 = data.route[index]?.latitude;
    const lon1 = data.route[index]?.longitude;
    const lat2 = data.route[index + 1]?.latitude;
    const lon2 = data.route[index + 1]?.longitude;

    const bearing = lat2 && lon2 ? calculateBearing(lat1, lon1, lat2, lon2) : 0;
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
    region = {
      ...region,
      ...newRegion,
    }
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

  return {
    region,
    handleLocationSelect,
    handlePressRoute,
  };
}